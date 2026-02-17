package com.insa.budgetwise.controller;

import com.insa.budgetwise.dto.BudgetStatusResponse;
import com.insa.budgetwise.entity.Budget;
import com.insa.budgetwise.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<Budget> saveBudget(@Valid @RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.saveBudget(budget));
    }

    // (eg፦ /api/budgets/status?userId=1&categoryId=2&month=5&year=2024)
    @GetMapping("/status")
    public ResponseEntity<BudgetStatusResponse> getBudgetStatus(
            @RequestParam Long userId,
            @RequestParam Long categoryId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(budgetService.getBudgetStatus(userId, categoryId, month, year));
    }
}