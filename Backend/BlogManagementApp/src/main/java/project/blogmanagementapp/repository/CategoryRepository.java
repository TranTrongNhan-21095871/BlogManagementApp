package project.blogmanagementapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.blogmanagementapp.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
