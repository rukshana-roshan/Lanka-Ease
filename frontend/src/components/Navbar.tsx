import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, LogOut, Sun, Moon, ChevronDown, UserRound, LayoutDashboard } from 'lucide-react';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SafeImage } from './SafeImage';
import { UserProfileModal } from './UserProfileModal';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { brandAvatar } from './BrandAvatar';
import type { Role } from '../types';
const links = [{ to: '/home', label: 'Home' }, { to: '/services', label: 'Our services' }, { to: '/providers', label: 'Professionals' }, { to: '/how-it-works', label: 'How it works' }, { to: '/about', label: 'Our story' }, { to: '/contact', label: 'Contact' }];
export function Navbar() {
  const { user, logout, demoLogin, isDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [account, setAccount] = useState(false);
  const [profile, storeProfile] = useState(false);
  const setProfile=(open:boolean)=>{if(open&&user?.role==='PROVIDER'&&!isDemo){navigate('/provider');return;}storeProfile(open);};
  const dashboard = user?.role === 'ADMIN' ? '/admin' : user?.role === 'PROVIDER' ? '/provider' : '/app';
  const switchRole = (role: Role) => { demoLogin(role); setAccount(false); navigate(role === 'ADMIN' ? '/admin' : role === 'PROVIDER' ? '/provider' : '/app'); };
  return <><header className="app-header"><div className="app-header-inner"><Logo showTagline={false} /><nav className="app-desktop-nav" aria-label="Main navigation">{links.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}</nav><div className="app-header-tools"><button className="app-icon-button theme-control" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button><div className="account-control"><button className="account-trigger" onClick={() => setAccount(!account)} aria-expanded={account} aria-label="Open account menu"><SafeImage src={user?.profileImage} fallbackSrc={brandAvatar(user?.fullName || 'My account')} alt="Your profile" className="account-avatar" /><span>{user?.fullName?.split(' ')[0] || 'My account'}</span><ChevronDown size={13} /></button>{account && <><button className="menu-dismiss" onClick={() => setAccount(false)} aria-label="Close account menu" /><div className="account-menu"><span className="design-eyebrow">YOUR LANKAEASE</span><strong>{user?.fullName}</strong><small>{user?.email}</small><Link to={dashboard} onClick={() => setAccount(false)}><LayoutDashboard size={15} /> My workspace <ArrowUpRight size={14} /></Link><button onClick={() => { setProfile(true); setAccount(false); }}><UserRound size={15} /> Edit profile</button><LanguageSwitcher />{isDemo && <><span className="account-menu-caption">Explore demo workspaces</span><div className="role-options">{(['CUSTOMER', 'PROVIDER', 'ADMIN'] as Role[]).map(r => <button key={r} onClick={() => switchRole(r)}>{r.charAt(0) + r.slice(1).toLowerCase()}</button>)}</div></>}<button onClick={() => { logout(); setAccount(false); navigate('/'); }}><LogOut size={15} /> Sign out</button></div></>}</div><button className="app-icon-button app-mobile-menu" onClick={() => setMobile(!mobile)} aria-label={mobile ? 'Close navigation' : 'Open navigation'} aria-expanded={mobile}>{mobile ? <X size={21} /> : <Menu size={21} />}</button></div></div>{mobile && <nav className="app-mobile-nav" aria-label="Mobile navigation">{links.map(l => <NavLink key={l.to} to={l.to} onClick={() => setMobile(false)}>{l.label}<ArrowUpRight size={15} /></NavLink>)}<Link to={dashboard} onClick={() => setMobile(false)}>My workspace <ArrowUpRight size={15} /></Link></nav>}</header><UserProfileModal isOpen={profile} onClose={() => setProfile(false)} /></>;
}
