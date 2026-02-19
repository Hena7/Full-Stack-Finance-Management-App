package com.insa.budgetwise.service;

import com.insa.budgetwise.entity.Category;
import com.insa.budgetwise.entity.CategoryType;
import com.insa.budgetwise.entity.User;
import com.insa.budgetwise.repository.CategoryRepository;
import com.insa.budgetwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // Get all categories for the logged-in user
    public List<Category> getMyCategories(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return categoryRepository.findByUserId(user.getId());
    }

    // Create a new category
    public Category createCategory(String name, CategoryType type, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = Category.builder()
                .name(name)
                .type(type)
                .user(user)
                .build();

        return categoryRepository.save(category);
    }

    // Delete a category
    public void deleteCategory(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        categoryRepository.deleteById(id);
    }
}
