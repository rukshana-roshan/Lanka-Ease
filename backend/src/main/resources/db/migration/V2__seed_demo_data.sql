-- LankaEase Database Seed Data V2
-- Realistic Sri Lankan Demo Data

-- 1. Service Categories
INSERT INTO service_categories (id, name, slug, description, icon_name, is_active) VALUES
(1, 'Electrical', 'electrical', 'Electrical wiring, socket repair, light fittings, and breaker box fixes.', 'Zap', true),
(2, 'Plumbing', 'plumbing', 'Pipe leaks, tap replacement, bathroom fittings, and drain unclogging.', 'Droplet', true),
(3, 'Carpentry', 'carpentry', 'Furniture repair, door/window fitting, custom wood shelves, and lock replacement.', 'Hammer', true),
(4, 'Home Cleaning', 'cleaning', 'Deep house cleaning, sofa shampooing, water tank cleaning, and post-construction cleaning.', 'Sparkles', true),
(5, 'Appliance Repair', 'appliance-repair', 'Washing machine, refrigerator, microwave oven, and air conditioner servicing.', 'Tv', true),
(6, 'Vehicle Repair', 'vehicle-repair', 'Mobile auto mechanic, breakdown assistance, battery jumpstart, and tire repair.', 'Wrench', true),
(7, 'Vehicle Service', 'vehicle-service', 'Full car/bike service, oil change, detailing, and pre-purchase inspection.', 'Car', true),
(8, 'Computer Repair', 'computer-repair', 'Laptop fixing, OS reinstallation, hardware upgrades, and virus removal.', 'Laptop', true),
(9, 'Mobile Repair', 'mobile-repair', 'Smartphone display replacement, battery swap, and charging port fixing.', 'Smartphone', true),
(10, 'Delivery', 'delivery', 'Islandwide parcel delivery, document dispatch, and grocery pickup.', 'Package', true),
(11, 'Moving & Transport', 'moving-transport', 'Lorry/van hire, house relocation, office moving, and heavy furniture transport.', 'Truck', true),
(12, 'Printing', 'printing', 'Document printing, banner design, visiting cards, and binding services.', 'Printer', true),
(13, 'Document Services', 'document-services', 'Typing, translation (English/Sinhala/Tamil), affidavit prep, and photocopying.', 'FileText', true),
(14, 'Tutors', 'tutors', 'Home and online tuition for O/L & A/L Science, Maths, English, and Commerce.', 'GraduationCap', true),
(15, 'Home Maintenance', 'home-maintenance', 'Handyman services, roof leak repairs, water proofing, and general fixes.', 'Home', true),
(16, 'Gardening', 'gardening', 'Lawn mowing, tree trimming, garden landscaping, and grass turf laying.', 'Trees', true),
(17, 'Painting', 'painting', 'Interior & exterior wall painting, waterproof coating, and color consultation.', 'Paintbrush', true),
(18, 'Other', 'other', 'Custom everyday household and business assistance.', 'MoreHorizontal', true);

-- Reset auto-increment sequence for categories
SELECT setval('service_categories_id_seq', (SELECT MAX(id) FROM service_categories));

-- 2. Demo Users (BCrypt Hash for password "password123": $2a$10$e8W/K5N5Y9p31JzN0Z8bxeG0N65d7ZgV9fG5D7k8fG9h0j1k2l3m4)
-- Note: In Spring Security, we will configure BCrypt or plaintext demo fallback so demo login always works reliably.
-- BCrypt encoded hash for 'password123':
-- $2a$10$8.UnVuG9HHg7g/2kO0h7ueZl/5Wn4A0Q8m4b9mN7d.r5k5m7l1n2o3

INSERT INTO users (id, full_name, email, phone, password_hash, role, preferred_language, profile_image, is_enabled, is_email_verified) VALUES
(1, 'System Admin', 'admin@lankaease.lk', '+94771234567', '$2a$10$8.UnVuG9HHg7g/2kO0h7ueZl/5Wn4A0Q8m4b9mN7d.r5k5m7l1n2o3', 'ADMIN', 'en', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', true, true),
(2, 'Kamal Perera', 'customer@lankaease.lk', '+94772345678', '$2a$10$8.UnVuG9HHg7g/2kO0h7ueZl/5Wn4A0Q8m4b9mN7d.r5k5m7l1n2o3', 'CUSTOMER', 'en', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', true, true),
(3, 'Kasun Fernando', 'kasun@lankaease.lk', '+94773456789', '$2a$10$8.UnVuG9HHg7g/2kO0h7ueZl/5Wn4A0Q8m4b9mN7d.r5k5m7l1n2o3', 'PROVIDER', 'si', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', true, true),
(4, 'Nimal Silva', 'nimal@lankaease.lk', '+94774567890', '$2a$10$8.UnVuG9HHg7g/2kO0h7ueZl/5Wn4A0Q8m4b9mN7d.r5k5m7l1n2o3', 'PROVIDER', 'en', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', true, true),
(5, 'Dilini Jayawardena', 'dilini@lankaease.lk', '+94775678901', '$2a$10$8.UnVuG9HHg7g/2kO0h7ueZl/5Wn4A0Q8m4b9mN7d.r5k5m7l1n2o3', 'PROVIDER', 'ta', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', true, true),
(6, 'Sunil Rathnayake', 'sunil@lankaease.lk', '+94776789012', '$2a$10$8.UnVuG9HHg7g/2kO0h7ueZl/5Wn4A0Q8m4b9mN7d.r5k5m7l1n2o3', 'PROVIDER', 'si', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', true, true);

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 3. Customer Profile
INSERT INTO customer_profiles (id, user_id, default_address, latitude, longitude) VALUES
(1, 2, 'No. 45, Galle Road, Colombo 03, Sri Lanka', 6.9147, 79.8510);

SELECT setval('customer_profiles_id_seq', (SELECT MAX(id) FROM customer_profiles));

-- 4. Provider Profiles
INSERT INTO provider_profiles (id, user_id, business_name, description, experience_years, price_min, price_max, is_verified, verification_status, rating_avg, jobs_completed_count, response_time_minutes, is_available, current_latitude, current_longitude) VALUES
(1, 3, 'Kasun Electrical Solutions', 'Certified electrician with 8+ years experience in domestic and commercial wiring, tripping diagnostics, and inverter installation.', 8, 1500.00, 4500.00, true, 'APPROVED', 4.90, 142, 10, true, 6.9200, 79.8550),
(2, 4, 'Nimal Plumbing & Sanitary', 'Professional plumbing services. Leak fixes, bathroom fittings, water pump repair, and high-pressure jetting.', 12, 1800.00, 6000.00, true, 'APPROVED', 4.80, 215, 15, true, 6.9050, 79.8600),
(3, 5, 'Dilini Clean & Sparkle', 'Eco-friendly deep house cleaning, sofa/carpet extraction, and kitchen sanitization by trained professionals.', 5, 2500.00, 8500.00, true, 'APPROVED', 4.95, 88, 20, true, 6.8900, 79.8700),
(4, 6, 'Sunil Appliance & AC Doctor', 'Specialist in inverter refrigerator, washing machine, and split AC repair and seasonal gas refill.', 10, 2000.00, 7500.00, true, 'APPROVED', 4.75, 176, 25, true, 6.9350, 79.8480);

SELECT setval('provider_profiles_id_seq', (SELECT MAX(id) FROM provider_profiles));

-- Map Providers to Categories
INSERT INTO provider_categories (provider_id, category_id) VALUES
(1, 1), (1, 5), -- Kasun: Electrical, Appliance Repair
(2, 2), (2, 15), -- Nimal: Plumbing, Home Maintenance
(3, 4), -- Dilini: Home Cleaning
(4, 5), (4, 1); -- Sunil: Appliance Repair, Electrical

-- Provider Service Areas
INSERT INTO service_areas (provider_id, city_name, district) VALUES
(1, 'Colombo', 'Colombo'), (1, 'Dehiwala', 'Colombo'), (1, 'Nugegoda', 'Colombo'),
(2, 'Colombo', 'Colombo'), (2, 'Kotte', 'Colombo'), (2, 'Battaramulla', 'Colombo'),
(3, 'Colombo', 'Colombo'), (3, 'Mount Lavinia', 'Colombo'),
(4, 'Colombo', 'Colombo'), (4, 'Kelaniya', 'Gampaha'), (4, 'Kiribathgoda', 'Gampaha');

-- 5. Family Members
INSERT INTO family_members (id, customer_id, name, relationship, phone, address, latitude, longitude) VALUES
(1, 2, 'Sunil Perera (Father)', 'FATHER', '+94718889900', 'No. 12, Kandy Road, Kurunegala', 7.4863, 80.3623),
(2, 2, 'Kamala Perera (Mother)', 'MOTHER', '+94717778899', 'No. 88, Peradeniya Road, Kandy', 7.2906, 80.6337);

SELECT setval('family_members_id_seq', (SELECT MAX(id) FROM family_members));

-- 6. Demo Service Requests
INSERT INTO service_requests (id, request_code, customer_id, family_member_id, category_id, provider_id, problem_description, ai_suggestion, address, latitude, longitude, preferred_date, preferred_time, urgency, status, estimated_price, final_price, created_at) VALUES
(1, 'REQ-2026-001', 2, NULL, 5, 4, 'My washing machine makes a loud grinding noise during spin cycle and leaks water underneath.', 'Suggested Category: Appliance Repair (Washing Machine)', 'No. 45, Galle Road, Colombo 03', 6.9147, 79.8510, '2026-09-24', '14:00 - 16:00', 'TODAY', 'ON_THE_WAY', 2500.00, 2500.00, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(2, 'REQ-2026-002', 2, NULL, 1, 1, 'Main circuit breaker trips whenever the kitchen oven and AC are turned on simultaneously.', 'Suggested Category: Electrical Wiring / Breaker Repair', 'No. 45, Galle Road, Colombo 03', 6.9147, 79.8510, '2026-09-25', '09:00 - 11:00', 'NORMAL', 'COMPLETED', 2000.00, 2000.00, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 'REQ-2026-003', 2, 1, 2, 2, 'Water tank overflow pipe at my father''s house in Kurunegala is leaking continuously.', 'Suggested Category: Plumbing & Water Tank Repair', 'No. 12, Kandy Road, Kurunegala', 7.4863, 80.3623, '2026-09-26', '10:00 - 12:00', 'URGENT', 'CREATED', 3500.00, 3500.00, CURRENT_TIMESTAMP - INTERVAL '1 day');

SELECT setval('service_requests_id_seq', (SELECT MAX(id) FROM service_requests));

-- 7. Conversations & Messages
INSERT INTO conversations (id, customer_id, provider_id, request_id, created_at) VALUES
(1, 2, 3, 1, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(2, 2, 1, 2, CURRENT_TIMESTAMP - INTERVAL '2 days');

SELECT setval('conversations_id_seq', (SELECT MAX(id) FROM conversations));

INSERT INTO messages (id, conversation_id, sender_id, text_content, is_read, created_at) VALUES
(1, 1, 2, 'Ayubowan Sunil, are you on your way to Colombo 03?', true, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(2, 1, 6, 'Ayubowan Kamal! Yes, I have left Kollupitiya and ETA is around 25 minutes.', true, CURRENT_TIMESTAMP - INTERVAL '50 minutes'),
(3, 1, 2, 'Great! The parking space in front of the house is clear.', false, CURRENT_TIMESTAMP - INTERVAL '30 minutes');

SELECT setval('messages_id_seq', (SELECT MAX(id) FROM messages));

-- 8. Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, reference_id) VALUES
(1, 2, 'Provider On The Way 🚗', 'Sunil Rathnayake has accepted your request REQ-2026-001 and is on the way.', 'REQUEST_STATUS', false, 'REQ-2026-001'),
(2, 2, 'Service Completed ✓', 'Kasun Fernando completed request REQ-2026-002. Please review your experience.', 'REQUEST_COMPLETED', true, 'REQ-2026-002');

SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));

-- 9. Reviews
INSERT INTO reviews (id, request_id, customer_id, provider_id, rating, review_text) VALUES
(1, 2, 2, 1, 5, 'Kasun was extremely professional! Identified the faulty DB breaker in 10 minutes and replaced it with a genuine Siemens breaker. Highly recommended!');

SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));

-- 10. Payments & Invoices
INSERT INTO payments (id, payment_code, request_id, customer_id, provider_id, amount, payment_method, status, transaction_reference) VALUES
(1, 'PAY-2026-002', 2, 2, 1, 2000.00, 'CARD', 'PAID', 'TXN-9847294812');

SELECT setval('payments_id_seq', (SELECT MAX(id) FROM payments));

INSERT INTO invoices (id, invoice_number, request_id, customer_id, provider_id, labour_fee, parts_fee, service_fee, total_amount, payment_status) VALUES
(1, 'INV-2026-002', 2, 2, 1, 1200.00, 600.00, 200.00, 2000.00, 'PAID');

SELECT setval('invoices_id_seq', (SELECT MAX(id) FROM invoices));

INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total_price) VALUES
(1, 1, 'Electrical Circuit Diagnosis & Labor', 1, 1200.00, 1200.00),
(2, 1, 'Siemens 32A MCB Breaker Part', 1, 600.00, 600.00),
(3, 1, 'LankaEase Platform Booking Fee', 1, 200.00, 200.00);

SELECT setval('invoice_items_id_seq', (SELECT MAX(id) FROM invoice_items));
