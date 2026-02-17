package com.insa.budgetwise.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ReportResponse {
    private Double totalIncome;
    private Double totalExpense;
    private Double netBalance;
}