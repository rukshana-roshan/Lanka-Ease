package com.lankaease.marketplace;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.List;
public final class MarketplaceDtos {
    private MarketplaceDtos() {}
    public record Hours(@NotNull DayOfWeek day, @NotNull LocalTime opens, @NotNull LocalTime closes) {}
    public record Details(@Size(max=30) @Pattern(regexp="(\\+?[0-9][0-9 ()-]{6,29})?") String whatsapp, @Size(max=150) String subcategory,
        @Size(max=3000) String qualifications, @Size(max=100) String province,
        @Size(max=100) String district, @Size(max=100) String city,
        @Size(max=12) List<@NotBlank @Size(max=500) String> portfolio,
        @Size(max=7) List<@NotNull @Valid Hours> hours, @Size(max=366) List<@NotNull LocalDate> blockedDates,
        boolean emergency, @Pattern(regexp="AVAILABLE|BUSY|OFFLINE") String availabilityStatus) {
        public static Details empty() { return new Details("","","","","","",List.of(),List.of(),List.of(),false,"AVAILABLE"); }
    }
    public record ProfileUpdate(@NotBlank @Size(max=100) String fullName,
        @NotBlank @Size(max=150) String businessName, @NotBlank @Email @Size(max=150) String email,
        @NotBlank @Size(max=20) @Pattern(regexp="\\+?[0-9][0-9 ()-]{6,19}") String phone, @Size(max=500) String profileImage,
        @NotBlank @Size(max=5000) String description, @Min(0) @Max(80) Integer experienceYears,
        @NotNull @DecimalMin("0") @DecimalMax("99999999.99") BigDecimal priceMin,
        @NotNull @DecimalMin("0") @DecimalMax("99999999.99") BigDecimal priceMax,
        @NotEmpty @Size(max=30) List<@NotNull Long> categoryIds,
        @NotEmpty @Size(max=50) List<@NotBlank @Size(max=100) String> serviceCities,
        @NotNull @Valid Details details) {}
    public record Offering(@NotNull Long categoryId, @NotBlank @Size(max=150) String title,
        @NotBlank @Size(max=5000) String description,
        @NotNull @DecimalMin("0") @DecimalMax("99999999.99") BigDecimal priceMin,
        @NotNull @DecimalMin("0") @DecimalMax("99999999.99") BigDecimal priceMax,
        @NotNull @Min(1) @Max(43200) Integer durationMinutes, boolean active) {}
    public record Reschedule(@NotNull @FutureOrPresent LocalDate date, @NotBlank @Size(max=50) String time) {}
    public record Report(@NotBlank @Size(max=3000) String reason, Long reviewId) {}
    public record Moderation(@Pattern(regexp="OPEN|RESOLVED|DISMISSED") @NotNull String status,
        @Size(max=3000) String notes) {}
}
