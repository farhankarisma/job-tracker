'use client';

import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { 
  DndContext, 
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import { Job, JobStatus } from '@/lib/type';
import JobColumn from './JobColumn';
import EmptyState from './EmptyState';
import NoResultsState from './NoResultsState';
import { updateJobStatus } from '@/lib/features/jobs/jobsSlice';
import toast from 'react-hot-toast';

const STATUSES: JobStatus[] = [
  JobStatus.APPLIED,
  JobStatus.INTERVIEWING,
  JobStatus.OFFERED,
  JobStatus.REJECTED,
  JobStatus.WITHDRAWN,
];

interface FilterableJobBoardProps {
  jobs: Job[];
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export default function FilterableJobBoard({ jobs, onClearFilters, hasActiveFilters = false }: FilterableJobBoardProps) {
  const dispatch: AppDispatch = useDispatch();
  const { pendingStatusUpdates } = useSelector((state: RootState) => state.jobs);
  
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  // Add sensors for better touch/mouse handling
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor)
  );

  const groupedJobs = useMemo(() => {
    const groups: { [key in JobStatus]: Job[] } = {
      APPLIED: [],
      INTERVIEWING: [],
      OFFERED: [],
      REJECTED: [],
      WITHDRAWN: [],
    };
    
    jobs.forEach(job => {
      if (groups[job.status]) {
        groups[job.status].push(job);
      }
    });
    
    return groups;
  }, [jobs]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const job = jobs.find(job => job.id === active.id);
    setActiveJob(job || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null); // Reset active job
    
    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as JobStatus;
    
    const currentJob = jobs.find(job => job.id === jobId);

    if (currentJob && currentJob.status !== newStatus) {
      dispatch(updateJobStatus({ id: jobId, status: newStatus }))
        .unwrap()
        .then(() => toast.success(`Moved to ${newStatus}`))
        .catch((error) => toast.error(`Error: ${error}`));
    }
  };

  if (jobs.length === 0) {
    return hasActiveFilters ? (
      <NoResultsState 
        onClearFilters={onClearFilters || (() => {})} 
        hasFilters={hasActiveFilters} 
      />
    ) : (
      <EmptyState />
    );
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {STATUSES.map((status) => (
          <JobColumn
            key={status}
            id={status}
            title={status}
            jobs={groupedJobs[status]}
            pendingStatusUpdates={pendingStatusUpdates}
          />
        ))}
      </div>
      
      {/* Add DragOverlay for smooth dragging */}
      <DragOverlay>
        {activeJob ? (
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-500 opacity-95 transform rotate-3">
            <h3 className="font-semibold text-gray-900">{activeJob.company}</h3>
            <p className="text-gray-600">{activeJob.position}</p>
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-2">
              {activeJob.status}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
