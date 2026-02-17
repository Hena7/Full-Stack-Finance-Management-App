package com.insa.budgetwise.controller;

import com.insa.budgetwise.dto.ReportResponse;
import com.insa.budgetwise.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<ReportResponse> getMyReport(Authentication authentication) {
        return ResponseEntity.ok(reportService.getMyReport(authentication.getName()));
    }
}