import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, api, ApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { ServiceCategory, User } from '../types';
import { MarketplaceAdmin } from '../components/MarketplaceAdmin';

const emptyCategory = { name: '', slug: '', description: '', iconName: 'Wrench', isActive: true };
const inputClass = 'w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 dark:bg-slate-900 dark:text-slate-100';
const buttonClass = 'rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50';

export function LiveAdminDashboard() {
  const { user } = useAuth();
  const client = useQueryClient();
  const [tab, setTab] = useState<'overview' | 'users' | 'providers' | 'categories' | 'messages' | 'marketplace'>('overview');
  const [messagePage, setMessagePage] = useState(0);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [categoryForm, setCategoryForm] = useState<(typeof emptyCategory & { id?: number }) | null>(null);
  const [message, setMessage] = useState('');
  const key = ['live-admin', user?.id];
  const stats = useQuery({ queryKey: [...key, 'stats'], queryFn: adminApi.getStats });
  const users = useQuery({ queryKey: [...key, 'users'], queryFn: adminApi.getUsers, enabled: tab === 'users' });
  const providers = useQuery({ queryKey: [...key, 'providers'], queryFn: () => api.getProviders(), enabled: tab === 'providers' });
  const categories = useQuery({ queryKey: [...key, 'categories'], queryFn: () => api.getCategories(), enabled: tab === 'categories' });
  const inbox = useQuery({ queryKey: [...key, 'messages', messagePage], queryFn: () => adminApi.getContactMessages(messagePage), enabled: tab === 'messages', retry: false });
  const mutation = useMutation({
    mutationFn: async (operation: () => Promise<unknown>) => operation(),
    onSuccess: async () => {
      setEditingUser(null); setCategoryForm(null); setMessage('Changes saved.');
      await Promise.all([client.invalidateQueries({ queryKey: key }),
        client.invalidateQueries({ queryKey: ['categories'] }), client.invalidateQueries({ queryKey: ['providers'] })]);
    },
  });
  const save = (operation: () => Promise<unknown>) => { setMessage(''); mutation.mutate(operation); };
  const active = tab === 'messages' ? inbox : tab === 'users' ? users : tab === 'providers' ? providers : tab === 'categories' ? categories : stats;
  const error = mutation.error || active.error || stats.error;
  const matches = (...values: (string | undefined)[]) => values.some(value => value?.toLowerCase().includes(search.toLowerCase()));
  const categoryEditor = (category: ServiceCategory) => { setCategoryForm({ ...category }); mutation.reset(); setMessage(''); };

  return <section className="space-y-6 pb-16 text-slate-800 dark:text-slate-100" aria-label="Administration">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-semibold">Administration</h1><p className="mt-2 text-sm text-slate-500">Manage your users, professionals, and services.</p></div>
      <button className={buttonClass} disabled={active.isFetching || mutation.isPending} onClick={() => { mutation.reset(); void client.invalidateQueries({ queryKey: key }); }}>Refresh</button>
    </header>
    <nav className="flex flex-wrap gap-2" aria-label="Admin sections">
      {(['overview', 'users', 'providers', 'categories', 'messages', 'marketplace'] as const).map(value => <button key={value}
        aria-pressed={tab === value} className={`${buttonClass} ${tab === value ? 'bg-emerald-800 text-white' : ''}`}
        onClick={() => { setTab(value); setSearch(''); mutation.reset(); setMessage(''); }}>
        {{ overview: 'Workspace overview', users: 'Users', providers: 'Professional directory', categories: 'Service catalogue', messages: 'Messages', marketplace: 'Marketplace management' }[value]}
      </button>)}
    </nav>
    {error && <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">
      {error instanceof ApiError && [401, 403].includes(error.status) ? 'Your admin session could not be authorized. Sign out and sign in again.' : error.message}
    </div>}
    {message && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-900">{message}</p>}
    {active.isPending && <p role="status">Loading {tab}…</p>}
    {tab === 'overview' && stats.data && <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {Object.entries({ 'Total users': stats.data.totalUsers, Customers: stats.data.totalCustomers, Professionals: stats.data.totalProviders,
        'Pending verifications': stats.data.pendingVerifications, 'Active requests': stats.data.activeRequests,
        'Completed requests': stats.data.completedRequests, 'Recorded paid revenue (LKR)': stats.data.totalRevenue }).map(([label, value]) => <article key={label} className="rounded-2xl border border-slate-200 p-5">
        <p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p>
      </article>)}
    </div>}
    {tab === 'marketplace' && <MarketplaceAdmin />}
    {tab !== 'overview' && tab !== 'messages' && tab !== 'marketplace' && <label className="block max-w-md text-sm">Search {tab}<input type="search" className={`${inputClass} mt-2`} value={search} onChange={e => setSearch(e.target.value)} /></label>}
    {tab === 'messages' && inbox.data && <div className="space-y-4">
      <div><h2 className="text-xl font-semibold">Customer messages</h2><p className="mt-1 text-sm text-slate-500">Contact form submissions, newest first. {inbox.data.totalElements} total.</p></div>
      {inbox.data.content.length === 0 && <p className="rounded-2xl border border-slate-200 p-5">No contact messages on this page.</p>}
      {inbox.data.content.map(item => <article key={item.id} className="space-y-3 rounded-2xl border border-slate-200 p-5">
        <header className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold">{item.subject || 'Contact inquiry'}</h3><p className="text-sm">From {item.name}</p></div>
          <time className="text-sm text-slate-500" dateTime={item.createdAt}>{item.createdAt.replace('T', ' ').slice(0, 19)} (server time)</time></header>
        <div className="flex flex-wrap gap-4 text-sm"><a className="break-all underline" href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <span>{item.phone}</span>}</div>
        <p className="whitespace-pre-wrap break-words text-sm">{item.message}</p>
        <a className={`${buttonClass} inline-block`} href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject || 'Your LankaEase inquiry'}`)}`}>Reply by email</a>
      </article>)}
      <div className="flex items-center gap-3"><button className={buttonClass} disabled={messagePage === 0 || inbox.isFetching} onClick={() => setMessagePage(p => p - 1)}>Previous</button>
        <span className="text-sm">Page {messagePage + 1} of {Math.max(1, inbox.data.totalPages)}</span>
        <button className={buttonClass} disabled={messagePage + 1 >= inbox.data.totalPages || inbox.isFetching} onClick={() => setMessagePage(p => p + 1)}>Next</button></div>
    </div>}
    {tab === 'users' && users.data && <div className="space-y-3">
      {users.data.filter(u => matches(u.fullName, u.email, u.phone)).map(u => <article key={u.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-5">
        <div className="min-w-0"><h2 className="font-semibold">{u.fullName}</h2><p className="break-all text-sm">{u.email}</p><p className="text-sm">{u.phone} · {u.role}</p></div>
        <button className={buttonClass} disabled={mutation.isPending} onClick={() => { setEditingUser({ ...u }); mutation.reset(); }}>Edit user</button>
      </article>)}
      {!users.data.some(u => matches(u.fullName, u.email, u.phone)) && <p>No users match your search.</p>}
    </div>}
    {tab === 'providers' && providers.data && <div className="space-y-3">
      {providers.data.filter(p => matches(p.fullName, p.businessName, p.email)).map(p => <article key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-5">
        <div><h2 className="font-semibold">{p.businessName || p.fullName}</h2><p className="text-sm">{p.fullName} · {p.verificationStatus}</p><p className="text-sm">{p.categories.map(c => c.name).join(', ')}</p></div>
        <label className="text-sm">Verification<select aria-label={`Verification for ${p.fullName}`} className={`${inputClass} mt-1`} value={p.verificationStatus} disabled={mutation.isPending}
          onChange={e => { const status = e.target.value as typeof p.verificationStatus; save(() => adminApi.verifyProvider(p.id, status)); }}>
          {['PENDING', 'APPROVED', 'REJECTED', 'MORE_INFO'].map(status => <option key={status}>{status}</option>)}
        </select></label>
      </article>)}
      {!providers.data.some(p => matches(p.fullName, p.businessName, p.email)) && <p>No professionals match your search.</p>}
    </div>}
    {tab === 'categories' && <div className="space-y-3">
      <button className={`${buttonClass} bg-emerald-800 text-white`} disabled={mutation.isPending} onClick={() => { setCategoryForm({ ...emptyCategory }); mutation.reset(); }}>Add category</button>
      {categories.data?.filter(c => matches(c.name, c.description)).map(c => <article key={c.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-5">
        <div className="max-w-xl"><h2 className="font-semibold">{c.name} <span className="text-xs font-normal">({c.isActive ? 'Active' : 'Inactive'})</span></h2><p className="mt-1 text-sm">{c.description}</p></div>
        <div className="flex gap-2"><button className={buttonClass} disabled={mutation.isPending} onClick={() => categoryEditor(c)}>Edit</button>
          <button className={buttonClass} disabled={mutation.isPending} onClick={() => { if (window.confirm(`Delete category "${c.name}"? This cannot be undone.`)) save(() => adminApi.deleteCategory(c.id)); }}>Delete</button></div>
      </article>)}
      {categories.data && !categories.data.some(c => matches(c.name, c.description)) && <p>No service categories match your search.</p>}
    </div>}
    {(editingUser || categoryForm) && <div className="rounded-2xl border border-emerald-700 p-5">
      <h2 className="mb-4 text-xl font-semibold">{editingUser ? 'Edit user' : categoryForm?.id ? 'Edit category' : 'Add category'}</h2>
      <form className="grid max-w-xl gap-4" onSubmit={e => { e.preventDefault(); if (editingUser) save(() => adminApi.updateUser(editingUser)); else if (categoryForm) save(() => adminApi.saveCategory({ ...categoryForm, slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })); }}>
        {editingUser && <>
          <label>Full name<input className={inputClass} required maxLength={100} value={editingUser.fullName} onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })} /></label>
          <label>Phone<input className={inputClass} required maxLength={20} value={editingUser.phone} onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })} /></label>
          <label>Role<select className={inputClass} disabled={editingUser.id === user?.id} value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value as User['role'] })}>
            <option>CUSTOMER</option><option>PROVIDER</option><option>ADMIN</option>
          </select></label>
          {editingUser.id === user?.id && <p className="text-sm">Your own administrator role is protected here.</p>}
        </>}
        {categoryForm && <>
          <label>Name<input className={inputClass} required maxLength={100} value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} /></label>
          <label>Description<textarea className={inputClass} required value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} /></label>
          <label>Icon name<input className={inputClass} required maxLength={50} value={categoryForm.iconName} onChange={e => setCategoryForm({ ...categoryForm, iconName: e.target.value })} /></label>
          {categoryForm.id && <label className="flex gap-2"><input type="checkbox" checked={categoryForm.isActive} onChange={e => setCategoryForm({ ...categoryForm, isActive: e.target.checked })} />Active</label>}
        </>}
        <div className="flex gap-2"><button type="submit" className={`${buttonClass} bg-emerald-800 text-white`} disabled={mutation.isPending}>{mutation.isPending ? 'Saving…' : 'Save'}</button>
          <button type="button" className={buttonClass} disabled={mutation.isPending} onClick={() => { setEditingUser(null); setCategoryForm(null); }}>Cancel</button></div>
      </form>
    </div>}
  </section>;
}
