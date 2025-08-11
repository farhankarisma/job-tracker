'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { closeEditJobModal } from '@/lib/features/ui/uiSlice';
import { editJob } from '@/lib/features/jobs/jobsSlice'; // We will create this action next
import { JobStatus, Job } from '@/lib/type';

export default function EditJobModal() {
  const dispatch: AppDispatch = useDispatch();

  // Get modal state and the ID of the job to edit from the UI slice
  const { isEditJobModalOpen, editingJobId } = useSelector(
    (state: RootState) => state.ui
  );
  
  // Find the full job object from the jobs slice using the ID
  const jobToEdit = useSelector((state: RootState) => 
    state.jobs.items.find(job => job.id === editingJobId)
  );

  // Local state for the form fields
  const [formData, setFormData] = useState<Partial<Job>>({});

  // When the modal opens or the selected job changes, populate the form
  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        company: jobToEdit.company,
        position: jobToEdit.position,
        status: jobToEdit.status,
        notes: jobToEdit.notes,
        jobUrl: jobToEdit.jobUrl,
      });
    }
  }, [jobToEdit]);

  if (!isEditJobModalOpen || !jobToEdit) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(editJob({ id: jobToEdit.id, ...formData }));
    dispatch(closeEditJobModal());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Job Application</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="company" placeholder="Company Name" value={formData.company || ''} onChange={handleInputChange} className="p-2 border rounded w-full" required />
            <input type="text" name="position" placeholder="Position / Role" value={formData.position || ''} onChange={handleInputChange} className="p-2 border rounded w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status || ''} onChange={handleInputChange} className="p-2 border rounded w-full mt-1">
              {Object.values(JobStatus).map((jobStatus) => (
                <option key={jobStatus} value={jobStatus}>{jobStatus}</option>
              ))}
            </select>
          </div>
          <input type="text" name="jobUrl" placeholder="Job Posting URL" value={formData.jobUrl || ''} onChange={handleInputChange} className="p-2 border rounded w-full" />
          <textarea name="notes" placeholder="Notes" value={formData.notes || ''} onChange={handleInputChange} className="p-2 border rounded w-full min-h-[100px]" />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => dispatch(closeEditJobModal())} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
