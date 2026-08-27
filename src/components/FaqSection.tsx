import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string>('faq_1');

  const categories = ['All', 'General', 'Application', 'Fees & Rates', 'Repayment', 'Safety & CBK'];

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white border-b border-orange-200/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            Help & Guidance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-['Outfit']">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Everything you need to know about Lendplus Kenya mobile short-term loans, CBK compliance, and M-PESA repayments.
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keyword (e.g., 'M-PESA', 'ID', 'Interest', 'Early settlement', 'Paybill')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm border border-orange-200/80 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none bg-orange-50/20 focus:bg-white transition-all shadow-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white font-bold shadow-xs'
                    : 'bg-orange-50/60 text-slate-700 hover:bg-orange-100 border border-orange-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all ${
                    isOpen ? 'border-orange-500 bg-orange-50/25 shadow-xs' : 'border-slate-200 bg-white hover:border-orange-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? '' : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-orange-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-orange-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-orange-50/30 rounded-2xl border border-orange-200 text-slate-500 text-sm">
              No matching questions found for "{searchQuery}". Try asking our Nairobi support team below!
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
