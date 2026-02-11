// ============================================================
// Types — mirrors backend models exactly
// ============================================================

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'STAFF' | 'MANAGER';
  age?: number;
}

export interface Shift {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'ASSIGNED';
  createdBy: User | string;
  createdOn: string;
}

export interface ShiftRequest {
  _id: string;
  shift: Shift;
  requestedBy: User | string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  rejectionReason?: string;
  requestedOn: string;
  actionTakenOn?: string;
}

export interface Assignment {
  _id: string;
  shift: Shift;
  assignedTo: User | string;
  assignedOn: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface ChangeRequest {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  requestedOn: string;
  actionTakenOn?: string;
  requestedBy: string;
  requestedTo: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: string, age: number) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
