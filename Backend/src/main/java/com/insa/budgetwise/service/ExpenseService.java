package com.insa.budgetwise.service;

import com.insa.budgetwise.dto.ExpenseRequest;
import com.insa.budgetwise.entity.Category;
import com.insa.budgetwise.entity.Expense;
import com.insa.budgetwise.entity.User;
import com.insa.budgetwise.repository.CategoryRepository;
import com.insa.budgetwise.repository.ExpenseRepository;
import com.insa.budgetwise.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public Expense addExpense(ExpenseRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        }

        Expense expense = Expense.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .date(request.getDate())
                .category(category)
                .user(user)
                .build();

        return expenseRepository.save(expense);
    }

    public List<Expense> getMyExpenses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return expenseRepository.findByUserId(user.getId());
    }

    public void deleteExpense(Long id, String email) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Expense not found"));

        if (!expense.getUser().getEmail().equals(email)) {
            throw new SecurityException("You are not authorized to delete this expense");
        }

        expenseRepository.deleteById(id);
    }
}
