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
  status: 'planned' | 'in_progress' | 'completed' | 'inconsistent' | 'absent';
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
  deleted_at?: string | null; // Soft delete
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
  device_key: string; // Agregado según API
  type: 'clock' | 'logical' | 'external';
  area_id: number;
  status: 'active' | 'disabled'; // Cambiado de 'inactive' a 'disabled'
  ip_address?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null; // Soft delete
  area?: {
    id: number;
    name: string;
  };
}

export interface DeviceCreateData {
  name: string;
  device_key: string; // Requerido según API
  type: 'clock' | 'logical' | 'external'; // Opcional, default: 'clock'
  area_id: number;
  status?: 'active' | 'disabled'; // Opcional, default: 'active'
}

export interface RemoteMarkData {
  worker_id: number;
  device_id: number; // Requerido según API
  direction: 'in' | 'out'; // Cambiado de 'type' a 'direction' según API
  marked_at?: string; // Opcional, si no se envía usa timestamp actual
  latitude?: number;
  longitude?: number;
}

export interface Mark {
  id: number;
  worker_id: number;
  shift_id?: number | null;
  device_id: number;
  direction: 'in' | 'out'; // Cambiado de 'type' a 'direction'
  source_type: 'remote' | 'clock' | 'external';
  marked_at: string;
  truncated_minute?: string; // Para validar duplicados
  exported_at?: string | null; // Para control de exportación
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null; // Soft delete
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
  type?: 'clock' | 'logical' | 'external';
  status?: 'active' | 'disabled';
  page?: number;
  per_page?: number;
}

export interface ExportMarksFilters {
  start_date?: string;
  end_date?: string;
  only_not_exported?: boolean;
  page?: number;
  per_page?: number;
}

export interface ExportStatistics {
  total: number;
  exported: number;
  not_exported: number;
  export_percentage: number;
  date_range: {
    start: string;
    end: string;
  };
}

export interface ExportedMark {
  id: number;
  worker_id: number;
  device_id: number;
  direction: 'in' | 'out';
  marked_at: string;
  source: 'remote' | 'clock' | 'external';
  area_id: number;
  branch_id: number;
  company_id: number;
  holding_id: number;
  worker_name: string;
  worker_rut: string;
  device_name: string;
  device_key: string;
  area_name: string;
  area_code: string;
  branch_name: string;
  branch_code: string;
  company_name: string;
  company_rut: string;
  holding_name: string;
  shift_id: number | null;
  shift_start_at: string | null;
  shift_end_at: string | null;
  shift_status: string | null;
  exported_at: string | null;
}

