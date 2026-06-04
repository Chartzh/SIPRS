import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, HeartPulse, Sparkles, Activity, 
  Stethoscope, HeartPulse as Cardiology, Baby, Ear, Smile, 
  Eye, UserRound, CheckCircle2, Calendar, Clock, DollarSign,
  User, CheckCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Polyclinic, Doctor, Ticket } from '../types';
import { MOCK_POLICLINICS, MOCK_DOCTORS } from '../data';

interface BookingWizardProps {
  patientNik: string;
  patientName: string;
  patientPhone: string;
  onBookingComplete: (newTicket: Ticket) => void;
  onCancel: () => void;
  initialClinicId?: string;
}

export default function BookingWizard({
  patientNik,
  patientName,
  patientPhone,
  onBookingComplete,
  onCancel,
  initialClinicId
}: BookingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // States
  const [selectedPolyclinic, setSelectedPolyclinic] = useState<Polyclinic | null>(
    initialClinicId ? MOCK_POLICLINICS.find(c => c.id === initialClinicId) || null : null
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [useBpjs, setUseBpjs] = useState(false);
  const [phoneToBook, setPhoneToBook] = useState(patientPhone || '');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle clinic selection
  const handleSelectClinic = (clinic: Polyclinic) => {
    setSelectedPolyclinic(clinic);
    setSelectedDoctor(null); // Reset doctor
    setAppointmentDate('');  // Reset date
    setErrorMsg('');
    setStep(2);
  };

  // Get doctors belonging to selected clinic
  const availableDoctors = selectedPolyclinic 
    ? MOCK_DOCTORS.filter(d => d.polyclinicId === selectedPolyclinic.id) 
    : [];

  // Helper date generators for scheduling (Next 7 calendar days excluding Sundays)
  const getAvailableDates = () => {
    const dates = [];
    const weekdays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = weekdays[d.getDay()];
      if (dayName !== 'Minggu') { // Hospitals closed on Sundays
        dates.push({
          dateString: d.toISOString().split('T')[0],
          dayName,
          displayDate: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        });
      }
    }
    return dates;
  };

  const datesList = getAvailableDates();

  // Handle Step 2 proceed validation
  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setErrorMsg('Silakan pilih salah satu Dokter spesialis terlebih dahulu.');
      return;
    }
    if (!appointmentDate) {
      setErrorMsg('Harap tentukan tanggal rencana kunjungan Anda.');
      return;
    }
    if (!phoneToBook.trim()) {
      setErrorMsg('Nomor telepon pasien aktif wajib diisi.');
      return;
    }

    // Verify day selection matching doctor's active days
    const selectedDateObj = new Date(appointmentDate);
    const dayNamesId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const chosenDayName = dayNamesId[selectedDateObj.getDay()];

    if (!selectedDoctor.activeDays.includes(chosenDayName)) {
      setErrorMsg(`Maaf, ${selectedDoctor.name} tidak praktek pada hari ${chosenDayName}. Praktek beliau: ${selectedDoctor.activeDays.join(', ')}.`);
      return;
    }

    setErrorMsg('');
    setStep(3);
  };

  // Final ticket generation submit
  const handleConfirmReservation = () => {
    if (!selectedPolyclinic || !selectedDoctor) return;

    // Generate unique index numbers
    const regCompactDate = appointmentDate.replace(/-/g, '');
    const randId = Math.floor(Math.random() * 900) + 100; // random suffix 100-999
    const registrationNumber = `SIPRS-${regCompactDate}-${randId}`;
    
    // Generate a random queue number padding (e.g. 008, 012)
    const nextQueueNum = String(selectedDoctor.currentQuota + 1).padStart(3, '0');

    // Setup new ticket
    const newTicket: Ticket = {
      id: `TKT-${Math.floor(Math.random() * 10000)}`,
      registrationNumber,
      patientNik,
      patientName,
      patientPhone: phoneToBook,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      polyclinicId: selectedPolyclinic.id,
      polyclinicName: selectedPolyclinic.name,
      appointmentDate,
      sessionTime: selectedDoctor.sessionTime,
      queueNumber: nextQueueNum,
      status: 'belum_verifikasi', // Patient starts at unverified stage from home
      createdAt: new Date().toISOString()
    };

    onBookingComplete(newTicket);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
      
      {/* Visual Booking Stepper Banner */}
      <div className="bg-emerald-900 text-white py-10 border-b border-emerald-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-700 rounded-full blur-3xl opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={onCancel}
              className="bg-white/10 hover:bg-white/25 border border-white/10 text-white p-2 rounded-xl transition-colors"
              title="Batalkan & Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Pendaftaran Rawat Jalan Online</h2>
              <p className="text-emerald-300 text-xs mt-0.5">Selesaikan proses reservasi hanya dalam 3 langkah mudah.</p>
            </div>
          </div>

          {/* Stepper Wizard Indicator */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${step === 1 ? 'bg-emerald-500 text-white' : 'bg-emerald-950 text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center font-bold">1</span>
              <span>Klinik</span>
            </div>
            <div className="w-4 h-px bg-slate-500"></div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${step === 2 ? 'bg-emerald-500 text-white' : 'bg-emerald-950 text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center font-bold">2</span>
              <span>Dokter & Tanggal</span>
            </div>
            <div className="w-4 h-px bg-slate-500"></div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${step === 3 ? 'bg-emerald-500 text-white' : 'bg-emerald-950 text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center font-bold">3</span>
              <span>Konfirmasi</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-medium border border-red-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: SELECT CLINIC */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">LANGKAH 1: PILIH POLIKLINIK RAWAT JALAN</h3>
              <p className="text-slate-500 text-xs mt-0.5">Silakan pilih klaster klinik pelayanan rawat jalan yang dituju oleh pasien.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {MOCK_POLICLINICS.map((clinic) => {
                let IconComp = Activity;
                if (clinic.id === 'poli-penyakit-dalam') IconComp = Stethoscope;
                else if (clinic.id === 'poli-jantung') IconComp = Cardiology;
                else if (clinic.id === 'poli-anak') IconComp = Baby;
                else if (clinic.id === 'poli-tht') IconComp = Ear;
                else if (clinic.id === 'poli-gigi') IconComp = Smile;
                else if (clinic.id === 'poli-gandungan') IconComp = UserRound;
                else if (clinic.id === 'poli-mata') IconComp = Eye;

                const isSelected = selectedPolyclinic?.id === clinic.id;

                return (
                  <button
                    key={clinic.id}
                    onClick={() => handleSelectClinic(clinic)}
                    className={`text-left p-5 rounded-3xl border-2 transition-all flex flex-col justify-between h-44 ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/20 shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className={`p-2.5 rounded-xl w-fit ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 mt-4 line-clamp-1">{clinic.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{clinic.roomNumber}</p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-2">
                      Pilih Poliklinik <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DOCTOR & SCHEDULE */}
        {step === 2 && selectedPolyclinic && (
          <form onSubmit={handleProceedToStep3} className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">LANGKAH 2: JADWAL & PIHAK MEDIS</h3>
                <p className="text-slate-500 text-xs mt-0.5">Poliklinik: <span className="font-bold text-emerald-600">{selectedPolyclinic.name}</span></p>
              </div>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-slate-400 hover:text-slate-800 text-xs font-semibold flex items-center gap-1"
              >
                Ganti Poli
              </button>
            </div>

            {/* Doctor Selection Roster */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Silakan Pilih Dokter Spesialis Anda:</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDoctors.map((doc) => {
                  const isSought = selectedDoctor?.id === doc.id;
                  const isFull = doc.currentQuota >= doc.maxQuota;

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      disabled={isFull}
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setErrorMsg('');
                      }}
                      className={`text-left p-5 rounded-3xl border-2 transition-all flex justify-between gap-4 ${
                        isFull
                          ? 'opacity-50 bg-slate-100 border-slate-200 cursor-not-allowed'
                          : isSought
                            ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-extrabold text-sm shrink-0 border border-slate-200/50">
                          {doc.name.replace('dr. ', '').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-950 text-xs sm:text-sm line-clamp-1">{doc.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{doc.specialty}</p>

                          <div className="flex gap-2 items-center mt-2 font-semibold">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Clock className="w-3 h-3 text-emerald-600" /> {doc.sessionTime}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Lama Kerja: {doc.experienceYears} Thn
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quota breakdown tag */}
                      <div className="text-right flex flex-col justify-between shrink-0">
                        {isFull ? (
                          <span className="bg-red-50 text-red-650 px-2 py-1 rounded-lg text-[9px] font-bold block border border-red-100 self-end">Sesi Penuh</span>
                        ) : (
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-bold block border self-end ${
                            isSought 
                              ? 'bg-emerald-500 text-white border-emerald-500' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}>
                            IDR {doc.consultationFee.toLocaleString('id-ID')}
                          </span>
                        )}

                        <span className="text-[10px] text-slate-400 font-normal mt-2 block">
                          Sisa Quota: <strong className="text-slate-700">{doc.maxQuota - doc.currentQuota}</strong>/{doc.maxQuota}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {availableDoctors.length === 0 && (
                  <div className="col-span-full py-10 text-center bg-slate-100/50 border rounded-2xl text-slate-400 text-xs font-normal">
                    Maaf, tidak ada jadwal dokter aktif saat ini untuk poliklinik {selectedPolyclinic.name}.
                  </div>
                )}
              </div>
            </div>

            {selectedDoctor && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
                
                {/* Available Date grid list */}
                <div className="md:col-span-7 space-y-3">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Pilih Tanggal Sesi ({selectedDoctor.activeDays.join(', ')}):
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {datesList.map((dt) => {
                      const isDoctorActiveOnDay = selectedDoctor.activeDays.includes(dt.dayName);
                      const isChosen = appointmentDate === dt.dateString;

                      return (
                        <button
                          key={dt.dateString}
                          type="button"
                          disabled={!isDoctorActiveOnDay}
                          onClick={() => {
                            setAppointmentDate(dt.dateString);
                            setErrorMsg('');
                          }}
                          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                            !isDoctorActiveOnDay
                              ? 'bg-slate-50 border-slate-200/40 text-slate-350 cursor-not-allowed opacity-40'
                              : isChosen
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-wider">{dt.dayName}</span>
                          <span className="text-sm font-black mt-1">{dt.displayDate}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Patient verification details */}
                <div className="md:col-span-5 space-y-4">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Informasi Kontak Pasien:</label>
                  
                  <div className="bg-slate-200/50 rounded-2xl p-4 border border-slate-200/50 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-450 block font-normal">Identitas Rekam Medis (Nama / NIK)</span>
                      <strong className="text-slate-800 block mt-0.5">{patientName} ({patientNik})</strong>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider mb-1">Nomor Telepon Kontak Aktif:</label>
                      <input 
                        type="tel"
                        required
                        value={phoneToBook}
                        onChange={(e) => setPhoneToBook(e.target.value.replace(/\D/g, ''))}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-medium outline-hidden"
                      />
                    </div>

                    {/* Medicare type checkbox toggle */}
                    <div className="pt-2 flex items-center gap-2">
                      <input 
                        type="checkbox"
                        id="bpjs_checkbox_toggle"
                        checked={useBpjs}
                        onChange={(e) => setUseBpjs(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <label htmlFor="bpjs_checkbox_toggle" className="font-bold text-xs text-slate-750 cursor-pointer select-none">
                        Daftar dengan Jaminan BPJS Kesehatan
                      </label>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* Actions block */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
              <button 
                type="button" 
                onClick={onCancel} 
                className="text-slate-500 hover:text-slate-800 text-xs font-bold"
              >
                Batalkan
              </button>
              
              <button
                type="submit"
                className="bg-emerald-600 text-white font-bold px-7 py-3 rounded-2xl text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                Lanjutkan Langkah Konfirmasi <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: CONSOLIDATED CONFIRMATION */}
        {step === 3 && selectedPolyclinic && selectedDoctor && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-1000 uppercase tracking-wide">LANGKAH 3: VERIFIKASI SEBELUM MENERBITKAN E-TICKET</h3>
              <p className="text-slate-500 text-xs mt-0.5">Tinjau rangkuman rujukan rawat jalan medis Anda sebelum menekan tombol konfirmasi.</p>
            </div>

            {/* Ticket Invoice Visual Box Card representation */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2.5 h-full bg-emerald-500"></div>

              {/* Patient Detail Summary */}
              <div className="md:col-span-5 space-y-4 md:border-r md:border-slate-100 md:pr-6">
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Ringkasan Medis</span>
                
                <div className="space-y-3 font-sans text-xs">
                  <div>
                    <span className="text-slate-400 block font-normal">Nama Pasien Rawat Jalan</span>
                    <strong className="text-slate-900 block text-sm mt-0.5">{patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">NIK Penduduk</span>
                    <span className="text-slate-700 block font-semibold mt-0.5">{patientNik}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Nomor Telepon Terdaftar</span>
                    <span className="text-slate-700 block font-semibold mt-0.5">{phoneToBook}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Jenis Jaminan Pembayaran</span>
                    <span className={`inline-block font-extrabold text-[10px] mt-1.5 px-2.5 py-0.5 rounded-md ${
                      useBpjs 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {useBpjs ? '✔ JAMINAN BPJS KESEHATAN' : '💰 UMUM / BAYAR MANDIRI'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Consultation details */}
              <div className="md:col-span-7 space-y-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Detail Sesi Rawat Jalan</span>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-sans">
                    <div>
                      <span className="text-slate-400 block font-normal">Klinik Tujuan</span>
                      <strong className="text-slate-800 block mt-0.5">{selectedPolyclinic.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-normal">Dokter Spesialis</span>
                      <strong className="text-slate-800 block mt-0.5">{selectedDoctor.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-normal">Tanggal Konsultasi</span>
                      <strong className="text-slate-850 block mt-0.5">{appointmentDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-normal">Jam Sesi Praktek</span>
                      <strong className="text-slate-850 block mt-0.5">{selectedDoctor.sessionTime}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-normal">Biaya Jasa Konsultasi Klinik:</span>
                    <span className="font-extrabold text-slate-900 block text-base mt-0.5">
                      {useBpjs ? 'Rp 0 (Ditanggung BPJS)' : `Rp ${selectedDoctor.consultationFee.toLocaleString('id-ID')}`}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-450 leading-relaxed font-light flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Lobby Loket mengamankan quota antrean Anda setelah konfirmasi.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Confirm action Buttons row */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="text-slate-500 hover:text-slate-800 text-xs font-bold flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali Edit Informasi
              </button>

              <button
                type="button"
                onClick={handleConfirmReservation}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs shadow-md transition-all active:scale-[0.98] flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> Konfirmasi & Terbitkan e-Ticket Medis
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
