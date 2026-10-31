import { NavLink } from 'react-router-dom';
import { Home, Compass, Plus, MessageSquare, UserRound, Layers, HeartHandshake, ListChecks } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export function BottomNav() {
 const { user } = useAuth();
 const customer = user?.role === 'CUSTOMER';
 const base = user?.role === 'ADMIN' ? '/admin' : user?.role === 'PROVIDER' ? '/provider' : '/app';
 const items = customer ? [{to:base,label:'Home',icon:Home},{to:'/app/requests',label:'Requests',icon:ListChecks},{to:'/app/request',label:'Request',icon:Plus,center:true},{to:'/app/messages',label:'Messages',icon:MessageSquare},{to:'/app/family',label:'Family',icon:HeartHandshake}] : [{to:base,label:'Workspace',icon:Home},{to:'/services',label:'Services',icon:Layers},{to:'/providers',label:'Explore',icon:Compass,center:true},{to:'/app/messages',label:'Messages',icon:MessageSquare},{to:base+'/profile',label:'Profile',icon:UserRound}];
 return <nav className="app-bottom-nav" aria-label="Mobile workspace navigation">{items.map(({to,label,icon:Icon,center})=><NavLink key={to} to={to} end={to===base} className={({isActive})=>`${center?'bottom-primary ':''}${isActive?'active':''}`}><span><Icon size={center?23:19} strokeWidth={1.7}/></span><small>{label}</small></NavLink>)}</nav>;
}
