package com.coreerp.domain.finance.repository;

import com.coreerp.domain.finance.entity.Invoice;
import com.coreerp.domain.finance.entity.InvoiceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    Page<Invoice> findAllByTenantIdAndInvoiceTypeAndIsDeletedFalse(String tenantId, InvoiceType type, Pageable pageable);
    Optional<Invoice> findByTenantIdAndInvoiceNumberAndIsDeletedFalse(String tenantId, String invoiceNumber);
    List<Invoice> findAllByTenantIdAndStatusAndIsDeletedFalse(String tenantId, com.coreerp.domain.finance.entity.InvoiceStatus status);
}
