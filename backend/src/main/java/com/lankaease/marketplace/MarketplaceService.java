package com.lankaease.marketplace;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.lankaease.entity.*;
import com.lankaease.entity.enums.*;
import com.lankaease.exception.*;
import com.lankaease.repository.*;
import com.lankaease.service.ProviderService;
import jakarta.persistence.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;
import java.math.*;
import java.time.*;
import java.util.*;
import static com.lankaease.marketplace.MarketplaceDtos.*;

@Service @Transactional
public class MarketplaceService {
    private static final Map<String,List<String>> LOCATIONS=Map.of(
        "Western",List.of("Colombo","Gampaha","Kalutara"),"Central",List.of("Kandy","Matale","Nuwara Eliya"),
        "Southern",List.of("Galle","Matara","Hambantota"),"Northern",List.of("Jaffna","Kilinochchi","Mannar","Mullaitivu","Vavuniya"),
        "Eastern",List.of("Trincomalee","Batticaloa","Ampara"),"North Western",List.of("Kurunegala","Puttalam"),
        "North Central",List.of("Anuradhapura","Polonnaruwa"),"Uva",List.of("Badulla","Monaragala"),"Sabaragamuwa",List.of("Ratnapura","Kegalle"));
    @PersistenceContext EntityManager em;
    final ProviderProfileRepository providers;
    final ServiceCategoryRepository categories;
    final ProviderService legacy;
    final ObjectMapper json;
    public MarketplaceService(ProviderProfileRepository providers, ServiceCategoryRepository categories,
                              ProviderService legacy, ObjectMapper json) {
        this.providers=providers; this.categories=categories; this.legacy=legacy; this.json=json;
    }
    public ProviderProfile own(Long userId) {
        return providers.findByUserId(userId).orElseThrow(()->new ResourceNotFoundException("Provider", "userId",userId));
    }
    public ProviderProfile provider(Long id) {
        var p=providers.findById(id).orElseThrow(()->new ResourceNotFoundException("Provider","id",id));
        if(!Boolean.TRUE.equals(p.getUser().getIsEnabled())||p.getUser().getRole()!=Role.PROVIDER) throw new ResourceNotFoundException("Provider","id",id);
        return p;
    }
    public List<Map<String,Object>> adminProviders(){return providers.findAll().stream().map(p->{var v=view(p,true);v.put("suspended",!Boolean.TRUE.equals(p.getUser().getIsEnabled()));return v;}).toList();}
    public Map<String,Object> suspend(Long id,boolean suspended){var p=providers.findById(id).orElseThrow(()->new ResourceNotFoundException("Provider","id",id));if(p.getUser().getRole()==Role.ADMIN)throw new BadRequestException("Administrator accounts cannot be suspended through provider management");p.getUser().setIsEnabled(!suspended);return Map.of("id",id,"suspended",suspended);}
    public Map<String,Object> setStatus(Long userId,String status){
        if(!Set.of("AVAILABLE","BUSY","OFFLINE").contains(status))throw new BadRequestException("Choose available, busy or offline");
        var p=own(userId);var d=details(p);var row=detailsRow(p,true);row.availabilityStatus=status;p.setIsAvailable(status.equals("AVAILABLE"));
        var changed=new Details(d.whatsapp(),d.subcategory(),d.qualifications(),d.province(),d.district(),d.city(),d.portfolio(),d.hours(),d.blockedDates(),d.emergency(),status);
        try{row.configurationJson=json.writeValueAsString(changed);}catch(Exception e){throw new BadRequestException("Invalid availability");}return view(p,true);
    }
    ProviderDetails detailsRow(ProviderProfile p, boolean create) {
        var rows=em.createQuery("from ProviderDetails d where d.provider.id=:id",ProviderDetails.class).setParameter("id",p.getId()).getResultList();
        if(!rows.isEmpty()) return rows.getFirst();
        if(!create)return null;
        var row=new ProviderDetails();row.provider=p;em.persist(row);return row;
    }
    public Details details(ProviderProfile p) {
        var row=detailsRow(p,false);
        if(row==null){var d=Details.empty();return new Details(d.whatsapp(),d.subcategory(),d.qualifications(),d.province(),d.district(),d.city(),d.portfolio(),d.hours(),d.blockedDates(),d.emergency(),Boolean.TRUE.equals(p.getIsAvailable())?"AVAILABLE":"OFFLINE");}
        try{return json.readValue(row.configurationJson,Details.class);}catch(Exception e){throw new IllegalStateException("Invalid stored provider configuration");}
    }
    public boolean availableOn(ProviderProfile p, LocalDate date) {
        var d=details(p);
        return Boolean.TRUE.equals(p.getIsAvailable()) && !"BUSY".equals(d.availabilityStatus()) && !"OFFLINE".equals(d.availabilityStatus())
            && (d.blockedDates()==null || !d.blockedDates().contains(date))
            && (d.hours()==null || d.hours().isEmpty() || d.hours().stream().anyMatch(h->h.day()==date.getDayOfWeek()));
    }
    public void validateAppointment(ProviderProfile p,LocalDate date,String time,int duration,boolean emergency){
        if(date==null||date.isBefore(LocalDate.now(ZoneId.of("Asia/Colombo"))))throw new BadRequestException("Choose today or a future date in Sri Lanka");
        var d=details(p);
        if(emergency&&!d.emergency())throw new BadRequestException("This provider does not accept emergency requests");
        boolean base=Boolean.TRUE.equals(p.getIsAvailable())&&!"BUSY".equals(d.availabilityStatus())&&!"OFFLINE".equals(d.availabilityStatus())&&(d.blockedDates()==null||!d.blockedDates().contains(date));
        if(!base||(!emergency&&!availableOn(p,date)))throw new BadRequestException("The provider is unavailable on that date");
        if(time==null||time.length()<5)throw new BadRequestException("Choose an appointment time");
        LocalTime start;try{start=LocalTime.parse(time.substring(0,5));}catch(Exception e){throw new BadRequestException("Choose a valid appointment time");}
        if(!emergency&&d.hours()!=null&&!d.hours().isEmpty()){
            var hours=d.hours().stream().filter(h->h.day()==date.getDayOfWeek()).findFirst().orElseThrow(()->new BadRequestException("Choose a working day"));
            if(start.isBefore(hours.opens())||!start.isBefore(hours.closes())||duration>java.time.Duration.between(start,hours.closes()).toMinutes())throw new BadRequestException("Choose a time within the provider's working hours");
        }
    }
    public List<ProviderOffering> offerings(ProviderProfile p, boolean all) {
        return em.createQuery("from ProviderOffering s where s.provider.id=:id"+(all?"":" and s.active=true and s.category.isActive=true")+" order by s.id",ProviderOffering.class).setParameter("id",p.getId()).getResultList();
    }
    public Map<String,Object> offeringView(ProviderOffering s) {
        return Map.of("id",s.getId(),"categoryId",s.getCategory().getId(),"categoryName",s.getCategory().getName(),"title",s.getTitle(),
            "description",s.getDescription(),"priceMin",s.getPriceMin(),"priceMax",s.getPriceMax(),"durationMinutes",s.getDurationMinutes(),"active",s.getActive());
    }
    public Map<String,Object> view(ProviderProfile p, boolean owner) {
        Map<String,Object> result=json.convertValue(legacy.getProviderById(p.getId()),new TypeReference<LinkedHashMap<String,Object>>(){});
        Long reviews=em.createQuery("select count(r) from Review r where r.provider.id=:id and r.hidden=false",Long.class).setParameter("id",p.getId()).getSingleResult();
        result.put("reviewCount",reviews);
        result.put("isVerified",p.getVerificationStatus()==VerificationStatus.APPROVED && Boolean.TRUE.equals(p.getIsVerified()));
        result.put("isAvailable",availableOn(p,LocalDate.now(ZoneId.of("Asia/Colombo"))));
        result.put("details",details(p));result.put("services",offerings(p,owner).stream().map(this::offeringView).toList());
        result.put("createdAt",p.getCreatedAt());
        return result;
    }
    public Map<String,Object> saveProfile(Long userId, ProfileUpdate body) {
        var p=own(userId);em.lock(p,LockModeType.PESSIMISTIC_WRITE);
        if(body.priceMax().compareTo(body.priceMin())<0)throw new BadRequestException("Maximum price must be at least the starting price");
        var selected=categories.findAllById(body.categoryIds());
        if(selected.size()!=new HashSet<>(body.categoryIds()).size() || selected.stream().anyMatch(c->!Boolean.TRUE.equals(c.getIsActive())))throw new BadRequestException("Choose active service categories");
        var d=body.details();
        if(d.province()==null||d.province().isBlank()||d.district()==null||d.district().isBlank()||d.city()==null||d.city().isBlank())throw new BadRequestException("Province, district and city are required");
        if(!LOCATIONS.getOrDefault(d.province(),List.of()).contains(d.district()))throw new BadRequestException("Choose a Sri Lankan district in the selected province");
        if(d.hours()!=null){
            var days=new HashSet<DayOfWeek>();
            for(var h:d.hours())if(!days.add(h.day())||!h.closes().isAfter(h.opens()))throw new BadRequestException("Use one opening interval per day, with closing time after opening time");
        }
        if(!Objects.equals(body.profileImage(),p.getUser().getProfileImage()))validateMedia(body.profileImage(),userId,"PROFILE");
        if(d.portfolio()!=null)for(String url:d.portfolio())validateMedia(url,userId,"PORTFOLIO");
        String email=body.email().trim().toLowerCase(Locale.ROOT);
        Long conflicts=em.createQuery("select count(u) from User u where u.id<>:id and (lower(u.email)=:email or u.phone=:phone)",Long.class)
            .setParameter("id",userId).setParameter("email",email).setParameter("phone",body.phone()).getSingleResult();
        if(conflicts>0)throw new BadRequestException("Email or phone is already in use");
        var u=p.getUser();u.setFullName(body.fullName().trim());if(!email.equalsIgnoreCase(u.getEmail()))u.setIsEmailVerified(false);u.setEmail(email);u.setPhone(body.phone());u.setProfileImage(body.profileImage());
        p.setBusinessName(body.businessName().trim());p.setDescription(body.description());p.setExperienceYears(body.experienceYears()==null?0:body.experienceYears());
        p.setPriceMin(body.priceMin());p.setPriceMax(body.priceMax());p.setCategories(new HashSet<>(selected));
        for(var service:offerings(p,false))p.getCategories().add(service.getCategory());
        p.getServiceAreas().clear();
        for(String city:new LinkedHashSet<>(body.serviceCities()))p.getServiceAreas().add(new ServiceArea(p,city.trim(),city.trim().equalsIgnoreCase(d.city())?d.district():""));
        var row=detailsRow(p,true);row.province=d.province();row.district=d.district();row.city=d.city();row.subcategory=d.subcategory();row.availabilityStatus=d.availabilityStatus()==null?"AVAILABLE":d.availabilityStatus();
        p.setIsAvailable(row.availabilityStatus.equals("AVAILABLE"));
        try{row.configurationJson=json.writeValueAsString(d);}catch(Exception e){throw new BadRequestException("Invalid provider settings");}
        em.flush();reprice(p);return view(p,true);
    }
    public void validateMedia(String url, Long owner, String purpose) {
        if(url==null||url.isBlank())return;
        String prefix="/api/marketplace/media/";
        if(!url.startsWith(prefix))throw new BadRequestException("Upload media using the marketplace image uploader");
        var file=em.find(MarketplaceMedia.class,url.substring(prefix.length()));
        if(file==null||!file.owner.getId().equals(owner)||!purpose.equals(file.purpose))throw new AccessDeniedException("This upload does not belong to your account or image type");
    }
    public Map<String,Object> saveOffering(Long userId, Long id, Offering body) {
        var p=own(userId);var s=id==null?new ProviderOffering():em.find(ProviderOffering.class,id);
        if(s==null)throw new ResourceNotFoundException("Service","id",id);
        if(s.getProvider()!=null&&!s.getProvider().getId().equals(p.getId()))throw new AccessDeniedException("This service belongs to another provider");
        if(body.priceMax().compareTo(body.priceMin())<0)throw new BadRequestException("Price range is invalid");
        var cat=categories.findById(body.categoryId()).orElseThrow(()->new ResourceNotFoundException("Category","id",body.categoryId()));
        if(!Boolean.TRUE.equals(cat.getIsActive()))throw new BadRequestException("Choose an active category");
        s.setProvider(p);s.setCategory(cat);s.setTitle(body.title());s.setDescription(body.description());s.setPriceMin(body.priceMin());s.setPriceMax(body.priceMax());s.setDurationMinutes(body.durationMinutes());s.setActive(body.active());
        if(id==null)em.persist(s);
        p.getCategories().add(cat);em.flush();reprice(p);return offeringView(s);
    }
    void reprice(ProviderProfile p){var active=offerings(p,false);if(!active.isEmpty()){
        p.setPriceMin(active.stream().map(s->s.getPriceMin()).min(BigDecimal::compareTo).orElseThrow());
        p.setPriceMax(active.stream().map(s->s.getPriceMax()).max(BigDecimal::compareTo).orElseThrow());}}
    public void deactivate(Long userId, Long id){var s=em.find(ProviderOffering.class,id);if(s==null)throw new ResourceNotFoundException("Service","id",id);
        if(!s.getProvider().getUser().getId().equals(userId))throw new AccessDeniedException("This service belongs to another provider");s.setActive(false);em.flush();reprice(s.getProvider());}

    public Map<String,Object> directory(String q,Long category,String province,String district,String city,boolean verified,boolean available,
        BigDecimal minPrice,BigDecimal maxPrice,double minRating,int experience,String sort,int page,int size){
        if(page<0||size<1||size>48||!Double.isFinite(minRating)||minRating<0||minRating>5||experience<0||(q!=null&&q.length()>150)||
            (minPrice!=null&&minPrice.signum()<0)||(maxPrice!=null&&maxPrice.signum()<0)||
            (minPrice!=null&&maxPrice!=null&&minPrice.compareTo(maxPrice)>0))throw new BadRequestException("Invalid directory filters");
        var sql=new StringBuilder("select p from ProviderProfile p where p.user.isEnabled=true and p.user.role=com.lankaease.entity.enums.Role.PROVIDER");
        var params=new HashMap<String,Object>();
        if(q!=null&&!q.isBlank()){
            sql.append(" and (lower(p.businessName) like :q or lower(p.user.fullName) like :q or lower(p.description) like :q or exists(select c.id from ProviderProfile p2 join p2.categories c where p2.id=p.id and lower(c.name) like :q) or exists(select a.id from ServiceArea a where a.provider=p and (lower(a.cityName) like :q or lower(a.district) like :q)) or exists(select d.id from ProviderDetails d where d.provider=p and (lower(d.city) like :q or lower(d.district) like :q or lower(d.subcategory) like :q)) or exists(select s.id from ProviderOffering s where s.provider=p and s.active=true and lower(s.title) like :q))");params.put("q","%"+q.toLowerCase(Locale.ROOT).trim()+"%");}
        for(var entry:Map.of("province",Objects.toString(province,""),"district",Objects.toString(district,""),"city",Objects.toString(city,"")).entrySet())if(!entry.getValue().isBlank()){
            sql.append(" and (exists(select d.id from ProviderDetails d where d.provider=p and lower(d.").append(entry.getKey()).append(")=:").append(entry.getKey());
            sql.append(")");if(entry.getKey().equals("city")||entry.getKey().equals("district"))sql.append(" or exists(select a.id from ServiceArea a where a.provider=p and lower(a.").append(entry.getKey().equals("city")?"cityName":"district").append(")=:").append(entry.getKey()).append(")");sql.append(")");params.put(entry.getKey(),entry.getValue().toLowerCase(Locale.ROOT));}
        if(verified)sql.append(" and p.isVerified=true and p.verificationStatus=com.lankaease.entity.enums.VerificationStatus.APPROVED");
        if(minPrice!=null){sql.append(" and p.priceMin>=:minPrice");params.put("minPrice",minPrice);}
        if(maxPrice!=null){sql.append(" and p.priceMin<=:maxPrice");params.put("maxPrice",maxPrice);}
        sql.append(" and p.experienceYears>=:experience");params.put("experience",experience);
        if(minRating>0){sql.append(" and (select avg(r.rating) from Review r where r.provider=p and r.hidden=false)>=:minRating");params.put("minRating",minRating);}
        var query=em.createQuery(sql.toString(),ProviderProfile.class);params.forEach(query::setParameter);
        var candidates=query.getResultList().stream().filter(p->!available||availableOn(p,LocalDate.now(ZoneId.of("Asia/Colombo")))) .toList();
        var counts=new HashMap<Long,Long>();for(var p:candidates)for(var cat:p.getCategories())counts.merge(cat.getId(),1L,Long::sum);
        var rows=new ArrayList<>(candidates.stream().filter(p->category==null||p.getCategories().stream().anyMatch(c->c.getId().equals(category))).map(p->view(p,false)).toList());
        Comparator<Map<String,Object>> order=switch(Objects.toString(sort,"rating")){
            case "price" -> Comparator.comparing(m->new BigDecimal(m.get("priceMin").toString()));
            case "experience" -> Comparator.<Map<String,Object>>comparingInt(m->((Number)m.get("experienceYears")).intValue()).reversed();
            case "newest" -> Comparator.<Map<String,Object>,String>comparing(m->m.get("createdAt").toString()).reversed();
            case "rating" -> Comparator.<Map<String,Object>>comparingDouble(m->((Number)m.get("ratingAvg")).doubleValue()).reversed();
            default -> throw new BadRequestException("Choose rating, price, experience or newest sorting");};
        rows.sort(order.thenComparing(m->((Number)m.get("id")).longValue()));
        long offset=(long)page*size;int from=(int)Math.min(offset,rows.size());
        var locations=em.createQuery("from ProviderDetails",ProviderDetails.class).getResultList();
        var locationRows=new ArrayList<>(locations.stream().map(d->Map.of("province",Objects.toString(d.province,""),"district",Objects.toString(d.district,""),"city",Objects.toString(d.city,""))).toList());
        for(var area:em.createQuery("from ServiceArea a where a.provider.user.isEnabled=true",ServiceArea.class).getResultList())locationRows.add(Map.of("province","","district",Objects.toString(area.getDistrict(),""),"city",area.getCityName()));
        var locationsView=locationRows.stream().distinct().toList();
        return Map.of("content",rows.subList(from,Math.min(from+size,rows.size())),"totalElements",rows.size(),"totalPages",(rows.size()+size-1)/size,
            "categoryCounts",counts,"allCount",candidates.size(),"locations",locationsView,"page",page);
    }
    public Map<String,Object> performance(Long userId){var p=own(userId);var stats=new LinkedHashMap<String,Object>();
        stats.put("totalBookings",em.createQuery("select count(r) from ServiceRequest r where r.provider.id=:id and r.status<>com.lankaease.entity.enums.RequestStatus.DRAFT",Long.class).setParameter("id",p.getId()).getSingleResult());
        stats.put("pendingRequests",em.createQuery("select count(r) from ServiceRequest r where r.provider.id=:id and r.status in (com.lankaease.entity.enums.RequestStatus.CREATED,com.lankaease.entity.enums.RequestStatus.PROVIDER_FOUND)",Long.class).setParameter("id",p.getId()).getSingleResult());
        stats.put("earnings",Optional.ofNullable(em.createQuery("select sum(p.amount) from Payment p where p.provider.id=:id and p.status=com.lankaease.entity.enums.PaymentStatus.PAID",BigDecimal.class).setParameter("id",p.getId()).getSingleResult()).orElse(BigDecimal.ZERO));
        var v=view(p,true);stats.put("completedJobs",v.get("jobsCompletedCount"));stats.put("averageRating",v.get("ratingAvg"));stats.put("reviewCount",v.get("reviewCount"));return stats;}
}
