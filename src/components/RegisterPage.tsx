import React, { useState } from 'react';
import { HeartPulse, Sparkles, UserPlus, FileText, ArrowLeft, Calendar, Phone, Lock, Eye, Mail, EyeOff } from 'lucide-react';
import { Patient } from '../types';

interface RegisterPageProps {
  onRegisterSuccess: (newPatient: Patient) => void;
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}

export default function RegisterPage({ onRegisterSuccess, onNavigateToLogin, onNavigateToHome }: RegisterPageProps) {
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Valdidate NIK length (exactly 16 digits)
    const cleanNik = nik.trim();
    if (!/^\d{16}$/.test(cleanNik)) {
      setErrorMsg('NIK harus terdiri dari tepat 16 digit angka nasional Indonesia.');
      return;
    }

    // Validate phone number
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 9) {
      setErrorMsg('Nomor telepon tidak valid. Minimal 9 angka.');
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak sesuai dengan kolom password.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Sandi (password) harus minimal 4 karakter untuk proteksi akun.');
      return;
    }

    // Dynamic registry
    const newPatient: Patient = {
      nik: cleanNik,
      name: name.trim(),
      email: email.trim() || `${cleanNik}@siprs.local`,
      birthDate,
      phone: cleanPhone,
      password // stored locally for trial flow
    };

    onRegisterSuccess(newPatient);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-teal-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-emerald-100 rounded-full blur-3xl opacity-30 translate-y-1/3 translate-x-1/4 pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* Left column promos */}
        <div className="md:col-span-5 bg-gradient-to-br from-teal-900 to-emerald-950 p-8 sm:p-12 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateToHome}>
              <div className="bg-white/10 p-2 rounded-xl">
                <HeartPulse className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">SIPRS</span>
            </div>

            <div className="space-y-4 pt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-teal-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Registrasi Rekam Medis Digital
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Buat Akun Pasien Baru
              </h2>
              <p className="text-slate-300 text-xs font-normal leading-relaxed">
                Mendaftar di SIPRS secara instan untuk memiliki Rekam Medis lokal. Nikmati kemudahan melacak histori berobat di berbagai poliklinik spesialis kami.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-teal-800 text-center md:text-left">
            <button 
              type="button"
              onClick={onNavigateToLogin}
              className="flex items-center gap-2 text-xs font-bold text-teal-300 hover:text-white transition-colors mx-auto md:ml-0"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke halaman login
            </button>
          </div>
        </div>

        {/* Right column form */}
        <div className="md:col-span-7 p-8 sm:p-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950">
                Pendaftaran Pasien Online
              </h1>
              <p className="text-slate-500 text-xs mt-1.5">
                Pastikan data yang Anda isi di bawah ini sesuai dengan kartu identitas KTP/KK yang sah.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 bg-red-50 text-red-600 p-3.5 rounded-xl text-xs font-medium border border-red-100">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleRegisterSubmit}>
            
            {/* NIK */}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Nomor Induk Kependudukan (NIK)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="Contoh: 3171012405940003 (16 Digit)"
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))} // Numeric only
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 font-sans">Nama Lengkap Pasien</label>
              <input
                type="text"
                required
                placeholder="Contoh: Feri Irawan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-medium text-slate-800"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Alamat Email (Opsional)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="feri.irawan@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Tanggal Lahir Pasien</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Nomor Handphone / WA</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Numeric only
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Sandi Akun (Password)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 4 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Ulangi Sandi Akun</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Ulangi Sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Button */}
            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-2xl text-xs shadow-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <UserPlus className="w-4 h-4" /> Buat Akun & Verifikasi Identitas
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500 font-normal">Sudah memiliki akun medis?</span>
            <button 
              onClick={onNavigateToLogin}
              className="text-teal-600 hover:text-teal-700 font-extrabold text-xs ml-1 bg-transparent border-0 outline-hidden tracking-tight cursor-pointer"
            >
              Masuk dengan Akun Saja
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
