'use client';

import { useDraggable } from '@dnd-kit/core';
import { Job } from '@/lib/type';
import { deleteJob } from '@/lib/features/jobs/jobsSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { TiDelete, TiPencil } from "react-icons/ti";
import { openEditJobModal } from '@/lib/features/ui/uiSlice';
import toast from 'react-hot-toast';

export default function JobCard({ job }: { job: Job }) {
  const dispatch: AppDispatch = useDispatch();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: job.id,
    data: { job },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  const handleEdit = () => {
    dispatch(openEditJobModal(job.id));
  };

  // 2. Update the handleDelete function to use toast
  const handleDelete = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">
          Delete application for {job.company}?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              dispatch(deleteJob(job.id));
              toast.dismiss(t.id); // Dismiss the confirmation toast
              toast.success('Application deleted'); // Show a success toast
            }}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      // Optional: Add a custom icon
      icon: '🤔',
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-4 border rounded-lg shadow-sm bg-white touch-none relative group"
    >
      <div {...listeners} className="cursor-grab">
        <h3 className="font-bold text-gray-800 pr-12">{job.position}</h3>
        <p className="text-gray-600 text-sm">{job.company}</p>
      </div>
      
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleEdit}
          className="p-1 text-gray-400 hover:text-blue-600"
          aria-label="Edit job"
        >
          <TiPencil size={20} />
        </button>
        <button 
          onClick={handleDelete}
          className="p-1 text-gray-400 hover:text-red-600"
          aria-label="Delete job"
        >
          <TiDelete size={20} />
        </button>
      </div>
    </div>
  );
}