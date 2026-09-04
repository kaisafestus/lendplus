import React, { useState } from 'react';
import { 
  User, 
  Menu, 
  X, 
  CreditCard, 
  ChevronRight
} from 'lucide-react';
import { UserProfile, LoanRecord } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onOpenApply: () => void;
  activeLoan: LoanRecord | null;
  isAppSimulatorOpen?: boolean;
  setIsAppSimulatorOpen?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenLogin,
  onOpenApply,
  activeLoan,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'calculator', label: 'Calculator' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'rates', label: 'Rates & Fees' },
    { id: 'repayments', label: 'Repayments & M-PESA' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl tracking-tighter font-['Outfit']">L+</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Outfit']">LEND<span className="text-orange-600">PLUS</span></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">KE</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">M-PESA Digital Loans</p>
              </div>
            </button>

            {/* Desktop Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentTab(link.id);
                  }}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentTab === link.id
                      ? 'text-orange-700 bg-orange-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Account</span>
                {activeLoan && (
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Log In</span>
              </button>
            )}

            <button
              onClick={onOpenApply}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-xl shadow-md shadow-orange-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Apply for Loan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenApply}
              className="px-3 py-1.5 text-xs font-bold text-white bg-orange-600 rounded-lg"
            >
              Apply
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg ${
                currentTab === link.id ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-slate-700'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <button
                onClick={() => {
                  setCurrentTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-900 text-white"
              >
                <User className="w-4 h-4" />
                <span>My LendPlus Account</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 text-slate-700"
              >
                <User className="w-4 h-4" />
                <span>Client Login</span>
              </button>
            )}
            <button
              onClick={() => {
                onOpenApply();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-white bg-orange-600 active:bg-orange-700 rounded-xl shadow-md shadow-orange-600/30"
            >
              <span>Apply for Up to KSh 100,000</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
