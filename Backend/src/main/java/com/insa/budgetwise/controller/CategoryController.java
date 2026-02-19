package com.insa.budgetwise.controller;

import com.insa.budgetwise.entity.Category;
import com.insa.budgetwise.entity.CategoryType;
import com.insa.budgetwise.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // GET /api/categories => ሁሉንም ካተጎሪዎቼን አምጣ
    @GetMapping
    public ResponseEntity<List<Category>> getMyCategories(Authentication authentication) {
        return ResponseEntity.ok(categoryService.getMyCategories(authentication.getName()));
    }

    // POST /api/categories => አዲስ ካተጎሪ ፍጠር
    // Body: { "name": "Salary", "type": "INCOME" }
    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String name = body.get("name");
        CategoryType type = CategoryType.valueOf(body.get("type").toUpperCase());
        return ResponseEntity.ok(categoryService.createCategory(name, type, authentication.getName()));
    }

    // DELETE /api/categories/{id} => ካተጎሪ ሰርዝ
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id,
            Authentication authentication) {
        categoryService.deleteCategory(id, authentication.getName());
        return ResponseEntity.ok("Category deleted successfully!");
    }
}
