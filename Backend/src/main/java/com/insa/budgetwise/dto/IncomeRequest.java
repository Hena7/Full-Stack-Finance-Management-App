package com.insa.budgetwise.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncomeRequest {
    private Double amount;
    private String description;
    private LocalDate date;
    private Long categoryId; // Optional: reference to category
}
