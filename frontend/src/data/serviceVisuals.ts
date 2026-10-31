export type ServiceVisual = { image: string; alt: string; palette: string };

export const SERVICE_VISUALS: Record<string, ServiceVisual> = {
  electrical: { image: '/images/services/electrical.png', alt: 'An electrician carefully installing a wall light', palette: 'sunshine' },
  plumbing: { image: '/images/services/plumbing.png', alt: 'A plumber repairing a kitchen faucet', palette: 'sky' },
  carpentry: { image: '/images/ease-repair-v3.png', alt: 'A carpenter restoring a teak wooden chair', palette: 'apricot' },
  cleaning: { image: '/images/ease-cleaning-v3.png', alt: 'A professional cleaning a sunlit Sri Lankan home', palette: 'mint' },
  'appliance-repair': { image: '/images/services/appliance-repair.png', alt: 'A technician servicing a washing machine', palette: 'lilac' },
  'vehicle-repair': { image: '/images/catalogue/vehicle-repair.png', alt: 'A mechanic inspecting a car engine in a blue workshop', palette: 'sky' },
  'vehicle-service': { image: '/images/catalogue/vehicle-service.png', alt: 'A professional caring for a car in a terracotta service bay', palette: 'apricot' },
  'computer-repair': { image: '/images/services/computer-repair.png', alt: 'A computer technician working on an open laptop', palette: 'sky' },
  'mobile-repair': { image: '/images/catalogue/mobile-repair.png', alt: 'A phone repair specialist working in a lavender studio', palette: 'lilac' },
  delivery: { image: '/images/catalogue/delivery.png', alt: 'A courier with a parcel beside a teal scooter', palette: 'sunshine' },
  'moving-transport': { image: '/images/services/moving-transport.png', alt: 'Moving professionals carrying boxes into a home', palette: 'apricot' },
  printing: { image: '/images/catalogue/printing.png', alt: 'A print professional examining colourful art prints', palette: 'rose' },
  'document-services': { image: '/images/catalogue/document-services.png', alt: 'A document assistant organising files in a sky-blue office', palette: 'sky' },
  tutors: { image: '/images/catalogue/tutors.png', alt: 'A tutor helping a student in a cheerful peach study room', palette: 'sunshine' },
  'home-maintenance': { image: '/images/services/home-maintenance.png', alt: 'A handyman installing a wooden shelf', palette: 'mint' },
  gardening: { image: '/images/catalogue/gardening.png', alt: 'A gardener tending to flowering tropical plants', palette: 'rose' },
  painting: { image: '/images/services/painting.png', alt: 'A painter adding a fresh colour to an interior wall', palette: 'lilac' },
  other: { image: '/images/catalogue/other.png', alt: 'An assistant helping an older woman with everyday groceries', palette: 'mint' },
};
