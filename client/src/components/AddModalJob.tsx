'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { closeAddJobModal } from '@/lib/features/ui/uiSlice';
import { addJob } from '@/lib/features/jobs/jobsSlice'; // We will create this action next
import { JobStatus } from '@/lib/type';

export default function AddJobModal() {
  const dispatch: AppDispatch = useDispatch();
  const { isAddJobModalOpen } = useSelector((state: RootState) => state.ui);

  // State for the form fields
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<JobStatus>(JobStatus.APPLIED);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !position) return;

    // Dispatch the action to add a new job
    dispatch(addJob({ company, position, status }));
    
    // Reset form and close modal
    setCompany('');
    setPosition('');
    setStatus(JobStatus.APPLIED);
    dispatch(closeAddJobModal());
  };

  if (!isAddJobModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Job Application</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} className="p-2 border rounded w-full" required />
            <input type="text" placeholder="Position / Role" value={position} onChange={(e) => setPosition(e.target.value)} className="p-2 border rounded w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)} className="p-2 border rounded w-full mt-1">
              {Object.values(JobStatus).map((jobStatus) => (
                <option key={jobStatus} value={jobStatus}>{jobStatus}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => dispatch(closeAddJobModal())} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Add Application</button>
          </div>
        </form>
      </div>
    </div>
  );
}
