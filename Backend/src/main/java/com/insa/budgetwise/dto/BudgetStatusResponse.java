package com.insa.budgetwise.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BudgetStatusResponse {
    private String categoryName;
    private Double budgetAmount;
    private Double actualSpent;
    private Double remainingAmount;
    private String status; // "UNDER_BUDGET" or "OVER_BUDGET"
}