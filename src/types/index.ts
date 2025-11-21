// Tipos base para la aplicación

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'worker';
  status: 'active' | 'inactive';
  worker_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Shift {
  id: number;
  worker_id: number;
  area_id: number;
  start_at: string;
  end_at: string;
  status: string;
  worker?: {
    id: number;
    name: string;
  };
  area?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ShiftCreateData {
  worker_id: number;
  area_id: number;
  start_at: string;
  end_at: string;
}

export interface Worker {
  id: number;
  name: string;
  email?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Device {
  id: number;
  name: string;
  type: string;
  area_id: number;
  status: 'active' | 'inactive';
  ip_address?: string;
  created_at?: string;
  updated_at?: string;
  area?: {
    id: number;
    name: string;
  };
}

export interface DeviceCreateData {
  name: string;
  type: string;
  area_id: number;
  ip_address?: string;
}

export interface RemoteMarkData {
  worker_id: number;
  device_id?: number;
  type: 'entry' | 'exit';
  latitude?: number;
  longitude?: number;
}

export interface Mark {
  id: number;
  worker_id: number;
  shift_id?: number;
  device_id: number;
  type: 'entry' | 'exit';
  marked_at: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceReport {
  worker_id: number;
  worker_name: string;
  date: string;
  status: string;
  entry_time?: string;
  exit_time?: string;
}

export interface DelayReport {
  worker_id: number;
  worker_name: string;
  date: string;
  shift_start: string;
  entry_time: string;
  delay_minutes: number;
}

export interface OvertimeReport {
  worker_id: number;
  worker_name: string;
  date: string;
  shift_end: string;
  exit_time: string;
  overtime_minutes: number;
}

export interface ReportFilters {
  start_date?: string;
  end_date?: string;
  worker_id?: number;
  area_id?: number;
}

export interface ShiftFilters {
  worker_id?: number;
  area_id?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface DeviceFilters {
  area_id?: number;
  type?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

