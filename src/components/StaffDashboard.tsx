import React, { useState } from 'react';
import { 
  HeartPulse, QrCode, Search, CheckCircle, Ban, Clock, 
  AlertCircle, ChevronRight, UserCheck, RefreshCw, LogOut,
  Sliders, ShieldAlert
} from 'lucide-react';
import { Ticket } from '../types';

interface StaffDashboardProps {
  staffName: string;
  tickets: Ticket[];
  onLogout: () => void;
  onUpdateTicketStatus: (ticketId: string, nextStatus: Ticket['status']) => void;
}

export default function StaffDashboard({
  staffName,
  tickets,
  onLogout,
  onUpdateTicketStatus
}: StaffDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketIdForScan, setSelectedTicketIdForScan] = useState('');
  const [isScanActive, setIsScanActive] = useState(false);
  const [scannedTicket, setScannedTicket] = useState<Ticket | null>(null);
  const [alertMessage, setAlertMessage] = useState({ text: '', type: 'success' });

  // Filter unverified & active appointments for the listing
  const filteredTickets = tickets.filter(t => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.patientName.toLowerCase().includes(q) ||
        t.patientNik.includes(q) ||
        t.registrationNumber.toLowerCase().includes(q) ||
        t.polyclinicName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filter candidates specifically for scan simulations (unverified tickets)
  const scannableTickets = tickets.filter(t => t.status === 'belum_verifikasi');

  // Trigger simulated scan
  const handleSimulateScan = () => {
    if (!selectedTicketIdForScan) {
      setAlertMessage({ text: 'Harap pilih salah satu e-Ticket Pasien untuk simulasi scan.', type: 'danger' });
      return;
    }

    setIsScanActive(true);
    setScannedTicket(null);
    setAlertMessage({ text: '', type: 'success' });

    // Simulate scanning delay
    setTimeout(() => {
      const ticketFound = tickets.find(t => t.id === selectedTicketIdForScan);
      if (ticketFound) {
        setScannedTicket(ticketFound);
        setIsScanActive(false);
        setAlertMessage({ text: 'e-Ticket Berhasil Terbaca! Silakan cocokkan identitas fisik sebelum klik check-in.', type: 'success' });
      } else {
        setIsScanActive(false);
        setAlertMessage({ text: 'Kesalahan: e-Ticket tidak valid atau sudah kedaluwarsa di server.', type: 'danger' });
      }
    }, 1200);
  };

  // Quick process check-in for a scanned ticket
  const handleCheckInScanned = (id: string) => {
    onUpdateTicketStatus(id, 'aktif');
    setScannedTicket(prev => prev && prev.id === id ? { ...prev, status: 'aktif' } : prev);
    setAlertMessage({ text: 'Check-in berhasil! e-Ticket diverifikasi dan antrean fisik aktif dicetak.', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Header navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 text-white p-2.5 rounded-2xl shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight block">Panel Petugas Loket | SIPRS</span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">Gedung Utama Unit Pendaftaran Rawat Jalan</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-normal uppercase tracking-wider">Petugas Jaga:</span>
                <strong className="text-sm font-black text-white tracking-tight">{staffName}</strong>
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

      {/* Workspace Body Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: QR Verification Scanner simulation widget */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Verifikasi Check-In Pasien
              </span>
              <h3 className="text-xl font-black text-slate-950 mt-2 tracking-tight">Simulasi Scanner QR-Code</h3>
              <p className="text-xs text-slate-400 font-medium">Lakukan scan QR-Code dari HP pasien untuk verifikasi kehadiran.</p>
            </div>

            {alertMessage.text && (
              <div className={`p-4 rounded-2xl text-xs font-semibold border flex items-start gap-2 ${
                alertMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                  : 'bg-red-50 text-red-650 border-red-100'
              }`}>
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{alertMessage.text}</span>
              </div>
            )}

            {/* Simulated camera grid */}
            <div className="bg-slate-900 rounded-3xl p-6 relative aspect-video flex flex-col items-center justify-center border-4 border-slate-800 overflow-hidden shadow-inner">
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

              {/* Hologram loading bar */}
              {isScanActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 animate-bounce" />
              )}

              {isScanActive ? (
                <div className="text-center space-y-2">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <span className="text-emerald-400 font-mono text-[11px] uppercase tracking-widest block">Membaca Barcode...</span>
                </div>
              ) : scannedTicket ? (
                <div className="text-center space-y-2 relative z-10 text-white">
                  <CheckCircle className="w-10 h-10 text-emerald-450 mx-auto" />
                  <div>
                    <span className="text-xs text-slate-400 block font-normal">Antrean Fisik No.</span>
                    <strong className="text-3xl font-extrabold text-emerald-400 block mt-0.5">{scannedTicket.queueNumber}</strong>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2 text-slate-400">
                  <QrCode className="w-12 h-12 mx-auto stroke-[1.5]" />
                  <span className="text-xs font-normal">Silakan pilih tiket di bawah lalu tekan Scan</span>
                </div>
              )}
            </div>

            {/* Simulative trigger select */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Simulasikan Pasien Hadir di Lobi:</label>
              
              <div className="flex gap-2.5">
                <select 
                  value={selectedTicketIdForScan}
                  onChange={(e) => {
                    setSelectedTicketIdForScan(e.target.value);
                    setScannedTicket(null);
                  }}
                  className="bg-white border border-slate-300 rounded-2xl p-3 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden flex-1 text-slate-800"
                >
                  <option value="">-- Pilih Tiket Antrean (Belum Check-In) --</option>
                  {scannableTickets.map(t => (
                    <option key={t.id} value={t.id}>
                      [{t.queueNumber}] {t.patientName} - {t.polyclinicName}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={!selectedTicketIdForScan || isScanActive}
                  onClick={handleSimulateScan}
                  className="bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-bold p-3 rounded-2xl text-xs transition-colors cursor-pointer shrink-0"
                >
                  Pindai QR
                </button>
              </div>
            </div>

            {/* Diagnostic readout panel after scanning */}
            {scannedTicket && (
              <div className="bg-slate-50 border rounded-3xl p-5 space-y-4 text-xs">
                <h4 className="text-slate-800 font-extrabold uppercase tracking-wider border-b pb-2 flex justify-between">
                  <span>Hasil Scan Verifikasi</span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{scannedTicket.registrationNumber}</span>
                </h4>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <span className="text-slate-400 font-normal">Nama Lengkap Pasien</span>
                    <strong className="text-slate-800 block mt-0.5">{scannedTicket.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Identitas NIK</span>
                    <strong className="text-slate-800 block mt-0.5">{scannedTicket.patientNik}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Spesialis Dokter</span>
                    <strong className="text-slate-805 block mt-0.5">{scannedTicket.doctorName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-normal">Poliklinik Tujuan</span>
                    <strong className="text-emerald-700 block mt-0.5">{scannedTicket.polyclinicName}</strong>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-2">
                  {scannedTicket.status === 'belum_verifikasi' ? (
                    <button
                      type="button"
                      onClick={() => handleCheckInScanned(scannedTicket.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors w-full text-center flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" /> Konfirmasi & Cetak Antrean Fisik
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-xl text-center w-full block">
                      ✔ TIKET PASIEN BERHASIL CHECK-IN
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Complete Lobby Queue list with filtering/search */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            
            {/* Header info */}
            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-950">Daftar Tunggu Pelayanan Loket</h3>
                <p className="text-slate-400 text-xs mt-0.5">Seluruh reservasi hari ini yang masuk di database hospital.</p>
              </div>

              {/* Search index */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4 pointer-events-none" />
                <input 
                  type="text"
                  placeholder="Cari NIK, nama, atau poliklinik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-hidden font-medium text-slate-800"
                />
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="py-4 px-6">No. Antrean & Pasien</th>
                    <th className="py-4 px-6">Poli & Dokter</th>
                    <th className="py-4 px-6 text-center">Status Sesi</th>
                    <th className="py-4 px-6 text-center">Aksi Pelayanan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/40 transition-colors">
                      
                      {/* Queue & Patient detail */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-xs text-slate-800 font-mono bg-slate-100 border px-2 py-0.5 rounded-lg shrink-0">
                            {t.queueNumber}
                          </span>
                          <div>
                            <div className="text-slate-900 font-bold text-sm">{t.patientName}</div>
                            <div className="text-[10px] text-slate-400 font-normal mt-0.5">NIK: {t.patientNik}</div>
                          </div>
                        </div>
                      </td>

                      {/* Clinic & doctor */}
                      <td className="py-4 px-6 font-sans">
                        <div className="text-slate-800 font-bold">{t.polyclinicName}</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">{t.doctorName}</div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        {t.status === 'belum_verifikasi' && (
                          <span className="inline-block bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase">
                            Belum Check-id
                          </span>
                        )}
                        {t.status === 'aktif' && (
                          <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 uppercase animate-pulse">
                            Aktif Antre
                          </span>
                        )}
                        {t.status === 'sedang_layani' && (
                          <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200 uppercase">
                            Sdg Konsultasi
                          </span>
                        )}
                        {t.status === 'selesai' && (
                          <span className="inline-block bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200 uppercase">
                            Selesai
                          </span>
                        )}
                        {t.status === 'batal' && (
                          <span className="inline-block bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-150 uppercase">
                            Batal
                          </span>
                        )}
                      </td>

                      {/* Action buttons list */}
                      <td className="py-4 px-6">
                        <div className="flex gap-1.5 justify-center">
                          {t.status === 'belum_verifikasi' && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateTicketStatus(t.id, 'aktif');
                                setAlertMessage({ text: `Pasien ${t.patientName} berhasil check-in.`, type: 'success' });
                              }}
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-all font-bold"
                            >
                              Check-In
                            </button>
                          )}

                          {t.status === 'aktif' && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateTicketStatus(t.id, 'sedang_layani');
                                setAlertMessage({ text: `Memanggil ${t.patientName} ke ruang periksa.`, type: 'success' });
                              }}
                              className="bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-xl transition-all font-bold"
                            >
                              Panggil Dokter
                            </button>
                          )}

                          {t.status === 'sedang_layani' && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateTicketStatus(t.id, 'selesai');
                                setAlertMessage({ text: `Konsultasi ${t.patientName} selesai.`, type: 'success' });
                              }}
                              className="bg-teal-55 bg-emerald-50 text-teal-700 hover:bg-emerald-100 border border-teal-200 px-3 py-1.5 rounded-xl transition-all font-bold"
                            >
                              Selesaikan
                            </button>
                          )}

                          {t.status !== 'selesai' && t.status !== 'batal' && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateTicketStatus(t.id, 'batal');
                                setAlertMessage({ text: `Kunjungan ${t.patientName} dibatalkan.`, type: 'danger' });
                              }}
                              className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-150 p-1.5 rounded-xl transition-all"
                              title="Batalkan Janji"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {(t.status === 'selesai' || t.status === 'batal') && (
                            <span className="text-slate-400 font-normal text-[10px] italic">Non-aktif</span>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}

                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-450 text-xs font-normal">
                        Tidak ada pendaftaran rawat jalan yang memuaskan indeks pencarian Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
