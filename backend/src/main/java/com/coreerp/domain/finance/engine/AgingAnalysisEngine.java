package com.coreerp.domain.finance.engine;

import com.coreerp.domain.finance.entity.Invoice;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class AgingAnalysisEngine {

    @Data
    @Builder
    public static class AgingBucketReport {
        private BigDecimal current0To30;
        private BigDecimal overdue31To60;
        private BigDecimal overdue61To90;
        private BigDecimal overdue90Plus;
        private BigDecimal totalOutstanding;
    }

    public AgingBucketReport computeAging(List<Invoice> unpaidInvoices, LocalDate asOfDate) {
        BigDecimal b0_30 = BigDecimal.ZERO;
        BigDecimal b31_60 = BigDecimal.ZERO;
        BigDecimal b61_90 = BigDecimal.ZERO;
        BigDecimal b90_plus = BigDecimal.ZERO;

        for (Invoice inv : unpaidInvoices) {
            BigDecimal balance = inv.getBalanceAmount();
            long daysPastDue = ChronoUnit.DAYS.between(inv.getDueDate(), asOfDate);

            if (daysPastDue <= 30) {
                b0_30 = b0_30.add(balance);
            } else if (daysPastDue <= 60) {
                b31_60 = b31_60.add(balance);
            } else if (daysPastDue <= 90) {
                b61_90 = b61_90.add(balance);
            } else {
                b90_plus = b90_plus.add(balance);
            }
        }

        BigDecimal total = b0_30.add(b31_60).add(b61_90).add(b90_plus);

        return AgingBucketReport.builder()
                .current0To30(b0_30)
                .overdue31To60(b31_60)
                .overdue61To90(b61_90)
                .overdue90Plus(b90_plus)
                .totalOutstanding(total)
                .build();
    }
}
