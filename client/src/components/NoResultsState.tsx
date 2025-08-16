"use client";

import { HiSearch, HiX } from "react-icons/hi";

interface NoResultsStateProps {
  onClearFilters: () => void;
  hasFilters: boolean;
}

export default function NoResultsState({ onClearFilters, hasFilters }: NoResultsStateProps) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <HiSearch className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No jobs found
      </h3>
      
      {hasFilters ? (
        <>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            No job applications match your current filters. Try adjusting your search criteria or clearing filters to see all jobs.
          </p>
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <HiX className="w-4 h-4" />
            Clear Filters
          </button>
        </>
      ) : (
        <p className="text-gray-600 max-w-md mx-auto">
          You haven&apos;t added any job applications yet. Click the &quot;Add New Job&quot; button to get started!
        </p>
      )}
    </div>
  );
}
