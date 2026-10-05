import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Wrench,
  Layers,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  Search,
  AlertTriangle,
  Sliders,
  Activity,
  Check,
  X,
  TrendingUp,
  Sparkles,
  Briefcase
} from 'lucide-react';
import { MOCK_PROVIDERS, MOCK_CATEGORIES, MOCK_REQUESTS } from '../services/api';
import type { Provider, ServiceCategory, ServiceRequest, User, VerificationStatus, RequestStatus, Role } from '../types';


// Mock Initial Users for Admin Panel User Management
const INITIAL_USERS: User[] = [
  { id: 1, fullName: 'System Admin', email: 'admin@lankaease.lk', phone: '+94770000000', role: 'ADMIN', preferredLanguage: 'en', isEmailVerified: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 2, fullName: 'Kamal Perera', email: 'kamal@example.lk', phone: '+94772345678', role: 'CUSTOMER', preferredLanguage: 'en', isEmailVerified: true, createdAt: '2026-02-15T09:30:00Z' },
  { id: 3, fullName: 'Nimal Silva', email: 'nimal@example.lk', phone: '+94713456789', role: 'CUSTOMER', preferredLanguage: 'si', isEmailVerified: true, createdAt: '2026-03-01T14:20:00Z' },
  { id: 4, fullName: 'Kasun Fernando', email: 'kasun@electrical.lk', phone: '+94773456789', role: 'PROVIDER', preferredLanguage: 'en', isEmailVerified: true, createdAt: '2026-01-10T11:00:00Z' },
  { id: 5, fullName: 'Dilshan Silva', email: 'dilshan@plumbing.lk', phone: '+94774567890', role: 'PROVIDER', preferredLanguage: 'si', isEmailVerified: false, createdAt: '2026-04-12T16:45:00Z' },
  { id: 6, fullName: 'Priyantha Wickrama', email: 'priyantha@woodcraft.lk', phone: '+94775678901', role: 'PROVIDER', preferredLanguage: 'en', isEmailVerified: true, createdAt: '2026-05-02T08:15:00Z' },
  { id: 7, fullName: 'Sunil Rathnayake', email: 'sunil@acdoctor.lk', phone: '+94776789012', role: 'PROVIDER', preferredLanguage: 'en', isEmailVerified: true, createdAt: '2026-05-20T10:00:00Z' },
];

export const AdminDashboard: React.FC = () => {
  // Navigation Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'providers' | 'categories' | 'requests' | 'settings'>('overview');

  // Core Data States for Real-time CRUD
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [categories, setCategories] = useState<ServiceCategory[]>(MOCK_CATEGORIES);
  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS);

  // System Configuration State
  const [systemSettings, setSystemSettings] = useState({
    commissionRate: 10,
    maintenanceMode: false,
    autoApproveProviders: false,
    maxActiveBookingsPerCustomer: 5,
    supportPhone: '+94 11 234 5678',
  });

  // Moderation Audit Logs
  const [auditLogs, setAuditLogs] = useState<Array<{ id: number; action: string; timestamp: string; type: 'create' | 'update' | 'delete' | 'verify' }>>([
    { id: 1, action: 'Approved provider Sunil Rathnayake (Appliance Repair)', timestamp: 'Just now', type: 'verify' },
    { id: 2, action: 'Updated system commission rate to 10%', timestamp: '10 mins ago', type: 'update' },
    { id: 3, action: 'Verified user Kamal Perera email address', timestamp: '1 hour ago', type: 'update' },
  ]);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addAuditLog = (action: string, type: 'create' | 'update' | 'delete' | 'verify') => {
    const newLog = {
      id: Date.now(),
      action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // --- SEARCH & FILTERS ---
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');

  const [providerSearch, setProviderSearch] = useState('');
  const [providerStatusFilter, setProviderStatusFilter] = useState<string>('ALL');

  const [categorySearch, setCategorySearch] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('ALL');

  // --- MODAL STATES ---
  // User Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER' as Role,
    preferredLanguage: 'en',
  });

  // Provider Modals
  const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [deletingProvider, setDeletingProvider] = useState<Provider | null>(null);

  const [newProviderForm, setNewProviderForm] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    experienceYears: 3,
    priceMin: 1500,
    priceMax: 5000,
    categoryName: 'Electrical',
    city: 'Colombo',
  });

  // Category Modals
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ServiceCategory | null>(null);

  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    description: '',
    iconName: 'Wrench',
  });

  // Booking Moderation Modal


  // --- CRUD HANDLERS FOR USERS ---
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.fullName || !newUserForm.email) return;

    const newUser: User = {
      id: Date.now(),
      fullName: newUserForm.fullName,
      email: newUserForm.email,
      phone: newUserForm.phone || '+94770001122',
      role: newUserForm.role,
      preferredLanguage: newUserForm.preferredLanguage,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    };

    setUsers([newUser, ...users]);
    setIsAddUserModalOpen(false);
    setNewUserForm({ fullName: '', email: '', phone: '', role: 'CUSTOMER', preferredLanguage: 'en' });
    showToast(`User "${newUser.fullName}" created successfully!`, 'success');
    addAuditLog(`Created user ${newUser.fullName} (${newUser.role})`, 'create');
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
    showToast(`User "${editingUser.fullName}" updated!`, 'success');
    addAuditLog(`Updated user ${editingUser.fullName}`, 'update');
    setEditingUser(null);
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;
    setUsers(users.filter((u) => u.id !== deletingUser.id));
    showToast(`User "${deletingUser.fullName}" removed from system`, 'info');
    addAuditLog(`Deleted user ${deletingUser.fullName}`, 'delete');
    setDeletingUser(null);
  };

  // --- CRUD HANDLERS FOR PROVIDERS ---
  const handleVerifyProvider = (id: number, status: VerificationStatus) => {
    setProviders(
      providers.map((p) =>
        p.id === id ? { ...p, verificationStatus: status, isVerified: status === 'APPROVED' } : p
      )
    );
    const target = providers.find((p) => p.id === id);
    showToast(`Provider "${target?.fullName}" verification set to ${status}`, status === 'APPROVED' ? 'success' : 'info');
    addAuditLog(`Set provider ${target?.fullName} status to ${status}`, 'verify');
  };

  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProviderForm.fullName || !newProviderForm.businessName) return;

    const categoryObj = categories.find((c) => c.name === newProviderForm.categoryName) || categories[0];

    const newPro: Provider = {
      id: Date.now(),
      userId: Date.now() + 1,
      fullName: newProviderForm.fullName,
      businessName: newProviderForm.businessName,
      description: `Professional ${newProviderForm.categoryName} services in ${newProviderForm.city}.`,
      experienceYears: Number(newProviderForm.experienceYears),
      priceMin: Number(newProviderForm.priceMin),
      priceMax: Number(newProviderForm.priceMax),
      isVerified: true,
      verificationStatus: 'APPROVED',
      ratingAvg: 4.8,
      jobsCompletedCount: 0,
      responseTimeMinutes: 15,
      isAvailable: true,
      currentLatitude: 6.9147,
      currentLongitude: 79.8510,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      phone: newProviderForm.phone || '+94778889900',
      email: newProviderForm.email || 'provider@lankaease.lk',
      categories: [categoryObj],
      serviceCities: [newProviderForm.city],
    };

    setProviders([newPro, ...providers]);
    setIsAddProviderModalOpen(false);
    setNewProviderForm({
      fullName: '',
      businessName: '',
      phone: '',
      email: '',
      experienceYears: 3,
      priceMin: 1500,
      priceMax: 5000,
      categoryName: 'Electrical',
      city: 'Colombo',
    });
    showToast(`Provider "${newPro.businessName}" added & verified!`, 'success');
    addAuditLog(`Added provider ${newPro.businessName}`, 'create');
  };

  const handleUpdateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;

    setProviders(providers.map((p) => (p.id === editingProvider.id ? editingProvider : p)));
    showToast(`Provider "${editingProvider.businessName}" updated!`, 'success');
    addAuditLog(`Updated provider profile ${editingProvider.businessName}`, 'update');
    setEditingProvider(null);
  };

  const handleDeleteProvider = () => {
    if (!deletingProvider) return;
    setProviders(providers.filter((p) => p.id !== deletingProvider.id));
    showToast(`Provider "${deletingProvider.fullName}" removed from platform`, 'info');
    addAuditLog(`Deleted provider ${deletingProvider.fullName}`, 'delete');
    setDeletingProvider(null);
  };

  // --- CRUD HANDLERS FOR CATEGORIES ---
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryForm.name) return;

    const newCat: ServiceCategory = {
      id: Date.now(),
      name: newCategoryForm.name,
      slug: newCategoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      description: newCategoryForm.description || 'Custom service category provided by LankaEase.',
      iconName: newCategoryForm.iconName || 'Wrench',
      isActive: true,
    };

    setCategories([newCat, ...categories]);
    setIsAddCategoryModalOpen(false);
    setNewCategoryForm({ name: '', description: '', iconName: 'Wrench' });
    showToast(`Category "${newCat.name}" added successfully!`, 'success');
    addAuditLog(`Added category ${newCat.name}`, 'create');
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setCategories(categories.map((c) => (c.id === editingCategory.id ? editingCategory : c)));
    showToast(`Category "${editingCategory.name}" updated!`, 'success');
    addAuditLog(`Updated category ${editingCategory.name}`, 'update');
    setEditingCategory(null);
  };

  const handleToggleCategoryActive = (id: number) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    const target = categories.find((c) => c.id === id);
    showToast(`Category "${target?.name}" set to ${!target?.isActive ? 'Active' : 'Inactive'}`);
  };

  const handleDeleteCategory = () => {
    if (!deletingCategory) return;
    setCategories(categories.filter((c) => c.id !== deletingCategory.id));
    showToast(`Category "${deletingCategory.name}" deleted`, 'info');
    addAuditLog(`Deleted category ${deletingCategory.name}`, 'delete');
    setDeletingCategory(null);
  };

  // --- MODERATION FOR REQUESTS & BOOKINGS ---
  const handleUpdateRequestStatus = (requestId: number, newStatus: RequestStatus) => {
    setRequests(
      requests.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
    showToast(`Service Booking status updated to ${newStatus}`, 'success');
    addAuditLog(`Updated booking REQ #${requestId} status to ${newStatus}`, 'update');
  };

  const handleDeleteRequest = (requestId: number) => {
    setRequests(requests.filter((r) => r.id !== requestId));
    showToast(`Service Booking #${requestId} removed by Admin`, 'info');
    addAuditLog(`Deleted service request #${requestId}`, 'delete');
  };

  // Filtered Lists
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()) || u.phone.includes(userSearch);
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredProviders = providers.filter((p) => {
    const matchesSearch = p.fullName.toLowerCase().includes(providerSearch.toLowerCase()) || p.businessName.toLowerCase().includes(providerSearch.toLowerCase()) || p.email.toLowerCase().includes(providerSearch.toLowerCase());
    const matchesStatus = providerStatusFilter === 'ALL' || p.verificationStatus === providerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) || c.description.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredRequests = requests.filter((r) =>
    requestStatusFilter === 'ALL' || r.status === requestStatusFilter
  );

  return (
    <div className="space-y-6 pb-24 pt-4 text-slate-800 dark:text-slate-100 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl bg-slate-900 border border-emerald-500/40 text-white animate-bounce-short">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 p-6 rounded-3xl border border-emerald-500/20 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              System Admin Center
            </span>
            <span className="text-xs text-slate-400">• Control & Moderation Suite</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-400" /> Admin Portal & System Moderation
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Full platform administration: Add, edit, update, verify, and moderate users, providers, categories, bookings, and financial operations across Sri Lanka.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
          <button
            onClick={() => setIsAddProviderModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Briefcase className="w-4 h-4" /> Add Provider
          </button>
          <button
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
          >
            <Layers className="w-4 h-4 text-emerald-400" /> Add Category
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Overview & Analytics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" /> User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'providers'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Briefcase className="w-4 h-4 text-purple-400" /> Provider Control ({providers.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" /> Service Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Wrench className="w-4 h-4 text-rose-400" /> Bookings & Moderation ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4 text-teal-400" /> System Settings & Audit Log
        </button>
      </div>

      {/* --- TAB 1: OVERVIEW & ANALYTICS --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Total Registered Users</span>
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">{users.length * 210 + 482}</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-semibold">
                <TrendingUp className="w-3 h-3" /> +14.2% this month
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Verified Providers</span>
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">{providers.filter((p) => p.isVerified).length}</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-purple-500 font-semibold">
                <span>{providers.filter((p) => p.verificationStatus === 'PENDING').length} Pending Verifications</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Active Categories</span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{categories.filter((c) => c.isActive).length}</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                <span>{categories.length} total categories registered</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Platform Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">Rs. 485,000</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-semibold">
                <Sparkles className="w-3 h-3" /> Commission rate: {systemSettings.commissionRate}%
              </div>
            </div>
          </div>

          {/* Verification Queue Quick Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" /> Urgent Provider Verification Queue
                </h3>
                <p className="text-xs text-slate-500">Review pending provider verification applications</p>
              </div>
              <button
                onClick={() => setActiveTab('providers')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1"
              >
                View All Providers &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Business Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {providers.slice(0, 5).map((pro) => (
                    <tr key={pro.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={pro.profileImage} alt={pro.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{pro.fullName}</div>
                          <div className="text-[10px] text-slate-400">{pro.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{pro.businessName}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {pro.categories?.[0]?.name || 'General'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{pro.experienceYears} Years</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            pro.verificationStatus === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : pro.verificationStatus === 'REJECTED'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {pro.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {pro.verificationStatus !== 'APPROVED' && (
                          <button
                            onClick={() => handleVerifyProvider(pro.id, 'APPROVED')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow transition-colors inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        {pro.verificationStatus !== 'REJECTED' && (
                          <button
                            onClick={() => handleVerifyProvider(pro.id, 'REJECTED')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg shadow transition-colors inline-flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: USER MANAGEMENT (ADD, EDIT, UPDATE, REMOVE) --- */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user name, email, or phone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="py-2 px-3 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-700 dark:text-slate-300 font-semibold"
              >
                <option value="ALL">All Roles</option>
                <option value="CUSTOMER">Customers</option>
                <option value="PROVIDER">Providers</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" /> Add New User
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-extrabold text-xs">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <div>{u.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">Lang: {u.preferredLanguage.toUpperCase()}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">{u.phone}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                              : u.role === 'PROVIDER'
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.isEmailVerified
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {u.isEmailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          title="Edit User"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(u)}
                          className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400"
                          title="Remove User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: PROVIDER CONTROL (ADD, EDIT, VERIFY, REMOVE) --- */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search provider name, business name, or city..."
                  value={providerSearch}
                  onChange={(e) => setProviderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={providerStatusFilter}
                onChange={(e) => setProviderStatusFilter(e.target.value)}
                className="py-2 px-3 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-700 dark:text-slate-300 font-semibold"
              >
                <option value="ALL">All Verification Statuses</option>
                <option value="APPROVED">APPROVED</option>
                <option value="PENDING">PENDING</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddProviderModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" /> Add New Provider
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.map((pro) => (
              <div
                key={pro.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={pro.profileImage} alt={pro.fullName} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{pro.fullName}</h4>
                        <p className="text-xs text-emerald-600 font-semibold">{pro.businessName}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        pro.verificationStatus === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : pro.verificationStatus === 'REJECTED'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {pro.verificationStatus}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Experience</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{pro.experienceYears} Years</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Rate Range</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Rs. {pro.priceMin} - {pro.priceMax}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Rating</span>
                      <span className="font-bold text-amber-500 flex items-center gap-1">★ {pro.ratingAvg}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Service Cities</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                        {pro.serviceCities?.join(', ') || 'Colombo'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {pro.verificationStatus !== 'APPROVED' && (
                      <button
                        onClick={() => handleVerifyProvider(pro.id, 'APPROVED')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {pro.verificationStatus !== 'REJECTED' && (
                      <button
                        onClick={() => handleVerifyProvider(pro.id, 'REJECTED')}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingProvider(pro)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      title="Edit Provider"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingProvider(pro)}
                      className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400"
                      title="Remove Provider"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: SERVICE CATEGORIES MANAGEMENT --- */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search category name or description..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20"
            >
              <Plus className="w-4 h-4" /> Add Service Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{cat.name}</h4>
                    </div>

                    <button
                      onClick={() => handleToggleCategoryActive(cat.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cat.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{cat.description}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-2">slug: /{cat.slug}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="Edit Category"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingCategory(cat)}
                    className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: SERVICE REQUESTS & BOOKINGS MODERATION --- */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Service Bookings Moderation</h3>
            <select
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value)}
              className="py-2 px-3 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-700 dark:text-slate-300 font-semibold"
            >
              <option value="ALL">All Request Statuses</option>
              <option value="CREATED">CREATED</option>
              <option value="ON_THE_WAY">ON_THE_WAY</option>
              <option value="WORKING">WORKING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service & Provider</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">{req.requestCode}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{req.customerName}</div>
                        <div className="text-[10px] text-slate-400">{req.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-emerald-600">{req.categoryName}</div>
                        <div className="text-[10px] text-slate-400">{req.providerName || 'Unassigned'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-rose-500">{req.urgency}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateRequestStatus(req.id, e.target.value as RequestStatus)}
                          className="py-1 px-2 rounded-lg text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                        >
                          <option value="CREATED">CREATED</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="ON_THE_WAY">ON_THE_WAY</option>
                          <option value="WORKING">WORKING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                          title="Purge Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 6: SYSTEM SETTINGS & AUDIT LOG --- */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Settings Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-500" /> Platform Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Platform Service Commission (%)
                </label>
                <input
                  type="number"
                  value={systemSettings.commissionRate}
                  onChange={(e) => setSystemSettings({ ...systemSettings, commissionRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  System Support Phone Line
                </label>
                <input
                  type="text"
                  value={systemSettings.supportPhone}
                  onChange={(e) => setSystemSettings({ ...systemSettings, supportPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">Maintenance Mode</span>
                  <span className="text-[10px] text-slate-400">Temporarily pause new customer service bookings</span>
                </div>
                <input
                  type="checkbox"
                  checked={systemSettings.maintenanceMode}
                  onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">Auto-Approve Provider Verification</span>
                  <span className="text-[10px] text-slate-400">Automatically grant approved status upon provider submission</span>
                </div>
                <input
                  type="checkbox"
                  checked={systemSettings.autoApproveProviders}
                  onChange={(e) => setSystemSettings({ ...systemSettings, autoApproveProviders: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              <button
                onClick={() => showToast('Platform configuration settings saved!', 'success')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>

          {/* Audit Log Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> Admin Audit & Activity Log
            </h3>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        log.type === 'create'
                          ? 'bg-emerald-500'
                          : log.type === 'delete'
                          ? 'bg-rose-500'
                          : log.type === 'verify'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DIALOGS ================= */}

      {/* MODAL: ADD USER */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> Add New Platform User
              </h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyantha Perera"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.lk"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+94 77 123 4567"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as Role })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="PROVIDER">Provider</option>
                  <option value="ADMIN">System Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-emerald-500" /> Edit User Profile
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as Role })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="PROVIDER">Provider</option>
                  <option value="ADMIN">System Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE USER CONFIRMATION */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Delete User Account?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <span className="font-bold text-slate-900 dark:text-slate-100">{deletingUser.fullName}</span> ({deletingUser.email})? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROVIDER */}
      {isAddProviderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-500" /> Register & Verify Provider
              </h3>
              <button onClick={() => setIsAddProviderModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProvider} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Provider Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Rathnayake"
                  value={newProviderForm.fullName}
                  onChange={(e) => setNewProviderForm({ ...newProviderForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Electrical Solutions"
                  value={newProviderForm.businessName}
                  onChange={(e) => setNewProviderForm({ ...newProviderForm, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newProviderForm.categoryName}
                    onChange={(e) => setNewProviderForm({ ...newProviderForm, categoryName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Service City</label>
                  <input
                    type="text"
                    value={newProviderForm.city}
                    onChange={(e) => setNewProviderForm({ ...newProviderForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    value={newProviderForm.experienceYears}
                    onChange={(e) => setNewProviderForm({ ...newProviderForm, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Min Rate (Rs)</label>
                  <input
                    type="number"
                    value={newProviderForm.priceMin}
                    onChange={(e) => setNewProviderForm({ ...newProviderForm, priceMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Max Rate (Rs)</label>
                  <input
                    type="number"
                    value={newProviderForm.priceMax}
                    onChange={(e) => setNewProviderForm({ ...newProviderForm, priceMax: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProviderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
                >
                  Add & Verify Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROVIDER */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-purple-500" /> Edit Provider Information
              </h3>
              <button onClick={() => setEditingProvider(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProvider} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                <input
                  type="text"
                  value={editingProvider.businessName}
                  onChange={(e) => setEditingProvider({ ...editingProvider, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Min Price (Rs)</label>
                  <input
                    type="number"
                    value={editingProvider.priceMin}
                    onChange={(e) => setEditingProvider({ ...editingProvider, priceMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Max Price (Rs)</label>
                  <input
                    type="number"
                    value={editingProvider.priceMax}
                    onChange={(e) => setEditingProvider({ ...editingProvider, priceMax: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Verification Status</label>
                <select
                  value={editingProvider.verificationStatus}
                  onChange={(e) => setEditingProvider({ ...editingProvider, verificationStatus: e.target.value as VerificationStatus, isVerified: e.target.value === 'APPROVED' })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
                >
                  Update Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE PROVIDER CONFIRMATION */}
      {deletingProvider && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Remove Provider Profile?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <span className="font-bold text-slate-900 dark:text-slate-100">{deletingProvider.fullName}</span> ({deletingProvider.businessName})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingProvider(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProvider}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" /> Add New Service Category
              </h3>
              <button onClick={() => setIsAddCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Panel Maintenance"
                  value={newCategoryForm.name}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the category services..."
                  value={newCategoryForm.description}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CATEGORY */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-500" /> Edit Service Category
              </h3>
              <button onClick={() => setEditingCategory(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CATEGORY CONFIRMATION */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Delete Category?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete category <span className="font-bold text-slate-900 dark:text-slate-100">{deletingCategory.name}</span>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
