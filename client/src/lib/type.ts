export enum JobStatus {
  APPLIED = "APPLIED",
  INTERVIEWING = "INTERVIEWING",
  OFFERED = "OFFERED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  appliedAt: string;
  description?: string;
  salary?: string;
  location?: string;
  jobUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}