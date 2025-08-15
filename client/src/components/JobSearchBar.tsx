"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { Job, JobStatus, JobType } from "@/lib/type";
import { HiSearch, HiFilter, HiX, HiSortAscending, HiSortDescending } from "react-icons/hi";

interface JobSearchBarProps {
  onFilterChange: (filteredJobs: Job[]) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

type SortField = 'company' | 'position' | 'createdAt' | 'status';
type SortOrder = 'asc' | 'desc';

export default function JobSearchBar({ onFilterChange, onClearFilters, hasActiveFilters }: JobSearchBarProps) {
  const dispatch: AppDispatch = useDispatch();
  const { items: jobs } = useSelector((state: RootState) => state.jobs);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<JobType | "ALL">("ALL");
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters and sorting whenever any filter changes
  useEffect(() => {
    let filteredJobs = [...jobs];

    // Search filter
    if (searchTerm.trim()) {
      filteredJobs = filteredJobs.filter(job =>
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.notes && job.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filteredJobs = filteredJobs.filter(job => job.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "ALL") {
      filteredJobs = filteredJobs.filter(job => job.type === typeFilter);
    }

    // Sorting
    filteredJobs.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'position':
          aValue = a.position.toLowerCase();
          bValue = b.position.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    onFilterChange(filteredJobs);
  }, [jobs, searchTerm, statusFilter, typeFilter, sortField, sortOrder]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setSortField('createdAt');
    setSortOrder('desc');
    
    // Call the external clear function if provided
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const localFiltersActive = searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      {/* Main Search Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by company, position, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border text-black/55 border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              showFilters || localFiltersActive
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <HiFilter className="w-4 h-4" />
            Filters
            {localFiltersActive && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>

          {localFiltersActive && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-2"
            >
              <HiX className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters (Collapsible) */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as JobStatus | "ALL")}
                className="block w-full px-3 py-2 border text-black/55 border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value={JobStatus.APPLIED}>Applied</option>
                <option value={JobStatus.INTERVIEWING}>Interviewing</option>
                <option value={JobStatus.OFFERED}>Offered</option>
                <option value={JobStatus.REJECTED}>Rejected</option>
                <option value={JobStatus.WITHDRAWN}>Withdrawn</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as JobType | "ALL")}
                className="block w-full px-3 py-2 border text-black/55 border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value={JobType.FULL_TIME}>Full Time</option>
                <option value={JobType.PART_TIME}>Part Time</option>
                <option value={JobType.FREELANCE}>Freelance</option>
                <option value={JobType.INTERNSHIP}>Internship</option>
              </select>
            </div>

            {/* Sort Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="block w-full px-3 py-2 border border-gray-300 text-black/55 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="createdAt">Date Added</option>
                <option value="company">Company</option>
                <option value="position">Position</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-black/55 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-center gap-2"
              >
                {sortOrder === 'asc' ? (
                  <>
                    <HiSortAscending className="w-4 h-4" />
                    Ascending
                  </>
                ) : (
                  <>
                    <HiSortDescending className="w-4 h-4" />
                    Descending
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-3 text-sm text-gray-600">
            {localFiltersActive && (
              <p>
                Filters active - showing filtered results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
