import './ServiceVisuals.css';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ArrowLeft, Check, ChevronDown, CalendarCheck, HeartHandshake, Leaf, ListChecks, MapPin, Menu, MessageCircle, Moon, Play, Search, ShieldCheck, Sparkles, Sun, Wrench, X } from 'lucide-react';
import { Logo } from './Logo';
import { Footer } from './Footer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MOCK_CATEGORIES } from '../data/mockProvidersData';
import { SERVICE_VISUALS } from '../data/serviceVisuals';
import './AttractiveLanding.css';

const slides = [
  { image: '/images/ease-home-v2.png', alt: 'A friendly professional welcomed into a Sri Lankan home', label: 'GOOD HELP, CLOSE TO HOME', title: 'Your home, in good hands.', detail: 'Find a helping hand for the little repairs and the bigger to-dos.', icon: Wrench, palette: 'mint' },
  { image: '/images/ease-cleaning-v3.png', alt: 'A professional giving a Sri Lankan home a fresh clean', label: 'MORE ROOM FOR YOUR EVERYDAY', title: 'A fresh space. A fresh start.', detail: 'Make time for your day. Let someone else take care of the chores.', icon: Sparkles, palette: 'sunshine' },
  { image: '/images/ease-family-v2.png', alt: 'A caring assistant spending time with an older Sri Lankan mother', label: 'A LITTLE CLOSER, WHEREVER YOU ARE', title: 'Care that feels closer.', detail: 'Arrange everyday help for the people who mean home.', icon: HeartHandshake, palette: 'rose' },
];

const questions = [
  ['What can I use LankaEase for?', 'Find professionals for home repairs, cleaning, vehicle care, technology support, moving, tutoring, and other everyday tasks. Start with a category or describe what you need.'],
  ['How do I request a service?', 'Create an account or sign in, explore the professionals in your area, and send a service request with your task details, address, and preferred time. You can follow the request from your workspace.'],
  ['Can I arrange help for my family?', 'Yes. Your family assistance workspace lets you save a loved one’s contact and address details, then create a service request for them. It is especially useful when you live away from home.'],
  ['Can I join as a service professional?', 'Yes. Choose Service Provider when creating your account. Your provider workspace brings your professional profile, availability, and service requests together.'],
];

export function AttractiveLanding() {
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [task, setTask] = useState('');
  const [rail, setRail] = useState({ current: 0, max: 0 });
  const trackRef = useRef<HTMLDivElement>(null);
  const dashboard = user?.role === 'ADMIN' ? '/admin' : user?.role === 'PROVIDER' ? '/provider' : '/app';
  const access = (path: string) => isAuthenticated ? path : `/login?redirect=${encodeURIComponent(path)}`;
  const playing = autoplay && !hovered && !focused && visible && !reducedMotion;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion(); updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => { media.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => setActive(previous => (previous + 1) % slides.length), 6500);
    return () => window.clearInterval(interval);
  }, [playing, active]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => setRail({ current: track.scrollLeft, max: track.scrollWidth - track.clientWidth });
    const observer = new ResizeObserver(update);
    observer.observe(track); track.addEventListener('scroll', update, { passive: true }); update();
    return () => { observer.disconnect(); track.removeEventListener('scroll', update); };
  }, []);

  const moveRail = (direction: number) => {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth * .85, behavior: reducedMotion ? 'instant' : 'smooth' });
  };

  return <div className="landing-root">
    <div className="landing-topline"><Leaf size={13} /> Made for life in Sri Lanka. <span>A little help. A lot more possibility.</span></div>
    <header className="landing-header landing-wrap">
      <Logo to="/" showTagline={false} />
      <nav className={menuOpen ? 'landing-nav open' : 'landing-nav'} aria-label="Landing navigation">
        {[['#possibilities', 'Why LankaEase'], ['#landing-services', 'Our services'], ['#landing-how', 'How it works'], ['#landing-faq', 'Your questions']].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="landing-header-actions"><button className="landing-icon-button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button><Link className="landing-signin" to={isAuthenticated ? dashboard : '/login'}>{isAuthenticated ? 'My workspace' : 'Sign in'} <ArrowUpRight size={15} /></Link><button className="landing-menu-button landing-icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
    </header>

    <section className="landing-hero landing-wrap" aria-labelledby="landing-title">
      <div className="landing-hero-copy"><span className="landing-eyebrow"><span /> YOUR EVERYDAY, WITH A LITTLE MORE EASE</span><h1 id="landing-title">More life.<br />Less on <em>your list.</em></h1><p>The home to care for. The family to look after. The little jobs that add up. Find local helping hands for all of it, right here in Sri Lanka.</p>
        <form className="landing-task-search" onSubmit={event => { event.preventDefault(); navigate(access(`/providers${task.trim() ? `?search=${encodeURIComponent(task.trim())}` : ''}`)); }}><label><Search size={19} /><input value={task} onChange={event => setTask(event.target.value)} aria-label="What do you need a hand with?" placeholder="What do you need a hand with?" /></label><button type="submit" aria-label="Find help"><ArrowUpRight size={21} /></button></form>
        <div className="landing-hero-actions"><a className="landing-button" href="#landing-services">Explore what’s possible <ArrowUpRight size={17} /></a><a className="landing-watch-link" href="#landing-how"><span><Play size={12} fill="currentColor" /></span>See how it works</a></div>
        <div className="landing-hero-footnote"><MapPin size={15} /> Local skills. Everyday possibilities. <span>Made for Sri Lanka.</span></div>
      </div>

      <div className="landing-hero-carousel" data-playing={playing} role="region" aria-roledescription="carousel" aria-label="Ways LankaEase helps" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
        <div className="landing-photo-frame">{slides.map((slide, index) => <div key={slide.title} className={`landing-hero-slide ${index === active ? 'active' : ''}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${slide.title}`} aria-hidden={index !== active}><img src={slide.image} alt={index === active ? slide.alt : ''} width={1000} height={1100} fetchPriority={index === 0 ? 'high' : 'auto'} /><span className="landing-photo-label"><span />{slide.label}</span></div>)}<span className="landing-photo-doodle" aria-hidden="true">✳</span></div>
        <div className={`landing-slide-note palette-${slides[active].palette}`}><span className="landing-note-icon">{(() => { const Icon = slides[active].icon; return <Icon size={23} strokeWidth={1.5} />; })()}</span><div><strong>{slides[active].title}</strong><p>{slides[active].detail}</p></div><Check size={17} /></div>
        {!reducedMotion && <button className="landing-slideshow-access" onClick={() => setAutoplay(!autoplay)}>{autoplay ? 'Pause hero slideshow' : 'Play hero slideshow'}</button>}
        <span className="landing-orbit-sticker" aria-hidden="true">A little<br /><em>more ease.</em><Sparkles size={16} /></span>
      </div>
    </section>

    <div className="landing-promise-strip"><div className="landing-wrap"><span><Wrench size={19} /> 18 ways to get things done</span><span><CalendarCheck size={19} /> Requests around your schedule</span><span><MessageCircle size={19} /> Keep every detail together</span><span><HeartHandshake size={19} /> Help for you and your family</span></div></div>

    <section id="possibilities" className="landing-possibilities landing-wrap"><div className="landing-section-heading"><div><span className="landing-eyebrow">FOR EVERYTHING THAT MAKES UP LIFE</span><h2>One place.<br /><em>So many ways to make life easier.</em></h2></div><p>More than a list of services. A simpler way to look after your home, your people, and your everyday.</p></div><div className="landing-use-grid">
      {[{ title: 'A home that runs smoothly.', subtitle: 'FOR YOUR HOME', description: 'From that dripping tap to the deep clean you keep putting off. Find the right skills for your space.', image: '/images/services/plumbing.png', alt: 'A plumber taking care of a home repair', palette: 'sky', path: '/services', link: 'Take care of your home' }, { title: 'Closer, even from far away.', subtitle: 'FOR YOUR LOVED ONES', description: 'Save your family’s details and arrange everyday help for them, wherever life takes you.', image: '/images/ease-family-v2.png', alt: 'A mother enjoying caring assistance at home', palette: 'rose', path: '/app/family', link: 'Explore family assistance' }, { title: 'Everyday extras, handled.', subtitle: 'FOR YOUR BUSY DAYS', description: 'A tutor, a delivery, a little tech help. Discover the people who help keep your day moving.', image: '/images/catalogue/delivery.png', alt: 'A courier ready to help with an everyday delivery', palette: 'sunshine', path: '/services', link: 'Find your helping hand' }].map(item => <Link className={`landing-use-card palette-${item.palette}`} key={item.title} to={access(item.path)}><div className="landing-use-image"><img src={item.image} alt={item.alt} loading="lazy" width={600} height={450} /><span>{item.subtitle}</span></div><div className="landing-use-copy"><h3>{item.title}</h3><p>{item.description}</p><span>{item.link}<ArrowUpRight size={19} /></span></div></Link>)}
    </div></section>

    <section id="landing-services" className="landing-service-section"><div className="landing-wrap"><div className="landing-section-heading"><div><span className="landing-eyebrow">A HELPING HAND FOR EVERY DAY</span><h2>What can we take<br /><em>off your list?</em></h2></div><div className="landing-rail-heading-actions"><Link to={access('/services')} className="landing-text-link">Explore all 18 services <ArrowUpRight size={17} /></Link><div><button className="landing-round-button" onClick={() => moveRail(-1)} aria-label="Previous services" disabled={rail.current <= 2}><ArrowLeft size={19} /></button><button className="landing-round-button" onClick={() => moveRail(1)} aria-label="Next services" disabled={rail.current >= rail.max - 2}><ArrowRight size={19} /></button></div></div></div>
      <div ref={trackRef} className="landing-service-track" role="region" aria-label="Service category carousel" tabIndex={0}>{MOCK_CATEGORIES.map(category => { const visual = SERVICE_VISUALS[category.slug]; return <Link className={`landing-service-tile palette-${visual.palette}`} key={category.id} to={access(`/providers?categoryId=${category.id}`)}><div><img src={visual.image} alt={visual.alt} loading="lazy" width={600} height={400} /><span>{String(category.id).padStart(2, '0')}</span></div><h3>{category.name}<ArrowUpRight size={19} /></h3><p>{category.description}</p></Link>; })}</div><div className="landing-rail-footer"><span>Good help comes in all kinds.</span><span className="landing-rail-progress"><span style={{ width: `${Math.max(8, rail.max > 0 ? (rail.current / rail.max) * 100 : 100)}%` }} /></span><span>Swipe to discover <ArrowRight size={14} /></span></div>
    </div></section>

    <section id="landing-how" className="landing-how landing-wrap"><div className="landing-how-intro"><span className="landing-eyebrow">FROM “I NEED A HAND” TO “ALL SORTED”</span><h2>A little less effort.<br /><em>A lot more everyday.</em></h2><p>Find help, arrange the details, and follow your request. All from your LankaEase workspace.</p><Link className="landing-button" to={access('/app/request')}>Let’s get it sorted <ArrowUpRight size={17} /></Link><span className="landing-how-flower" aria-hidden="true">✳</span></div><div className="landing-steps">{[{ icon: Search, title: 'Tell us what’s on your list.', text: 'Explore a category or describe the task you need help with.' }, { icon: CalendarCheck, title: 'Find your helping hand.', text: 'Compare professional profiles and request a time and place that work for you.' }, { icon: ListChecks, title: 'Keep life moving.', text: 'Follow your service requests, stay in touch, and keep your details in one place.' }].map(({ icon: Icon, title, text }, index) => <div className="landing-step" key={title}><span className="landing-step-number">0{index + 1}</span><div><Icon size={23} strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>

    <section className="landing-partner-section landing-wrap"><div className="landing-partner-image"><img src="/images/ease-repair-v3.png" alt="A skilled Sri Lankan carpenter restoring furniture" loading="lazy" width={800} height={600} /><span><ShieldCheck size={18} /> Local skills. Real possibilities.</span></div><div className="landing-partner-copy"><span className="landing-eyebrow">YOUR SKILLS CAN MAKE SOMEONE’S DAY</span><h2>Good at what you do?<br /><em>There’s a place for you here.</em></h2><p>Bring your everyday expertise to LankaEase. Create your professional profile and manage your availability and service requests from your provider workspace.</p><Link className="landing-button" to="/register?role=PROVIDER">Become a service partner <ArrowUpRight size={17} /></Link></div></section>

    <section id="landing-faq" className="landing-faq landing-wrap"><div><span className="landing-eyebrow">A LITTLE CLARITY</span><h2>Good questions.<br /><em>Simple answers.</em></h2><p>Here to make your everyday easier, starting with the details.</p></div><div className="landing-faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></section>

    <section className="landing-final-cta landing-wrap"><span aria-hidden="true">✳</span><div><span className="landing-eyebrow">MAKE ROOM FOR WHAT MATTERS</span><h2>Your next “all sorted”<br />starts right here.</h2><p>A happier home. A little more time. Let’s make it happen.</p></div><Link className="landing-button" to={isAuthenticated ? '/home' : '/register'}>{isAuthenticated ? 'Explore LankaEase' : 'Find your everyday ease'}<ArrowUpRight size={18} /></Link></section>
    <Footer />
  </div>;
}
