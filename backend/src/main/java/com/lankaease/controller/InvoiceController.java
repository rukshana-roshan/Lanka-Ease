package com.lankaease.controller;

import com.lankaease.dto.response.InvoiceItemDto;
import com.lankaease.dto.response.InvoiceResponseDto;
import com.lankaease.entity.Invoice;
import com.lankaease.exception.ResourceNotFoundException;
import com.lankaease.repository.InvoiceRepository;
import com.lankaease.util.PdfInvoiceService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;
    private final PdfInvoiceService pdfInvoiceService;

    public InvoiceController(InvoiceRepository invoiceRepository, PdfInvoiceService pdfInvoiceService) {
        this.invoiceRepository = invoiceRepository;
        this.pdfInvoiceService = pdfInvoiceService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponseDto> getInvoiceById(@PathVariable Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));
        return ResponseEntity.ok(mapToDto(invoice));
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<InvoiceResponseDto> getInvoiceByRequestId(@PathVariable Long requestId) {
        Invoice invoice = invoiceRepository.findByRequestId(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice for request", "requestId", requestId));
        return ResponseEntity.ok(mapToDto(invoice));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        byte[] pdfContents = pdfInvoiceService.generateInvoicePdf(invoice);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Invoice-" + invoice.getInvoiceNumber() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContents);
    }

    private InvoiceResponseDto mapToDto(Invoice inv) {
        List<InvoiceItemDto> itemDtos = inv.getItems() != null ? inv.getItems().stream()
                .map(i -> new InvoiceItemDto(i.getId(), i.getDescription(), i.getQuantity(), i.getUnitPrice(), i.getTotalPrice()))
                .toList() : List.of();

        return new InvoiceResponseDto(
                inv.getId(),
                inv.getInvoiceNumber(),
                inv.getRequest().getId(),
                inv.getRequest().getRequestCode(),
                inv.getCustomer().getFullName(),
                inv.getCustomer().getPhone(),
                inv.getRequest().getAddress(),
                inv.getProvider().getUser().getFullName(),
                inv.getProvider().getBusinessName(),
                inv.getProvider().getUser().getPhone(),
                inv.getLabourFee(),
                inv.getPartsFee(),
                inv.getServiceFee(),
                inv.getTotalAmount(),
                inv.getPaymentStatus(),
                itemDtos,
                inv.getCreatedAt()
        );
    }
}
