package com.coreerp.domain.hr.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.hr.entity.Employee;
import com.coreerp.domain.hr.entity.EmployeeRepository;
import com.coreerp.domain.hr.entity.PayrollRun;
import com.coreerp.domain.hr.entity.PayrollRunRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/hr")
@RequiredArgsConstructor
@Tag(name = "Human Resources & Payroll", description = "Employee Records, Attendance, Leave, and Payroll Calculation")
public class HrController {

    private final EmployeeRepository employeeRepository;
    private final PayrollRunRepository payrollRunRepository;

    @GetMapping("/employees")
    @PreAuthorize("hasAuthority('employee:read') or hasRole('HR_MANAGER') or hasRole('HR_EXECUTIVE')")
    @Operation(summary = "List Employees")
    public ResponseEntity<ApiResponse<PageResponse<Employee>>> listEmployees(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Employee> page = employeeRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }

    @GetMapping("/payroll")
    @PreAuthorize("hasAuthority('payroll:calculate') or hasRole('HR_MANAGER') or hasRole('CFO')")
    @Operation(summary = "List Payroll Runs")
    public ResponseEntity<ApiResponse<PageResponse<PayrollRun>>> listPayroll(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<PayrollRun> page = payrollRunRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
