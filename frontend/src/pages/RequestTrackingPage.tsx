import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, MOCK_PROVIDERS } from '../services/api';
import type { ServiceRequest } from '../types';
import { RequestTimeline } from '../components/RequestTimeline';
import { InteractiveMap } from '../components/InteractiveMap';
import {
  Phone,
  MessageSquare,
  FileText,
  CreditCard,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

export const RequestTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    if (id) {
      api.getRequestById(Number(id)).then(setRequest);
    }
  }, [id]);

  if (!request) {
    return <div className="p-8 text-center text-xs">Loading service request details...</div>;
  }

  const provider = MOCK_PROVIDERS.find((p) => p.id === request.providerId) || MOCK_PROVIDERS[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 pt-4">
      <Link to="/app/requests" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-600">
        <ChevronLeft className="w-4 h-4" /> Back to My Requests
      </Link>

      {/* Header Info Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-full">
              {request.requestCode}
            </span>
            <span className="text-xs text-slate-400">• Created on {request.createdAt.split('T')[0]}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{request.categoryName}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{request.problemDescription}</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Link
            to={`/app/messages?conversationWith=${provider.userId}&requestId=${request.id}`}
            className="flex-1 md:flex-none px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" /> Chat
          </Link>
          <a
            href={`tel:${request.providerPhone || provider.phone}`}
            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
          >
            <Phone className="w-4 h-4" /> Call Provider
          </a>
        </div>
      </div>

      {/* Live Timeline Component */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Request Status History</h3>
        <RequestTimeline status={request.status} />
      </div>

      {/* Interactive Map Component */}
      <InteractiveMap
        address={request.address}
        providerName={request.providerName || provider.fullName}
        etaMinutes={18}
        distanceKm={2.4}
        status={request.status}
      />

      {/* Provider Details Card */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={provider.profileImage} alt={provider.fullName} className="w-14 h-14 rounded-full object-cover border-2 border-brand-500" />
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
              {request.providerBusinessName || provider.businessName}
              <ShieldCheck className="w-4 h-4 text-brand-600" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{request.providerName || provider.fullName} • ⭐ {provider.ratingAvg}</p>
            <p className="text-[11px] text-slate-400 mt-1">Contact: {request.providerPhone || provider.phone}</p>
          </div>
        </div>

        {/* Action Buttons for Invoice and Payment */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to="/app/invoices"
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Invoice
          </Link>
          <Link
            to="/app/payments"
            className="flex-1 sm:flex-none px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-slate-950 text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" /> Pay Rs. {request.finalPrice?.toLocaleString() || '2,500'}
          </Link>
        </div>
      </div>
    </div>
  );
};
