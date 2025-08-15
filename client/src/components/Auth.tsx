'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/src/supabaseClient';
import toast from 'react-hot-toast';
import Link from 'next/link'; // 1. Import Link for navigation
import { useRouter } from 'next/navigation';

// Define the props for the component
interface AuthProps {
  initialMode?: 'signin' | 'signup';
}

export default function Auth({ initialMode = 'signin' }: AuthProps) {
  // 2. The form mode is now controlled by the page it's on
  const isSigningIn = initialMode === 'signin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isSigningIn) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.success('Signed in successfully!');
        router.push('/dashboard'); // Redirect on successful login
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.success('Sign up successful! Please check your email for verification.');
        router.push('/login'); // Redirect to login page after signup
      }
    }
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {isSigningIn ? 'Sign In' : 'Create an Account'}
      </h2>
      
      <button
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md text-black/50 hover:bg-gray-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.519-3.486-11.188-8.264l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.863 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
        Sign in with Google
      </button>

      <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with email</span></div></div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
        <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? 'Loading...' : (isSigningIn ? 'Sign In' : 'Create Account')}
        </button>
      </form>
      
      {/* 3. Use Link to navigate between pages */}
      <p className="text-center text-sm text-gray-600">
        {isSigningIn ? "Don't have an account?" : 'Already have an account?'}
        <Link href={isSigningIn ? '/register' : '/login'} className="ml-2 font-semibold text-blue-600 hover:underline">
          {isSigningIn ? 'Sign Up' : 'Sign In'}
        </Link>
      </p>
    </div>
  );
}
