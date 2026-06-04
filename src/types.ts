export type UserRole = 'patient' | 'staff' | 'admin';

export interface Patient {
  nik: string;
  name: string;
  email: string;
  birthDate: string;
  phone: string;
  password?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  polyclinicId: string;
  rating: number;
  activeDays: string[]; // ['Senin', 'Rabu', 'Jumat']
  sessionTime: string; // '07:30 - 10:00 WIB'
  experienceYears: number;
  avatarUrl?: string;
  maxQuota: number;
  currentQuota: number;
  consultationFee: number;
}

export interface Polyclinic {
  id: string;
  name: string;
  icon: string; // lucide icon name
  description: string;
  totalDoctors: number;
  roomNumber: string;
}

export interface Ticket {
  id: string;
  registrationNumber: string; // e.g., REG-007
  patientNik: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  polyclinicId: string;
  polyclinicName: string;
  appointmentDate: string; // YYYY-MM-DD
  sessionTime: string;
  queueNumber: string; // e.g., "007"
  status: 'belum_verifikasi' | 'aktif' | 'sedang_layani' | 'selesai' | 'batal';
  verifiedAt?: string;
  createdAt: string;
}

export interface QueueState {
  polyclinicId: string;
  polyclinicName: string;
  doctorName: string;
  currentServing: string; // e.g. "004"
  nextQueue: string; // e.g. "005"
  patientEstimateMinutes: number;
  recentHistory: {
    queueNumber: string;
    status: 'selesai' | 'terpanggil' | 'dilewati';
    time: string;
  }[];
}
