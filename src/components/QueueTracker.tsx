import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, Play, Clock, Users, ArrowLeft, ArrowRight,
  Sparkles, CheckCircle, Volume2, UserCheck, AlertCircle, ChevronDown, ListOrdered
} from 'lucide-react';
import { Polyclinic } from '../types';
import { MOCK_POLICLINICS } from '../data';

interface QueueTrackerProps {
  onBack: () => void;
  initialClinicId?: string;
  isLoggedIn?: boolean;
}

export default function QueueTracker({ onBack, initialClinicId, isLoggedIn = false }: QueueTrackerProps) {
  const [selectedClinicId, setSelectedClinicId] = useState<string>(initialClinicId || 'poli-penyakit-dalam');

  // Multi-clinic queue numbers simulation states
  const [queues, setQueues] = useState<Record<string, { current: number; total: number; avgTime: number }>>({
    'poli-umum': { current: 4, total: 12, avgTime: 12 },
    'poli-penyakit-dalam': { current: 7, total: 15, avgTime: 15 },
    'poli-jantung': { current: 3, total: 8, avgTime: 20 },
    'poli-anak': { current: 9, total: 14, avgTime: 10 },
    'poli-tht': { current: 2, total: 6, avgTime: 12 },
    'poli-gigi': { current: 3, total: 5, avgTime: 15 },
    'poli-mata': { current: 1, total: 2, avgTime: 15 },
  });

  const selectedClinic = MOCK_POLICLINICS.find(c => c.id === selectedClinicId) || MOCK_POLICLINICS[0];
  const activeQueue = queues[selectedClinicId] || { current: 0, total: 0, avgTime: 15 };

  // Generate simulated history based on current number
  const generateHistoryList = (currentNum: number, totalNum: number) => {
    const list = [];
    for (let i = 1; i <= Math.max(currentNum, 1); i++) {
      const isServing = i === currentNum;
      list.push({
        num: String(i).padStart(3, '0'),
        status: isServing ? 'Sdg Dipanggil' : 'Selesai',
        time: `${Math.max(7, 7 + i * 15)}:15 WIB`
      });
    }
    return list.slice(-5).reverse(); // Last 5 items, newest first
  };

  const historyList = generateHistoryList(activeQueue.current, activeQueue.total);

  // Play a mock vocal chime
  const playChimeAndVoice = (numStr: string, room: string) => {
    // If Web Audio API speech synthesis is supported, speak the Indonesian call!
    if ('speechSynthesis' in window) {
      try {
        const text = `Nomor antrean ${parseInt(numStr)}, silakan menuju ${room}`;
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'id-ID';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
      } catch (e) {
        console.warn('SpeechSynthesis fail:', e);
      }
    }
  };

  // Push queue forward (simulating staff calling next person)
  const handleCallNext = () => {
    setQueues(prev => {
      const currentObj = prev[selectedClinicId];
      if (!currentObj) return prev;
      
      const newCurrent = currentObj.current < currentObj.total 
        ? currentObj.current + 1 
        : currentObj.current; // wait for new registrations
      
      const totalNumStr = String(newCurrent).padStart(3, '0');
      
      // Trigger voice simulation
      playChimeAndVoice(totalNumStr, selectedClinic.roomNumber.split(',')[2] || 'Ruang Periksa');

      return {
        ...prev,
        [selectedClinicId]: {
          ...currentObj,
          current: newCurrent
        }
      };
    });
  };

  // Add demo outpatient register
  const handleAddDemoPatient = () => {
    setQueues(prev => {
      const currentObj = prev[selectedClinicId];
      if (!currentObj) return prev;
      return {
        ...prev,
        [selectedClinicId]: {
          ...currentObj,
          total: currentObj.total + 1
        }
      };
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
      
      {/* Top Header navbar */}
      <nav className="bg-white sticky top-0 z-50 border-b border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            <div className="flex items-center gap-2.5">
              <button 
                onClick={onBack}
                className="hover:bg-slate-100 text-slate-500 p-2 rounded-xl transition-colors cursor-pointer mr-1"
                title="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="font-extrabold text-lg text-slate-950 block leading-tight">Pantau Antrean Live</span>
                <span className="text-[10px] text-slate-450 font-semibold block uppercase">SISTEM MONITORING REAL-TIME</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-red-50 text-red-600 px-3.5 py-1.5 rounded-full border border-red-100 text-[11px] font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              SINKRONISASI LIVE HARI INI
            </div>

          </div>
        </div>
      </nav>

      {/* Main Grid Wrapper */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Clinic Selector List & Stats banner */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-250/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-950 uppercase tracking-wider flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-emerald-600" /> Daftar Poliklinik
              </h3>
              <span className="text-[10px] text-slate-450 font-mono">Pilih Poli</span>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {MOCK_POLICLINICS.map((clinic) => {
                const isSelected = clinic.id === selectedClinicId;
                const clinicQueue = queues[clinic.id] || { current: 0, total: 0 };

                return (
                  <button
                    key={clinic.id}
                    onClick={() => setSelectedClinicId(clinic.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-650 shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <strong className={`block text-xs sm:text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{clinic.name}</strong>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>{clinic.roomNumber.split(',')[1]}</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] uppercase font-bold block ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>Melayani</span>
                      <strong className="text-sm font-black italic block">{String(clinicQueue.current).padStart(3, '0')}</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Average Wait Time breakdown widget */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 border border-teal-950/20 shadow-xs space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-300">Estimasi Pelayanan</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl">
                <span className="text-slate-350 text-[10px] block font-light">Rerata Per Pasien</span>
                <strong className="text-lg font-extrabold text-emerald-400 block mt-1">{activeQueue.avgTime} Menit</strong>
              </div>
              <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl">
                <span className="text-slate-350 text-[10px] block font-light">Jumlah Sisa Antrean</span>
                <strong className="text-lg font-extrabold text-emerald-400 block mt-1">
                  {Math.max(0, activeQueue.total - activeQueue.current)} Pasien
                </strong>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2.5 text-xs text-slate-305 font-light">
              <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Estimasi waktu tunggu didasarkan pada sirkulasi real-time perawat lobi kardiologi.</span>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Circular Counter Card & Historic tracker list */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5 mb-5">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedClinic.roomNumber.split(',')[0]}
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-2 tracking-tight text-slate-950">{selectedClinic.name}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Loket Verifikasi: {selectedClinic.roomNumber}</p>
              </div>

              <div className="text-right">
                <span className="text-slate-400 text-xs font-normal">Antrean Hari Ini:</span>
                <strong className="text-slate-800 text-lg block font-extrabold font-mono mt-0.5">
                  No. 001 - No. {String(activeQueue.total).padStart(3, '0')}
                </strong>
              </div>
            </div>

            {/* Simulated Live Display Panel reminiscent of physical smart TVs in waiting lobbies */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-6">
              
              {/* Circular calling widget */}
              <div className="md:col-span-6 flex flex-col items-center">
                <div className="relative w-48 h-48 rounded-full bg-emerald-50 border-4 border-emerald-500 flex flex-col items-center justify-center shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-100 scale-0 group-hover:scale-100 group-focus:scale-100 transition-transform duration-500 rounded-full z-0 opacity-40"></div>
                  
                  {/* Pulse Effect */}
                  <div className="absolute inset-2 border border-dashed border-emerald-300 rounded-full animate-spin [animation-duration:15s] z-0"></div>

                  <div className="relative z-10 text-center space-y-1">
                    <span className="text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest block">SEDANG MELAYANI</span>
                    <strong className="text-5xl font-black text-emerald-600 tracking-tight block">
                      {String(activeQueue.current).padStart(3, '0')}
                    </strong>
                    <span className="text-[10px] bg-emerald-600/10 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full block w-fit mx-auto">
                      Room {selectedClinic.id.includes('jantung') ? 'B-203' : 'A-101'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                  <Volume2 className="w-4 h-4 text-emerald-500 animate-bounce" />
                  <span>Tekan simulator panggil di bawah untuk melompat</span>
                </div>
              </div>

              {/* Step indicator horizontal details */}
              <div className="md:col-span-6 space-y-5">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-3 text-xs">
                  
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-450">Nomor Selanjutnya:</span>
                    <strong className="text-slate-800 font-mono text-sm bg-slate-200 px-2 py-0.5 rounded-md">
                      {activeQueue.current < activeQueue.total 
                        ? String(activeQueue.current + 1).padStart(3, '0') 
                        : 'Selesai'}
                    </strong>
                  </div>

                  <div className="h-px bg-slate-200/60"></div>

                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-450">Selesai Berobat:</span>
                    <strong className="text-slate-850 font-mono text-sm bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-md">
                      {activeQueue.current > 1 ? String(activeQueue.current - 1).padStart(3, '0') : '-'}
                    </strong>
                  </div>

                  <div className="h-px bg-slate-200/60"></div>

                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-450">Total Terdaftar di Server:</span>
                    <strong className="text-slate-800 font-mono text-sm bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md">
                      {activeQueue.total} Pendaftar
                    </strong>
                  </div>

                </div>

                {/* Queue Interactive Simulator panel */}
                <div className="bg-amber-50 rounded-3xl p-4 border border-amber-200 space-y-3">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> WIDGET INTERAKTIF SIMULATOR SIPRS
                  </span>
                  <p className="text-[10px] text-amber-700 font-normal leading-relaxed">
                    Sistem loket aslinya dikendalikan oleh dasbor perawat petugas loket. Di sini Anda bisa menstimulasi sirkulasi pemanggilan untuk keperluan evaluasi UI.
                  </p>
                  
                  <div className="flex gap-2.5 pt-1">
                    <button 
                      type="button"
                      onClick={handleCallNext}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[11px] px-3.5 py-2.5 rounded-xl transition-all shadow-xs flex-1 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Panggil Nomor Selanjutnya
                    </button>
                    <button 
                      type="button"
                      onClick={handleAddDemoPatient}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] px-3.5 py-2.5 rounded-xl transition-all flex-1 active:scale-95 cursor-pointer"
                    >
                      + Tambah Pasien Demo
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* History tracking list */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sirkulasi Kunjungan Terakhir (Kamar Loket)</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {historyList.map((item, idx) => {
                  const isServingState = item.status.includes('Sdg');

                  return (
                    <div 
                      key={item.num}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isServingState
                          ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <span className="text-xs text-slate-400 font-normal block">Nomor Antrean</span>
                        <strong className={`text-base font-extrabold block font-mono ${isServingState ? 'text-amber-700' : 'text-slate-800'}`}>
                          No. {item.num}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md inline-block uppercase ${
                          isServingState 
                            ? 'bg-amber-100 text-amber-700 animate-pulse' 
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{item.time}</span>
                      </div>
                    </div>
                  );
                })}

                {historyList.length === 0 && (
                  <div className="col-span-full text-center py-4 text-slate-400 text-xs">
                    Belum ada antrean yang dipanggil hari ini.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
