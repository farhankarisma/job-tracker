"use client";

import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Job, JobStatus } from "@/lib/type";
import JobColumn from "./JobColumn";

// We will create these components in the next steps
// import JobColumn from './JobColumn';
// import { updateJobStatus } from '@/lib/features/jobs/jobsSlice';

const STATUSES: JobStatus[] = [
  JobStatus.APPLIED,
  JobStatus.INTERVIEWING,
  JobStatus.OFFERED,
  JobStatus.REJECTED,
  JobStatus.WITHDRAWN,
];

export default function JobBoard() {
  const dispatch: AppDispatch = useDispatch();
  const { items: jobs } = useSelector((state: RootState) => state.jobs);

  const groupedJobs = useMemo(() => {
    const groups: { [key in JobStatus]: Job[] } = {
      APPLIED: [],
      INTERVIEWING: [],
      OFFERED: [],
      REJECTED: [],
      WITHDRAWN: [],
    };

    jobs.forEach((job) => {
      if (groups[job.status]) {
        groups[job.status].push(job);
      }
    });

    return groups;
  }, [jobs]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as JobStatus;

    const currentJob = jobs.find((job) => job.id === jobId);

    if (currentJob && currentJob.status !== newStatus) {
      // We will create this action in a later step
      // dispatch(updateJobStatus({ id: jobId, status: newStatus }));
      console.log(`Move job ${jobId} to ${newStatus}`);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {STATUSES.map((status) => (
          // Use the new JobColumn component here
          <JobColumn
            key={status}
            id={status}
            title={status}
            jobs={groupedJobs[status]}
          />
        ))}
      </div>
    </DndContext>
  );
}
