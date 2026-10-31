import '../components/ServiceVisuals.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../services/api';
import { Search, X, Wrench, Zap, Droplet, Hammer, Sparkles, Tv, Car, Laptop, Smartphone, Package, Truck, Printer, FileText, GraduationCap, Home, Trees, Paintbrush, MoreHorizontal, HeartHandshake, ArrowUpRight } from 'lucide-react';
const iconMap: Record<string, LucideIcon> = { Zap, Droplet, Hammer, Sparkles, Tv, Wrench, Car, Laptop, Smartphone, Package, Truck, Printer, FileText, GraduationCap, Home, Trees, Paintbrush, MoreHorizontal };
import type { LucideIcon } from 'lucide-react';
import { PageIntro } from '../components/PageIntro';
import { SERVICE_VISUALS } from '../data/serviceVisuals';
import './ServicesPage.css';
export function ServicesPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_CATEGORIES.filter(c => `${c.name} ${c.description}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="designed-page services-page"><PageIntro eyebrow="A HELPING HAND FOR EVERY DAY" title="Your home. Our everyday expertise." description="From the little repairs to the tasks you never quite get to. Explore services that make room for a more effortless everyday." image="/images/ease-cleaning-v3.png" imageAlt="A home cleaning professional caring for a sunlit Sri Lankan home" /><div className="catalogue-toolbar"><div><span className="design-eyebrow">FIND YOUR HELPING HAND</span><h2>What is on your to-do list?</h2></div><label className="catalogue-search"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search our services" aria-label="Search services" />{search && <button onClick={() => setSearch('')} aria-label="Clear service search"><X size={16} /></button>}</label></div><div className="catalogue-grid">{filtered.map((cat) => {
    const Icon = iconMap[cat.iconName] || Wrench;
    const visual = SERVICE_VISUALS[cat.slug];
    return <Link className={`catalogue-card catalogue-photo-card palette-${visual.palette}`} to={`/providers?categoryId=${cat.id}`} key={cat.id}>
      <span className="catalogue-photo"><img src={visual.image} alt={visual.alt} width={768} height={512} loading="lazy" decoding="async" /><span className="catalogue-icon" aria-hidden="true"><Icon size={25} strokeWidth={1.5} /></span><small aria-hidden="true">{String(cat.id).padStart(2, '0')}</small></span>
      <div className="catalogue-copy"><h3>{cat.name}</h3><p>{cat.description}</p><span className="catalogue-card-link">Explore professionals <ArrowUpRight size={18} /></span></div>
    </Link>;
  })}</div>{!filtered.length && <div className="design-empty"><Search size={30} /><h3>No matching services yet.</h3><p>Try a broader search or browse all our categories.</p><button className="design-button" onClick={() => setSearch('')}>Browse all services</button></div>}<section className="service-help-banner"><HeartHandshake size={32} strokeWidth={1.4} /><div><h2>Not sure where to start?</h2><p>Tell us what you need. We will help you put your request together.</p></div><Link className="design-button" to="/app/request">Describe your task <ArrowUpRight size={17} /></Link></section></div>;
}
