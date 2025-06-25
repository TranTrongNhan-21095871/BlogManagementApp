package project.blogmanagementapp.service;

import project.blogmanagementapp.entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    Category createCategory(String name) ;
    List<Category> getAllCategories();
    Optional<Category> getCategoryById(Long id);
    Category updateCategory(Long id, String name);
    void deleteCategory(Long id);
}
