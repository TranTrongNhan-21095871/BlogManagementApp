package project.blogmanagementapp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.blogmanagementapp.entity.Category;
import project.blogmanagementapp.repository.CategoryRepository;
import project.blogmanagementapp.service.CategoryService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category createCategory(String name) {
        if (categoryRepository.findByName(name).isPresent()) {
            throw new IllegalStateException("Category '" + name + "' already exists");
        }
        Category category = new Category();
        category.setName(name);
        category.setCreatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public Category updateCategory(Long id, String name) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Category not found with id: " + id));
        if (categoryRepository.findByName(name).isPresent() && !category.getName().equals(name)) {
            throw new IllegalStateException("Category name '" + name + "' already exists");
        }
        category.setName(name);
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }
}
