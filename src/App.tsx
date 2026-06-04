import React, { useState, useEffect } from 'react';
import { UserRole, Patient, Doctor, Polyclinic, Ticket } from './types';
import { MOCK_POLICLINICS, MOCK_DOCTORS, INITIAL_TICKETS, MOCK_PATIENS } from './data';

// Component imports
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PatientDashboard from './components/PatientDashboard';
import BookingWizard from './components/BookingWizard';
import TicketConfirmation from './components/TicketConfirmation';
import QueueTracker from './components/QueueTracker';
import StaffDashboard from './components/StaffDashboard';
import AdminDashboard from './components/AdminDashboard';

import { Activity, LayoutDashboard, QrCode, Stethoscope, Users, Home } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<
    'landing' | 'login' | 'register' | 'patient-dashboard' | 'booking' | 'ticket-confirmed' | 'queue-monitor' | 'staff-dashboard' | 'admin-dashboard'
  >('landing');

  // Role and auth details references
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentPatientNik, setCurrentPatientNik] = useState<string>('');
  const [currentPatientName, setCurrentPatientName] = useState<string>('');
  const [currentStaffName, setCurrentStaffName] = useState<string>('');
  const [currentAdminName, setCurrentAdminName] = useState<string>('');

  // Loaded database state (synced live!)
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [newlyCreatedTicket, setNewlyCreatedTicket] = useState<Ticket | null>(null);

  // Intent carrying states
  const [preSelectedClinicId, setPreSelectedClinicId] = useState<string>('');

  // Developer/Assessor Quick Bar panel (Highly useful in Sandbox demo environments to switch roles instantly)
  const [showDemoToolbar, setShowDemoToolbar] = useState(true);

  // Sync back on login success block
  const handleLoginSuccess = (role: UserRole, userNik: string, userName: string) => {
    setCurrentRole(role);
    if (role === 'patient') {
      setCurrentPatientNik(userNik);
      setCurrentPatientName(userName);
      
      // If patient had clicked a clinic earlier, proceed straight to wizard
      if (preSelectedClinicId) {
        setCurrentView('booking');
      } else {
        setCurrentView('patient-dashboard');
      }
    } else if (role === 'staff') {
      setCurrentStaffName(userName);
      setCurrentView('staff-dashboard');
    } else if (role === 'admin') {
      setCurrentAdminName(userName);
      setCurrentView('admin-dashboard');
    }
  };

  // On registration completion
  const handleRegisterSuccess = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
    // Automatically log them in as a patient!
    setCurrentRole('patient');
    setCurrentPatientNik(newPatient.nik);
    setCurrentPatientName(newPatient.name);
    
    if (preSelectedClinicId) {
      setCurrentView('booking');
    } else {
      setCurrentView('patient-dashboard');
    }
  };

  // On appointment booking confirmation completion
  const handleBookingComplete = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    setNewlyCreatedTicket(newTicket);
    setPreSelectedClinicId(''); // Reset selector
    setCurrentView('ticket-confirmed');
  };

  // Live reception Desk status updating handler
  const handleUpdateTicketStatus = (ticketId: string, nextStatus: Ticket['status']) => {
    setTickets(prevTickets => 
      prevTickets.map(t => t.id === ticketId ? { ...t, status: nextStatus } : t)
    );
  };

  // Role switching utility
  const handleQuickRoleSwitch = (targetRole: UserRole) => {
    if (targetRole === 'patient') {
      setCurrentRole('patient');
      setCurrentPatientNik('3171012405940003');
      setCurrentPatientName('Feri Irawan');
      setCurrentView('patient-dashboard');
    } else if (targetRole === 'staff') {
      setCurrentRole('staff');
      setCurrentStaffName('Siti Rahma');
      setCurrentView('staff-dashboard');
    } else if (targetRole === 'admin') {
      setCurrentRole('admin');
      setCurrentAdminName('dr. H. Ahmad Fauzi (Direktur)');
      setCurrentView('admin-dashboard');
    }
  };

  // Global logout
  const handleLogout = () => {
    setCurrentRole(null);
    setCurrentPatientNik('');
    setCurrentPatientName('');
    setPreSelectedClinicId('');
    setNewlyCreatedTicket(null);
    setCurrentView('landing');
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Dynamic Main App Views Router */}
      <div className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingPage 
            onNavigate={(view) => {
              if (view === 'queue-monitor') {
                setCurrentView('queue-monitor');
              } else {
                setCurrentView(view);
              }
            }}
            allClinics={MOCK_POLICLINICS}
            onSelectClinicFromLanding={(clinicId) => setPreSelectedClinicId(clinicId)}
          />
        )}

        {currentView === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentView('register')}
            onNavigateToHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage 
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => setCurrentView('login')}
            onNavigateToHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'patient-dashboard' && (
          <PatientDashboard 
            patientNik={currentPatientNik}
            patientName={currentPatientName}
            tickets={tickets}
            onLogout={handleLogout}
            onNavigateToBooking={() => setCurrentView('booking')}
            onNavigateToQueue={(polyclinicId) => {
              setPreSelectedClinicId(polyclinicId);
              setCurrentView('queue-monitor');
            }}
            onViewETicket={(ticket) => {
              setNewlyCreatedTicket(ticket);
              setCurrentView('ticket-confirmed');
            }}
          />
        )}

        {currentView === 'booking' && (
          <BookingWizard 
            patientNik={currentPatientNik || '3171012405940003'}
            patientName={currentPatientName || 'Feri Irawan'}
            patientPhone="081234567890"
            initialClinicId={preSelectedClinicId}
            onBookingComplete={handleBookingComplete}
            onCancel={() => {
              setPreSelectedClinicId('');
              setCurrentView('patient-dashboard');
            }}
          />
        )}

        {currentView === 'ticket-confirmed' && newlyCreatedTicket && (
          <TicketConfirmation 
            ticket={newlyCreatedTicket}
            onNavigateHome={() => setCurrentView('patient-dashboard')}
            onNavigateToQueue={(polyclinicId) => {
              setPreSelectedClinicId(polyclinicId);
              setCurrentView('queue-monitor');
            }}
          />
        )}

        {currentView === 'queue-monitor' && (
          <QueueTracker 
            onBack={() => {
              setPreSelectedClinicId('');
              if (currentRole === 'patient') {
                setCurrentView('patient-dashboard');
              } else {
                setCurrentView('landing');
              }
            }}
            initialClinicId={preSelectedClinicId}
            isLoggedIn={!!currentRole}
          />
        )}

        {currentView === 'staff-dashboard' && (
          <StaffDashboard 
            staffName={currentStaffName || 'Siti Rahma'}
            tickets={tickets}
            onLogout={handleLogout}
            onUpdateTicketStatus={handleUpdateTicketStatus}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard 
            adminName={currentAdminName || 'dr. H. Ahmad Fauzi'}
            tickets={tickets}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* SENSATIONAL MOCK MULTI-ROLE CONSOLE BAR (Trial Helper Widget) */}
      {showDemoToolbar && (
        <div id="demo_role_helper_bar" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 bg-slate-900/95 backdrop-blur-md text-white px-5 py-4 rounded-3xl border border-slate-700/50 shadow-2xl z-50 max-w-sm space-y-3 font-sans">
          <div className="flex justify-between items-center bg-slate-900 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">Shortcut Evaluasi Panel (Role Switcher)</span>
            </div>
            <button 
              onClick={() => setShowDemoToolbar(false)} 
              className="text-slate-400 hover:text-white text-xs font-bold bg-transparent border-0 outline-hidden tracking-tight cursor-pointer"
            >
              × Sembunyikan
            </button>
          </div>

          <p className="text-[10px] text-slate-400 leading-normal">
            Gunakan tombol cepat ini untuk berpindah peran dan menguji alur terintegrasi secara instan:
          </p>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
            <button
              onClick={() => handleQuickRoleSwitch('patient')}
              className="bg-emerald-600 hover:bg-emerald-700 hover:text-white p-2 rounded-xl text-center transition-colors flex flex-col items-center gap-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Portal Pasien</span>
            </button>
            <button
              onClick={() => handleQuickRoleSwitch('staff')}
              className="bg-purple-600 hover:bg-purple-700 hover:text-white p-2 rounded-xl text-center transition-colors flex flex-col items-center gap-1 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Loket Verifikasi</span>
            </button>
            <button
              onClick={() => handleQuickRoleSwitch('admin')}
              className="bg-amber-600 hover:bg-amber-700 hover:text-white p-2 rounded-xl text-center transition-colors flex flex-col items-center gap-1 cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Laporan Admin</span>
            </button>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
            <span>Tampilan Aktif: <strong className="text-emerald-400 uppercase font-mono">{currentView}</strong></span>
            <button 
              onClick={() => {
                setCurrentRole(null);
                setCurrentView('landing');
              }}
              className="text-slate-400 hover:text-white underline font-semibold cursor-pointer"
            >
              Kembali Landing
            </button>
          </div>
        </div>
      )}

      {/* Floating activator if drawer is closed */}
      {!showDemoToolbar && (
        <button 
          onClick={() => setShowDemoToolbar(true)}
          className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white p-3 rounded-full shadow-2xl z-50 text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5 font-bold cursor-pointer"
          id="activator_helper_btn"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span> Swtich Role Demo
        </button>
      )}

    </div>
  );
}
