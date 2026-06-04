import { Polyclinic, Doctor, Ticket, Patient } from './types';

export const MOCK_POLICLINICS: Polyclinic[] = [
  {
    id: 'poli-umum',
    name: 'Poli Umum',
    icon: 'Activity',
    description: 'Pemeriksaan kesehatan umum, rujukan, konsultasi awal kesehatan fisik harian.',
    totalDoctors: 4,
    roomNumber: 'Gedung A, Lt. 1, Ruang 101'
  },
  {
    id: 'poli-penyakit-dalam',
    name: 'Poli Penyakit Dalam',
    icon: 'Stethoscope',
    description: 'Diagnosis dan terapi medis non-bedah untuk penyakit sistemik organ dalam.',
    totalDoctors: 3,
    roomNumber: 'Gedung B, Lt. 1, Ruang 105'
  },
  {
    id: 'poli-jantung',
    name: 'Poli Jantung & Pembuluh',
    icon: 'HeartPulse',
    description: 'Pelayanan kardiologi komprehensif, EKG, konsultasi jantung dan vaskular.',
    totalDoctors: 2,
    roomNumber: 'Gedung B, Lt. 2, Ruang 203'
  },
  {
    id: 'poli-anak',
    name: 'Poli Anak (Pediatri)',
    icon: 'Baby',
    description: 'Imunisasi tumbuh kembang, pediatri preventif, pengobatan penyakit anak.',
    totalDoctors: 3,
    roomNumber: 'Gedung A, Lt. 2, Ruang 201'
  },
  {
    id: 'poli-tht',
    name: 'Poli THT-KL',
    icon: 'Ear',
    description: 'Penanganan penyakit telinga, hidung, tenggorokan, kepala, dan leher.',
    totalDoctors: 2,
    roomNumber: 'Gedung A, Lt. 1, Ruang 103'
  },
  {
    id: 'poli-gandungan',
    name: 'Poli Kandungan & Kebidanan',
    icon: 'UserRound',
    description: 'Pemeriksaan kehamilan, USG 4D, kesehatan reproduksi wanita, KB.',
    totalDoctors: 2,
    roomNumber: 'Gedung B, Lt. 2, Ruang 208'
  },
  {
    id: 'poli-gigi',
    name: 'Poli Gigi & Mulut',
    icon: 'Smile',
    description: 'Tambal gigi, cabut, pembersihan karang gigi, ortodonti, bedah mulut.',
    totalDoctors: 3,
    roomNumber: 'Gedung A, Lt. 1, Ruang 110'
  },
  {
    id: 'poli-mata',
    name: 'Poli Mata',
    icon: 'Eye',
    description: 'Pemeriksaan visus, kacamata, penanganan gangguan kornea dan katarak.',
    totalDoctors: 2,
    roomNumber: 'Gedung A, Lt. 2, Ruang 205'
  }
];

export const MOCK_DOCTORS: Doctor[] = [
  // Poli Umum
  {
    id: 'doc-budi',
    name: 'dr. Budi Setiawan',
    specialty: 'Dokter Umum',
    polyclinicId: 'poli-umum',
    rating: 4.8,
    activeDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
    sessionTime: '08:00 - 11:30 WIB',
    experienceYears: 6,
    maxQuota: 30,
    currentQuota: 12,
    consultationFee: 75000
  },
  {
    id: 'doc-citra',
    name: 'dr. Citra Lestari',
    specialty: 'Dokter Umum',
    polyclinicId: 'poli-umum',
    rating: 4.7,
    activeDays: ['Senin', 'Rabu', 'Kamis'],
    sessionTime: '13:00 - 16:30 WIB',
    experienceYears: 4,
    maxQuota: 25,
    currentQuota: 5,
    consultationFee: 75000
  },

  // Poli Penyakit Dalam
  {
    id: 'doc-sari',
    name: 'dr. Sari Indah, Sp.PD',
    specialty: 'Spesialis Penyakit Dalam',
    polyclinicId: 'poli-penyakit-dalam',
    rating: 4.9,
    activeDays: ['Senin', 'Rabu', 'Jumat'],
    sessionTime: '07:30 - 10:00 WIB',
    experienceYears: 12,
    maxQuota: 15,
    currentQuota: 7,
    consultationFee: 150000
  },
  {
    id: 'doc-hadi',
    name: 'dr. Hadi Wijaya, Sp.PD',
    specialty: 'Spesialis Penyakit Dalam',
    polyclinicId: 'poli-penyakit-dalam',
    rating: 4.8,
    activeDays: ['Selasa', 'Kamis', 'Sabtu'],
    sessionTime: '14:00 - 17:00 WIB',
    experienceYears: 10,
    maxQuota: 20,
    currentQuota: 3,
    consultationFee: 150000
  },

  // Poli Jantung
  {
    id: 'doc-anton',
    name: 'dr. Anton Pratama, Sp.JP',
    specialty: 'Spesialis Jantung & Pembuluh',
    polyclinicId: 'poli-jantung',
    rating: 4.9,
    activeDays: ['Senin', 'Selasa', 'Kamis'],
    sessionTime: '08:00 - 11:00 WIB',
    experienceYears: 15,
    maxQuota: 15,
    currentQuota: 8,
    consultationFee: 200000
  },
  {
    id: 'doc-elisa',
    name: 'dr. Elisa Melani, Sp.JP',
    specialty: 'Spesialis Jantung & Pembuluh',
    polyclinicId: 'poli-jantung',
    rating: 4.9,
    activeDays: ['Rabu', 'Jumat'],
    sessionTime: '13:00 - 15:30 WIB',
    experienceYears: 9,
    maxQuota: 15,
    currentQuota: 4,
    consultationFee: 200000
  },

  // Poli Anak
  {
    id: 'doc-faisal',
    name: 'dr. Faisal Reza, Sp.A',
    specialty: 'Spesialis Anak',
    polyclinicId: 'poli-anak',
    rating: 4.9,
    activeDays: ['Senin', 'Selasa', 'Kamis', 'Jumat'],
    sessionTime: '08:00 - 11:00 WIB',
    experienceYears: 11,
    maxQuota: 20,
    currentQuota: 14,
    consultationFee: 130000
  },

  // Poli THT
  {
    id: 'doc-gina',
    name: 'dr. Gina Amalia, Sp.THT-KL',
    specialty: 'Spesialis THT-KL',
    polyclinicId: 'poli-tht',
    rating: 4.7,
    activeDays: ['Selasa', 'Rabu', 'Kamis'],
    sessionTime: '09:00 - 12:00 WIB',
    experienceYears: 8,
    maxQuota: 25,
    currentQuota: 6,
    consultationFee: 120000
  },

  // Poli Gigi
  {
    id: 'doc-kartika',
    name: 'drg. Kartika Widiati',
    specialty: 'Dokter Gigi',
    polyclinicId: 'poli-gigi',
    rating: 4.8,
    activeDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
    sessionTime: '08:30 - 12:00 WIB',
    experienceYears: 7,
    maxQuota: 15,
    currentQuota: 5,
    consultationFee: 100000
  }
];

export const MOCK_PATIENS: Patient[] = [
  {
    nik: '3171012405940003',
    name: 'Feri Irawan',
    email: 'feri.irawan@gmail.com',
    birthDate: '1994-05-24',
    phone: '081234567890'
  },
  {
    nik: '3172041212880005',
    name: 'Budi Santoso',
    email: 'budi.santoso@yahoo.com',
    birthDate: '1988-12-12',
    phone: '085678901234'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-001',
    registrationNumber: 'SIPRS-024052024-007',
    patientNik: '3171012405940003',
    patientName: 'Feri Irawan',
    patientPhone: '081234567890',
    doctorId: 'doc-sari',
    doctorName: 'dr. Sari Indah, Sp.PD',
    polyclinicId: 'poli-penyakit-dalam',
    polyclinicName: 'Poli Penyakit Dalam',
    appointmentDate: '2026-06-08', // Set to a close future Monday for demo
    sessionTime: '07:30 - 10:00 WIB',
    queueNumber: '007',
    status: 'aktif',
    createdAt: '2026-06-01T08:12:00Z'
  },
  {
    id: 'TKT-002',
    registrationNumber: 'SIPRS-15052026-012',
    patientNik: '3171012405940003',
    patientName: 'Feri Irawan',
    patientPhone: '081234567890',
    doctorId: 'doc-budi',
    doctorName: 'dr. Budi Setiawan',
    polyclinicId: 'poli-umum',
    polyclinicName: 'Poli Umum',
    appointmentDate: '2026-05-15',
    sessionTime: '08:00 - 11:30 WIB',
    queueNumber: '023',
    status: 'selesai',
    createdAt: '2026-05-14T09:45:00Z'
  },
  {
    id: 'TKT-003',
    registrationNumber: 'SIPRS-02052026-015',
    patientNik: '3171012405940003',
    patientName: 'Feri Irawan',
    patientPhone: '081234567890',
    doctorId: 'doc-anton',
    doctorName: 'dr. Anton Pratama, Sp.JP',
    polyclinicId: 'poli-jantung',
    polyclinicName: 'Poli Jantung & Pembuluh',
    appointmentDate: '2026-05-02',
    sessionTime: '08:00 - 11:00 WIB',
    queueNumber: '005',
    status: 'batal',
    createdAt: '2026-05-01T15:20:00Z'
  },
  {
    id: 'TKT-004',
    registrationNumber: 'SIPRS-01062026-004',
    patientNik: '3172041212880005',
    patientName: 'Budi Santoso',
    patientPhone: '085678901234',
    doctorId: 'doc-faisal',
    doctorName: 'dr. Faisal Reza, Sp.A',
    polyclinicId: 'poli-anak',
    polyclinicName: 'Poli Anak (Pediatri)',
    appointmentDate: '2026-06-03',
    sessionTime: '08:00 - 11:00 WIB',
    queueNumber: '014',
    status: 'belum_verifikasi',
    createdAt: '2026-06-02T11:30:00Z'
  }
];

export const INITIAL_QUEUES: Record<string, number> = {
  'poli-umum': 12,
  'poli-penyakit-dalam': 4,
  'poli-jantung': 3,
  'poli-anak': 14,
  'poli-tht': 6,
  'poli-gigi': 5,
  'poli-mata': 1
};
