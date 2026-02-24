package com.insa.budgetwise.service;

import com.insa.budgetwise.dto.BudgetRequest;
import com.insa.budgetwise.dto.BudgetStatusResponse;
import com.insa.budgetwise.entity.Budget;
import com.insa.budgetwise.entity.Category;
import com.insa.budgetwise.entity.Expense;
import com.insa.budgetwise.entity.User;
import com.insa.budgetwise.repository.BudgetRepository;
import com.insa.budgetwise.repository.CategoryRepository;
import com.insa.budgetwise.repository.ExpenseRepository;
import com.insa.budgetwise.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public Budget saveBudget(BudgetRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        // Check if budget already exists for this category, month, year
        Budget budget = budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(
                user.getId(), category.getId(), request.getMonth(), request.getYear())
                .orElse(Budget.builder()
                        .user(user)
                        .category(category)
                        .month(request.getMonth())
                        .year(request.getYear())
                        .build());

        budget.setAmount(request.getAmount());
        return budgetRepository.save(budget);
    }

    public List<Budget> getMyBudgets(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return budgetRepository.findByUserId(user.getId());
    }

    public void deleteBudget(Long id, String email) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found"));

        if (!budget.getUser().getEmail().equals(email)) {
            throw new SecurityException("You are not authorized to delete this budget");
        }

        budgetRepository.deleteById(id);
    }

    public Budget updateBudget(Long id, BudgetRequest request, String email) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found"));

        if (!budget.getUser().getEmail().equals(email)) {
            throw new SecurityException("You are not authorized to update this budget");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            budget.setCategory(category);
        }

        budget.setAmount(request.getAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());

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