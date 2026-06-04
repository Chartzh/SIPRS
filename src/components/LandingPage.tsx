import React, { useState } from 'react';
import { 
  Building2, Users, HeartPulse, Clock, ShieldCheck, 
  ArrowRight, Search, Activity, Stethoscope, Baby, Ear, 
  Smile, Eye, UserRound, Sparkles
} from 'lucide-react';
import { Polyclinic } from '../types';
import { MOCK_POLICLINICS } from '../data';

interface LandingPageProps {
  onNavigate: (view: 'login' | 'register' | 'queue-monitor') => void;
  onSelectClinicFromLanding: (clinicId: string) => void;
  allClinics: Polyclinic[];
}

export default function LandingPage({ onNavigate, onSelectClinicFromLanding, allClinics }: LandingPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClinics = allClinics.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
      {/* Dynamic Header */}
      <nav className="bg-white sticky top-0 z-50 border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-md cursor-pointer hover:bg-emerald-600 transition-colors" onClick={() => window.location.reload()}>
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900">SIPRS</span>
                <span className="hidden sm:inline text-xs block text-slate-500 font-medium -mt-1">Sistem Informasi Pendaftaran Rumah Sakit</span>
              </div>
            </div>

            {/* Nav Menu */}
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#layanan" className="text-slate-600 hover:text-emerald-600 transition-colors">Layanan</a>
              <a href="#poliklinik" className="text-slate-600 hover:text-emerald-600 transition-colors">Poliklinik</a>
              <a href="#fitur" className="text-slate-600 hover:text-emerald-600 transition-colors">Keunggulan</a>
              <button 
                onClick={() => onNavigate('queue-monitor')}
                className="text-emerald-600 hover:text-emerald-700 transition-colors font-semibold flex items-center gap-1"
              >
                <Clock className="w-4 h-4" /> Pantau Antrean
              </button>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate('login')}
                className="text-slate-700 hover:text-emerald-600 font-semibold px-4 py-2 text-sm transition-colors"
                id="landing_login_btn"
              >
                Masuk
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="bg-emerald-600 text-white font-semibold px-5 py-2 rounded-xl text-sm shadow-sm hover:bg-emerald-700 hover:shadow-md transition-all active:scale-[0.98]"
                id="landing_register_btn"
              >
                Daftar Baru
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Abstract Background Accents */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-400 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                #1 Portal Outpatient Terpercaya
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Daftar Rawat Jalan Lebih <span className="text-emerald-400">Praktis, Cepat & Bebas Antre</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-light">
                Hindari antrean panjang di loket fisik rumah sakit. Daftarkan diri Anda dan keluarga ke klinik pilihan secara online secara 24/7 dan peroleh e-Ticket Instan langsung di genggaman Anda.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                >
                  Mulai Pendaftaran <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onNavigate('queue-monitor')}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <Clock className="w-5 h-5 text-emerald-400" /> Pantau Antrean Live
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">2 Mnt</div>
                  <div className="text-xs text-slate-400">Rerata Proses Daftar</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
                  <div className="text-xs text-slate-400">Digital e-Ticket</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">24/7</div>
                  <div className="text-xs text-slate-400">Akses Tanpa Libur</div>
                </div>
              </div>
            </div>

            {/* Right Column Visual Portal Widget */}
            <div className="lg:col-span-5 flex justify-center">
              <div id="hero_promo_card" className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 w-full max-w-sm shadow-2xl relative">
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full animate-pulse shadow-sm">
                  LIVE STATUS
                </div>
                
                <h3 className="text-sm font-semibold tracking-wider text-emerald-300 uppercase mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Pusat Antrean Hari Ini
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-300">Poli Jantung & Pembuluh</div>
                      <div className="text-sm font-bold mt-0.5">dr. Anton Pratama, Sp.JP</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-400 font-semibold uppercase">Sedang Melayani</div>
                      <div className="text-lg font-black text-emerald-300">008</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-300">Poli Penyakit Dalam</div>
                      <div className="text-sm font-bold mt-0.5">dr. Sari Indah, Sp.PD</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-teal-400 font-semibold uppercase">Sedang Melayani</div>
                      <div className="text-lg font-black text-teal-300">007</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-300">Poli Anak (Pediatri)</div>
                      <div className="text-sm font-bold mt-0.5">dr. Faisal Reza, Sp.A</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-amber-400 font-semibold uppercase">Sedang Melayani</div>
                      <div className="text-lg font-black text-amber-300">012</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate('queue-monitor')}
                  className="w-full mt-5 bg-white/10 hover:bg-white/20 hover:text-emerald-300 border border-white/10 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                >
                  Pantau Semua Kamar Loket <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Polyclinic Showcase Section */}
      <section id="poliklinik" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pilih Poliklinik Rawat Jalan
          </h2>
          <p className="text-slate-500 mt-3 font-normal max-w-lg mx-auto">
            Cari jadwal praktek dokter spesialis terbaik kami dan langsung daftarkan janji temu secara online.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
            <input 
              type="text"
              placeholder="Cari Poliklinik atau penyakit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Polyclinic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredClinics.map((clinic) => {
            // Icon mapping dictionary
            let IconComp = Activity;
            if (clinic.id === 'poli-penyakit-dalam') IconComp = Stethoscope;
            else if (clinic.id === 'poli-jantung') IconComp = HeartPulse;
            else if (clinic.id === 'poli-anak') IconComp = Baby;
            else if (clinic.id === 'poli-tht') IconComp = Ear;
            else if (clinic.id === 'poli-gigi') IconComp = Smile;
            else if (clinic.id === 'poli-gandungan') IconComp = UserRound;
            else if (clinic.id === 'poli-mata') IconComp = Eye;

            return (
              <div 
                key={clinic.id} 
                className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-emerald-100 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-3.5 rounded-2xl w-fit transition-colors mb-5 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {clinic.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    {clinic.roomNumber}
                  </p>
                  <p className="text-slate-500 text-xs font-normal mt-3 leading-relaxed">
                    {clinic.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {clinic.totalDoctors} Dokter Praktek
                  </span>
                  <button 
                    onClick={() => {
                      onSelectClinicFromLanding(clinic.id);
                      onNavigate('login');
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Daftar <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredClinics.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              Poliklinik "{searchTerm}" tidak ditemukan. Silakan gunakan kata kunci lain.
            </div>
          )}
        </div>
      </section>

      {/* Feature Value Props Block */}
      <section id="fitur" className="bg-slate-100 py-20 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mengapa Memilih Portal Online SIPRS?
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              SIPRS dirancang cerdas untuk mempercepat proses pelayanan kesehatan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/30 shadow-xs relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 group-hover:w-2.5 transition-all"></div>
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl w-fit mb-5">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Pendaftaran 24/7</h3>
              <p className="text-slate-500 text-xs font-normal mt-3 leading-relaxed">
                Kapan saja dan di mana saja, Anda dapat memilih jadwal berobat yang sesuai. Sistem kami memvalidasi tiket secara langsung.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/30 shadow-xs relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500 group-hover:w-2.5 transition-all"></div>
              <div className="bg-teal-50 text-teal-600 p-3 rounded-xl w-fit mb-5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">e-Ticket Digital</h3>
              <p className="text-slate-500 text-xs font-normal mt-3 leading-relaxed">
                Tunjukkan e-Ticket digital dengan QR Code unik yang diterbitkan otomatis pasca pendaftaran kepada loket verifikasi untuk check-in instan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/30 shadow-xs relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-800 group-hover:w-2.5 transition-all"></div>
              <div className="bg-slate-100 text-slate-800 p-3 rounded-xl w-fit mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Data Aman Terenkripsi</h3>
              <p className="text-slate-500 text-xs font-normal mt-3 leading-relaxed">
                Semua data pasien, rekam NIK, nomor telepon, dan histori rujukan dijamin aman terlindungi sesuai standar regulasi medis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer Block */}
      <footer className="bg-slate-900 text-white py-16 border-t border-slate-800 flex-1 flex flex-col justify-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500 text-white p-2 rounded-xl">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl tracking-tight">SIPRS</span>
              </div>
              <p className="text-slate-400 text-xs font-light max-w-sm leading-relaxed">
                Sistem Pendaftaran Rawat Jalan Digital modern untuk mengoptimalkan efisiensi sirkulasi pelayanan klinis di Rumah Sakit Umum Pusat Daerah Sakti.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <div>Jl. Kesehatan Raya No. 45, Kompleks Medika, Jakarta 12050</div>
                <div>Telp: (021) 555-0199 | Email: info@siprs-medika.go.id</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm tracking-wider uppercase text-emerald-400">Aparatur Portal</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">
                    Masuk Sebagai Pasien
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">
                    Lobby Petugas Loket (Staff)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">
                    Dasbor Analitis Direktur (Admin)
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm tracking-wider uppercase text-emerald-400">Jam Operasional Layanan</h4>
              <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed font-light">
                <li><span className="font-medium text-slate-300">Pendaftaran Online:</span> 24 Jam Non-stop</li>
                <li><span className="font-medium text-slate-300">Poli Rawat Jalan:</span> Senin - Sabtu, 07:30 - 17:00 WIB</li>
                <li><span className="font-medium text-slate-300">Instalasi Gawat Darurat (IGD):</span> Tanggapan Cepat 24 Jam</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} SIPRS Medika. Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div className="flex gap-4">
              <span className="hover:text-slate-300 cursor-pointer">Kebijakan Privasi</span>
              <span>&middot;</span>
              <span className="hover:text-slate-300 cursor-pointer">Syarat & Ketentuan</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
