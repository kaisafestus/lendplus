import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LoanCalculator } from './components/LoanCalculator';
import { HowItWorks } from './components/HowItWorks';
import { EligibilitySection } from './components/EligibilitySection';
import { RatesAndFees } from './components/RatesAndFees';
import { RepaymentsSection } from './components/RepaymentsSection';
import { ClientDashboard } from './components/ClientDashboard';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LoanApplicationModal } from './components/LoanApplicationModal';
import { OzowPaymentModal } from './components/OzowPaymentModal';
import { AuthModal } from './components/AuthModal';
import { AuthPromptModal } from './components/AuthPromptModal';
import { MobileAppSimulator } from './components/MobileAppSimulator';
import { INITIAL_DEMO_LOANS } from './data/mockData';
import { UserProfile, LoanRecord } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allLoans, setAllLoans] = useState<LoanRecord[]>(INITIAL_DEMO_LOANS);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [applyParams, setApplyParams] = useState<{ amount: number; termDays: number; isReturning: boolean }>({
    amount: 10000,
    termDays: 6,
    isReturning: false,
  });

  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState<boolean>(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  // M-PESA / Repayment Modal state
  const [isOzowModalOpen, setIsOzowModalOpen] = useState<boolean>(false);
  const [ozowParams, setOzowParams] = useState<{ loanNumber: string; amount: number }>({
    loanNumber: 'LP-KE-2026-94821',
    amount: 3750,
  });

  // Mobile App Frame Simulator state
  const [isAppSimulatorOpen, setIsAppSimulatorOpen] = useState<boolean>(false);

  const isAuthenticated = !!currentUser;

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lendplus_session');
      if (saved) {
        const session = JSON.parse(saved);
        if (session?.user) {
          setCurrentUser(session.user);
        }
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // Derive active loan for the logged-in user
  const userActiveLoan = allLoans.find(
    (loan) => loan.userId === currentUser?.id && (loan.status === 'active' || loan.status === 'approved')
  ) || null;

  // Auth gate: require login/signup before protected actions
  const requireAuth = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      setPendingAuthAction(() => action);
      setIsAuthPromptOpen(true);
    }
  };

  // Sync URL hash with tabs and endpoints dynamically
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (!hash || hash === 'home') {
        setCurrentTab('home');
      } else if (hash.startsWith('apply')) {
        if (isAuthenticated) {
          setIsApplyModalOpen(true);
        } else {
          setPendingAuthAction(() => () => setIsApplyModalOpen(true));
          setIsAuthPromptOpen(true);
        }
      } else if (['calculator', 'how-it-works', 'eligibility', 'rates', 'repayments', 'dashboard', 'faq', 'contact'].includes(hash)) {
        if (hash === 'dashboard' && !isAuthenticated) {
          setPendingAuthAction(() => () => {
            setCurrentTab('dashboard');
            window.location.hash = '#/dashboard';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          setIsAuthPromptOpen(true);
        } else {
          setCurrentTab(hash);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    // Initialize on load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  const handleTabChange = (tab: string) => {
    if (tab === 'dashboard' && !isAuthenticated) {
      requireAuth(() => {
        setCurrentTab(tab);
        window.location.hash = tab === 'home' ? '' : `#/${tab}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return;
    }
    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? '' : `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers
  const handleStartApply = (amount: number = 10000, termDays: number = 6, isReturning: boolean = false) => {
    setApplyParams({ amount, termDays, isReturning });
    setIsApplyModalOpen(true);
    window.location.hash = `#/apply`;
  };

  const handleCloseApply = () => {
    setIsApplyModalOpen(false);
    if (window.location.hash.includes('apply')) {
      window.location.hash = currentTab === 'home' ? '' : `#/${currentTab}`;
    }
  };

  const handleApplicationCompleted = (newLoan: LoanRecord, newProfile: UserProfile) => {
    setCurrentUser(newProfile);
    setAllLoans((prev) => [newLoan, ...prev]);
    setCurrentTab('dashboard');
    window.location.hash = `#/dashboard`;
  };

  const handleOpenOzow = (loanNumber: string, amount: number) => {
    setOzowParams({ loanNumber, amount });
    setIsOzowModalOpen(true);
  };

  const handleOzowPaymentSuccess = (amount: number, method: 'M-PESA Express STK Push' | 'M-PESA Paybill (4085435)' | 'Bank Transfer', reference: string) => {
    if (!userActiveLoan) return;

    const newBalance = Math.max(0, userActiveLoan.balanceRemaining - amount);
    const updatedLoan: LoanRecord = {
      ...userActiveLoan,
      balanceRemaining: newBalance,
      paidAmount: userActiveLoan.paidAmount + amount,
      status: newBalance === 0 ? 'paid' : 'active',
      payments: [
        {
          id: `pay_${Date.now()}`,
          loanId: userActiveLoan.id,
          amount,
          date: new Date().toISOString().split('T')[0],
          method,
          status: 'Completed',
          reference,
        },
        ...userActiveLoan.payments,
      ],
    };

    setAllLoans((prev) => prev.map((l) => (l.id === updatedLoan.id ? updatedLoan : l)));
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setIsAuthPromptOpen(false);
    try {
      localStorage.setItem('lendplus_session', JSON.stringify({ user }));
    } catch (err) {
      // ignore
    }
    if (pendingAuthAction) {
      const action = pendingAuthAction;
      setPendingAuthAction(null);
      action();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
    window.location.hash = '';
    try {
      localStorage.removeItem('lendplus_session');
    } catch (err) {
      // ignore
    }
  };

  const handleOpenAuthPromptForLogin = () => {
    setIsAuthPromptOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleOpenAuthPromptForRegister = () => {
    setIsAuthPromptOpen(false);
    setIsAuthModalOpen(true);
  };

  const wrappedStartApply = (amount: number = 10000, termDays: number = 6, isReturning: boolean = false) => {
    requireAuth(() => handleStartApply(amount, termDays, isReturning));
  };

  const wrappedOpenOzow = (loanNumber: string, amount: number) => {
    requireAuth(() => handleOpenOzow(loanNumber, amount));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onOpenApply={() => wrappedStartApply(10000, 6, false)}
        activeLoan={userActiveLoan}
        isAppSimulatorOpen={isAppSimulatorOpen}
        setIsAppSimulatorOpen={setIsAppSimulatorOpen}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full overflow-x-hidden">
        {currentTab === 'dashboard' && currentUser ? (
          <ClientDashboard
            currentUser={currentUser}
            activeLoan={userActiveLoan}
            allLoans={allLoans}
            onOpenOzowRepay={wrappedOpenOzow}
            onApplyNewLoan={() => wrappedStartApply(currentUser.isReturning ? 50000 : 10000, 6, currentUser.isReturning)}
            onSwitchUser={() => {}}
            onLogout={handleLogout}
          />
        ) : (
          <>
            {/* Landing & Key Sections */}
            {(currentTab === 'home' || currentTab === 'calculator') && (
              <Hero
                onStartApplication={wrappedStartApply}
                onOpenEligibility={() => handleTabChange('eligibility')}
              />
            )}

            {(currentTab === 'home' || currentTab === 'how-it-works') && (
              <HowItWorks onStartApply={() => wrappedStartApply(10000, 6, false)} />
            )}

            {(currentTab === 'home' || currentTab === 'eligibility') && (
              <EligibilitySection onStartApply={() => wrappedStartApply(10000, 6, false)} />
            )}

            {(currentTab === 'home' || currentTab === 'rates') && (
              <RatesAndFees />
            )}

            {(currentTab === 'home' || currentTab === 'repayments') && (
              <RepaymentsSection
                onOpenOzowDemo={() => wrappedOpenOzow('LP-KE-DEMO-8492', 3750)}
              />
            )}

            {(currentTab === 'home' || currentTab === 'faq') && (
              <FaqSection />
            )}

            {(currentTab === 'home' || currentTab === 'contact') && (
              <ContactSection />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={handleTabChange}
        onOpenApply={() => wrappedStartApply(10000, 6, false)}
      />

      {/* Application Wizard Modal */}
      <LoanApplicationModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseApply}
        initialAmount={applyParams.amount}
        initialTerm={applyParams.termDays}
        isReturning={applyParams.isReturning}
        onApplicationCompleted={handleApplicationCompleted}
      />

      {/* M-PESA & Bank Payment Modal */}
      <OzowPaymentModal
        isOpen={isOzowModalOpen}
        onClose={() => setIsOzowModalOpen(false)}
        loanNumber={ozowParams.loanNumber}
        defaultAmount={ozowParams.amount}
        onPaymentSuccess={handleOzowPaymentSuccess}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        onGoToLogin={handleOpenAuthPromptForLogin}
        onGoToRegister={handleOpenAuthPromptForRegister}
      />

      {/* Mobile App Device Simulator */}
      <MobileAppSimulator
        isOpen={isAppSimulatorOpen}
        onClose={() => setIsAppSimulatorOpen(false)}
        currentUser={currentUser}
        activeLoan={userActiveLoan}
        onStartApply={wrappedStartApply}
        onOpenOzow={wrappedOpenOzow}
      />
    </div>
  );
}
