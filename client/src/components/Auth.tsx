// src/components/Auth.tsx
"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppDispatch, RootState } from "@/lib/store";
import { register, login, reset } from "@/lib/features/auth/authSlice";

interface AuthProps {
  initialMode?: "signin" | "signup";
}

export default function Auth({ initialMode = "signin" }: AuthProps) {
  const [isSigningIn, setIsSigningIn] = useState(initialMode === "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { token, isLoading, isError, isSucces, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Handle any errors from login or register
    if (isError) {
      alert(message);
      dispatch(reset());
    }

    // Handle success states
    if (isSucces) {
      if (token) {
        // If there's a token, it means login was successful. Redirect to dashboard.
        router.push("/dashboard");
      } else {
        // If success is true but there's no token, it means registration was successful.
        // Redirect to the login page.
        alert("Registration successful! Please log in."); // Give user feedback
        router.push("/login");
      }
      dispatch(reset());
    }
  }, [isError, isSucces, token, message, router, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { email, password };
    if (isSigningIn) {
      dispatch(login(userData));
    } else {
      dispatch(register(userData));
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {isSigningIn ? "Sign In" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? "Loading..." : isSigningIn ? "Sign In" : "Sign Up"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        {isSigningIn ? "Don't have an account?" : "Already have an account?"}
        <Link
          href={isSigningIn ? "/register" : "/login"}
          className="ml-2 font-semibold text-blue-600 hover:underline"
        >
          {isSigningIn ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  );
}
