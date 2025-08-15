// src/components/JobColumn.tsx
'use client';

import { useDroppable } from '@dnd-kit/core';
import { Job } from '@/lib/type';
import JobCard from './JobCard';

interface JobColumnProps {
  id: string;
  title: string;
  jobs: Job[];
}

export default function JobColumn({ id, title, jobs }: JobColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-gray-100 p-4 rounded-lg min-h-[500px] flex flex-col
        transition-colors duration-200 border-2 border-transparent
        ${isOver ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : ''}
      `}
    >
      <h2 className="text-lg font-bold mb-4 text-gray-700 capitalize">
        {title.toLowerCase().replace('_', ' ')}
      </h2>
      <div className="space-y-4 flex-grow">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}