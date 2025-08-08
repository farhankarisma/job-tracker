export interface Application {
  id: string;
  company: string;
  role: string;
  status: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export interface User {
  id: string;
  email: string;
}
