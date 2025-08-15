// src/app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-2">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-black">
          Tracker you've been looking for
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
          Organized, manage, and track your job applications needs with ease.
        </p>
      </div>
      <div className="mt-10 flex gap-4">
        <Link href="/dashboard">
          <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
            Get Started
          </button>
        </Link>
      
      </div>
    </main>
  );
}