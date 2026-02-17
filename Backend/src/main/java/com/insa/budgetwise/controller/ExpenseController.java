package com.insa.budgetwise.controller;

import com.insa.budgetwise.dto.ExpenseRequest;
import com.insa.budgetwise.entity.Expense;
import com.insa.budgetwise.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody ExpenseRequest request, Authentication authentication) {
        return ResponseEntity.ok(expenseService.addExpense(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getMyExpenses(Authentication authentication) {
        return ResponseEntity.ok(expenseService.getMyExpenses(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id, Authentication authentication) {
        expenseService.deleteExpense(id, authentication.getName());
        return ResponseEntity.ok("Expense deleted successfully!");
    }
}
