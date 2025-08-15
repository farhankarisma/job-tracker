export enum JobStatus {
  APPLIED = "APPLIED",
  INTERVIEWING = "INTERVIEWING",
  OFFERED = "OFFERED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export enum JobType {
  INTERNSHIP = "INTERNSHIP",
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  FREELANCE = "FREELANCE",
}

export interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  appliedAt: string;
  type: JobType;
  color: string;
  description?: string;
  salary?: string;
  location?: string;
  jobUrl?: string;
  notes?: string;
  reminderAt?: string;
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

export interface FileItem {
  id: string;
  name: string;
  size: number;
  path: string;
  category: string;
  description?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface FilesState {
  files: FileItem[];
  filteredFiles: FileItem[];
  uploadingFiles: string[];
  filters: {
    category: string;
    searchTerm: string;
  };
  loading: boolean;
  error: string | null;
  uploadProgress: { [filename: string]: number };
}
