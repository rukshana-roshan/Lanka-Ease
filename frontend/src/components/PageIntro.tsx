import { Leaf } from 'lucide-react';

export function PageIntro({ eyebrow, title, description, image = '/images/ease-home-v2.png', imageAlt = 'Everyday help in a Sri Lankan home' }: { eyebrow: string; title: string; description: string; image?: string; imageAlt?: string }) {
  return <section className="page-intro"><div className="page-intro-copy"><span className="design-eyebrow"><Leaf size={14} />{eyebrow}</span><h1>{title}</h1><p>{description}</p><span className="page-intro-note">A little help. A lot more peace of mind.</span></div><div className="page-intro-image"><img src={image} alt={imageAlt} fetchPriority="high" /><span aria-hidden="true">✳</span></div></section>;
}
