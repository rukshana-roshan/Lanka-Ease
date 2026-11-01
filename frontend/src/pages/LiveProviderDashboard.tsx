import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, providerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { RequestStatus, ServiceRequest } from '../types';

const buttonClass = 'rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50';
const inputClass = 'mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:bg-slate-900 dark:text-slate-100';
const nextStep: Partial<Record<RequestStatus, { status: RequestStatus; label: string }>> = {
  CREATED: { status: 'ACCEPTED', label: 'Accept request' },
  PROVIDER_FOUND: { status: 'ACCEPTED', label: 'Accept request' },
  ACCEPTED: { status: 'ON_THE_WAY', label: 'On my way' },
  ON_THE_WAY: { status: 'ARRIVED', label: 'Mark arrived' },
  ARRIVED: { status: 'WORKING', label: 'Start work' },
  WORKING: { status: 'COMPLETED', label: 'Complete work' },
};
const terminal = new Set<RequestStatus>(['COMPLETED', 'REVIEWED', 'CANCELLED']);
const label = (value: string) => value.replaceAll('_', ' ').toLowerCase();
const money = (value: number) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);

export function LiveProviderDashboard() {
  const { user } = useAuth();
  const client = useQueryClient();
  const key = ['live-provider', user?.id];
  const [filter, setFilter] = useState<'active' | 'completed' | 'all'>('active');
  const [completion, setCompletion] = useState<ServiceRequest | null>(null);
  const [labour, setLabour] = useState('');
  const [parts, setParts] = useState('0');
  const [notice, setNotice] = useState('');
  const enabled = user?.role === 'PROVIDER';
  const profile = useQuery({ queryKey: [...key, 'profile'], queryFn: providerApi.getProfile, enabled, retry: false });
  const requests = useQuery({ queryKey: [...key, 'requests'], queryFn: providerApi.getRequests, enabled, retry: false });
  const mutation = useMutation({ mutationFn: (operation: () => Promise<unknown>) => operation(),
    onSuccess: async () => {
      setCompletion(null); setNotice('Changes saved.');
      await Promise.all([client.invalidateQueries({ queryKey: key }),
        client.invalidateQueries({ queryKey: ['requests'] }), client.invalidateQueries({ queryKey: ['providers'] })]);
    },
  });
  const save = (operation: () => Promise<unknown>) => { setNotice(''); mutation.mutate(operation); };
  const error = mutation.error || profile.error || requests.error;
  const allRequests = (requests.data || []).filter(r => r.status !== 'DRAFT');
  const visible = allRequests.filter(r => filter === 'all' || (filter === 'active' ? !terminal.has(r.status) : ['COMPLETED', 'REVIEWED'].includes(r.status)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (!enabled) return <section className="space-y-4"><h1 className="text-2xl font-semibold">Provider workspace</h1>
    <p>This workspace is for registered service providers.</p><Link className="underline" to="/admin">Open administration</Link></section>;

  return <section className="space-y-6 pb-16 text-slate-800 dark:text-slate-100" aria-label="Provider workspace">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-semibold">Provider workspace</h1><p className="mt-2 text-sm text-slate-500">Manage your availability and customer requests.</p></div>
      <button className={buttonClass} disabled={profile.isFetching || requests.isFetching || mutation.isPending}
        onClick={() => { mutation.reset(); void client.invalidateQueries({ queryKey: key }); }}>Refresh</button>
    </header>
    {error && <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">
      {error instanceof ApiError && [401, 403].includes(error.status) ? 'Your provider session could not be authorized. Sign out and sign in again.' : error.message}
    </div>}
    {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-900">{notice}</p>}
    {(profile.isPending || requests.isPending) && <p role="status">Loading your workspace…</p>}
    {profile.data && <article className="space-y-4 rounded-2xl border border-slate-200 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">{profile.data.businessName || profile.data.fullName}</h2>
        <p className="text-sm">{profile.data.fullName} · Verification: {label(profile.data.verificationStatus)}</p></div>
        <button className={buttonClass} aria-pressed={profile.data.isAvailable} disabled={mutation.isPending}
          onClick={() => save(() => providerApi.setAvailability(!profile.data!.isAvailable))}>
          {profile.data.isAvailable ? 'Available — set unavailable' : 'Unavailable — set available'}
        </button></div>
      {profile.data.description && <p className="text-sm">{profile.data.description}</p>}
      <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div><dt className="text-slate-500">Services</dt><dd>{profile.data.categories.map(c => c.name).join(', ') || 'No categories selected'}</dd></div>
        <div><dt className="text-slate-500">Service areas</dt><dd>{profile.data.serviceCities.join(', ') || 'No service areas selected'}</dd></div>
        <div><dt className="text-slate-500">Price range</dt><dd>{money(profile.data.priceMin)} – {money(profile.data.priceMax)}</dd></div>
        <div><dt className="text-slate-500">Completed jobs</dt><dd>{profile.data.jobsCompletedCount}</dd></div>
      </dl>
    </article>}
    <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-semibold">Assigned requests</h2>
      <nav className="flex gap-2" aria-label="Filter requests">{(['active', 'completed', 'all'] as const).map(value => <button key={value}
        className={`${buttonClass} ${filter === value ? 'bg-emerald-800 text-white' : ''}`} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === 'active' ? 'Active' : value === 'completed' ? 'Completed' : 'All'}</button>)}</nav>
    </div>
    {requests.data && visible.length === 0 && <p className="rounded-2xl border border-slate-200 p-5">No {filter === 'all' ? '' : `${filter} `}requests yet. Requests assigned to you will appear here.</p>}
    <div className="space-y-4">{visible.map(request => <article key={request.id} className="space-y-3 rounded-2xl border border-slate-200 p-5">
      <header className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold">{request.categoryName}</h3><p className="text-xs text-slate-500">{request.requestCode}</p></div><span className="text-sm capitalize">{label(request.status)}</span></header>
      <p className="whitespace-pre-wrap break-words text-sm">{request.problemDescription}</p>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-slate-500">Customer</dt><dd>{request.customerName}{request.customerPhone && ` · ${request.customerPhone}`}</dd></div>
        <div><dt className="text-slate-500">Address</dt><dd>{request.address}</dd></div>
        <div><dt className="text-slate-500">Preferred visit</dt><dd>{request.preferredDate || 'Not specified'} {request.preferredTime}</dd></div>
        <div><dt className="text-slate-500">Urgency</dt><dd className="capitalize">{label(request.urgency)}</dd></div>
      </dl>
      {nextStep[request.status] && <button className={`${buttonClass} bg-emerald-800 text-white`} disabled={mutation.isPending}
        onClick={() => {
          if (request.status === 'WORKING') { setCompletion(request); setLabour(''); setParts('0'); mutation.reset(); setNotice(''); }
          else save(() => providerApi.updateRequest(request.id, { newStatus: nextStep[request.status]!.status }));
        }}>{nextStep[request.status]!.label}</button>}
    </article>)}</div>
    {completion && <form className="max-w-xl space-y-4 rounded-2xl border border-emerald-700 p-5" onSubmit={e => {
      e.preventDefault(); const labourFee = Number(labour), partsFee = Number(parts);
      if (!labour.trim() || !Number.isFinite(labourFee) || !Number.isFinite(partsFee) || labourFee < 0 || partsFee < 0) return;
      save(() => providerApi.updateRequest(completion.id, { newStatus: 'COMPLETED', labourFee, partsFee, finalPrice: labourFee + partsFee + 200 }));
    }}>
      <h2 className="text-xl font-semibold">Complete {completion.requestCode}</h2><p className="text-sm">Confirm the charges before completing this job. Completion creates the customer’s invoice.</p>
      <label className="block text-sm">Labour fee (LKR)<input className={inputClass} type="number" min="0" step="0.01" required value={labour} onChange={e => setLabour(e.target.value)} /></label>
      <label className="block text-sm">Parts fee (LKR)<input className={inputClass} type="number" min="0" step="0.01" required value={parts} onChange={e => setParts(e.target.value)} /></label>
      <p className="text-sm">Platform booking fee: {money(200)}. Total: {money((Number(labour) || 0) + (Number(parts) || 0) + 200)}.</p>
      <div className="flex gap-2"><button type="submit" className={`${buttonClass} bg-emerald-800 text-white`} disabled={mutation.isPending}>Confirm completion</button>
        <button type="button" className={buttonClass} disabled={mutation.isPending} onClick={() => setCompletion(null)}>Cancel</button></div>
    </form>}
  </section>;
}
