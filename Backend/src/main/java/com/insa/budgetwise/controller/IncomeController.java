package com.insa.budgetwise.controller;

import com.insa.budgetwise.dto.IncomeRequest;
import com.insa.budgetwise.entity.Income;
import com.insa.budgetwise.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
public class IncomeController {
    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<Income> addIncome(@RequestBody IncomeRequest request, Authentication authentication) {
        return ResponseEntity.ok(incomeService.addIncome(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Income>> getMyIncomes(Authentication authentication) {
        return ResponseEntity.ok(incomeService.getMyIncomes(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIncome(@PathVariable Long id, Authentication authentication) {
        incomeService.deleteIncome(id, authentication.getName());
        return ResponseEntity.ok("Income deleted successfully!");
    }
}
