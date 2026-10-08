import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, CreditCard } from 'lucide-react';
import { api } from '../services/api';

export const InvoicesPage: React.FC = () => {
  const invoices = [
    {
      id: 1,
      invoiceNumber: 'INV-2026-002',
      requestCode: 'REQ-2026-002',
      customerName: 'Kamal Perera',
      providerName: 'Kasun Fernando (Kasun Electrical)',
      labourFee: 1200,
      partsFee: 600,
      serviceFee: 200,
      totalAmount: 2000,
      paymentStatus: 'PAID',
      createdAt: '22 Sep 2026',
    },
    {
      id: 2,
      invoiceNumber: 'INV-2026-001',
      requestCode: 'REQ-2026-001',
      customerName: 'Kamal Perera',
      providerName: 'Sunil Rathnayake (Sunil Appliance)',
      labourFee: 1800,
      partsFee: 500,
      serviceFee: 200,
      totalAmount: 2500,
      paymentStatus: 'PENDING',
      createdAt: '23 Sep 2026',
    },
  ];

  return (
    <div className="space-y-6 pb-24 pt-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-600" /> Digital Invoices & Receipts
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Itemized breakdowns for all completed and active service requests
        </p>
      </div>

      <div className="space-y-4">
        {invoices.map((inv) => (
          <div key={inv.id} className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{inv.invoiceNumber}</span>
                <span className="text-xs text-slate-400 ml-2">({inv.requestCode})</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  inv.paymentStatus === 'PAID'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {inv.paymentStatus}
              </span>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p><strong>Provider:</strong> {inv.providerName}</p>
              <p><strong>Date:</strong> {inv.createdAt}</p>
            </div>

            {/* Fee Breakdown Table */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between"><span>Labour & Diagnosis Charge:</span><span>Rs. {inv.labourFee.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Parts & Materials:</span><span>Rs. {inv.partsFee.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Platform Fee:</span><span>Rs. {inv.serviceFee.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-700 pt-1.5 text-slate-900 dark:text-slate-100">
                <span>Total Amount:</span>
                <span className="text-brand-600 dark:text-brand-400 text-sm">Rs. {inv.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={api.getInvoicePdfUrl(inv.id)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" /> Download Official PDF
              </a>

              {inv.paymentStatus === 'PENDING' && (
                <Link
                  to="/app/payments"
                  className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-slate-950 text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" /> Checkout Payment
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
