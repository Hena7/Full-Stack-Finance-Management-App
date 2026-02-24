package com.insa.budgetwise.controller;

import com.insa.budgetwise.dto.BudgetRequest;
import com.insa.budgetwise.dto.BudgetStatusResponse;
import com.insa.budgetwise.entity.Budget;
import com.insa.budgetwise.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<Budget> saveBudget(@Valid @RequestBody BudgetRequest request, Authentication authentication) {
        return ResponseEntity.ok(budgetService.saveBudget(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getMyBudgets(Authentication authentication) {
        return ResponseEntity.ok(budgetService.getMyBudgets(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBudget(@PathVariable Long id, Authentication authentication) {
        budgetService.deleteBudget(id, authentication.getName());
        return ResponseEntity.ok("Budget deleted successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id, @Valid @RequestBody BudgetRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(budgetService.updateBudget(id, request, authentication.getName()));
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