"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/AuthProvider";
import Image from "next/image";
import LazyLoader from "@/components/LazyLoaders/Spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const role = user.user_metadata?.role;
      router.replace(role === "admin" ? "/admin/dashboard" : "/dashboard");
    }
  }, [user, isLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !data.user) {
      setError(loginError?.message || "Login failed.");
      setLoading(false);
      return;
    }

    // Force session refresh and get fresh user metadata
    await supabase.auth.getSession();

    await fetch("/auth/callback", {
      method: "POST",
    });

    // Refresh user data to ensure you have the latest metadata
    const { data: refreshedUserData, error: refreshedUserError } =
      await supabase.auth.getUser();

    if (refreshedUserError || !refreshedUserData.user) {
      setError(refreshedUserError?.message || "Failed to refresh user data.");
      setLoading(false);
      return;
    }

    const role = refreshedUserData.user.user_metadata?.role;
    console.log("Role after login:", role); // Debugging log to check the role

    // Redirect based on role
    if (role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/dashboard");
    }

    setLoading(false);
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LazyLoader />
      </div>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-2 min-h-screen flex flex-col justify-center">
      <div className="flex justify-center mb-4">
        <Image
          src="/assets/logosample.svg"
          alt="Logo image"
          width={120}
          height={120}
          className="object-contain h-auto w-auto max-w-[150px]"
          priority
        />
      </div>

      <h2 className="text-4xl font-bold text-center uppercase">Subdivision</h2>
      <h1 className="text-2xl font-semibold text-center mb-10 uppercase">
        Record management system
      </h1>

      <div className="bg-white border border-gray-100 drop-shadow-lg p-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-3 py-3 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute left-2 -top-3 text-xs px-2 bg-white text-black transition-all duration-200
                peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                peer-focus:-top-1 peer-focus:text-xs peer-focus:text-black peer-focus:bg-white peer-focus:font-medium"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-3 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute left-2 -top-3 text-xs px-2 bg-white text-black transition-all duration-200
                peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                peer-focus:-top-1 peer-focus:text-xs peer-focus:text-black peer-focus:bg-white peer-focus:font-medium"
            >
              Password
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
