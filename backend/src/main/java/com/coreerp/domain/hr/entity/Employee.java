package com.coreerp.domain.hr.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.security.entity.Department;
import com.coreerp.domain.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "employee_code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee extends TenantAwareEntity {

    @Column(name = "employee_code", nullable = false, length = 50)
    private String employeeCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "job_title", nullable = false, length = 150)
    private String jobTitle;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "salary_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal salaryAmount = BigDecimal.ZERO;

    @Column(name = "salary_frequency", nullable = false, length = 50)
    @Builder.Default
    private String salaryFrequency = "MONTHLY";

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE";

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
