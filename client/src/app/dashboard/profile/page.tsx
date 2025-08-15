'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/src/supabaseClient'; 
import type { Session } from '@supabase/supabase-js';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineCalendar,
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle
} from 'react-icons/hi';

interface ProfileStats {
  totalApplications: number;
  appliedCount: number;
  interviewingCount: number;
  offeredCount: number;
  rejectedCount: number;
  withdrawnCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { items: jobs } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setSession(session);
        setIsLoading(false);
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
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Calculate statistics
  const stats: ProfileStats = {
    totalApplications: jobs.length,
    appliedCount: jobs.filter(job => job.status === 'APPLIED').length,
    interviewingCount: jobs.filter(job => job.status === 'INTERVIEWING').length,
    offeredCount: jobs.filter(job => job.status === 'OFFERED').length,
    rejectedCount: jobs.filter(job => job.status === 'REJECTED').length,
    withdrawnCount: jobs.filter(job => job.status === 'WITHDRAWN').length,
  };

  const recentApplications = jobs
    .slice()
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return <HiOutlineClock className="w-4 h-4 text-blue-500" />;
      case 'INTERVIEWING':
        return <HiOutlineUser className="w-4 h-4 text-yellow-500" />;
      case 'OFFERED':
        return <HiOutlineCheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
        return <HiOutlineXCircle className="w-4 h-4 text-red-500" />;
      case 'WITHDRAWN':
        return <HiOutlineXCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <HiOutlineClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-100 text-blue-800';
      case 'INTERVIEWING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OFFERED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || !session) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar 
        userEmail={session.user.email}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
            <p className="text-gray-600 mt-1">Your profile and application statistics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r bg-green-950 rounded-full flex items-center justify-center">
                      <HiOutlineUser className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {session.user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">Job Seeker</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <HiOutlineMail className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{session.user.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <HiOutlineCalendar className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        Joined {new Date(session.user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <HiOutlineBriefcase className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {stats.totalApplications} Applications
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <HiOutlineChartBar className="w-5 h-5" />
                  Application Statistics
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
                    <div className="text-sm text-blue-700">Total Applications</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{stats.appliedCount}</div>
                    <div className="text-sm text-yellow-700">Applied</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.interviewingCount}</div>
                    <div className="text-sm text-purple-700">Interviewing</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.offeredCount}</div>
                    <div className="text-sm text-green-700">Offered</div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.rejectedCount}</div>
                    <div className="text-sm text-red-700">Rejected</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{stats.withdrawnCount}</div>
                    <div className="text-sm text-gray-700">Withdrawn</div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Applications</h2>
                
                {recentApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <HiOutlineBriefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No applications yet</p>
                    <p className="text-sm">Start by adding your first job application</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(job.status)}
                          <div>
                            <p className="font-medium text-gray-900">{job.position}</p>
                            <p className="text-sm text-gray-600">{job.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                            {job.status.toLowerCase().replace('_', ' ')}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
