package com.lankaease.config;

import com.lankaease.entity.*;
import com.lankaease.entity.enums.Role;
import com.lankaease.entity.enums.VerificationStatus;
import com.lankaease.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

@Component
@org.springframework.context.annotation.Profile("dev & !prod")
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ServiceCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(ServiceCategoryRepository categoryRepository,
                           UserRepository userRepository,
                           CustomerProfileRepository customerProfileRepository,
                           ProviderProfileRepository providerProfileRepository,
                           PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }

        log.info("Seeding initial LankaEase demo data into database...");

        // 1. Categories
        List<ServiceCategory> categories = List.of(
            new ServiceCategory("Electrical", "electrical", "Electrical wiring, socket repair, light fittings, and breaker box fixes.", "Zap"),
            new ServiceCategory("Plumbing", "plumbing", "Pipe leaks, tap replacement, bathroom fittings, and drain unclogging.", "Droplet"),
            new ServiceCategory("Carpentry", "carpentry", "Furniture repair, door/window fitting, custom wood shelves, and lock replacement.", "Hammer"),
            new ServiceCategory("Home Cleaning", "cleaning", "Deep house cleaning, sofa shampooing, water tank cleaning, and post-construction cleaning.", "Sparkles"),
            new ServiceCategory("Appliance Repair", "appliance-repair", "Washing machine, refrigerator, microwave oven, and air conditioner servicing.", "Tv"),
            new ServiceCategory("Vehicle Repair", "vehicle-repair", "Mobile auto mechanic, breakdown assistance, battery jumpstart, and tire repair.", "Wrench"),
            new ServiceCategory("Vehicle Service", "vehicle-service", "Full car/bike service, oil change, detailing, and pre-purchase inspection.", "Car"),
            new ServiceCategory("Computer Repair", "computer-repair", "Laptop fixing, OS reinstallation, hardware upgrades, and virus removal.", "Laptop"),
            new ServiceCategory("Mobile Repair", "mobile-repair", "Smartphone display replacement, battery swap, and charging port fixing.", "Smartphone"),
            new ServiceCategory("Delivery", "delivery", "Islandwide parcel delivery, document dispatch, and grocery pickup.", "Package"),
            new ServiceCategory("Moving & Transport", "moving-transport", "Lorry/van hire, house relocation, office moving, and heavy furniture transport.", "Truck"),
            new ServiceCategory("Printing", "printing", "Document printing, banner design, visiting cards, and binding services.", "Printer"),
            new ServiceCategory("Document Services", "document-services", "Typing, translation (English/Sinhala/Tamil), affidavit prep, and photocopying.", "FileText"),
            new ServiceCategory("Tutors", "tutors", "Home and online tuition for O/L & A/L Science, Maths, English, and Commerce.", "GraduationCap"),
            new ServiceCategory("Home Maintenance", "home-maintenance", "Handyman services, roof leak repairs, water proofing, and general fixes.", "Home"),
            new ServiceCategory("Gardening", "gardening", "Lawn mowing, tree trimming, garden landscaping, and grass turf laying.", "Trees"),
            new ServiceCategory("Painting", "painting", "Interior & exterior wall painting, waterproof coating, and color consultation.", "Paintbrush"),
            new ServiceCategory("Other", "other", "Custom everyday household and business assistance.", "MoreHorizontal")
        );
        categoryRepository.saveAll(categories);

        Map<String, ServiceCategory> catMap = new HashMap<>();
        for (ServiceCategory sc : categoryRepository.findAll()) {
            catMap.put(sc.getSlug(), sc);
        }

        String encodedPassword = passwordEncoder.encode("password123");

        // 3. Customer User
        User customer = new User("Kamal Perera", "customer@lankaease.lk", "+94772345678", encodedPassword, Role.CUSTOMER);
        customer.setProfileImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200");
        customer.setIsEmailVerified(true);
        customer = userRepository.save(customer);

        CustomerProfile cp = new CustomerProfile(customer, "No. 45, Galle Road, Colombo 03, Sri Lanka", 6.9147, 79.8510);
        customerProfileRepository.save(cp);

        // 4. Provider Users & Profiles
        User kasun = new User("Kasun Fernando", "kasun@lankaease.lk", "+94773456789", encodedPassword, Role.PROVIDER);
        kasun.setPreferredLanguage("si");
        kasun.setProfileImage("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200");
        kasun.setIsEmailVerified(true);
        kasun = userRepository.save(kasun);

        ProviderProfile p1 = new ProviderProfile();
        p1.setUser(kasun);
        p1.setBusinessName("Kasun Electrical Solutions");
        p1.setDescription("Certified electrician with 8+ years experience in domestic and commercial wiring, tripping diagnostics, and inverter installation.");
        p1.setExperienceYears(8);
        p1.setPriceMin(new BigDecimal("1500.00"));
        p1.setPriceMax(new BigDecimal("4500.00"));
        p1.setIsVerified(true);
        p1.setVerificationStatus(VerificationStatus.APPROVED);
        p1.setRatingAvg(new BigDecimal("4.90"));
        p1.setJobsCompletedCount(142);
        p1.setResponseTimeMinutes(10);
        p1.setIsAvailable(true);
        p1.setCurrentLatitude(6.9200);
        p1.setCurrentLongitude(79.8550);
        if (catMap.containsKey("electrical")) p1.getCategories().add(catMap.get("electrical"));
        providerProfileRepository.save(p1);

        User nimal = new User("Nimal Silva", "nimal@lankaease.lk", "+94774567890", encodedPassword, Role.PROVIDER);
        nimal.setPreferredLanguage("en");
        nimal.setProfileImage("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200");
        nimal.setIsEmailVerified(true);
        nimal = userRepository.save(nimal);

        ProviderProfile p2 = new ProviderProfile();
        p2.setUser(nimal);
        p2.setBusinessName("Nimal Plumbing & Sanitary");
        p2.setDescription("Professional plumbing services. Leak fixes, bathroom fittings, water pump repair, and high-pressure jetting.");
        p2.setExperienceYears(12);
        p2.setPriceMin(new BigDecimal("1800.00"));
        p2.setPriceMax(new BigDecimal("6000.00"));
        p2.setIsVerified(true);
        p2.setVerificationStatus(VerificationStatus.APPROVED);
        p2.setRatingAvg(new BigDecimal("4.80"));
        p2.setJobsCompletedCount(215);
        p2.setResponseTimeMinutes(15);
        p2.setIsAvailable(true);
        p2.setCurrentLatitude(6.9050);
        p2.setCurrentLongitude(79.8600);
        if (catMap.containsKey("plumbing")) p2.getCategories().add(catMap.get("plumbing"));
        providerProfileRepository.save(p2);

        User dilini = new User("Dilini Jayawardena", "dilini@lankaease.lk", "+94775678901", encodedPassword, Role.PROVIDER);
        dilini.setPreferredLanguage("ta");
        dilini.setProfileImage("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200");
        dilini.setIsEmailVerified(true);
        dilini = userRepository.save(dilini);

        ProviderProfile p3 = new ProviderProfile();
        p3.setUser(dilini);
        p3.setBusinessName("Dilini Clean & Sparkle");
        p3.setDescription("Eco-friendly deep house cleaning, sofa/carpet extraction, and kitchen sanitization by trained professionals.");
        p3.setExperienceYears(5);
        p3.setPriceMin(new BigDecimal("2500.00"));
        p3.setPriceMax(new BigDecimal("8500.00"));
        p3.setIsVerified(true);
        p3.setVerificationStatus(VerificationStatus.APPROVED);
        p3.setRatingAvg(new BigDecimal("4.95"));
        p3.setJobsCompletedCount(88);
        p3.setResponseTimeMinutes(20);
        p3.setIsAvailable(true);
        p3.setCurrentLatitude(6.8900);
        p3.setCurrentLongitude(79.8700);
        if (catMap.containsKey("cleaning")) p3.getCategories().add(catMap.get("cleaning"));
        providerProfileRepository.save(p3);

        User sunil = new User("Sunil Rathnayake", "sunil@lankaease.lk", "+94776789012", encodedPassword, Role.PROVIDER);
        sunil.setPreferredLanguage("si");
        sunil.setProfileImage("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200");
        sunil.setIsEmailVerified(true);
        sunil = userRepository.save(sunil);

        ProviderProfile p4 = new ProviderProfile();
        p4.setUser(sunil);
        p4.setBusinessName("Sunil Appliance & AC Doctor");
        p4.setDescription("Specialist in inverter refrigerator, washing machine, and split AC repair and seasonal gas refill.");
        p4.setExperienceYears(10);
        p4.setPriceMin(new BigDecimal("2000.00"));
        p4.setPriceMax(new BigDecimal("7500.00"));
        p4.setIsVerified(true);
        p4.setVerificationStatus(VerificationStatus.APPROVED);
        p4.setRatingAvg(new BigDecimal("4.75"));
        p4.setJobsCompletedCount(176);
        p4.setResponseTimeMinutes(25);
        p4.setIsAvailable(true);
        p4.setCurrentLatitude(6.9350);
        p4.setCurrentLongitude(79.8480);
        if (catMap.containsKey("appliance-repair")) p4.getCategories().add(catMap.get("appliance-repair"));
        providerProfileRepository.save(p4);

        log.info("LankaEase demo data seeded successfully with {} categories and 4 providers!", categories.size());
    }
}
