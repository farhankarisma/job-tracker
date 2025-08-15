"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/src/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchJobs } from "@/lib/features/jobs/jobsSlice";
import { openAddJobModal } from "@/lib/features/ui/uiSlice";

import JobBoard from "@/components/JobBoard";
import FilterableJobBoard from "@/components/FilterableJobBoard";
import JobSearchBar from "@/components/JobSearchBar";
import AddJobModal from "@/components/AddModalJob";
import EditJobModal from "@/components/EditJobModal";
import BoardSkeleton from "@/components/BoardSkeleton";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import { Job } from "@/lib/type";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  const { status, items: jobs } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
        setIsLoading(false);
        // Hanya fetch jika data belum ada
        if (status === "idle") {
          dispatch(fetchJobs());
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, dispatch, status]);

  // Initialize filtered jobs when jobs change
  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  const handleFilterChange = useCallback((filtered: Job[]) => {
    setFilteredJobs(filtered);
  }, []);

  const clearFilters = useCallback(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  const hasFiltersApplied = filteredJobs.length !== jobs.length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const showJobPortalRecommendations = () => {
    const jobPortals = [
      {
        name: "LinkedIn",
        url: "https://linkedin.com/jobs",
      },
      {
        name: "Glassdoor",
        url: "https://glassdoor.com/jobs",
      },
      {
        name: "JobStreet",
        url: "https://jobstreet.com",
      },
      {
        name: "Indeed",
        url: "https://indeed.com",
      },
      {
        name: "Jobsdb",
        url: "https://jobsdb.com",
      },
    ];

    toast.custom(
      (t) => (
        <div
          className={`
          ${t.visible ? "animate-enter" : "animate-leave"}
          max-w-md w-full bg-white shadow-xl rounded-lg pointer-events-auto flex flex-col ring-1 ring-black ring-opacity-5
        `}
        >
          <div className="bg-green-500 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Job Portal Recommendations
              </h3>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-green-100 text-sm mt-1">
              Find your next opportunity
            </p>
          </div>

          <div className="px-6 py-4 max-h-80 overflow-y-auto">
            <div className="space-y-3">
              {jobPortals.map((portal, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => {
                    window.open(portal.url, "_blank");
                    toast.success(`Opening ${portal.name}...`);
                  }}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-green-600">
                      {portal.name}
                    </h4>
                  </div>
                  <div className="text-gray-400 group-hover:text-green-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-right",
      }
    );
  };

  if (isLoading || !session) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar userEmail={session.user.email} onLogout={handleLogout} />

      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-8">
          <div className="flex justify-between items-center mb-6 gap-10">
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-xl lg:text-3xl font-bold text-gray-800">
                  Job Tracker
                </h1>
                <p className="text-sm lg:text-[16px] text-gray-600 mt-1">
                  Manage your job applications
                </p>
              </div>
              <button
                onClick={() => showJobPortalRecommendations()}
                className="px-2 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 font-medium shadow-md text-xs lg:text-sm flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 hidden lg:block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Find more...
              </button>
            </div>
            <button
              onClick={() => dispatch(openAddJobModal())}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 font-medium text-sm shadow-lg"
            >
              + Add New Job
            </button>
          </div>

          {status === "loading" && <BoardSkeleton />}
          {status === "succeeded" && (
            <>
              <JobSearchBar 
                onFilterChange={handleFilterChange} 
                onClearFilters={clearFilters}
                hasActiveFilters={hasFiltersApplied}
              />
              
              {/* Results Summary */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredJobs.length} of {jobs.length} job application{jobs.length !== 1 ? 's' : ''}
                {hasFiltersApplied && (
                  <span className="ml-2 text-blue-600 font-medium">
                    (filtered)
                  </span>
                )}
              </div>
              
              <FilterableJobBoard 
                jobs={filteredJobs} 
                onClearFilters={clearFilters}
                hasActiveFilters={hasFiltersApplied}
              />
            </>
          )}
          {status === "failed" && (
            <p className="text-red-500">Failed to load jobs.</p>
          )}

          {/* Render kedua modal agar siap dibuka */}
          <AddJobModal />
          <EditJobModal />
        </div>
      </div>
    </div>
  );
}
