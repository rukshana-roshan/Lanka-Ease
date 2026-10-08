import type { Provider, ServiceCategory } from '../types';

export const MOCK_CATEGORIES: ServiceCategory[] = [
  { id: 1, name: 'Electrical', slug: 'electrical', description: 'Wiring, socket repair, light fittings & breaker box fixes.', iconName: 'Zap', isActive: true },
  { id: 2, name: 'Plumbing', slug: 'plumbing', description: 'Pipe leaks, tap replacement & water tank cleaning.', iconName: 'Droplet', isActive: true },
  { id: 3, name: 'Carpentry', slug: 'carpentry', description: 'Furniture repair, door fitting & lock replacement.', iconName: 'Hammer', isActive: true },
  { id: 4, name: 'Home Cleaning', slug: 'cleaning', description: 'Deep cleaning, sofa shampooing & sanitization.', iconName: 'Sparkles', isActive: true },
  { id: 5, name: 'Appliance Repair', slug: 'appliance-repair', description: 'Washing machine, fridge & AC servicing.', iconName: 'Tv', isActive: true },
  { id: 6, name: 'Vehicle Repair', slug: 'vehicle-repair', description: 'Mobile mechanic, breakdown & battery jumpstart.', iconName: 'Wrench', isActive: true },
  { id: 7, name: 'Vehicle Service', slug: 'vehicle-service', description: 'Full car/bike service & oil change.', iconName: 'Car', isActive: true },
  { id: 8, name: 'Computer Repair', slug: 'computer-repair', description: 'Laptop fixing & OS reinstallation.', iconName: 'Laptop', isActive: true },
  { id: 9, name: 'Mobile Repair', slug: 'mobile-repair', description: 'Display replacement & battery swap.', iconName: 'Smartphone', isActive: true },
  { id: 10, name: 'Delivery', slug: 'delivery', description: 'Islandwide parcel & document dispatch.', iconName: 'Package', isActive: true },
  { id: 11, name: 'Moving & Transport', slug: 'moving-transport', description: 'Lorry hire & house relocation.', iconName: 'Truck', isActive: true },
  { id: 12, name: 'Printing', slug: 'printing', description: 'Banner design & visiting card printing.', iconName: 'Printer', isActive: true },
  { id: 13, name: 'Document Services', slug: 'document-services', description: 'Typing & translation (EN/SI/TA).', iconName: 'FileText', isActive: true },
  { id: 14, name: 'Tutors', slug: 'tutors', description: 'O/L & A/L Science, Maths & English tuition.', iconName: 'GraduationCap', isActive: true },
  { id: 15, name: 'Home Maintenance', slug: 'home-maintenance', description: 'Handyman & roof leak repairs.', iconName: 'Home', isActive: true },
  { id: 16, name: 'Gardening', slug: 'gardening', description: 'Lawn mowing & garden landscaping.', iconName: 'Trees', isActive: true },
  { id: 17, name: 'Painting', slug: 'painting', description: 'Interior & exterior wall painting.', iconName: 'Paintbrush', isActive: true },
  { id: 18, name: 'Other', slug: 'other', description: 'Custom everyday household assistance.', iconName: 'MoreHorizontal', isActive: true },
];

const CITIES_LIST = [
  ['Colombo', 'Dehiwala', 'Nugegoda'],
  ['Kandy', 'Peradeniya', 'Katugastota'],
  ['Galle', 'Matara', 'Hikkaduwa'],
  ['Gampaha', 'Negombo', 'Ja-Ela'],
  ['Kurunegala', 'Kuliyapitiya', 'Maho'],
  ['Battaramulla', 'Kotte', 'Malabe'],
  ['Kalutara', 'Panadura', 'Wadduwa'],
  ['Jaffna', 'Chavakachcheri', 'Point Pedro']
];

const FIRST_NAMES = [
  'Kasun', 'Nimal', 'Priyantha', 'Ruwan', 'Sajith', 'Chathura', 'Nuwan', 'Dilshan',
  'Sampath', 'Tharindu', 'Dinesh', 'Kaveen', 'Mahesh', 'Asanka', 'Suranga', 'Janaka',
  'Sunil', 'Kamal', 'Bandula', 'Chaminda', 'Eranga', 'Gayan', 'Harsha', 'Isuru',
  'Jayantha', 'Kusal', 'Lakmal', 'Manjula', 'Nalin', 'Pradeep', 'Roshan', 'Sanjeewa'
];

const LAST_NAMES = [
  'Fernando', 'Silva', 'Perera', 'Wickramasinghe', 'De Silva', 'Bandara', 'Jayasinghe',
  'Rathnayake', 'Fonseka', 'Cooray', 'Mendis', 'Jayawardena', 'Abeywickrama', 'Gunawardena',
  'Kulatunga', 'Gamage', 'Liyanage', 'Hewage', 'Karunaratne', 'Dissanayake', 'Senanayake',
  'Rajapaksha', 'Tennakoon', 'Peiris', 'Fernandopulle', 'Weerasinghe', 'Herath', 'Pathirana'
];

const AVATAR_POOL = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200'
];

const CATEGORY_TITLES: Record<string, { businessSuffix: string; profession: string; desc: string }> = {
  'Electrical': { businessSuffix: 'Electrical Solutions', profession: 'Licensed Electrician', desc: 'Expert domestic & commercial electrical wiring, circuit diagnostics, DB board repairs, LED installations, and generator setups.' },
  'Plumbing': { businessSuffix: 'Plumbing & Sanitary', profession: 'Master Plumber', desc: 'Overhead water tank leak repair, bathroom fitting, high-pressure unclogging, PVC piping, and water pump maintenance.' },
  'Carpentry': { businessSuffix: 'Woodcraft & Carpentry', profession: 'Custom Furniture Carpenter', desc: 'Door and window fitting, teak furniture repair, wooden flooring, kitchen pantries, and deadbolt lock fixes.' },
  'Home Cleaning': { businessSuffix: 'CleanCare Services', profession: 'Sanitization & Deep Cleaner', desc: 'Complete house deep cleaning, fabric sofa extraction, carpet shampooing, kitchen degreasing, and roof dusting.' },
  'Appliance Repair': { businessSuffix: 'Appliance & AC Care', profession: 'HVAC & Appliance Tech', desc: 'Inverter refrigerator fixing, front-load washing machine repairs, split AC chemical cleaning, and gas re-charging.' },
  'Vehicle Repair': { businessSuffix: 'Mobile Auto Mechanic', profession: 'Emergency Breakdown Mechanic', desc: '24/7 mobile mechanic for roadside breakdowns, battery jumpstarts, clutch/brake repairs, and engine diagnostics.' },
  'Vehicle Service': { businessSuffix: 'Express Vehicle Tuning', profession: 'Automobile Service Specialist', desc: 'Full lube service, oil filter changes, suspension checks, spark plug replacement, and car detailing.' },
  'Computer Repair': { businessSuffix: 'TechFix Computers', profession: 'Laptop & Chipset Repairer', desc: 'Laptop motherboard diagnostics, display screen replacement, SSD upgrades, OS reinstallation, and malware removal.' },
  'Mobile Repair': { businessSuffix: 'SmartPhone Clinic', profession: 'Mobile Phone Specialist', desc: 'OLED/LCD screen replacement, battery health restoration, charging port fixes, and water damage recovery.' },
  'Delivery': { businessSuffix: 'Express Courier LK', profession: 'Reliable Parcel Rider', desc: 'Same-day urgent parcel delivery, document dispatch, medicine pick-up, and cash on delivery logistics.' },
  'Moving & Transport': { businessSuffix: 'Islandwide Movers', profession: 'Lorry & Moving Operator', desc: 'House and office furniture relocation, padded lorry transport, loading/unloading labor, and bubble-wrap packing.' },
  'Printing': { businessSuffix: 'ColorCraft Printers', profession: 'Digital Printing Pro', desc: 'Vinyl banner printing, business cards, customized mugs, t-shirt printing, and event flyer production.' },
  'Document Services': { businessSuffix: 'Lanka Translucence Docs', profession: 'Sworn Translator & Typist', desc: 'Sinhala/Tamil/English document translation, legal typing, PDF formatting, and NIC/passport form assistance.' },
  'Tutors': { businessSuffix: 'Academic Excellence Tutors', profession: 'O/L & A/L Educator', desc: 'Individual and small group tuition for GCE O/L and A/L Science, Mathematics, English, and ICT subjects.' },
  'Home Maintenance': { businessSuffix: 'Handyman Fixes', profession: 'All-Round Home Handyman', desc: 'Roof tile leak waterproofing, wall drilling, curtain rod mounting, gutter clearing, and masonry repairs.' },
  'Gardening': { businessSuffix: 'GreenThumb Landscaping', profession: 'Lawn & Garden Caregiver', desc: 'Grass cutting, hedge trimming, garden landscaping, fertilizer application, and flowerbed maintenance.' },
  'Painting': { businessSuffix: 'Rainbow Wall Painters', profession: 'Interior & Exterior Painter', desc: 'JAT/Weather Shield wall painting, wood waterproofing, putty plastering, and decorative color matching.' },
  'Other': { businessSuffix: 'Everyday Household Support', profession: 'General Household Assistant', desc: 'General domestic errand runner, event setup support, pet care assistance, and elder care accompaniment.' }
};

// Generate 12 unique, realistic Sri Lankan providers FOR EACH of the 18 categories (Total: 216 providers!)
export const generateAllProviders = (): Provider[] => {
  const providers: Provider[] = [];
  let globalId = 1;

  MOCK_CATEGORIES.forEach((cat) => {
    const meta = CATEGORY_TITLES[cat.name] || CATEGORY_TITLES['Other'];
    
    // Create 12 distinct providers per category so every category > 10 people
    for (let i = 1; i <= 12; i++) {
      const fName = FIRST_NAMES[(globalId + i * 3) % FIRST_NAMES.length];
      const lName = LAST_NAMES[(globalId + i * 7) % LAST_NAMES.length];
      const fullName = `${fName} ${lName}`;
      const businessName = `${fName} ${meta.businessSuffix}`;
      const cities = CITIES_LIST[(globalId + i) % CITIES_LIST.length];
      const avatar = AVATAR_POOL[(globalId + i) % AVATAR_POOL.length];
      
      const rating = Number((4.5 + ((globalId * 7 + i * 3) % 5) * 0.1).toFixed(1));
      const jobsCount = 30 + ((globalId * 13 + i * 19) % 250);
      const expYears = 3 + ((globalId + i * 2) % 15);
      const priceMin = 1200 + ((globalId * 11 + i * 100) % 1500);
      const priceMax = priceMin + 2000 + ((globalId * 17 + i * 200) % 4000);

      providers.push({
        id: globalId,
        userId: 100 + globalId,
        fullName,
        businessName,
        description: `${meta.desc} Serving ${cities.join(', ')} with over ${expYears} years of proven expertise. Guaranteed customer satisfaction.`,
        experienceYears: expYears,
        priceMin,
        priceMax,
        isVerified: true,
        verificationStatus: 'APPROVED',
        ratingAvg: rating > 5.0 ? 5.0 : rating,
        jobsCompletedCount: jobsCount,
        responseTimeMinutes: 10 + (i % 4) * 5,
        isAvailable: i % 10 !== 0,
        currentLatitude: 6.9271 + (i * 0.01) - 0.05,
        currentLongitude: 79.8612 + (i * 0.01) - 0.05,
        profileImage: avatar,
        phone: `+9477${Math.floor(1000000 + (globalId * 4321) % 8999999)}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}@lankaease.lk`,
        categories: [cat],
        serviceCities: cities,
      });

      globalId++;
    }
  });

  return providers;
};

export const MOCK_PROVIDERS: Provider[] = generateAllProviders();
