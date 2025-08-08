// src/app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
        Welcome to Gawekeun
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
        Stop losing track of your job applications. Organize, manage, and monitor your entire job hunt from one simple dashboard.
      </p>
      <Link href="/login">
        <button className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition-colors">
          Login & Get Started
        </button>
      </Link>
    </main>
  );
}