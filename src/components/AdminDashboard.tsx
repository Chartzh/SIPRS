import React, { useState } from 'react';
import { 
  HeartPulse, LayoutDashboard, Database, Calendar, Users, 
  HelpCircle, Sparkles, TrendingUp, DollarSign, Stethoscope, 
  Trash2, Plus, Edit3, Check, Ban, LogOut, FileBarChart2, AlertCircle
} from 'lucide-react';
import { Ticket, Doctor, Polyclinic } from '../types';
import { MOCK_DOCTORS, MOCK_POLICLINICS } from '../data';

interface AdminDashboardProps {
  adminName: string;
  tickets: Ticket[];
  onLogout: () => void;
}

export default function AdminDashboard({ adminName, tickets, onLogout }: AdminDashboardProps) {
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(MOCK_DOCTORS);
  const [manageTab, setManageTab] = useState<'laporan' | 'jadwal'>('laporan');

  // Fields for adding new doctor schedule
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocPoli, setNewDocPoli] = useState('poli-umum');
  const [newDocQuota, setNewDocQuota] = useState(20);
  const [newDocFee, setNewDocFee] = useState(100000);
  const [warningMsg, setWarningMsg] = useState('');

  // Computing stats values
  const totalReg = tickets.length;
  const verifiedCheckIn = tickets.filter(t => t.status !== 'belum_verifikasi').length;
  const completedReg = tickets.filter(t => t.status === 'selesai').length;
  const canceledReg = tickets.filter(t => t.status === 'batal').length;

  // Aggregate totals by Polyclinic for the gorgeous Bar Chart
  const getClinicLoadData = () => {
    const counts: Record<string, number> = {};
    MOCK_POLICLINICS.forEach(p => { counts[p.name] = 0; });
    
    tickets.forEach(t => {
      if (counts[t.polyclinicName] !== undefined) {
        counts[t.polyclinicName] += 1;
      } else {
        counts[t.polyclinicName] = 1;
      }
    });

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  const clinicData = getClinicLoadData();

  // Handle adding new Doctor schedule
  const handleAddDoctorSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setWarningMsg('');

    if (!newDocName.trim() || !newDocSpecialty.trim()) {
      setWarningMsg('Harap isi semua kolom nama dan bidang spesialis dokter.');
      return;
    }

    // Check duplicate name or schedule conflicts
    const conflictFound = doctorsList.find(d => 
      d.name.toLowerCase() === newDocName.toLowerCase() && 
      d.polyclinicId === newDocPoli
    );

    if (conflictFound) {
      setWarningMsg(`Konflik Jadwal Terbaca: dr. ${newDocName} sudah terpasang rujukan poliklinik yang sama.`);
      return;
    }

    const newDoctorObj: Doctor = {
      id: `doc-${Date.now()}`,
      name: `dr. ${newDocName.replace('dr. ', '')}`,
      specialty: newDocSpecialty,
      polyclinicId: newDocPoli,
      rating: 4.8,
      activeDays: ['Senin', 'Rabu', 'Jumat'],
      sessionTime: '08:00 - 11:00 WIB',
      experienceYears: 5,
      maxQuota: Number(newDocQuota),
      currentQuota: 0,
      consultationFee: Number(newDocFee)
    };

    setDoctorsList([newDoctorObj, ...doctorsList]);
    setNewDocName('');
    setNewDocSpecialty('');
    setNewDocQuota(20);
    setNewDocFee(100000);
  };

  // Toggle Doctor's current operational status
  const handleDeleteDoctor = (id: string) => {
    setDoctorsList(doctorsList.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Header navbar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 text-white p-2.5 rounded-2xl shadow-md">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight block">Dasbor Analitis Direktur (Admin)</span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">SIPRS Pelaporan Rumah Sakit Sakti</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-normal uppercase tracking-wider">Administrator:</span>
                <strong className="text-sm font-black text-rose-100 tracking-tight">{adminName}</strong>
              </div>
              <button 
                onClick={onLogout}
                className="bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 p-2.5 rounded-2xl transition-colors cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Control Switcher Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 text-sm font-bold">
          <button 
            onClick={() => setManageTab('laporan')}
            className={`py-5 border-b-2 transition-all flex items-center gap-2 ${
              manageTab === 'laporan' 
                ? 'border-emerald-600 text-emerald-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileBarChart2 className="w-4 h-4" /> Laporan & Analitik Kunjungan
          </button>
          
          <button 
            onClick={() => setManageTab('jadwal')}
            className={`py-5 border-b-2 transition-all flex items-center gap-2 ${
              manageTab === 'jadwal' 
                ? 'border-emerald-600 text-emerald-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Kelola Dokter & Jadwal Roster
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* LAPORAN & ANALITYC TAB VIEW */}
        {manageTab === 'laporan' && (
          <div className="space-y-8">
            
            {/* Top Quick Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-450 text-[10px] uppercase font-bold block">Total Registrasi</span>
                  <strong className="text-2xl font-black text-slate-900 block mt-0.5">{totalReg}</strong>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-450 text-[10px] uppercase font-bold block">Rate Kehadiran</span>
                  <strong className="text-2xl font-black text-slate-900 block mt-0.5">
                    {totalReg > 0 ? Math.round((verifiedCheckIn / totalReg) * 105) : 0}%
                  </strong>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="bg-teal-50 text-teal-600 p-3 rounded-2xl">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-450 text-[10px] uppercase font-bold block">Selesai Berobat</span>
                  <strong className="text-2xl font-black text-slate-900 block mt-0.5">{completedReg}</strong>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="bg-rose-50 text-rose-600 p-3 rounded-2xl">
                  <Ban className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-450 text-[10px] uppercase font-bold block">Pembatalan</span>
                  <strong className="text-2xl font-black text-slate-900 block mt-0.5">{canceledReg}</strong>
                </div>
              </div>

            </div>

            {/* Visual SVG Hand Crafted Charts row layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Daily Outpatient curve flow chart */}
              <div className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center bg-white">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-950">Tren Kunjungan Rawat Jalan Mingguan</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Fluktuasi pendaftaran harian yang terangkum di loket.</p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Sistem Rujukan Terpusat
                  </span>
                </div>

                {/* Hand crafted beautiful SVG area chart */}
                <div className="h-64 w-full pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 220" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* horizontal grids */}
                    <line x1="0" y1="20" x2="1000" y2="20" stroke="#f1f5f9" strokeWidth="1.5" />
                    <line x1="0" y1="70" x2="1000" y2="70" stroke="#f1f5f9" strokeWidth="1.5" />
                    <line x1="0" y1="120" x2="1000" y2="120" stroke="#f1f5f9" strokeWidth="1.5" />
                    <line x1="0" y1="170" x2="1000" y2="170" stroke="#f1f5f9" strokeWidth="1.5" />
                    <line x1="0" y1="220" x2="1000" y2="220" stroke="#e2e8f0" strokeWidth="2" />

                    {/* Area Polygon */}
                    <polygon 
                      points="50,170 200,120 350,50 500,140 650,40 800,90 950,130 950,220 50,220" 
                      fill="url(#areaGrad)" 
                    />

                    {/* Sparkline curve */}
                    <path 
                      d="M 50 170 L 200 120 L 350 50 L 500 140 L 650 40 L 800 90 L 950 130" 
                      fill="none" 
                      stroke="#059669" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />

                    {/* Data Points hover pins */}
                    <circle cx="50" cy="170" r="5" fill="#34d399" stroke="#065f46" strokeWidth="2" />
                    <circle cx="200" cy="120" r="5" fill="#34d399" stroke="#065f46" strokeWidth="2" />
                    <circle cx="350" cy="50" r="5" fill="#34d399" stroke="#065f46" strokeWidth="2" />
                    <circle cx="500" cy="140" r="5" fill="#34d399" stroke="#065f46" strokeWidth="2" />
                    <circle cx="650" cy="40" r="5" fill="#34d399" stroke="#065f46" strokeWidth="2" />
                    <circle cx="800" cy="90" r="5" fill="#34d399" stroke="#065f46" strokeWidth="2" />
                    <circle cx="950" cy="130" r="5" fill="#34d399" stroke="#065f46" strokeWidth="2" />

                    {/* Values labels text display */}
                    <text x="50" y="150" fill="#065f46" fontWeight="bold" fontSize="10" textAnchor="middle">12 Reservasi</text>
                    <text x="200" y="100" fill="#065f46" fontWeight="bold" fontSize="10" textAnchor="middle">18 Reservasi</text>
                    <text x="350" y="30" fill="#065f46" fontWeight="bold" fontSize="10" textAnchor="middle">24 Reservasi (Puncak)</text>
                    <text x="500" y="120" fill="#065f46" fontWeight="bold" fontSize="10" textAnchor="middle">14 Reservasi</text>
                    <text x="650" y="20" fill="#065f46" fontWeight="bold" fontSize="10" textAnchor="middle">25 Reservasi</text>
                    <text x="800" y="70" fill="#065f46" fontWeight="bold" fontSize="10" textAnchor="middle">20 Reservasi</text>
                    <text x="950" y="110" fill="#065f46" fontWeight="bold" fontSize="10" textAnchor="middle">15 Reservasi</text>

                    {/* Weekday axis */}
                    <text x="50" y="235" fill="#94a3b8" fontWeight="bold" fontSize="11" textAnchor="middle">Senin</text>
                    <text x="200" y="235" fill="#94a3b8" fontWeight="bold" fontSize="11" textAnchor="middle">Selasa</text>
                    <text x="350" y="235" fill="#94a3b8" fontWeight="bold" fontSize="11" textAnchor="middle">Rabu</text>
                    <text x="500" y="235" fill="#94a3b8" fontWeight="bold" fontSize="11" textAnchor="middle">Kamis</text>
                    <text x="650" y="235" fill="#94a3b8" fontWeight="bold" fontSize="11" textAnchor="middle">Jumat</text>
                    <text x="800" y="235" fill="#94a3b8" fontWeight="bold" fontSize="11" textAnchor="middle">Sabtu</text>
                    <text x="950" y="235" fill="#94a3b8" fontWeight="bold" fontSize="11" textAnchor="middle">Hari Ini</text>
                  </svg>
                </div>
              </div>

              {/* Clinic load distributions bar layout */}
              <div className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-950">Beban Konsultasi per Poliklinik</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Proporsi pembagian kunjungan antrean di setiap klaster rawat.</p>
                </div>

                <div className="space-y-4">
                  {clinicData.map((c, idx) => {
                    // Maximum of total check-ins to make relative percentage
                    const maxCount = Math.max(...clinicData.map(cd => cd.count), 1);
                    const pct = Math.round((c.count / maxCount) * 100);

                    return (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-slate-700">{c.name}</span>
                          <span className="text-slate-550 font-mono text-emerald-600">{c.count} Kunjungan</span>
                        </div>
                        {/* Horizontal Custom Bar */}
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 rounded-full h-full transition-all duration-700" 
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* KELOLA DOKTER & JADWAL ROSTER VIEW */}
        {manageTab === 'jadwal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left column: Add new Doctor Schedule form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 h-fit">
              <div className="border-b pb-3">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  SINKRONISASI ROSTER DOKTER
                </span>
                <h3 className="text-lg font-black text-slate-950 mt-2">Buat Jadwal Baru</h3>
                <p className="text-xs text-slate-400 font-normal">Tambahkan slots jam praktek dokter spesialis.</p>
              </div>

              {warningMsg && (
                <div className="bg-amber-50 text-amber-700 p-3.5 rounded-2xl text-xs font-semibold border border-amber-200 flex items-start gap-1.5 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{warningMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddDoctorSchedule} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Nama Dokter (Lengkap)</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: dr. Handoko Lim"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">Spesialis / Bidang Medis</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Spesialis Kulit & Kelamin"
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">Poli Induk</label>
                    <select 
                      value={newDocPoli}
                      onChange={(e) => setNewDocPoli(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white"
                    >
                      {MOCK_POLICLINICS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 font-bold block mb-1">Maks Quota Antrean</label>
                    <input 
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={newDocQuota}
                      onChange={(e) => setNewDocQuota(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-605 font-bold block mb-1">Biaya Konsultasi Medis (IDR)</label>
                  <input 
                    type="number"
                    required
                    step={10000}
                    value={newDocFee}
                    onChange={(e) => setNewDocFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold w-full py-3.5 rounded-2xl flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all text-xs"
                >
                  <Plus className="w-4 h-4" /> Pasangkan & Daftarkan Dokter Roster
                </button>
              </form>
            </div>

            {/* Right column: Roster Table lists */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-6 sm:p-8 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-950 text-base">Roster Kedokteran Aktif SIPRS</h3>
                <p className="text-slate-450 text-xs mt-0.5">Seluruh dokter spesialis yang terpasang di database online.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                      <th className="py-4 px-6">Nama & Bidang Spesialis</th>
                      <th className="py-4 px-6 text-center">Quota Limit</th>
                      <th className="py-4 px-6 text-right">Biaya Konsul</th>
                      <th className="py-4 px-6 text-center">Aksi Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                    {doctorsList.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/20 transition-colors">
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-extrabold flex items-center justify-center border shrink-0 text-xs">
                              {doc.name.replace('dr. ', '').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong className="text-slate-900 block font-bold text-xs sm:text-sm">{doc.name}</strong>
                              <span className="text-[10px] text-slate-400 block font-normal">{doc.specialty}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span className="font-extrabold font-mono text-slate-800">
                            {doc.maxQuota} Pasien / Sesi
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right font-mono text-slate-700">
                          IDR {doc.consultationFee.toLocaleString('id-ID')}
                        </td>

                        <td className="py-4 px-6 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteDoctor(doc.id)}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 p-2 rounded-xl transition-all"
                            title="Hapus Roster"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
