import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  Building2
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/mockData';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Loan Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setIsSent(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-orange-50/30 border-b border-orange-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            We're Here to Help
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-['Outfit']">
            Contact LendPlus Kenya Support
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            Have questions about your M-PESA disbursement, payment confirmation, or loan extension? Our local Nairobi customer care team is available 7 days a week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-6 rounded-3xl bg-white border border-orange-200/70 shadow-xs space-y-4">
              <h3 className="font-bold text-lg text-slate-900 font-['Outfit']">Customer Care Desk</h3>
              
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">General Support Line</span>
                    <a href="tel:+254709123456" className="text-orange-600 font-bold hover:underline">
                      {COMPANY_DETAILS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">M-PESA Helpline & Repayment Support</span>
                    <a href="tel:+254722000000" className="text-amber-700 font-bold hover:underline">
                      {COMPANY_DETAILS.helpPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Email Inquiries</span>
                    <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-slate-800 font-medium hover:underline">
                      {COMPANY_DETAILS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Operating Hours (EAT)</span>
                    <span className="text-slate-500">{COMPANY_DETAILS.hours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Registered Office</span>
                    <span className="text-slate-500">{COMPANY_DETAILS.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regulatory footnote */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800">
              <p className="font-bold text-orange-400">Central Bank of Kenya (CBK) Licensed</p>
              <p className="text-slate-300 leading-relaxed">
                Lendplus Kenya Limited is licensed as a Digital Credit Provider by the Central Bank of Kenya under license number <strong>{COMPANY_DETAILS.cbkLicense}</strong> and company registration number <strong>{COMPANY_DETAILS.regNumber}</strong>.
              </p>
            </div>

          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-orange-200/80 shadow-md">
            <h3 className="font-bold text-xl text-slate-900 font-['Outfit'] mb-2">Send Us an Inquiry</h3>
            <p className="text-xs text-slate-500 mb-6">Fill in your message and our Nairobi support desk will get back to you promptly.</p>

            {isSent ? (
              <div className="p-8 text-center bg-orange-50 rounded-2xl border border-orange-200 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-orange-600 mx-auto" />
                <h4 className="font-bold text-base text-slate-900 font-['Outfit']">Inquiry Sent Successfully!</h4>
                <p className="text-xs text-slate-600">A customer support officer will reach out via SMS, phone or email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Brian Kipchoge"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. brian@example.co.ke"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">M-PESA Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 0712 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none bg-white"
                    >
                      <option value="Loan Inquiry">Loan Application Status</option>
                      <option value="M-PESA STK">M-PESA / Paybill Repayment Issue</option>
                      <option value="Limit Increase">Credit Limit Review</option>
                      <option value="Financial Relief">Payment Extension / Debt Consultation</option>
                      <option value="General">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can our Kenyan team assist you today?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Support</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
