package com.lankaease.ai;

import com.lankaease.dto.response.SmartAiResponseDto;
import com.lankaease.entity.ServiceCategory;
import com.lankaease.repository.ServiceCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class MockAIServiceImpl implements AIService {

    private final ServiceCategoryRepository categoryRepository;

    public MockAIServiceImpl(ServiceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public SmartAiResponseDto classifyServiceRequest(String description) {
        if (description == null || description.isBlank()) {
            return new SmartAiResponseDto(
                    "Home Maintenance", 15L, "home-maintenance",
                    List.of("Could you describe what needs repair?"),
                    "General maintenance request",
                    "AI suggestions are for service categorization only and are not professional diagnoses."
            );
        }

        String lower = description.toLowerCase(Locale.ROOT);
        String categorySlug = "home-maintenance";
        List<String> questions = new ArrayList<>();

        if (lower.contains("wash") || lower.contains("fridge") || lower.contains("refrigerator") || lower.contains("microwave") || lower.contains("ac") || lower.contains("air conditioner") || lower.contains("oven")) {
            categorySlug = "appliance-repair";
            questions.add("What is the brand and model of your appliance?");
            questions.add("Is the appliance turning on at all or displaying any error code?");
        } else if (lower.contains("wire") || lower.contains("socket") || lower.contains("light") || lower.contains("trip") || lower.contains("breaker") || lower.contains("spark") || lower.contains("power") || lower.contains("electricity")) {
            categorySlug = "electrical";
            questions.add("Is the entire house affected or a specific room?");
            questions.add("Did you check if the main trip switch is off?");
        } else if (lower.contains("pipe") || lower.contains("leak") || lower.contains("tap") || lower.contains("sink") || lower.contains("drain") || lower.contains("water") || lower.contains("toilet") || lower.contains("tank")) {
            categorySlug = "plumbing";
            questions.add("Is the water supply currently turned off?");
            questions.add("Where is the leak located (bathroom, kitchen, or outdoor pipe)?");
        } else if (lower.contains("clean") || lower.contains("sofa") || lower.contains("dust") || lower.contains("sweeping") || lower.contains("wash house")) {
            categorySlug = "cleaning";
            questions.add("How many rooms or approximate square footage requires cleaning?");
            questions.add("Do you require cleaning chemicals and tools to be provided?");
        } else if (lower.contains("car") || lower.contains("van") || lower.contains("bike") || lower.contains("engine") || lower.contains("tire") || lower.contains("brake") || lower.contains("mechanic")) {
            categorySlug = "vehicle-repair";
            questions.add("What is the make, model, and year of the vehicle?");
            questions.add("Is the vehicle stranded on the road or at home?");
        } else if (lower.contains("laptop") || lower.contains("pc") || lower.contains("computer") || lower.contains("screen") || lower.contains("virus")) {
            categorySlug = "computer-repair";
            questions.add("Is it a desktop or laptop device?");
            questions.add("What operating system is installed (Windows/Mac)?");
        } else if (lower.contains("wood") || lower.contains("door") || lower.contains("table") || lower.contains("chair") || lower.contains("lock") || lower.contains("furniture") || lower.contains("carpenter")) {
            categorySlug = "carpentry";
            questions.add("Do you have replacement hardware or wood material ready?");
        } else if (lower.contains("paint") || lower.contains("wall") || lower.contains("color")) {
            categorySlug = "painting";
            questions.add("Is this interior or exterior wall painting?");
        } else if (lower.contains("move") || lower.contains("lorry") || lower.contains("furniture transport") || lower.contains("relocate")) {
            categorySlug = "moving-transport";
            questions.add("What are the pickup and destination locations?");
        }

        if (questions.isEmpty()) {
            questions.add("When would you prefer the service technician to visit?");
            questions.add("Are there any specific safety guidelines or access instructions?");
        }

        final String finalSlug = categorySlug;
        ServiceCategory category = categoryRepository.findBySlug(finalSlug)
                .orElseGet(() -> categoryRepository.findAll().stream().findFirst().orElse(null));

        String categoryName = (category != null) ? category.getName() : "Home Maintenance";
        Long categoryId = (category != null) ? category.getId() : 15L;

        String summary = "Automated AI classification identified '" + categoryName + "' based on keywords in your description.";

        return new SmartAiResponseDto(
                categoryName,
                categoryId,
                finalSlug,
                questions,
                summary,
                "AI suggestions are for service categorization only and are not professional diagnoses."
        );
    }
}
