'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/src/supabaseClient'; 
import type { Session } from '@supabase/supabase-js';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchJobs } from '@/lib/features/jobs/jobsSlice';
import { openAddJobModal } from '@/lib/features/ui/uiSlice';

import JobBoard from '@/components/ApplicationBoard';
import AddJobModal from '@/components/AddModalJob';
import EditJobModal from '@/components/EditJobModal';
import BoardSkeleton from '@/components/BoardSkeleton';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { status, items: jobs } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setSession(session);
        setIsLoading(false);
        // Hanya fetch jika data belum ada
        if (status === 'idle') {
          dispatch(fetchJobs());
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, dispatch, status]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading || !session) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Job Tracker</h1>
        <div className="flex gap-4 items-center">
          <p className="text-sm text-gray-600">{session.user.email}</p>
          <button 
            onClick={() => dispatch(openAddJobModal())}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add New Job
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
      
      {status === 'loading' && <BoardSkeleton />}
      {status === 'succeeded' && <JobBoard />}
      {status === 'failed' && <p className="text-red-500">Failed to load jobs.</p>}

      {/* Render kedua modal agar siap dibuka */}
      <AddJobModal />
      <EditJobModal />
    </main>
  );
}
