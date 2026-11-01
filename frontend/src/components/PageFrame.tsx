import type { ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, LayoutDashboard, ListChecks, MessageCircle, HeartHandshake, FileText, ChevronRight, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const names: Record<string, string> = { services: 'Our services', providers: 'Find a professional', 'how-it-works': 'How it works', about: 'Our story', contact: 'Get in touch', app: 'Your dashboard', request: 'New service request', requests: 'Your requests', family: 'Family assistance', messages: 'Messages', invoices: 'Invoices', payments: 'Payments', profile: 'Your profile', explore: 'Explore professionals', provider: 'Provider workspace', admin: 'Administration' };

export function PageFrame({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const segments = pathname.split('/').filter(Boolean);
  const isWorkspace = ['app', 'provider', 'admin'].includes(segments[0]);
  const base = user?.role === 'ADMIN' ? '/admin' : user?.role === 'PROVIDER' ? '/provider' : '/app';
  const links = user?.role === 'CUSTOMER' ? [
    { to: '/app', label: 'Overview', icon: LayoutDashboard }, { to: '/app/requests', label: 'My requests', icon: ListChecks }, { to: '/app/messages', label: 'Messages', icon: MessageCircle }, { to: '/app/family', label: 'Family', icon: HeartHandshake }, { to: '/app/invoices', label: 'Invoices', icon: FileText },
  ] : [{ to: base, label: 'Workspace overview', icon: LayoutDashboard }, { to: '/providers', label: 'Professional directory', icon: ListChecks }, { to: '/services', label: 'Service catalogue', icon: FileText }];
  return <div className={`page-frame ${isWorkspace ? 'workspace-frame' : 'discover-frame'}`} data-page={segments.slice(0, 2).join('-')}>
    <div className="page-breadcrumb"><Link to="/home">Home</Link>{segments.map((part, i) => <span key={i}><ChevronRight size={12} />{names[part] || (Number(part) ? `${segments[0] === 'providers' ? 'Professional' : 'Request'} #${part}` : part)}</span>)}<span className="page-breadcrumb-note"><Leaf size={12} /> Everyday, made easier.</span></div>
    {isWorkspace && <nav className="workspace-nav" aria-label="Workspace navigation">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === base}><Icon size={16} />{label}</NavLink>)}{user?.role === 'CUSTOMER' && <Link className="workspace-new" to="/app/request">New request <ArrowUpRight size={16} /></Link>}</nav>}
    <div className="page-body">{children}</div>
  </div>;
}
