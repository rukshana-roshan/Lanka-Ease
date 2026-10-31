import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Check, ChevronDown, MapPin, Search, ShieldCheck, Wrench, Zap, Droplets, Sparkles, Wind, Hammer, HeartHandshake, Menu, X, Leaf, MessageCircle, CalendarCheck, House, Laptop, Paintbrush, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './EaseExperience.css';

const services = [
  { title: 'Home cleaning', detail: 'A fresh start for your space', icon: Sparkles, category: 'cleaning', image: '/images/ease-cleaning-v3.png', imageAlt: 'A home cleaning professional wiping a teak table in a bright Sri Lankan home', color: 'sage' },
  { title: 'Electrical', detail: 'Keep your home connected', icon: Zap, category: 'electrical', image: '/images/services/electrical.png', imageAlt: 'An electrician installing a wall light in a Sri Lankan home', color: 'sand' },
  { title: 'Plumbing', detail: 'Little leaks. Expert fixes.', icon: Droplets, category: 'plumbing', image: '/images/services/plumbing.png', imageAlt: 'A plumber repairing a kitchen faucet', color: 'blue' },
  { title: 'Appliance repair', detail: 'Get everyday life running', icon: Wind, category: 'appliance-repair', image: '/images/services/appliance-repair.png', imageAlt: 'A technician servicing a front-loading washing machine', color: 'rose' },
  { title: 'Carpentry', detail: 'Crafted with care', icon: Hammer, category: 'carpentry', image: '/images/ease-repair-v3.png', imageAlt: 'A carpenter carefully restoring a teak wooden chair', color: 'sand' },
  { title: 'Home maintenance', detail: 'All the jobs on your list', icon: Wrench, category: 'home-maintenance', image: '/images/services/home-maintenance.png', imageAlt: 'A home maintenance professional installing a wooden shelf', color: 'sage' },
  { title: 'Computer repair', detail: 'A little help with your tech', icon: Laptop, category: 'computer-repair', image: '/images/services/computer-repair.png', imageAlt: 'A computer repair professional working on a laptop', color: 'blue' },
  { title: 'Painting', detail: 'Make your space feel new', icon: Paintbrush, category: 'painting', image: '/images/services/painting.png', imageAlt: 'A painter applying sage-green paint to an interior wall', color: 'rose' },
  { title: 'Moving & transport', detail: 'Your next chapter, made easier', icon: Truck, category: 'moving-transport', image: '/images/services/moving-transport.png', imageAlt: 'Moving professionals carrying boxes into a Sri Lankan home', color: 'sand' },
];

export function EaseExperience({ embedded = false }: { embedded?: boolean }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Colombo');
  const [expanded, setExpanded] = useState(false);
  const [menu, setMenu] = useState(false);
  const go = (path: string) => navigate(isAuthenticated ? path : `/login?redirect=${encodeURIComponent(path)}`);
  const findService = (category?: string) => {
    const params = new URLSearchParams({ city });
    if (category) params.set('category', category);
    if (query.trim()) params.set('search', query.trim());
    go(`/providers?${params}`);
  };
  return <div className="ease-site">
    {!embedded && <><div className="ease-announcement"><Leaf size={13} /> A little help. A lot more peace of mind. <span>Made for life in Sri Lanka.</span></div>
      <header className="ease-header ease-wrap">
        <Link to="/" className="ease-wordmark" aria-label="Lanka Ease home"><span className="ease-logo"><House size={23} /></span>Lanka<span>Ease</span></Link>
        <nav className={menu ? 'ease-nav is-open' : 'ease-nav'} aria-label="Main navigation"><a href="#services" onClick={() => setMenu(false)}>Our services <ChevronDown size={13} /></a><a href="#how-it-works" onClick={() => setMenu(false)}>How it works</a><a href="#family" onClick={() => setMenu(false)}>For your family</a><Link to="/register?role=PROVIDER" className="ease-mobile-provider">Become a partner <ArrowUpRight size={14} /></Link></nav>
        <div className="ease-header-actions"><Link className="ease-partner" to="/register?role=PROVIDER">Become a partner <ArrowUpRight size={14} /></Link><Link className="ease-signin" to={isAuthenticated ? '/app' : '/login'}>{isAuthenticated ? 'My dashboard' : 'Sign in'} <ArrowUpRight size={16} /></Link><button className="ease-menu" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu}>{menu ? <X /> : <Menu />}</button></div>
      </header></>}
    <section className="ease-hero ease-wrap"><div className="ease-hero-copy"><div className="ease-eyebrow"><span /> YOUR EVERYDAY, MADE EASIER</div><h1>A happy home.<br />A little <em>less hassle.</em></h1><p>From the small fixes to the big to-dos, find local professionals who help you get back to what matters.</p>
      <form className="ease-search" onSubmit={e => { e.preventDefault(); findService(); }}><label className="ease-search-query"><Search size={19} /><input aria-label="What do you need help with?" placeholder="What do you need help with?" value={query} onChange={e => setQuery(e.target.value)} /></label><div className="ease-search-bottom"><label className="ease-city"><MapPin size={17} /><select value={city} onChange={e => setCity(e.target.value)} aria-label="Your city">{['Colombo', 'Kandy', 'Galle', 'Gampaha', 'Negombo', 'Matara', 'Kurunegala', 'Jaffna', 'Kalutara'].map(c => <option key={c}>{c}</option>)}</select></label><button className="ease-button" type="submit">Find a professional <ArrowUpRight size={17} /></button></div></form>
      <div className="ease-popular"><span>Popular:</span>{['Cleaning', 'Plumbing', 'Electrical'].map((s, i) => <button key={s} onClick={() => findService(['cleaning', 'plumbing', 'electrical'][i])}>{s}</button>)}</div><div className="ease-hero-note"><ShieldCheck size={18} /><span>Local expertise. Thoughtful service. All in one place.</span></div></div>
      <div className="ease-hero-visual"><img className="ease-hero-photo" src="/images/ease-home-v2.png" alt="A Sri Lankan homeowner welcoming a home service professional to her tropical home" fetchPriority="high" /><div className="ease-image-label"><span /> GOOD HELP, CLOSE TO HOME</div><div className="ease-floating-note"><span className="ease-check-icon"><Check size={20} /></span><div><strong>One less thing on your list.</strong><span>More time for the moments that matter.</span></div><span className="ease-note-spark">✦</span></div><span className="ease-hero-flower" aria-hidden="true">✳</span></div>
    </section>
    <div className="ease-benefits"><div className="ease-wrap"><span><ShieldCheck /> Find the right professional</span><span><CalendarCheck /> Book around your day</span><span><MessageCircle /> Stay connected, easily</span><span><HeartHandshake /> Care for loved ones, from anywhere</span></div></div>
    <section id="services" className="ease-services ease-wrap"><div className="ease-section-heading"><div><div className="ease-eyebrow">A HELPING HAND FOR EVERY DAY</div><h2>What can we take off your list?</h2></div><button className="ease-text-link" aria-expanded={expanded} aria-controls="home-service-grid" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show popular services' : 'Explore all services'} <ArrowUpRight size={18} /></button></div><div id="home-service-grid" className="ease-service-grid">
        {(expanded ? services : services.slice(0, 6)).map(({ title, detail, icon: Icon, category, color, image, imageAlt }, i) => (
          <button className="ease-service-card ease-service-photo-card" key={category} onClick={() => findService(category)}>
            <span className="ease-service-photo">
              <img src={image} alt={imageAlt} width={768} height={512} loading="lazy" decoding="async" />
              <span className={`ease-service-icon ${color}`} aria-hidden="true"><Icon size={21} strokeWidth={1.6} /></span>
              <span className="ease-service-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            </span>
            <span className="ease-service-card-copy">
              <h3>{title}</h3><p>{detail}</p>
              <span className="ease-service-arrow" aria-hidden="true"><ArrowUpRight size={21} /></span>
            </span>
          </button>
        ))}
      </div>{expanded && <button className="ease-button ease-more-services" onClick={() => go('/services')}>See every service <ArrowRight size={17} /></button>}</section>
    <section id="how-it-works" className="ease-process"><div className="ease-wrap"><div className="ease-section-heading"><div><div className="ease-eyebrow">LESS TO DO. MORE TIME FOR YOU.</div><h2>A simpler way to get things done.</h2></div><p>From “I need a hand” to “all sorted.”<br />Here’s how LankaEase helps.</p></div><div className="ease-steps">{[{ icon: Search, title: 'Tell us what you need', text: 'Choose a service and your location. Find help for the task you have in mind.' }, { icon: CalendarCheck, title: 'Find your helping hand', text: 'Explore professional profiles and request a time that works for you.' }, { icon: House, title: 'Make room for life', text: 'Keep in touch and follow your request, all from your own dashboard.' }].map(({ icon: Icon, title, text }, i) => <div className="ease-step" key={title}><div className="ease-step-top"><span><Icon size={23} /></span><small>0{i + 1}</small>{i < 2 && <ArrowRight className="ease-step-arrow" size={25} />}</div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
    <section id="family" className="ease-family ease-wrap"><div className="ease-family-image"><img src="/images/ease-family-v2.png" alt="A Sri Lankan mother enjoying time at home with a caring household assistant" loading="lazy" /><span><HeartHandshake size={18} /> A little closer, wherever you are.</span></div><div className="ease-family-copy"><div className="ease-eyebrow">FOR THE PEOPLE WHO MEAN HOME</div><h2>Miles apart.<br /><em>Still there for them.</em></h2><p>Arrange everyday help for your parents and loved ones in Sri Lanka. From a repair at home to a helping hand, care doesn’t have to feel far away.</p><ul><li><Check size={17} /> Request services for a family member</li><li><Check size={17} /> Keep their home and contact details together</li><li><Check size={17} /> Follow requests from your dashboard</li></ul><button className="ease-button" onClick={() => go('/app/family')}>Explore family assistance <ArrowUpRight size={17} /></button></div></section>
    <section className="ease-cta ease-wrap"><div className="ease-cta-symbol" aria-hidden="true">✳</div><div><div className="ease-eyebrow">YOUR NEXT “ALL SORTED” STARTS HERE</div><h2>A little help goes a long way.</h2><p>Let’s make room for a more effortless everyday.</p></div><button className="ease-button ease-button-light" onClick={() => go('/app/request')}>Find your helping hand <ArrowUpRight size={18} /></button></section>
    {!embedded && <footer className="ease-footer ease-wrap"><div className="ease-footer-top"><div><Link to="/" className="ease-wordmark"><span className="ease-logo"><House size={23} /></span>Lanka<span>Ease</span></Link><p>Everyday services. A little more ease.<br />Made with care, for Sri Lanka.</p></div><div><strong>Discover</strong><a href="#services">Our services</a><a href="#how-it-works">How it works</a><a href="#family">Family assistance</a></div><div><strong>Join the community</strong><Link to="/register">Create an account</Link><Link to="/register?role=PROVIDER">Become a partner</Link><Link to="/login">Sign in</Link></div><div className="ease-footer-note"><Leaf size={23} /><span>A happier home.<br />A little more time.<br /><em>That’s the LankaEase way.</em></span></div></div><div className="ease-footer-bottom"><span>© {new Date().getFullYear()} LankaEase. All rights reserved.</span><span><MapPin size={13} /> Rooted in Sri Lanka.</span></div></footer>}
    {!embedded && <a href="#services" className="ease-mobile-book"><Search size={17} /> Find a service <ArrowUpRight size={17} /></a>}
  </div>;
}
