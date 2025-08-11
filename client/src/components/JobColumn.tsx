'use client';

import { useDroppable } from '@dnd-kit/core';
import { Job } from '@/lib/type';
import JobCard from './JobCard'; // We will create this next

interface JobColumnProps {
  id: string;
  title: string;
  jobs: Job[];
}

export default function JobColumn({ id, title, jobs }: JobColumnProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-4 rounded-lg min-h-[200px] flex flex-col"
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
