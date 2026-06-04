import React, { useState } from 'react';
import { 
  HeartPulse, LogOut, ArrowRight, Calendar, User, 
  HelpCircle, CreditCard, Clock, CheckCircle2, ChevronRight,
  PlusCircle, RefreshCw, Eye, Search, AlertCircle, FileText, Ban
} from 'lucide-react';
import { Ticket } from '../types';

interface PatientDashboardProps {
  patientNik: string;
  patientName: string;
  tickets: Ticket[];
  onLogout: () => void;
  onNavigateToBooking: () => void;
  onNavigateToQueue: (polyclinicId: string) => void;
  onViewETicket: (ticket: Ticket) => void;
}

export default function PatientDashboard({
  patientNik,
  patientName,
  tickets,
  onLogout,
  onNavigateToBooking,
  onNavigateToQueue,
  onViewETicket
}: PatientDashboardProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'aktif' | 'selesai' | 'batal'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patient tickets
  const patientTickets = tickets.filter(t => t.patientNik === patientNik);

  // Active tickets that need immediate user attention
  const activeTicket = patientTickets.find(t => t.status === 'aktif' || t.status === 'belum_verifikasi' || t.status === 'sedang_layani');

  const filteredTickets = patientTickets.filter(t => {
    // Tab filter
    if (filterTab === 'aktif' && t.status !== 'aktif' && t.status !== 'belum_verifikasi' && t.status !== 'sedang_layani') return false;
    if (filterTab === 'selesai' && t.status !== 'selesai') return false;
    if (filterTab === 'batal' && t.status !== 'batal') return false;

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        t.registrationNumber.toLowerCase().includes(query) ||
        t.doctorName.toLowerCase().includes(query) ||
        t.polyclinicName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Professional Portal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-sm">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-950 block">Portal Pasien SIPRS</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  REKAM MEDIS AKTIF
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs text-slate-400 font-medium font-sans">Selamat datang,</span>
                <span className="text-sm font-black text-slate-800 tracking-tight">{patientName}</span>
              </div>
              <div className="bg-slate-100 p-2.5 rounded-2xl border border-slate-200">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <button 
                onClick={onLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-2xl border border-red-100 transition-colors cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Welcome and quick disclaimer */}
        <div className="bg-emerald-950 text-white px-8 py-7 rounded-3xl relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Kesehatan Anda Adalah Prioritas Utama Kami</h2>
              <p className="text-slate-300 text-xs font-light leading-relaxed max-w-2xl">
                Dapatkan pelayanan rawat jalan terbaik di SIPRS. Untuk kenyamanan bersama, harap tiba di loket verifikasi 15 menit sebelum sesi dokter dimulai untuk mencocokkan e-Ticket Anda.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <button 
                onClick={onNavigateToBooking}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" /> Daftar Poliklinik Baru <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Queue Card Section */}
        {activeTicket ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-100 pb-6 mb-6">
              
              <div className="flex items-center gap-4">
                <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl border border-amber-200 animate-pulse">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Pendaftaran Aktif Berhasil</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md">
                      {activeTicket.registrationNumber}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-950 mt-1">{activeTicket.polyclinicName}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{activeTicket.doctorName}</p>
                </div>
              </div>

              {/* Outstanding large Number badge */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 flex sm:items-center gap-4 w-full lg:w-auto justify-between sm:justify-start">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block tracking-wider">No. Antrean Anda</span>
                  <span className="text-4xl font-extrabold text-emerald-600 tracking-tight block mt-0.5">{activeTicket.queueNumber}</span>
                </div>
                <div className="h-10 w-px bg-emerald-200 hidden sm:block"></div>
                <div className="text-right sm:text-left">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Metode Sesi</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1">{activeTicket.sessionTime}</span>
                </div>
              </div>

            </div>

            {/* Visit Progress Tracker */}
            <div className="py-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Status Kunjungan Pasien</h4>
              
              <div className="grid grid-cols-4 gap-4 relative">
                {/* Horizontal progress bar behind icons */}
                <div className="absolute top-[18px] left-[10%] right-[10%] h-[3px] bg-slate-100 z-0"></div>

                {/* Progress highlight color */}
                <div 
                  className="absolute top-[18px] left-[10%] h-[3px] bg-emerald-500 z-0 transition-all duration-500" 
                  style={{
                    width: activeTicket.status === 'belum_verifikasi' 
                      ? '0%' 
                      : activeTicket.status === 'aktif' 
                        ? '33%' 
                        : activeTicket.status === 'sedang_layani' 
                          ? '66%' 
                          : '100%'
                  }}
                ></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all ${
                    activeTicket.status === 'belum_verifikasi'
                      ? 'bg-amber-100 text-amber-700 border-amber-400'
                      : 'bg-emerald-500 text-white border-emerald-500'
                  }`}>
                    1
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-2 block">Daftar Online</span>
                  <span className="text-[9px] text-slate-400 font-normal hidden sm:block">Konfirmasi tercatat</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all ${
                    activeTicket.status === 'belum_verifikasi'
                      ? 'bg-white text-slate-400 border-slate-200'
                      : activeTicket.status === 'aktif'
                        ? 'bg-amber-100 text-amber-700 border-amber-400 animate-pulse'
                        : 'bg-emerald-500 text-white border-emerald-500'
                  }`}>
                    2
                  </div>
                  <span className={`text-[11px] font-bold mt-2 block ${activeTicket.status === 'belum_verifikasi' ? 'text-slate-400' : 'text-slate-800'}`}>Check-In</span>
                  <span className="text-[9px] text-slate-400 font-normal hidden sm:block">Verifikasi loket cetak</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all ${
                    activeTicket.status === 'belum_verifikasi' || activeTicket.status === 'aktif'
                      ? 'bg-white text-slate-400 border-slate-200'
                      : activeTicket.status === 'sedang_layani'
                        ? 'bg-amber-100 text-amber-700 border-amber-400 animate-pulse'
                        : 'bg-emerald-500 text-white border-emerald-500'
                  }`}>
                    3
                  </div>
                  <span className={`text-[11px] font-bold mt-2 block ${activeTicket.status === 'belum_verifikasi' || activeTicket.status === 'aktif' ? 'text-slate-400' : 'text-slate-800'}`}>Konsultasi</span>
                  <span className="text-[9px] text-slate-400 font-normal hidden sm:block">Sedang di ruang periksa</span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all ${
                    activeTicket.status !== 'selesai'
                      ? 'bg-white text-slate-400 border-slate-200'
                      : 'bg-emerald-500 text-white border-emerald-500'
                  }`}>
                    4
                  </div>
                  <span className={`text-[11px] font-bold mt-2 block ${activeTicket.status !== 'selesai' ? 'text-slate-400' : 'text-slate-800'}`}>Selesai</span>
                  <span className="text-[9px] text-slate-400 font-normal hidden sm:block">Ambil obat & pulang</span>
                </div>

              </div>
            </div>

            {/* Quick CTAs for Active ticket */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={() => onNavigateToQueue(activeTicket.polyclinicId)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Clock className="w-4 h-4 text-emerald-600" /> Pantau Antrean Real-time
              </button>
              <button 
                onClick={() => onViewETicket(activeTicket)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4" /> Lihat e-Ticket Kunjungan
              </button>
            </div>

          </div>
        ) : (
          /* Empty Active Ticket view to mimic user interface */
          <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-200 text-center space-y-4">
            <div className="bg-slate-50 text-slate-400 p-4 rounded-full w-fit mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tidak Ada Jadwal Kunjungan Aktif</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto leading-relaxed">
                Anda tidak memiliki antrean rawat jalan aktif hari ini. Yuk jadwalkan konsultasi dokter spesialis sekarang!
              </p>
            </div>
            <button 
              onClick={onNavigateToBooking}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-sm transition-transform active:scale-95 inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Daftarkan Poliklinik Baru
            </button>
          </div>
        )}

        {/* History visit lists table module */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          
          {/* Header block with search & tabs */}
          <div className="p-6 sm:p-8 border-b border-slate-100 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-950">Riwayat Kunjungan Rawat Jalan</h3>
                <p className="text-slate-400 text-xs mt-0.5">Daftar riwayat konsultasi medis masa lalu dan pendaftaran berjalan.</p>
              </div>

              {/* History Search Box */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4 pointer-events-none" />
                <input 
                  type="text"
                  placeholder="Cari poli, dokter, transaksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Filter Tabs matching the look from the screenshot */}
            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200 w-fit">
              <button 
                onClick={() => setFilterTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua Kunjungan ({patientTickets.length})
              </button>
              <button 
                onClick={() => setFilterTab('aktif')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'aktif' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Aktif ({patientTickets.filter(t => t.status === 'aktif' || t.status === 'belum_verifikasi' || t.status === 'sedang_layani').length})
              </button>
              <button 
                onClick={() => setFilterTab('selesai')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'selesai' ? 'bg-white text-teal-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Selesai ({patientTickets.filter(t => t.status === 'selesai').length})
              </button>
              <button 
                onClick={() => setFilterTab('batal')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'batal' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Batal ({patientTickets.filter(t => t.status === 'batal').length})
              </button>
            </div>

          </div>

          {/* Actual responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="py-4 px-6">Tanggal & Registrasi</th>
                  <th className="py-4 px-6">Poliklinik Tujuan</th>
                  <th className="py-4 px-6">Dokter Spesialis</th>
                  <th className="py-4 px-6 text-center">No. Antrean</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Aksi / Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Date / Reg No */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-900">{ticket.appointmentDate}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ticket.registrationNumber}</div>
                    </td>

                    {/* Clinic */}
                    <td className="py-4 px-6">
                      <div className="text-slate-800 font-bold">{ticket.polyclinicName}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">Sesi: {ticket.sessionTime}</div>
                    </td>

                    {/* Doctor specialty */}
                    <td className="py-4 px-6 text-slate-600 font-medium font-sans">
                      {ticket.doctorName}
                    </td>

                    {/* Queue number */}
                    <td className="py-4 px-6 text-center">
                      <span className="font-extrabold text-sm text-emerald-600 font-mono bg-emerald-50 px-2.5 py-1 rounded-lg">
                        {ticket.queueNumber}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center">
                      {ticket.status === 'belum_verifikasi' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5" /> Menunggu Loket
                        </span>
                      )}
                      {ticket.status === 'aktif' && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-200">
                          <Clock className="w-3.5 h-3.5 animate-pulse" /> Check-in Aktif
                        </span>
                      )}
                      {ticket.status === 'sedang_layani' && (
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-purple-200 animate-pulse">
                          🎯 Di Ruang Periksa
                        </span>
                      )}
                      {ticket.status === 'selesai' && (
                        <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-teal-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                        </span>
                      )}
                      {ticket.status === 'batal' && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-150">
                          <Ban className="w-3.5 h-3.5" /> Dibatalkan
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-center">
                      {ticket.status !== 'batal' ? (
                        <button 
                          onClick={() => onViewETicket(ticket)}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 mx-auto border border-emerald-100"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detail e-Ticket
                        </button>
                      ) : (
                        <span className="text-slate-400 font-light text-[11px]">Batal / Non-aktif</span>
                      )}
                    </td>

                  </tr>
                ))}

                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-normal">
                      Tidak ada riwayat kunjungan yang sesuai dengan kriteria filter tab Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>
    </div>
  );
}
