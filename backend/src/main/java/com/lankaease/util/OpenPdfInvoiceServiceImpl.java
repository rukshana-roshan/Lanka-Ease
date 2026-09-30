package com.lankaease.util;

import com.lankaease.entity.Invoice;
import com.lankaease.entity.InvoiceItem;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.awt.Color;
import java.time.format.DateTimeFormatter;

@Service
public class OpenPdfInvoiceServiceImpl implements PdfInvoiceService {

    @Override
    public byte[] generateInvoicePdf(Invoice invoice) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // Branding Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(13, 148, 136));
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            Paragraph pTitle = new Paragraph("LankaEase", titleFont);
            pTitle.setAlignment(Element.ALIGN_LEFT);
            document.add(pTitle);

            Paragraph pSub = new Paragraph("Everyday help, made easier. | Official Invoice", subTitleFont);
            pSub.setSpacingAfter(20);
            document.add(pSub);

            // Invoice Header Info Table
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{1f, 1f});

            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.addElement(new Paragraph("INVOICE TO:", boldFont));
            leftCell.addElement(new Paragraph(invoice.getCustomer().getFullName(), normalFont));
            leftCell.addElement(new Paragraph(invoice.getCustomer().getPhone(), normalFont));
            leftCell.addElement(new Paragraph(invoice.getRequest().getAddress(), normalFont));

            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rightCell.addElement(new Paragraph("INVOICE NO: " + invoice.getInvoiceNumber(), boldFont));
            rightCell.addElement(new Paragraph("REQUEST CODE: " + invoice.getRequest().getRequestCode(), normalFont));
            rightCell.addElement(new Paragraph("DATE: " + invoice.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")), normalFont));
            rightCell.addElement(new Paragraph("PAYMENT STATUS: " + invoice.getPaymentStatus(), boldFont));

            headerTable.addCell(leftCell);
            headerTable.addCell(rightCell);
            headerTable.setSpacingAfter(20);
            document.add(headerTable);

            // Line items table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3f, 1f, 1.5f, 1.5f});

            // Table headers
            String[] headers = {"Description", "Qty", "Unit Price (Rs.)", "Total (Rs.)"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
                cell.setBackgroundColor(new Color(241, 245, 249));
                cell.setPadding(8);
                table.addCell(cell);
            }

            // Items
            if (invoice.getItems() != null && !invoice.getItems().isEmpty()) {
                for (InvoiceItem item : invoice.getItems()) {
                    table.addCell(new PdfPCell(new Phrase(item.getDescription(), normalFont)));
                    table.addCell(new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), normalFont)));
                    table.addCell(new PdfPCell(new Phrase(String.format("%,.2f", item.getUnitPrice()), normalFont)));
                    table.addCell(new PdfPCell(new Phrase(String.format("%,.2f", item.getTotalPrice()), normalFont)));
                }
            } else {
                table.addCell(new PdfPCell(new Phrase("Service Fee & Labour Charges", normalFont)));
                table.addCell(new PdfPCell(new Phrase("1", normalFont)));
                table.addCell(new PdfPCell(new Phrase(String.format("%,.2f", invoice.getLabourFee()), normalFont)));
                table.addCell(new PdfPCell(new Phrase(String.format("%,.2f", invoice.getLabourFee()), normalFont)));
            }

            table.setSpacingAfter(15);
            document.add(table);

            // Total Summary
            Paragraph pTotal = new Paragraph("TOTAL AMOUNT: Rs. " + String.format("%,.2f", invoice.getTotalAmount()), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(13, 148, 136)));
            pTotal.setAlignment(Element.ALIGN_RIGHT);
            pTotal.setSpacingAfter(30);
            document.add(pTotal);

            // Footer
            Paragraph footer = new Paragraph("Thank you for using LankaEase!\nFor support, visit www.lankaease.lk or call +94 11 200 3000.", subTitleFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF invoice", e);
        }
    }
}
