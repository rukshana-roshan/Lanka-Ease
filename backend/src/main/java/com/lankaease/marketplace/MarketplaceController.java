package com.lankaease.marketplace;

import com.lankaease.entity.*;
import com.lankaease.entity.enums.*;
import com.lankaease.security.UserPrincipal;
import com.lankaease.exception.*;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.*;
import org.springframework.transaction.annotation.Transactional;
import javax.imageio.ImageIO;
import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import static com.lankaease.marketplace.MarketplaceDtos.*;

@RestController @RequestMapping("/api/marketplace") @Transactional
public class MarketplaceController {
    final MarketplaceService service;
    @PersistenceContext EntityManager em;
    public MarketplaceController(MarketplaceService service){this.service=service;}
    @GetMapping("/providers")
    public Map<String,Object> search(@RequestParam(required=false) String q,@RequestParam(required=false) Long categoryId,
        @RequestParam(required=false) String province,@RequestParam(required=false) String district,@RequestParam(required=false) String city,
        @RequestParam(defaultValue="false") boolean verifiedOnly,@RequestParam(defaultValue="false") boolean availableOnly,
        @RequestParam(required=false) BigDecimal minPrice,@RequestParam(required=false) BigDecimal maxPrice,
        @RequestParam(defaultValue="0") double minRating,@RequestParam(defaultValue="0") int experience,
        @RequestParam(defaultValue="rating") String sort,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="12") int size){
        return service.directory(q,categoryId,province,district,city,verifiedOnly,availableOnly,minPrice,maxPrice,minRating,experience,sort,page,size);
    }
    @GetMapping("/providers/{id}") public Map<String,Object> profile(@PathVariable Long id){return service.view(service.provider(id),false);}
    @GetMapping("/me") @PreAuthorize("hasRole('PROVIDER')")
    public Map<String,Object> mine(@AuthenticationPrincipal UserPrincipal user){return service.view(service.own(user.getId()),true);}
    @PatchMapping("/me/availability") @PreAuthorize("hasRole('PROVIDER')")
    public Map<String,Object> availability(@AuthenticationPrincipal UserPrincipal user,@RequestParam String status){return service.setStatus(user.getId(),status);}
    @PutMapping("/me") @PreAuthorize("hasRole('PROVIDER')")
    public Map<String,Object> save(@AuthenticationPrincipal UserPrincipal user,@Valid @RequestBody ProfileUpdate body){return service.saveProfile(user.getId(),body);}
    @PatchMapping("/me/photo") @PreAuthorize("hasRole('PROVIDER')")
    public Map<String,String> photo(@AuthenticationPrincipal UserPrincipal user,@RequestBody Map<String,String> body){String url=body.get("url");service.validateMedia(url,user.getId(),"PROFILE");service.own(user.getId()).getUser().setProfileImage(url);return Map.of("url",Objects.toString(url,""));}
    @GetMapping("/me/performance") @PreAuthorize("hasRole('PROVIDER')")
    public Map<String,Object> performance(@AuthenticationPrincipal UserPrincipal user){return service.performance(user.getId());}
    @PostMapping("/me/services") @PreAuthorize("hasRole('PROVIDER')")
    public Map<String,Object> add(@AuthenticationPrincipal UserPrincipal user,@Valid @RequestBody Offering body){return service.saveOffering(user.getId(),null,body);}
    @PutMapping("/me/services/{id}") @PreAuthorize("hasRole('PROVIDER')")
    public Map<String,Object> update(@AuthenticationPrincipal UserPrincipal user,@PathVariable Long id,@Valid @RequestBody Offering body){return service.saveOffering(user.getId(),id,body);}
    @DeleteMapping("/me/services/{id}") @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Void> deactivate(@AuthenticationPrincipal UserPrincipal user,@PathVariable Long id){service.deactivate(user.getId(),id);return ResponseEntity.noContent().build();}

    @PostMapping("/media") @PreAuthorize("hasRole('PROVIDER')")
    public Map<String,String> upload(@AuthenticationPrincipal UserPrincipal user,@RequestParam String purpose,@RequestPart("file") MultipartFile file) throws java.io.IOException {
        if(!Set.of("PROFILE","PORTFOLIO","VERIFICATION").contains(purpose)||file.isEmpty()||file.getSize()>5L*1024*1024)throw new BadRequestException("Choose a profile, portfolio or verification image under 5 MB");
        if(em.createQuery("select count(m) from MarketplaceMedia m where m.owner.id=:id",Long.class).setParameter("id",user.getId()).getSingleResult()>=100)throw new BadRequestException("Upload limit reached; contact support to remove unused files");
        byte[] bytes=file.getBytes();String type;
        // Detect the decoded format; do not trust filename or client MIME type.
        try(var stream=ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))){
            var readers=ImageIO.getImageReaders(stream);if(!readers.hasNext())throw new BadRequestException("Choose a valid JPEG, PNG or GIF image");
            var reader=readers.next();try{reader.setInput(stream);String format=reader.getFormatName().toLowerCase(Locale.ROOT);
                type=switch(format){case "jpeg","jpg"->"image/jpeg";case "png"->"image/png";case "gif"->"image/gif";default->throw new BadRequestException("Choose JPEG, PNG or GIF");};
                if((long)reader.getWidth(0)*reader.getHeight(0)>12000000)throw new BadRequestException("Image resolution is too large; use an image under 12 megapixels");
                // Decode and re-encode the first frame, stripping attached metadata/payloads.
                var image=reader.read(0);var output=new java.io.ByteArrayOutputStream();ImageIO.write(image,format.equals("jpg")?"jpeg":format,output);bytes=output.toByteArray();
            }finally{reader.dispose();}
        } catch(BadRequestException e){throw e;}catch(Exception e){throw new BadRequestException("The image could not be decoded");}
        if(bytes.length>5L*1024*1024)throw new BadRequestException("The decoded image is too large; upload a smaller image");
        var m=new MarketplaceMedia();m.id=UUID.randomUUID().toString();m.owner=em.getReference(User.class,user.getId());m.purpose=purpose;m.contentType=type;m.content=bytes;em.persist(m);
        return Map.of("id",m.id,"url","/api/marketplace/media/"+m.id);
    }
    @GetMapping("/media/{id}") public ResponseEntity<byte[]> media(@PathVariable String id,@AuthenticationPrincipal UserPrincipal user){
        var m=em.find(MarketplaceMedia.class,id);if(m==null)throw new ResourceNotFoundException("Image","id",id);
        if(m.purpose.equals("VERIFICATION")&&(user==null||(!user.getId().equals(m.owner.getId())&&user.getRole()!=Role.ADMIN)))throw new AccessDeniedException("This document is private");
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(m.contentType)).header("X-Content-Type-Options","nosniff")
            .cacheControl(m.purpose.equals("VERIFICATION")?CacheControl.noStore():CacheControl.maxAge(java.time.Duration.ofHours(1))).body(m.content);
    }
    public record VerificationSubmission(String idDocument, String businessDocument) {}
    @PostMapping("/me/verification") @PreAuthorize("hasRole('PROVIDER')")
    public Map<String,Object> verify(@AuthenticationPrincipal UserPrincipal user,@RequestBody VerificationSubmission body){
        if(body.idDocument()==null||body.idDocument().isBlank())throw new BadRequestException("Upload an identity verification image");
        service.validateMedia(body.idDocument(),user.getId(),"VERIFICATION");service.validateMedia(body.businessDocument(),user.getId(),"VERIFICATION");
        var p=service.own(user.getId());var v=new VerificationRequest();v.setProvider(p);v.setIdDocumentUrl(body.idDocument());v.setBusinessDocumentUrl(body.businessDocument());em.persist(v);
        p.setVerificationStatus(VerificationStatus.PENDING);p.setIsVerified(false);return Map.of("id",v.getId(),"status","PENDING");
    }
    @GetMapping("/me/verification") @PreAuthorize("hasRole('PROVIDER')")
    public List<Map<String,Object>> myVerification(@AuthenticationPrincipal UserPrincipal user){
        return em.createQuery("from VerificationRequest v where v.provider.user.id=:id order by v.id desc",VerificationRequest.class).setParameter("id",user.getId()).getResultList().stream().map(this::verificationView).toList();
    }
    Map<String,Object> verificationView(VerificationRequest v){var map=new LinkedHashMap<String,Object>();map.put("id",v.getId());map.put("providerId",v.getProvider().getId());map.put("providerName",v.getProvider().getBusinessName());map.put("status",v.getStatus());map.put("idDocument",v.getIdDocumentUrl());map.put("businessDocument",v.getBusinessDocumentUrl());map.put("notes",v.getAdminNotes());return map;}
    @GetMapping("/admin/verifications") @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String,Object>> verifications(){return em.createQuery("from VerificationRequest v order by v.id desc",VerificationRequest.class).setMaxResults(200).getResultList().stream().map(this::verificationView).toList();}
    @GetMapping("/admin/providers") @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String,Object>> allProviders(){return service.adminProviders();}
    public record Decision(@jakarta.validation.constraints.NotNull VerificationStatus status,@jakarta.validation.constraints.Size(max=3000) String notes) {}
    @PatchMapping("/admin/verifications/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Map<String,Object> decide(@PathVariable Long id,@Valid @RequestBody Decision body){var v=em.find(VerificationRequest.class,id);if(v==null)throw new ResourceNotFoundException("Verification","id",id);
        var latest=em.createQuery("select max(v.id) from VerificationRequest v where v.provider.id=:id",Long.class).setParameter("id",v.getProvider().getId()).getSingleResult();if(!id.equals(latest))throw new BadRequestException("Review the latest document submission for this provider");
        if(body.status()==null||body.status()==VerificationStatus.PENDING)throw new BadRequestException("Choose approved, rejected or more information");
        v.setStatus(body.status());v.setAdminNotes(body.notes());v.setReviewedAt(LocalDateTime.now());var p=v.getProvider();p.setVerificationStatus(body.status());p.setIsVerified(body.status()==VerificationStatus.APPROVED);return verificationView(v);}
    @PostMapping("/providers/{id}/reports") @PreAuthorize("isAuthenticated()")
    public Map<String,Object> report(@PathVariable Long id,@AuthenticationPrincipal UserPrincipal user,@Valid @RequestBody Report body){
        var r=new ProviderReport();r.provider=service.provider(id);r.reporter=em.getReference(User.class,user.getId());r.reason=body.reason();r.reviewId=body.reviewId();
        if(r.reviewId!=null){var review=em.find(Review.class,r.reviewId);if(review==null||!review.getProvider().getId().equals(id))throw new BadRequestException("Review does not belong to this provider");}
        em.persist(r);return Map.of("id",r.id,"status",r.status);}
    @GetMapping("/admin/reports") @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String,Object>> reports(){return em.createQuery("from ProviderReport order by id desc",ProviderReport.class).setMaxResults(200).getResultList().stream().map(r->{Map<String,Object> v=new LinkedHashMap<>();v.put("id",r.id);v.put("providerId",r.provider.getId());v.put("providerName",r.provider.getBusinessName());v.put("reviewId",r.reviewId);v.put("reason",r.reason);v.put("status",r.status);v.put("notes",r.adminNotes);return v;}).toList();}
    @PatchMapping("/admin/reports/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Map<String,Object> moderate(@PathVariable Long id,@Valid @RequestBody Moderation body){var r=em.find(ProviderReport.class,id);if(r==null)throw new ResourceNotFoundException("Report","id",id);r.status=body.status();r.adminNotes=body.notes();return Map.of("id",id,"status",r.status);}
    @PatchMapping("/admin/providers/{id}/suspension") @PreAuthorize("hasRole('ADMIN')")
    public Map<String,Object> suspension(@PathVariable Long id,@RequestParam boolean suspended){return service.suspend(id,suspended);}
    @PatchMapping("/admin/reviews/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Map<String,Object> hide(@PathVariable Long id,@RequestParam boolean hidden){var r=em.find(Review.class,id);if(r==null)throw new ResourceNotFoundException("Review","id",id);r.setHidden(hidden);return Map.of("id",id,"hidden",hidden);}
    ServiceRequest booking(Long id){var r=em.find(ServiceRequest.class,id,LockModeType.PESSIMISTIC_WRITE);if(r==null)throw new ResourceNotFoundException("Request","id",id);com.lankaease.security.ResourceAccess.requireRequest(r);return r;}
    @PostMapping("/bookings/{id}/reschedule") @PreAuthorize("hasRole('PROVIDER')")
    public Map<String,Object> propose(@PathVariable Long id,@AuthenticationPrincipal UserPrincipal user,@Valid @RequestBody Reschedule body){
        var r=booking(id);if(r.getProvider()==null||!r.getProvider().getUser().getId().equals(user.getId()))throw new AccessDeniedException("Only the assigned provider can propose a new appointment");
        if(!Set.of(RequestStatus.CREATED,RequestStatus.PROVIDER_FOUND,RequestStatus.ACCEPTED).contains(r.getStatus()))throw new BadRequestException("This booking cannot be rescheduled");
        service.validateAppointment(r.getProvider(),body.date(),body.time(),r.getOffering()==null?0:r.getOffering().getDurationMinutes(),false);
        r.setProposedDate(body.date());r.setProposedTime(body.time());em.persist(new Notification(r.getCustomer(),"New appointment proposal","Your provider proposed "+body.date()+" at "+body.time(),"RESCHEDULE",r.getRequestCode()));return Map.of("id",id,"proposedDate",body.date(),"proposedTime",body.time());
    }
    @PostMapping("/bookings/{id}/reschedule/accept") @PreAuthorize("hasRole('CUSTOMER')")
    public Map<String,Object> acceptReschedule(@PathVariable Long id,@AuthenticationPrincipal UserPrincipal user){
        var r=booking(id);if(!r.getCustomer().getId().equals(user.getId()))throw new AccessDeniedException("Only the customer can accept this proposal");
        if(r.getProposedDate()==null||r.getProposedDate().isBefore(java.time.LocalDate.now(java.time.ZoneId.of("Asia/Colombo")))||!Set.of(RequestStatus.CREATED,RequestStatus.PROVIDER_FOUND,RequestStatus.ACCEPTED).contains(r.getStatus()))throw new BadRequestException("No valid proposal is available");
        service.validateAppointment(r.getProvider(),r.getProposedDate(),r.getProposedTime(),r.getOffering()==null?0:r.getOffering().getDurationMinutes(),false);
        r.setPreferredDate(r.getProposedDate());r.setPreferredTime(r.getProposedTime());r.setProposedDate(null);r.setProposedTime(null);
        return Map.of("id",id,"date",r.getPreferredDate(),"time",r.getPreferredTime());
    }
}
