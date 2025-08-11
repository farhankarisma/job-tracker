'use client';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { openAddJobModal } from '@/lib/features/ui/uiSlice';

export default function EmptyState() {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className="text-center p-10 border-2 border-dashed rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700">Your board is empty</h3>
      <p className="text-gray-500 mt-2 mb-4">
        Add your first job application to get started.
      </p>
      <button
        onClick={() => dispatch(openAddJobModal())}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Add New Job
      </button>
    </div>
  );
}
