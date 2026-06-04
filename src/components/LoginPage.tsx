import React, { useState } from 'react';
import { LogIn, HeartPulse, Sparkles, User, ShieldCheck, Mail, Lock } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, userNik: string, userName: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToHome: () => void;
}

export default function LoginPage({ onLoginSuccess, onNavigateToRegister, onNavigateToHome }: LoginPageProps) {
  const [activeRole, setActiveRole] = useState<UserRole>('patient');
  const [nikOrEmail, setNikOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nikOrEmail || !password) {
      setErrorMsg('Harap isi semua kolom login.');
      return;
    }

    if (activeRole === 'patient') {
      // Allow the default patient, or a newly registered user
      if (
        (nikOrEmail === '3171012405940003' || nikOrEmail === 'feri.irawan@gmail.com') && 
        password === 'password'
      ) {
        onLoginSuccess('patient', '3171012405940003', 'Feri Irawan');
      } else if (password.length >= 4) {
        // Fallback: allow any NIK/email with any 4+ char password for seamless dynamic registration & testing
        const fallbackName = nikOrEmail.includes('@') ? nikOrEmail.split('@')[0] : 'Pasien Berobat';
        onLoginSuccess('patient', nikOrEmail, fallbackName);
      } else {
        setErrorMsg('NIK/Email atau password salah. (Petunjuk: Gunakan akun demo atau masukkan password minimal 4 karakter)');
      }
    } else if (activeRole === 'staff') {
      if (nikOrEmail === 'staff' || nikOrEmail === 'STAFF123') {
        onLoginSuccess('staff', 'STAFF123', 'Siti Rahma');
      } else {
        setErrorMsg('Kredensial Petugas Loket tidak valid.');
      }
    } else if (activeRole === 'admin') {
      if (nikOrEmail === 'admin' || nikOrEmail === 'ADMIN123') {
        onLoginSuccess('admin', 'ADMIN123', 'dr. H. Ahmad Fauzi (Direktur)');
      } else {
        setErrorMsg('Kredensial Administrator tidak valid.');
      }
    }
  };

  // Quick helper to fill in demo credentials instantly
  const handleQuickDemoLogin = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'patient') {
      setNikOrEmail('3171012405940003');
      setPassword('password');
    } else if (role === 'staff') {
      setNikOrEmail('STAFF123');
      setPassword('staff');
    } else if (role === 'admin') {
      setNikOrEmail('ADMIN123');
      setPassword('admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-teal-100 rounded-full blur-3xl opacity-30 translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* Left Column panel: Brand Promotion */}
        <div className="md:col-span-5 bg-gradient-to-br from-emerald-800 to-teal-950 p-8 sm:p-12 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateToHome}>
              <div className="bg-white/10 p-2 rounded-xl">
                <HeartPulse className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">SIPRS</span>
            </div>

            <div className="space-y-4 pt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Registrasi Mandiri Praktis
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Amankan Antrean Anda Sekarang
              </h2>
              <p className="text-slate-300 text-xs font-normal leading-relaxed">
                Platform digital resmi Rumah Sakit Umum Daerah untuk memperoleh nomor tiket antrean rawat jalan secara terpusat tanpa harus berdiri mengantre di koridor lobi rumah sakit.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Aparatur Cepat Demo</h4>
            <div className="flex flex-col gap-2">
              <button 
                type="button"
                onClick={() => handleQuickDemoLogin('patient')}
                className="w-full text-left bg-white/5 hover:bg-white/15 px-3 py-2 rounded-xl text-xs flex justify-between items-center transition-colors border border-white/5"
              >
                <span>👤 Masuk Demo Pasien</span>
                <span className="text-[10px] text-emerald-400 font-mono">Auto-fill</span>
              </button>
              <button 
                type="button"
                onClick={() => handleQuickDemoLogin('staff')}
                className="w-full text-left bg-white/5 hover:bg-white/15 px-3 py-2 rounded-xl text-xs flex justify-between items-center transition-colors border border-white/5"
              >
                <span>💼 Masuk Demo Petugas Loket</span>
                <span className="text-[10px] text-emerald-400 font-mono">Auto-fill</span>
              </button>
              <button 
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="w-full text-left bg-white/5 hover:bg-white/15 px-3 py-2 rounded-xl text-xs flex justify-between items-center transition-colors border border-white/5"
              >
                <span>👑 Masuk Demo Admin (Direktur)</span>
                <span className="text-[10px] text-emerald-400 font-mono">Auto-fill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Secure Access Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950">
              Masuk ke Akun Anda
            </h1>
            <p className="text-slate-500 text-xs mt-1.5 font-normal">
              Silakan pilih hak akses dan masukkan kredensial resmi Rumah Sakit Anda.
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div className="mt-8 grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveRole('patient');
                setErrorMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'patient'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pasien
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveRole('staff');
                setErrorMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'staff'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Petugas Lock
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setErrorMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'admin'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Admin
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 bg-red-50 text-red-600 p-3.5 rounded-xl text-xs font-medium border border-red-100">
              {errorMsg}
            </div>
          )}

          {/* Actual Login Form */}
          <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {activeRole === 'patient' ? 'Nomor NIK Baru / Alamat Email' : 'Kredensial ID Petugas / Admin ID'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {activeRole === 'patient' ? <Mail className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </span>
                <input
                  type="text"
                  required
                  id="login_nik_field"
                  placeholder={
                    activeRole === 'patient' 
                      ? 'NIK: 3171012405940003 atau Email' 
                      : activeRole === 'staff' 
                        ? 'ID Petugas Loket (e.g., STAFF123)' 
                        : 'ID Administrator (e.g., ADMIN123)'
                  }
                  value={nikOrEmail}
                  onChange={(e) => setNikOrEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">Sandikata (Password)</label>
                <span className="text-[11px] text-slate-400 font-medium hover:text-emerald-600 cursor-pointer">Lupa Password?</span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  id="login_password_field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-2xl text-xs shadow-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 mt-2 active:scale-[0.99]"
            >
              <LogIn className="w-4 h-4" /> Masuk Akses Portal
            </button>
          </form>

          {activeRole === 'patient' && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">Belum memiliki akun medis di SIPRS?</span>
              <button 
                onClick={onNavigateToRegister}
                className="text-emerald-600 hover:text-emerald-700 font-extrabold text-xs ml-1 bg-transparent border-0 outline-hidden tracking-tight cursor-pointer"
              >
                Daftar sebagai Pasien Baru
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button 
              onClick={onNavigateToHome}
              className="text-slate-400 hover:text-slate-600 text-xs underline font-medium"
            >
              Kembali ke Halaman Beranda
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
