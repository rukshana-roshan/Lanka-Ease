import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, CheckCircle2, Building, DollarSign, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'CARD' | 'PAYHERE' | 'BANK_TRANSFER' | 'CASH'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-24 pt-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-brand-600" /> Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">LKR Payment Processing</p>
      </div>

      {isSuccess ? (
        <div className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 p-8 rounded-3xl shadow-xl text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Payment Successful!</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            Payment of <strong>Rs. 2,500</strong> via {method} has been received. Transaction reference: <strong>TXN-9847294812</strong>.
          </p>
          <button
            onClick={() => navigate('/app/requests')}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow"
          >
            Return to My Requests
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
          {/* Service Summary Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Washing Machine Repair</h4>
            <p className="text-slate-500">Provider: Sunil Appliance & AC Doctor</p>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              <span>Total Payable:</span>
              <span className="text-brand-600 dark:text-brand-400">Rs. 2,500</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <form onSubmit={handlePay} className="space-y-4">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">Select Payment Method</label>

            <div className="space-y-3">
              {[
                { key: 'CARD', label: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5 text-brand-600" /> },
                { key: 'PAYHERE', label: 'PayHere (Local Bank Direct)', icon: <Wallet className="w-5 h-5 text-saffron-600" /> },
                { key: 'BANK_TRANSFER', label: 'Online Bank Transfer', icon: <Building className="w-5 h-5 text-purple-600" /> },
                { key: 'CASH', label: 'Cash on Completion', icon: <DollarSign className="w-5 h-5 text-emerald-600" /> },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMethod(item.key as any)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    method === item.key
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/80 ring-2 ring-brand-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.label}</span>
                  </div>
                  {method === item.key && <ShieldCheck className="w-4 h-4 text-brand-600" />}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-extrabold rounded-xl shadow-lg shadow-brand-600/30 transition-all mt-4"
            >
              {isProcessing ? 'Processing Payment...' : 'Pay Rs. 2,500'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
