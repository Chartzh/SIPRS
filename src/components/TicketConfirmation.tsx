import React, { useRef } from 'react';
import { 
  HeartPulse, QrCode, ClipboardCheck, ArrowLeft, Printer, 
  MapPin, Clock, Calendar, Phone, Activity, User, Home, Sparkles 
} from 'lucide-react';
import { Ticket } from '../types';

interface TicketConfirmationProps {
  ticket: Ticket;
  onNavigateHome: () => void;
  onNavigateToQueue: (polyclinicId: string) => void;
}

export default function TicketConfirmation({ ticket, onNavigateHome, onNavigateToQueue }: TicketConfirmationProps) {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-xl mx-auto space-y-6">
        
        {/* Top greeting badge */}
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 flex items-center gap-2 text-xs font-semibold shadow-xs">
          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Selamat! e-Ticket Anda berhasil diterbitkan. Tunjukkan barcode ini di loket pelayanan.</span>
        </div>

        {/* Outer ticket container styled like a real physical docket */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
          
          {/* Visual Header Grid Accent */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-lg border border-white/10">
                <HeartPulse className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="font-extrabold text-sm block tracking-widest uppercase">E-TICKET RESMI</span>
                <span className="text-[10px] text-emerald-450 font-semibold uppercase">{ticket.registrationNumber}</span>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Metode Antre</span>
              <span className="text-xs font-bold leading-tight">ONLINE PORTAL</span>
            </div>
          </div>

          {/* Ticket status badge */}
          <div className="bg-slate-100/50 py-3.5 px-6 border-b border-dashed border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-450 font-medium">Nomor Registrasi:</span>
            <strong className="text-slate-800 font-mono tracking-wide">{ticket.registrationNumber}</strong>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Large Queue Badge with side cuts */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 sm:p-6 text-center space-y-1 relative">
              <span className="text-slate-500 text-[10px] tracking-widest font-extrabold uppercase">NOMOR ANTREAN</span>
              <div className="text-5xl font-black text-emerald-600 tracking-tight">{ticket.queueNumber}</div>
              <p className="text-[11px] text-slate-500 font-semibold pt-1">
                Loket: <strong className="text-slate-850">Poliklinik {ticket.polyclinicName}</strong>
              </p>
            </div>

            {/* Grid structure details */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs border-b border-dashed border-slate-200 pb-6">
              
              <div className="flex gap-2">
                <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-normal text-[10px]">Nama Pasien</span>
                  <strong className="text-slate-800 block text-xs mt-0.5">{ticket.patientName}</strong>
                </div>
              </div>

              <div className="flex gap-2">
                <ClipboardCheck className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-normal text-[10px]">Identitas NIK</span>
                  <strong className="text-slate-800 block text-xs mt-0.5">{ticket.patientNik}</strong>
                </div>
              </div>

              <div className="flex gap-2">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-normal text-[10px]">Tanggal Kunjungan</span>
                  <strong className="text-slate-850 block text-xs mt-0.5">{ticket.appointmentDate}</strong>
                </div>
              </div>

              <div className="flex gap-2">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-normal text-[10px]">Sesi Dokter</span>
                  <strong className="text-slate-850 block text-xs mt-0.5">{ticket.sessionTime}</strong>
                </div>
              </div>

              <div className="col-span-2 flex gap-2 border-t border-slate-100 pt-3 mt-1">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-normal text-[10px]">Instalasi Loket / Klinik</span>
                  <strong className="text-slate-800 block text-xs mt-0.5">{ticket.doctorName}</strong>
                  <span className="text-[10px] text-slate-450 font-normal">Gedung Pusat Rumah Sakit, Unit Rawat Jalan Daerah</span>
                </div>
              </div>

            </div>

            {/* QR Code Graphic Section */}
            <div className="flex flex-col items-center text-center space-y-3 py-2">
              <div id="ticket_qr_code" className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans text-slate-450 uppercase block font-semibold">VALIDASI SCAN PETUGAS LOKET</span>
                <span className="text-[9px] text-slate-400 font-mono">Tunjukkan QR-Code saat tiba untuk mencetak tiket antrean fisik</span>
              </div>
            </div>

          </div>

          {/* Core Footer notes in ticket */}
          <div className="bg-slate-50 border-t border-slate-100 py-4 px-6 text-center text-[10px] text-slate-400 leading-relaxed font-light">
            SIPRS Medika terintegrasi secara otomatis dengan portal rekam medis. Jika terdapat kendala penjadwalan, harap hubungi Helpdesk Online di nomor (021) 555-0199.
          </div>

        </div>

        {/* Buttons layout and controls */}
        <div className="flex flex-col sm:flex-row gap-2.5 justify-between">
          <button 
            onClick={onNavigateHome}
            className="bg-white hover:bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-1 border border-slate-200 transition-colors"
          >
            <Home className="w-4 h-4 text-teal-600" /> Kembali ke Beranda Pasien
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-3 rounded-2xl text-xs flex items-center justify-center gap-1 transition-colors flex-1"
            >
              <Printer className="w-4 h-4" /> Cetak Docket
            </button>
            
            <button 
              onClick={() => onNavigateToQueue(ticket.polyclinicId)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-1 transition-colors flex-1 shadow-sm"
            >
              <Activity className="w-4 h-4" /> Pantau Antrean Live
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
