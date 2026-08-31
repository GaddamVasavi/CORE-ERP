const fs = require('fs');
const path = require('path');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  const fullPath = path.resolve(process.cwd(), filePath);
  ensureDirSync(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`Created: ${filePath}`);
}

console.log("Generating Phase 2 Java Backend Codebase...");

// -------------------------------------------------------------
// 1. Finance Entities, Repositories, DTOs & Services
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/AccountType.java', `package com.coreerp.domain.finance.entity;

public enum AccountType {
    ASSET,
    LIABILITY,
    EQUITY,
    REVENUE,
    EXPENSE
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/JournalStatus.java', `package com.coreerp.domain.finance.entity;

public enum JournalStatus {
    DRAFT,
    POSTED,
    REVERSED
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/InvoiceType.java', `package com.coreerp.domain.finance.entity;

public enum InvoiceType {
    CUSTOMER_INVOICE,
    SUPPLIER_INVOICE
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/InvoiceStatus.java', `package com.coreerp.domain.finance.entity;

public enum InvoiceStatus {
    DRAFT,
    ISSUED,
    PARTIALLY_PAID,
    PAID,
    OVERDUE,
    CANCELLED
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/PaymentType.java', `package com.coreerp.domain.finance.entity;

public enum PaymentType {
    RECEIPT,
    DISBURSEMENT
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/ChartOfAccounts.java', `package com.coreerp.domain.finance.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "chart_of_accounts", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "account_code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChartOfAccounts extends TenantAwareEntity {

    @Column(name = "account_code", nullable = false, length = 50)
    private String accountCode;

    @Column(name = "account_name", nullable = false, length = 150)
    private String accountName;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 50)
    private AccountType accountType;

    @Column(name = "account_subtype", length = 100)
    private String accountSubtype;

    @Column(name = "currency", nullable = false, length = 10)
    @Builder.Default
    private String currency = "USD";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_account_id")
    private ChartOfAccounts parentAccount;

    @Column(name = "is_reconciliation", nullable = false)
    @Builder.Default
    private boolean isReconciliation = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Column(name = "current_balance", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal currentBalance = BigDecimal.ZERO;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/JournalEntry.java', `package com.coreerp.domain.finance.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "journal_entries", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "entry_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntry extends TenantAwareEntity {

    @Column(name = "entry_number", nullable = false, length = 100)
    private String entryNumber;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "reference_type", length = 100)
    private String referenceType;

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "total_debit", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalDebit = BigDecimal.ZERO;

    @Column(name = "total_credit", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalCredit = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private JournalStatus status = JournalStatus.DRAFT;

    @Column(name = "posted_at")
    private Instant postedAt;

    @Column(name = "posted_by", length = 36)
    private String postedBy;

    @OneToMany(mappedBy = "journalEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<JournalEntryLine> lines = new ArrayList<>();

    public void addLine(JournalEntryLine line) {
        lines.add(line);
        line.setJournalEntry(this);
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/JournalEntryLine.java', `package com.coreerp.domain.finance.entity;

import com.coreerp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "journal_entry_lines")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntryLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id", nullable = false)
    private JournalEntry journalEntry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private ChartOfAccounts account;

    @Column(name = "description")
    private String description;

    @Column(name = "debit_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal debitAmount = BigDecimal.ZERO;

    @Column(name = "credit_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal creditAmount = BigDecimal.ZERO;

    @Column(name = "department_id", length = 36)
    private String departmentId;

    @Column(name = "line_number", nullable = false)
    private int lineNumber;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/BankAccount.java', `package com.coreerp.domain.finance.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "bank_accounts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankAccount extends TenantAwareEntity {

    @Column(name = "account_name", nullable = false, length = 150)
    private String accountName;

    @Column(name = "bank_name", nullable = false, length = 150)
    private String bankName;

    @Column(name = "account_number", nullable = false, length = 100)
    private String accountNumber;

    @Column(name = "routing_number", length = 100)
    private String routingNumber;

    @Column(name = "swift_bic", length = 50)
    private String swiftBic;

    @Column(name = "currency", nullable = false, length = 10)
    @Builder.Default
    private String currency = "USD";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gl_account_id")
    private ChartOfAccounts glAccount;

    @Column(name = "current_balance", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal currentBalance = BigDecimal.ZERO;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/Invoice.java', `package com.coreerp.domain.finance.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.sales.entity.Customer;
import com.coreerp.domain.procurement.entity.Supplier;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "invoices", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "invoice_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice extends TenantAwareEntity {

    @Column(name = "invoice_number", nullable = false, length = 100)
    private String invoiceNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "invoice_type", nullable = false, length = 50)
    private InvoiceType invoiceType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(name = "sales_order_id", length = 36)
    private String salesOrderId;

    @Column(name = "purchase_order_id", length = 36)
    private String purchaseOrderId;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "currency", nullable = false, length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "subtotal", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "paid_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "balance_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal balanceAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id")
    private JournalEntry journalEntry;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/entity/Payment.java', `package com.coreerp.domain.finance.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "payment_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends TenantAwareEntity {

    @Column(name = "payment_number", nullable = false, length = 100)
    private String paymentNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false, length = 50)
    private PaymentType paymentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_account_id")
    private BankAccount bankAccount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "amount", nullable = false, precision = 18, scale = 4)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "COMPLETED";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id")
    private JournalEntry journalEntry;
}
`);

// -------------------------------------------------------------
// 2. Sales & CRM Entities
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/sales/entity/Customer.java', `package com.coreerp.domain.sales.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "customers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "customer_code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends TenantAwareEntity {

    @Column(name = "customer_code", nullable = false, length = 50)
    private String customerCode;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "website")
    private String website;

    @Column(name = "tax_number", length = 100)
    private String taxNumber;

    @Column(name = "currency", nullable = false, length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "payment_terms_days", nullable = false)
    @Builder.Default
    private int paymentTermsDays = 30;

    @Column(name = "credit_limit", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal creditLimit = BigDecimal.ZERO;

    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/sales/entity/Lead.java', `package com.coreerp.domain.sales.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leads")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lead extends TenantAwareEntity {

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "source", length = 100)
    private String source;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "NEW";

    @Column(name = "lead_score", nullable = false)
    @Builder.Default
    private int leadScore = 0;

    @Column(name = "assigned_to_user_id", length = 36)
    private String assignedToUserId;

    @Column(name = "converted_customer_id", length = 36)
    private String convertedCustomerId;

    @Column(name = "converted_opportunity_id", length = 36)
    private String convertedOpportunityId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/sales/entity/Opportunity.java', `package com.coreerp.domain.sales.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Opportunity extends TenantAwareEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @Column(name = "customer_id", length = 36)
    private String customerId;

    @Column(name = "stage", nullable = false, length = 50)
    @Builder.Default
    private String stage = "PROSPECTING";

    @Column(name = "probability", nullable = false)
    @Builder.Default
    private int probability = 10;

    @Column(name = "estimated_revenue", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal estimatedRevenue = BigDecimal.ZERO;

    @Column(name = "expected_close_date")
    private LocalDate expectedCloseDate;

    @Column(name = "assigned_to_user_id", length = 36)
    private String assignedToUserId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/sales/entity/SalesOrder.java', `package com.coreerp.domain.sales.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales_orders", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "order_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrder extends TenantAwareEntity {

    @Column(name = "order_number", nullable = false, length = 100)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "quotation_id", length = 36)
    private String quotationId;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "expected_delivery_date")
    private LocalDate expectedDeliveryDate;

    @Column(name = "currency", nullable = false, length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "subtotal", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "DRAFT";

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SalesOrderItem> items = new ArrayList<>();

    public void addItem(SalesOrderItem item) {
        items.add(item);
        item.setSalesOrder(this);
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/sales/entity/SalesOrderItem.java', `package com.coreerp.domain.sales.entity;

import com.coreerp.common.entity.BaseEntity;
import com.coreerp.domain.inventory.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "sales_order_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder salesOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false, precision = 18, scale = 4)
    private BigDecimal quantity;

    @Column(name = "unit_price", nullable = false, precision = 18, scale = 4)
    private BigDecimal unitPrice;

    @Column(name = "discount_percent", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercent = BigDecimal.ZERO;

    @Column(name = "tax_percent", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal taxPercent = BigDecimal.ZERO;

    @Column(name = "subtotal", nullable = false, precision = 18, scale = 4)
    private BigDecimal subtotal;

    @Column(name = "total_amount", nullable = false, precision = 18, scale = 4)
    private BigDecimal totalAmount;
}
`);

// -------------------------------------------------------------
// 3. Procurement Entities
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/procurement/entity/Supplier.java', `package com.coreerp.domain.procurement.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "suppliers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "supplier_code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Supplier extends TenantAwareEntity {

    @Column(name = "supplier_code", nullable = false, length = 50)
    private String supplierCode;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "website")
    private String website;

    @Column(name = "tax_number", length = 100)
    private String taxNumber;

    @Column(name = "payment_terms_days", nullable = false)
    @Builder.Default
    private int paymentTermsDays = 30;

    @Column(name = "rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = new BigDecimal("5.00");

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/procurement/entity/PurchaseOrder.java', `package com.coreerp.domain.procurement.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "po_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder extends TenantAwareEntity {

    @Column(name = "po_number", nullable = false, length = 100)
    private String poNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(name = "purchase_request_id", length = 36)
    private String purchaseRequestId;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "expected_delivery_date")
    private LocalDate expectedDeliveryDate;

    @Column(name = "currency", nullable = false, length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "subtotal", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "DRAFT";

    @Column(name = "approved_by_user_id", length = 36)
    private String approvedByUserId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PurchaseOrderItem> items = new ArrayList<>();

    public void addItem(PurchaseOrderItem item) {
        items.add(item);
        item.setPurchaseOrder(this);
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/procurement/entity/PurchaseOrderItem.java', `package com.coreerp.domain.procurement.entity;

import com.coreerp.common.entity.BaseEntity;
import com.coreerp.domain.inventory.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false, precision = 18, scale = 4)
    private BigDecimal quantity;

    @Column(name = "unit_price", nullable = false, precision = 18, scale = 4)
    private BigDecimal unitPrice;

    @Column(name = "tax_percent", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal taxPercent = BigDecimal.ZERO;

    @Column(name = "subtotal", nullable = false, precision = 18, scale = 4)
    private BigDecimal subtotal;

    @Column(name = "total_amount", nullable = false, precision = 18, scale = 4)
    private BigDecimal totalAmount;

    @Column(name = "quantity_received", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal quantityReceived = BigDecimal.ZERO;
}
`);

// -------------------------------------------------------------
// 4. Inventory & WMS Entities
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/inventory/entity/Product.java', `package com.coreerp.domain.inventory.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "sku"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product extends TenantAwareEntity {

    @Column(name = "sku", nullable = false, length = 100)
    private String sku;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_id", length = 36)
    private String categoryId;

    @Column(name = "type", nullable = false, length = 50)
    @Builder.Default
    private String type = "STORABLE";

    @Column(name = "uom", nullable = false, length = 20)
    @Builder.Default
    private String uom = "UNIT";

    @Column(name = "purchase_price", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal purchasePrice = BigDecimal.ZERO;

    @Column(name = "sales_price", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal salesPrice = BigDecimal.ZERO;

    @Column(name = "min_reorder_level", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal minReorderLevel = BigDecimal.ZERO;

    @Column(name = "safety_stock", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal safetyStock = BigDecimal.ZERO;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/inventory/entity/Warehouse.java', `package com.coreerp.domain.inventory.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "warehouses", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Warehouse extends TenantAwareEntity {

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "manager_id", length = 36)
    private String managerId;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/inventory/entity/InventoryItem.java', `package com.coreerp.domain.inventory.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_items", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "product_id", "warehouse_id", "batch_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem extends TenantAwareEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(name = "location_id", length = 36)
    private String locationId;

    @Column(name = "quantity_on_hand", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal quantityOnHand = BigDecimal.ZERO;

    @Column(name = "quantity_reserved", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal quantityReserved = BigDecimal.ZERO;

    @Column(name = "quantity_available", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal quantityAvailable = BigDecimal.ZERO;

    @Column(name = "batch_number", length = 100)
    private String batchNumber;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/inventory/entity/InventoryMovement.java', `package com.coreerp.domain.inventory.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "inventory_movements")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryMovement extends TenantAwareEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(name = "movement_type", nullable = false, length = 50)
    private String movementType;

    @Column(name = "quantity", nullable = false, precision = 18, scale = 4)
    private BigDecimal quantity;

    @Column(name = "unit_cost", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal unitCost = BigDecimal.ZERO;

    @Column(name = "total_cost", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalCost = BigDecimal.ZERO;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    @Column(name = "performed_by_user_id", length = 36)
    private String performedByUserId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
`);

// -------------------------------------------------------------
// 5. Repositories
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/finance/repository/ChartOfAccountsRepository.java', `package com.coreerp.domain.finance.repository;

import com.coreerp.domain.finance.entity.AccountType;
import com.coreerp.domain.finance.entity.ChartOfAccounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChartOfAccountsRepository extends JpaRepository<ChartOfAccounts, String> {
    List<ChartOfAccounts> findAllByTenantIdAndIsDeletedFalseOrderByAccountCodeAsc(String tenantId);
    Optional<ChartOfAccounts> findByTenantIdAndAccountCodeAndIsDeletedFalse(String tenantId, String accountCode);
    List<ChartOfAccounts> findAllByTenantIdAndAccountTypeAndIsDeletedFalse(String tenantId, AccountType accountType);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/repository/JournalEntryRepository.java', `package com.coreerp.domain.finance.repository;

import com.coreerp.domain.finance.entity.JournalEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, String> {
    Page<JournalEntry> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<JournalEntry> findByTenantIdAndEntryNumberAndIsDeletedFalse(String tenantId, String entryNumber);
    List<JournalEntry> findAllByTenantIdAndEntryDateBetweenAndStatusAndIsDeletedFalse(
            String tenantId, LocalDate startDate, LocalDate endDate, com.coreerp.domain.finance.entity.JournalStatus status);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/repository/InvoiceRepository.java', `package com.coreerp.domain.finance.repository;

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
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/repository/PaymentRepository.java', `package com.coreerp.domain.finance.repository;

import com.coreerp.domain.finance.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Page<Payment> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/sales/repository/CustomerRepository.java', `package com.coreerp.domain.sales.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    Page<Customer> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<Customer> findByTenantIdAndCustomerCodeAndIsDeletedFalse(String tenantId, String customerCode);
    long countByTenantIdAndIsDeletedFalse(String tenantId);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/sales/repository/LeadRepository.java', `package com.coreerp.domain.sales.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadRepository extends JpaRepository<Lead, String> {
    Page<Lead> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/sales/repository/SalesOrderRepository.java', `package com.coreerp.domain.sales.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, String> {
    Page<SalesOrder> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<SalesOrder> findByTenantIdAndOrderNumberAndIsDeletedFalse(String tenantId, String orderNumber);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/procurement/repository/SupplierRepository.java', `package com.coreerp.domain.procurement.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String> {
    Page<Supplier> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<Supplier> findByTenantIdAndSupplierCodeAndIsDeletedFalse(String tenantId, String code);
    long countByTenantIdAndIsDeletedFalse(String tenantId);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/procurement/repository/PurchaseOrderRepository.java', `package com.coreerp.domain.procurement.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, String> {
    Page<PurchaseOrder> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<PurchaseOrder> findByTenantIdAndPoNumberAndIsDeletedFalse(String tenantId, String poNumber);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/inventory/repository/ProductRepository.java', `package com.coreerp.domain.inventory.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Page<Product> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<Product> findByTenantIdAndSkuAndIsDeletedFalse(String tenantId, String sku);
    long countByTenantIdAndIsDeletedFalse(String tenantId);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/inventory/repository/WarehouseRepository.java', `package com.coreerp.domain.inventory.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, String> {
    List<Warehouse> findAllByTenantIdAndIsDeletedFalse(String tenantId);
    Optional<Warehouse> findByTenantIdAndCodeAndIsDeletedFalse(String tenantId, String code);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/inventory/repository/InventoryItemRepository.java', `package com.coreerp.domain.inventory.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {
    Page<InventoryItem> findAllByTenantId(String tenantId, Pageable pageable);
    Optional<InventoryItem> findByTenantIdAndProductAndWarehouse(String tenantId, Product product, Warehouse warehouse);
}
`);

// -------------------------------------------------------------
// 6. Controllers & REST Endpoints
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/finance/controller/FinanceController.java', `package com.coreerp.domain.finance.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.finance.entity.ChartOfAccounts;
import com.coreerp.domain.finance.entity.JournalEntry;
import com.coreerp.domain.finance.repository.ChartOfAccountsRepository;
import com.coreerp.domain.finance.repository.JournalEntryRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
@Tag(name = "Finance & General Ledger", description = "Chart of Accounts, Journal Entries, Double-Entry Posting")
public class FinanceController {

    private final ChartOfAccountsRepository coaRepository;
    private final JournalEntryRepository journalEntryRepository;

    @GetMapping("/accounts")
    @PreAuthorize("hasAuthority('gl:read') or hasRole('ACCOUNTANT') or hasRole('FINANCE_MANAGER') or hasRole('CFO')")
    @Operation(summary = "Get Chart of Accounts hierarchy")
    public ResponseEntity<ApiResponse<List<ChartOfAccounts>>> getChartOfAccounts() {
        String tenantId = TenantContext.getTenantId();
        List<ChartOfAccounts> accounts = coaRepository.findAllByTenantIdAndIsDeletedFalseOrderByAccountCodeAsc(tenantId);
        return ResponseEntity.ok(ApiResponse.ok(accounts));
    }

    @GetMapping("/journal-entries")
    @PreAuthorize("hasAuthority('gl:read') or hasRole('ACCOUNTANT') or hasRole('FINANCE_MANAGER')")
    @Operation(summary = "List Journal Entries with pagination")
    public ResponseEntity<ApiResponse<PageResponse<JournalEntry>>> getJournalEntries(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<JournalEntry> page = journalEntryRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/controller/InvoiceController.java', `package com.coreerp.domain.finance.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.finance.entity.Invoice;
import com.coreerp.domain.finance.entity.InvoiceType;
import com.coreerp.domain.finance.repository.InvoiceRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices (AP / AR)", description = "Customer & Supplier Invoices and Billing")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('invoice:read') or hasRole('ACCOUNTANT') or hasRole('SALES_MANAGER')")
    @Operation(summary = "List Invoices (AR / AP)")
    public ResponseEntity<ApiResponse<PageResponse<Invoice>>> listInvoices(
            @RequestParam(defaultValue = "CUSTOMER_INVOICE") InvoiceType type,
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Invoice> page = invoiceRepository.findAllByTenantIdAndInvoiceTypeAndIsDeletedFalse(tenantId, type, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/sales/controller/CustomerController.java', `package com.coreerp.domain.sales.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.sales.entity.Customer;
import com.coreerp.domain.sales.entity.CustomerRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "Customer Master and CRM 360")
public class CustomerController {

    private final CustomerRepository customerRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('customer:read') or hasRole('SALES_EXECUTIVE') or hasRole('SALES_MANAGER')")
    @Operation(summary = "List Customers for Tenant")
    public ResponseEntity<ApiResponse<PageResponse<Customer>>> listCustomers(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Customer> page = customerRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/sales/controller/SalesOrderController.java', `package com.coreerp.domain.sales.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.sales.entity.SalesOrder;
import com.coreerp.domain.sales.entity.SalesOrderRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sales-orders")
@RequiredArgsConstructor
@Tag(name = "Sales Orders", description = "Order-to-Cash process and order tracking")
public class SalesOrderController {

    private final SalesOrderRepository salesOrderRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('sales_order:create') or hasRole('SALES_EXECUTIVE') or hasRole('SALES_MANAGER')")
    @Operation(summary = "List Sales Orders")
    public ResponseEntity<ApiResponse<PageResponse<SalesOrder>>> listOrders(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<SalesOrder> page = salesOrderRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/procurement/controller/ProcurementController.java', `package com.coreerp.domain.procurement.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.procurement.entity.PurchaseOrder;
import com.coreerp.domain.procurement.entity.PurchaseOrderRepository;
import com.coreerp.domain.procurement.entity.Supplier;
import com.coreerp.domain.procurement.entity.SupplierRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/procurement")
@RequiredArgsConstructor
@Tag(name = "Procurement & Purchasing", description = "Supplier Master, RFQs, and Purchase Orders")
public class ProcurementController {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository poRepository;

    @GetMapping("/suppliers")
    @PreAuthorize("hasAuthority('supplier:manage') or hasRole('PROCUREMENT_MANAGER') or hasRole('PURCHASE_EXECUTIVE')")
    @Operation(summary = "List Suppliers")
    public ResponseEntity<ApiResponse<PageResponse<Supplier>>> listSuppliers(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Supplier> page = supplierRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }

    @GetMapping("/purchase-orders")
    @PreAuthorize("hasAuthority('purchase_order:create') or hasRole('PROCUREMENT_MANAGER') or hasRole('PURCHASE_EXECUTIVE')")
    @Operation(summary = "List Purchase Orders")
    public ResponseEntity<ApiResponse<PageResponse<PurchaseOrder>>> listPurchaseOrders(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<PurchaseOrder> page = poRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/inventory/controller/InventoryController.java', `package com.coreerp.domain.inventory.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.inventory.entity.*;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory & Warehouse (WMS)", description = "Product Catalog, Stock Balances, Warehouses, Movements")
public class InventoryController {

    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryItemRepository inventoryItemRepository;

    @GetMapping("/products")
    @PreAuthorize("hasAuthority('inventory:read') or hasRole('INVENTORY_MANAGER') or hasRole('WAREHOUSE_MANAGER')")
    @Operation(summary = "List Products with SKUs")
    public ResponseEntity<ApiResponse<PageResponse<Product>>> listProducts(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Product> page = productRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }

    @GetMapping("/warehouses")
    @PreAuthorize("hasAuthority('inventory:read') or hasRole('WAREHOUSE_MANAGER')")
    @Operation(summary = "List Warehouses")
    public ResponseEntity<ApiResponse<List<Warehouse>>> listWarehouses() {
        String tenantId = TenantContext.getTenantId();
        List<Warehouse> warehouses = warehouseRepository.findAllByTenantIdAndIsDeletedFalse(tenantId);
        return ResponseEntity.ok(ApiResponse.ok(warehouses));
    }

    @GetMapping("/stock")
    @PreAuthorize("hasAuthority('inventory:read') or hasRole('INVENTORY_MANAGER')")
    @Operation(summary = "Get stock levels and batches")
    public ResponseEntity<ApiResponse<PageResponse<InventoryItem>>> getStockLevels(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<InventoryItem> page = inventoryItemRepository.findAllByTenantId(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
`);

console.log("Phase 2 Java backend files generated.");
