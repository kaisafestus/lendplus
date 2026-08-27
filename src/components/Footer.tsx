import React from 'react';

interface FooterProps {
  onSelectTab?: (tab: string) => void;
  onOpenApply?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-slate-400">
        <div>
          © 2026 Lendplus Kenya Limited. All rights reserved. Central Bank of Kenya DCP License #CBK/DCP/0089.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
          <span className="hover:text-slate-200 transition-colors cursor-pointer">Kenya Data Protection Act Policy</span>
          <span className="text-slate-600">•</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer">Terms & Conditions</span>
          <span className="text-slate-600">•</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer">CBK Consumer Protection</span>
        </div>
      </div>
    </footer>
  );
};
