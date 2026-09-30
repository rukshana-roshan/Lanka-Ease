package com.lankaease.util;

import com.lankaease.entity.Invoice;

public interface PdfInvoiceService {
    byte[] generateInvoicePdf(Invoice invoice);
}
