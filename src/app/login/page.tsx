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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
