package com.insa.budgetwise.service;

import com.insa.budgetwise.dto.IncomeRequest;
import com.insa.budgetwise.entity.Category;
import com.insa.budgetwise.entity.Income;
import com.insa.budgetwise.entity.User;
import com.insa.budgetwise.repository.CategoryRepository;
import com.insa.budgetwise.repository.IncomeRepository;
import com.insa.budgetwise.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public Income addIncome(IncomeRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        }

        Income income = Income.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .date(request.getDate())
                .category(category)
                .user(user)
                .build();

        return incomeRepository.save(income);
    }

    public List<Income> getMyIncomes(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return incomeRepository.findByUserId(user.getId());
    }

    public void deleteIncome(Long id, String email) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Income not found"));

        if (!income.getUser().getEmail().equals(email)) {
            throw new SecurityException("You are not authorized to delete this income");
        }

        incomeRepository.deleteById(id);
    }

    public Income updateIncome(Long id, IncomeRequest request, String email) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Income not found"));

        if (!income.getUser().getEmail().equals(email)) {
            throw new SecurityException("You are not authorized to update this income");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            income.setCategory(category);
        }

        income.setAmount(request.getAmount());
        income.setDescription(request.getDescription());
        income.setDate(request.getDate());

        return incomeRepository.save(income);
    }
}
