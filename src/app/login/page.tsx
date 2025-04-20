"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/AuthProvider";
import Image from "next/image";

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
      console.log("Role is:", role);

      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Logging in with:", email);

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      console.error("Login error:", loginError.message);
      setError(loginError.message);
      setLoading(false);
      return;
    }

    // ⏳ Wait a moment to allow Supabase to fully sync session (especially useful locally)
    await new Promise((res) => setTimeout(res, 500));

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Failed to fetch user after login:", userError.message);
      setError("Failed to fetch user after login.");
      setLoading(false);
      return;
    }

    const role = user?.user_metadata?.role;
    console.log("✅ Role after login:", role);

    if (role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/dashboard");
    }

    setLoading(false);
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  // can use shadow-xl/20 instead of drop-shadow-lg
  return (
    <main className="max-w-md mx-auto mt-10 px-4 sm:px-6 lg:px-8 min-h-screen">
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
      <h1 className="text-2xl font-semibold text-center mb-15 uppercase">
        Record management system
      </h1>
      <div className="bg-white border rounded-xl shadow p-6 justify-center align-center">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="relative w-full mb-6">
            <input
              type="email"
              className="block w-full px-3 py-3 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:ring-black focus:border-black peer"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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

          <div className="relative w-full mb-6">
            <input
              placeholder=" "
              type="password"
              className="block w-full px-3 py-3 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label
              htmlFor="password"
              className="absolute left-2 -top-2 text-xs px-2 bg-white text-black transition-all duration-200
                          peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                          peer-focus:-top-1 peer-focus:text-xs peer-focus:text-black peer-focus:bg-white peer-focus:font-medium"
            >
              Password
            </label>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
