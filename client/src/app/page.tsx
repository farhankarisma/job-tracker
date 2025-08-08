// src/app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Welcome to Gawekeun
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
          Stop losing track of your job applications. Organize, manage, and monitor your entire job hunt from one simple dashboard.
        </p>
      </div>
      <div className="mt-10 flex gap-4">
        <Link href="/login">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
            Sign Up
          </button>
        </Link>
      </div>
    </main>
  );
}