package com.lankaease.security;
import com.fasterxml.jackson.databind.*;
import com.lankaease.entity.*;
import com.lankaease.entity.enums.*;
import com.lankaease.marketplace.*;
import com.lankaease.repository.*;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mock.web.MockMultipartFile;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") @Transactional
class MarketplaceIntegrationTest {
 @Autowired MockMvc mvc; @Autowired ObjectMapper json; @Autowired UserRepository users;
 @Autowired ProviderProfileRepository providers; @Autowired ServiceCategoryRepository categories;
 @Autowired ServiceRequestRepository requests; @Autowired JwtTokenProvider jwt; @Autowired EntityManager em;
 @Autowired org.springframework.security.crypto.password.PasswordEncoder encoder;
 User worker,other,customer,admin; ProviderProfile provider; ServiceCategory category;
 User user(Role role){String id=UUID.randomUUID().toString();return users.save(new User("Marketplace test",id+"@example.com",id.substring(0,16),encoder.encode("test-only-password"),role));}
 String auth(User u){return "Bearer "+jwt.generateTokenFromUserId(u.getId(),u.getEmail(),u.getRole().name(),60000);}
 @BeforeEach void setup(){worker=user(Role.PROVIDER);other=user(Role.PROVIDER);customer=user(Role.CUSTOMER);admin=user(Role.ADMIN);
  category=new ServiceCategory();category.setName("Testing "+worker.getId());category.setSlug("testing-"+worker.getId());category=categories.save(category);
  provider=new ProviderProfile();provider.setUser(worker);provider.setBusinessName("Unique electrician "+worker.getId());provider.setDescription("Electrical repairs");provider.setIsAvailable(true);provider.getCategories().add(category);provider=providers.save(provider);
  var second=new ProviderProfile();second.setUser(other);providers.save(second);
 }
 Map<String,Object> profileBody(){var d=new LinkedHashMap<String,Object>();d.put("whatsapp","+94770000000");d.put("subcategory","Wiring");d.put("qualifications","Certified electrician");d.put("province","Western");d.put("district","Colombo");d.put("city","Dehiwala");d.put("portfolio",List.of());d.put("hours",List.of());d.put("blockedDates",List.of());d.put("emergency",false);d.put("availabilityStatus","AVAILABLE");
  return new LinkedHashMap<>(Map.of("fullName","Real worker","businessName",provider.getBusinessName(),"email",worker.getEmail(),"phone","+94770000000","description","Safe wiring and electrical service","experienceYears",7,"priceMin",1500,"priceMax",3000,"categoryIds",List.of(category.getId()),"serviceCities",List.of("Dehiwala","Colombo"))){{put("details",d);}};
 }
 Map<String,Object> serviceBody(){return Map.of("categoryId",category.getId(),"title","Socket repair","description","Repair one electrical socket","priceMin",1500,"priceMax",2500,"durationMinutes",60,"active",true);}
 JsonNode performProfile(Map<String,Object> body) throws Exception{return json.readTree(mvc.perform(put("/api/marketplace/me").header("Authorization",auth(worker)).contentType("application/json").content(json.writeValueAsString(body))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());}
 Long service() throws Exception{return json.readTree(mvc.perform(post("/api/marketplace/me/services").header("Authorization",auth(worker)).contentType("application/json").content(json.writeValueAsString(serviceBody()))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()).get("id").asLong();}
 ServiceRequest booking(){var r=new ServiceRequest();r.setRequestCode("TEST-"+UUID.randomUUID().toString().substring(0,12));r.setCustomer(customer);r.setProvider(provider);r.setCategory(category);r.setAddress("Test address");r.setProblemDescription("Test socket");return requests.saveAndFlush(r);}

 @Test void registrationCreatesPendingProviderWithoutElevatedRole() throws Exception{
  var body=Map.of("fullName","New professional","businessName","New business","email","new-"+UUID.randomUUID()+"@example.com","phone","077"+System.nanoTime()%10000000,"password","test-only-password");
  var response=json.readTree(mvc.perform(post("/api/auth/register/provider").contentType("application/json").content(json.writeValueAsString(body))).andExpect(status().isOk()).andExpect(jsonPath("$.user.role").value("PROVIDER")).andReturn().getResponse().getContentAsString());
  var p=providers.findByUserId(response.at("/user/id").asLong()).orElseThrow();assertEquals(VerificationStatus.PENDING,p.getVerificationStatus());assertFalse(p.getIsVerified());
 }
 @Test void profileAndSettingsSurviveDatabaseRoundTrip() throws Exception{
  performProfile(profileBody());Long id=provider.getId();em.flush();em.clear();var p=providers.findById(id).orElseThrow();assertEquals("Real worker",p.getUser().getFullName());assertEquals(2,p.getServiceAreas().size());
  mvc.perform(get("/api/marketplace/providers/"+id)).andExpect(status().isOk()).andExpect(jsonPath("$.details.city").value("Dehiwala")).andExpect(jsonPath("$.ratingAvg").value(0)).andExpect(jsonPath("$.jobsCompletedCount").value(0));
 }
 @Test void onlyProviderCanEditOwnProfileAndService() throws Exception{
  mvc.perform(put("/api/marketplace/me").header("Authorization",auth(customer)).contentType("application/json").content(json.writeValueAsString(profileBody()))).andExpect(status().isForbidden());
  Long id=service();mvc.perform(put("/api/marketplace/me/services/"+id).header("Authorization",auth(other)).contentType("application/json").content(json.writeValueAsString(serviceBody()))).andExpect(status().isForbidden());
  mvc.perform(delete("/api/marketplace/me/services/"+id).header("Authorization",auth(other))).andExpect(status().isForbidden());
 }
 @Test void serviceUpdateAndDeactivationPersist() throws Exception{
  Long id=service();var edit=new HashMap<>(serviceBody());edit.put("title","Updated socket service");edit.put("priceMin",1750);
  mvc.perform(put("/api/marketplace/me/services/"+id).header("Authorization",auth(worker)).contentType("application/json").content(json.writeValueAsString(edit))).andExpect(status().isOk());
  em.flush();em.clear();assertEquals("Updated socket service",em.find(ProviderOffering.class,id).getTitle());
  mvc.perform(delete("/api/marketplace/me/services/"+id).header("Authorization",auth(worker))).andExpect(status().isNoContent());em.flush();em.clear();assertFalse(em.find(ProviderOffering.class,id).getActive());
 }
 @Test void combinedSearchCategoryLocationPriceAndExperienceFilters() throws Exception{
  performProfile(profileBody());
  mvc.perform(get("/api/marketplace/providers").param("q","Unique electrician").param("categoryId",category.getId().toString()).param("province","Western").param("district","Colombo").param("city","Dehiwala").param("minPrice","1000").param("maxPrice","2000").param("experience","5").param("sort","price"))
   .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(1)).andExpect(jsonPath("$.categoryCounts."+category.getId()).value(1)).andExpect(jsonPath("$.locations[*].city").value(org.hamcrest.Matchers.hasItem("Colombo")));
  mvc.perform(get("/api/marketplace/providers").param("q","Unique electrician").param("city","Kandy")).andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(0));
 }
 @Test void blockedDateAndBusySettingsAffectAvailability() throws Exception{
  var body=profileBody();@SuppressWarnings("unchecked") var d=(Map<String,Object>)body.get("details");d.put("blockedDates",List.of(LocalDate.now(ZoneId.of("Asia/Colombo")).toString()));performProfile(body);
  mvc.perform(get("/api/marketplace/providers").param("q","Unique electrician").param("availableOnly","true")).andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(0));
  d.put("blockedDates",List.of());d.put("availabilityStatus","BUSY");performProfile(body);assertFalse(provider.getIsAvailable());
 }
 @Test void invertedPricesAndInvalidHoursRejected() throws Exception{
  var body=profileBody();body.put("priceMin",5000);mvc.perform(put("/api/marketplace/me").header("Authorization",auth(worker)).contentType("application/json").content(json.writeValueAsString(body))).andExpect(status().isBadRequest());
  body=profileBody();@SuppressWarnings("unchecked") var d=(Map<String,Object>)body.get("details");d.put("hours",List.of(Map.of("day","MONDAY","opens","18:00","closes","09:00")));
  mvc.perform(put("/api/marketplace/me").header("Authorization",auth(worker)).contentType("application/json").content(json.writeValueAsString(body))).andExpect(status().isBadRequest());
 }
 @Test void chosenServiceIsValidatedAndSnapshottedAtBooking() throws Exception{
  Long id=service();var body=Map.of("providerId",provider.getId(),"categoryId",category.getId(),"serviceId",id,"problemDescription","Broken socket","address","Test home");
  var saved=json.readTree(mvc.perform(post("/api/requests").header("Authorization",auth(customer)).contentType("application/json").content(json.writeValueAsString(body))).andExpect(status().isOk()).andExpect(jsonPath("$.serviceTitle").value("Socket repair")).andExpect(jsonPath("$.estimatedPrice").value(1500)).andReturn().getResponse().getContentAsString());
  em.flush();em.clear();mvc.perform(get("/api/requests/"+saved.get("id").asLong()).header("Authorization",auth(customer))).andExpect(status().isOk()).andExpect(jsonPath("$.serviceId").value(id));
  var invalid=new HashMap<String,Object>(body);invalid.put("providerId",providers.findByUserId(other.getId()).orElseThrow().getId());
  mvc.perform(post("/api/requests").header("Authorization",auth(customer)).contentType("application/json").content(json.writeValueAsString(invalid))).andExpect(status().isBadRequest());
 }
 @Test void assignedProviderCanAcceptAndRejectButOtherProviderCannot() throws Exception{
  var r=booking();String path="/api/requests/"+r.getId()+"/status";
  mvc.perform(patch(path).header("Authorization",auth(other)).contentType("application/json").content("{\"newStatus\":\"ACCEPTED\"}")).andExpect(status().isForbidden());
  mvc.perform(patch(path).header("Authorization",auth(worker)).contentType("application/json").content("{\"newStatus\":\"ACCEPTED\"}")).andExpect(status().isOk());
  mvc.perform(patch(path).header("Authorization",auth(worker)).contentType("application/json").content("{\"newStatus\":\"CANCELLED\"}")).andExpect(status().isOk());assertEquals(RequestStatus.CANCELLED,r.getStatus());
 }
 @Test void rescheduleRequiresAssignedProviderAndCustomerConsent() throws Exception{
  var r=booking();String path="/api/marketplace/bookings/"+r.getId()+"/reschedule";String body=json.writeValueAsString(Map.of("date",LocalDate.now().plusDays(2).toString(),"time","10:30"));
  mvc.perform(post(path).header("Authorization",auth(other)).contentType("application/json").content(body)).andExpect(status().isForbidden());
  mvc.perform(post(path).header("Authorization",auth(worker)).contentType("application/json").content(body)).andExpect(status().isOk());assertNull(r.getPreferredDate());
  mvc.perform(post(path+"/accept").header("Authorization",auth(customer))).andExpect(status().isOk());assertNotNull(r.getPreferredDate());assertNull(r.getProposedDate());
 }
 @Test void privateDocumentsAreNotPublicAndAdminApprovalPersists() throws Exception{
  var output=new java.io.ByteArrayOutputStream();javax.imageio.ImageIO.write(new java.awt.image.BufferedImage(2,2,java.awt.image.BufferedImage.TYPE_INT_RGB),"png",output);
  var uploaded=json.readTree(mvc.perform(multipart("/api/marketplace/media").file(new MockMultipartFile("file","doc.png","image/png",output.toByteArray())).param("purpose","VERIFICATION").header("Authorization",auth(worker))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());String path=uploaded.get("url").asText();
  mvc.perform(get(path)).andExpect(status().isForbidden());mvc.perform(get(path).header("Authorization",auth(other))).andExpect(status().isForbidden());mvc.perform(get(path).header("Authorization",auth(admin))).andExpect(status().isOk());
  var submitted=json.readTree(mvc.perform(post("/api/marketplace/me/verification").header("Authorization",auth(worker)).contentType("application/json").content(json.writeValueAsString(Map.of("idDocument",path)))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
  mvc.perform(patch("/api/marketplace/admin/verifications/"+submitted.get("id").asLong()).header("Authorization",auth(admin)).contentType("application/json").content("{\"status\":\"APPROVED\",\"notes\":\"Checked\"}")).andExpect(status().isOk());assertTrue(provider.getIsVerified());
  mvc.perform(patch("/api/admin/providers/"+provider.getId()+"/verify").param("status","APPROVED").header("Authorization",auth(admin))).andExpect(status().isOk()).andExpect(jsonPath("$.ratingAvg").value(0)).andExpect(jsonPath("$.jobsCompletedCount").value(0));
 }
 @Test void fakeImagesAndCrossAccountPhotoUrlsRejected() throws Exception{
  mvc.perform(multipart("/api/marketplace/media").file(new MockMultipartFile("file","fake.png","image/png","<script>bad</script>".getBytes())).param("purpose","PROFILE").header("Authorization",auth(worker))).andExpect(status().isBadRequest());
  var body=profileBody();body.put("profileImage","https://external.invalid/image.png");mvc.perform(put("/api/marketplace/me").header("Authorization",auth(worker)).contentType("application/json").content(json.writeValueAsString(body))).andExpect(status().isBadRequest());
 }
 @Test void conversationStartAndReadAreLimitedToParticipants() throws Exception{
  var conversation=json.readTree(mvc.perform(post("/api/conversations/start").param("providerUserId",worker.getId().toString()).header("Authorization",auth(customer))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());String path="/api/conversations/"+conversation.get("id").asLong()+"/messages";
  mvc.perform(post(path).header("Authorization",auth(customer)).contentType("application/json").content("{\"textContent\":\"Can you repair a socket?\"}")).andExpect(status().isOk());
  mvc.perform(get(path).header("Authorization",auth(other))).andExpect(status().isForbidden());mvc.perform(get(path).header("Authorization",auth(worker))).andExpect(status().isOk()).andExpect(jsonPath("$[0].textContent").value("Can you repair a socket?"));
 }
 @Test void suspensionHidesProviderAndAdminRoutesRejectCustomer() throws Exception{
  mvc.perform(get("/api/marketplace/admin/reports").header("Authorization",auth(customer))).andExpect(status().isForbidden());
  mvc.perform(patch("/api/marketplace/admin/providers/"+provider.getId()+"/suspension").param("suspended","true").header("Authorization",auth(admin))).andExpect(status().isOk());
  mvc.perform(get("/api/marketplace/providers/"+provider.getId())).andExpect(status().isNotFound());mvc.perform(get("/api/marketplace/me").header("Authorization",auth(worker))).andExpect(status().isUnauthorized());
 }
 @Test void noRecordedPaymentsMeansZeroEarnings() throws Exception{
  mvc.perform(get("/api/marketplace/me/performance").header("Authorization",auth(worker))).andExpect(status().isOk()).andExpect(jsonPath("$.earnings").value(0));
 }
 @Test void completionUsesActualFeesAndReviewModerationRecalculatesRatings() throws Exception{
  var r=booking();r.setStatus(RequestStatus.WORKING);requests.saveAndFlush(r);
  String path="/api/requests/"+r.getId()+"/status";
  mvc.perform(patch(path).header("Authorization",auth(worker)).contentType("application/json").content("{\"newStatus\":\"COMPLETED\"}")).andExpect(status().isBadRequest());
  mvc.perform(patch(path).header("Authorization",auth(worker)).contentType("application/json").content("{\"newStatus\":\"COMPLETED\",\"labourFee\":1500,\"partsFee\":300,\"finalPrice\":1}")).andExpect(status().isOk()).andExpect(jsonPath("$.finalPrice").value(2000));
  var review=json.readTree(mvc.perform(post("/api/reviews").header("Authorization",auth(customer)).contentType("application/json").content(json.writeValueAsString(Map.of("requestId",r.getId(),"rating",4,"reviewText","Good repair")))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
  mvc.perform(get("/api/marketplace/providers/"+provider.getId())).andExpect(status().isOk()).andExpect(jsonPath("$.ratingAvg").value(4)).andExpect(jsonPath("$.jobsCompletedCount").value(1));
  mvc.perform(post("/api/marketplace/providers/"+provider.getId()+"/reports").header("Authorization",auth(customer)).contentType("application/json").content(json.writeValueAsString(Map.of("reason","Please review this content","reviewId",review.get("id").asLong())))).andExpect(status().isOk());
  mvc.perform(patch("/api/marketplace/admin/reviews/"+review.get("id").asLong()).param("hidden","true").header("Authorization",auth(admin))).andExpect(status().isOk());
  mvc.perform(get("/api/marketplace/providers/"+provider.getId())).andExpect(status().isOk()).andExpect(jsonPath("$.ratingAvg").value(0)).andExpect(jsonPath("$.reviewCount").value(0)).andExpect(jsonPath("$.jobsCompletedCount").value(1));
 }
 @Test void earningsExcludePendingAndRefundedTransactions() throws Exception{
  var r=booking();
  for(var status:List.of(PaymentStatus.PAID,PaymentStatus.PENDING,PaymentStatus.REFUNDED)){
   var p=new Payment();p.setPaymentCode("PAY-"+UUID.randomUUID().toString().substring(0,12));p.setRequest(r);p.setCustomer(customer);p.setProvider(provider);p.setAmount(new BigDecimal("1234"));p.setPaymentMethod(PaymentMethod.CASH);p.setStatus(status);em.persist(p);
  }
  em.flush();mvc.perform(get("/api/marketplace/me/performance").header("Authorization",auth(worker))).andExpect(status().isOk()).andExpect(jsonPath("$.earnings").value(1234));
 }
 @Test void servicesMustFitWorkingHours() throws Exception{
  Long id=service();LocalDate date=LocalDate.now().plusDays(2);var body=profileBody();@SuppressWarnings("unchecked") var d=(Map<String,Object>)body.get("details");
  d.put("hours",List.of(Map.of("day",date.getDayOfWeek().name(),"opens","09:00","closes","10:00")));performProfile(body);
  var booking=Map.of("providerId",provider.getId(),"categoryId",category.getId(),"serviceId",id,"problemDescription","Socket repair","address","Test home","preferredDate",date.toString(),"preferredTime","09:30");
  mvc.perform(post("/api/requests").header("Authorization",auth(customer)).contentType("application/json").content(json.writeValueAsString(booking))).andExpect(status().isBadRequest());
 }
 @Test void repeatChatStartReusesConversationAndProvidersCannotImpersonateCustomer() throws Exception{
  var first=json.readTree(mvc.perform(post("/api/conversations/start").param("providerUserId",worker.getId().toString()).header("Authorization",auth(customer))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
  mvc.perform(post("/api/conversations/start").param("providerUserId",worker.getId().toString()).header("Authorization",auth(customer))).andExpect(status().isOk()).andExpect(jsonPath("$.id").value(first.get("id").asLong()));
  mvc.perform(post("/api/conversations/start").param("providerUserId",worker.getId().toString()).header("Authorization",auth(other))).andExpect(status().isForbidden());
 }
 @Test void draftsAreNotVisibleToAssignedProvider() throws Exception{
  var r=booking();r.setStatus(RequestStatus.DRAFT);requests.saveAndFlush(r);
  mvc.perform(get("/api/requests/"+r.getId()).header("Authorization",auth(worker))).andExpect(status().isForbidden());
  mvc.perform(get("/api/requests/provider").header("Authorization",auth(worker))).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(0));
 }
 @Test void adminCountsNewAndArrivedBookingsAsActive() throws Exception{
  long baseline=requests.countByStatus(RequestStatus.CREATED)+requests.countByStatus(RequestStatus.PROVIDER_FOUND)+requests.countByStatus(RequestStatus.ACCEPTED)+requests.countByStatus(RequestStatus.ON_THE_WAY)+requests.countByStatus(RequestStatus.ARRIVED)+requests.countByStatus(RequestStatus.WORKING);
  var r=booking();
  mvc.perform(get("/api/admin/stats").header("Authorization",auth(admin))).andExpect(status().isOk()).andExpect(jsonPath("$.activeRequests").value(baseline+1));
  r.setStatus(RequestStatus.ARRIVED);requests.saveAndFlush(r);
  mvc.perform(get("/api/admin/stats").header("Authorization",auth(admin))).andExpect(status().isOk()).andExpect(jsonPath("$.activeRequests").value(baseline+1));
  r.setStatus(RequestStatus.COMPLETED);requests.saveAndFlush(r);
  mvc.perform(get("/api/admin/stats").header("Authorization",auth(admin))).andExpect(status().isOk()).andExpect(jsonPath("$.activeRequests").value(baseline));
 }
}
