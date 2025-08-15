"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Job } from "@/lib/type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { deleteJob } from "@/lib/features/jobs/jobsSlice";
import { openEditJobModal } from "@/lib/features/ui/uiSlice";
import { TiPencil, TiDelete } from "react-icons/ti";
import toast from "react-hot-toast";
import { useState } from "react";

export default function JobCard({ job, isPending = false }: { job: Job; isPending?: boolean }) {
  const dispatch: AppDispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: job.id,
      data: { job },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    backgroundColor: job.color || "#ffffff",
    borderColor: job.color === "#ffffff" ? "#E5E7EB" : job.color,
  };

  const handleEdit = () => {
    dispatch(openEditJobModal(job.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any drag events
    
    // Prevent multiple toasts from appearing
    if (isDeleting) {
      return;
    }
    
    setIsDeleting(true);
    
    // Custom toast confirmation - centered
    toast(
      (t) => {
        return (
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-gray-800">
              Delete application for {job.company}?
            </p>
            <p className="text-sm text-gray-600">
              {job.position} - This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  setIsDeleting(false); // Reset state when cancelled
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(deleteJob(job.id))
                    .unwrap()
                    .then(() => {
                      toast.dismiss(t.id);
                      toast.success("Application deleted successfully!");
                      // Don't reset isDeleting here since component will unmount
                    })
                    .catch((error) => {
                      console.error('Delete error:', error); // Debug log
                      toast.dismiss(t.id);
                      toast.error(`Error deleting application: ${error}`);
                      setIsDeleting(false); // Reset state on error
                    });
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        );
      },
      {
        icon: '🗑️',
        duration: Infinity, // Keep open until user decides
        position: 'top-center', // Center the toast
        style: {
          minWidth: '350px',
          maxWidth: '400px',
        },
      }
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        p-4 border rounded-lg shadow-sm touch-none relative group
        cursor-grab hover:shadow-md transition-all duration-200
        ${
          isDragging
            ? "opacity-50 cursor-grabbing scale-105 z-50"
            : "hover:scale-102"
        }
        ${
          isPending
            ? "ring-2 ring-blue-400 ring-opacity-60 bg-blue-50 border-blue-300 animate-pulse"
            : ""
        }
      `}
    >
      {/* Show updating indicator */}
      {isPending && (
        <div className="absolute top-1 left-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        <h3 className="font-bold text-gray-800 pr-12">{job.position}</h3>
        <p className="text-gray-600 text-sm">{job.company}</p>

        {/* Display the Job Type as a small badge */}
        <div className="mt-2">
          <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-full capitalize">
            {job.type.toLowerCase().replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
          aria-label="Edit job"
        >
          <TiPencil size={20} />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-1 transition-colors ${
            isDeleting 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-500 hover:text-red-600'
          }`}
          aria-label="Delete job"
          type="button"
        >
          <TiDelete size={20} />
        </button>
      </div>
    </div>
  );
}
