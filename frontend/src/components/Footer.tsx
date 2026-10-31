import { Link } from 'react-router-dom';
import { ArrowUpRight, Leaf, MapPin } from 'lucide-react';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
export function Footer() {
  return <footer className="app-footer"><div className="app-footer-inner"><div className="app-footer-lead"><Logo /><p>Everyday services. A little more ease.<br />Made with care, for Sri Lanka.</p><LanguageSwitcher /></div><div><strong>Discover</strong><Link to="/services">Our services</Link><Link to="/providers">Find a professional</Link><Link to="/how-it-works">How it works</Link></div><div><strong>A little closer</strong><Link to="/app/family">Family assistance</Link><Link to="/about">Our story</Link><Link to="/contact">Get in touch <ArrowUpRight size={12} /></Link></div><div className="app-footer-message"><Leaf size={24} /><span>A happier home.<br />A little more time.<br /><em>That's the LankaEase way.</em></span></div><div className="app-footer-bottom"><span>© {new Date().getFullYear()} LankaEase. All rights reserved.</span><span><MapPin size={12} /> Rooted in Sri Lanka.</span></div></div></footer>;
}
