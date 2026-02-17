package com.insa.budgetwise.service;

import com.insa.budgetwise.dto.BudgetStatusResponse;
import com.insa.budgetwise.entity.Budget;
import com.insa.budgetwise.entity.Expense;
import com.insa.budgetwise.repository.BudgetRepository;
import com.insa.budgetwise.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public Budget saveBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public BudgetStatusResponse getBudgetStatus(Long userId, Long categoryId, Integer month, Integer year) {
        Budget budget = budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(userId, categoryId, month, year)
                .orElseThrow(() -> new RuntimeException("Budget not found for this period!"));

        List<Expense> userExpenses = expenseRepository.findByUserId(userId);

        double actualSpent = userExpenses.stream()
                .filter(e -> e.getCategory().getId().equals(categoryId))
                .filter(e -> e.getDate().getMonthValue() == month)
                .filter(e -> e.getDate().getYear() == year)
                .mapToDouble(Expense::getAmount)
                .sum();

        double remaining = budget.getAmount() - actualSpent;

        return BudgetStatusResponse.builder()
                .categoryName(budget.getCategory().getName())
                .budgetAmount(budget.getAmount())
                .actualSpent(actualSpent)
                .remainingAmount(remaining)
                .status(remaining >= 0 ? "UNDER_BUDGET" : "OVER_BUDGET")
                .build();
    }
}