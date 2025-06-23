package project.blogmanagementapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.blogmanagementapp.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
}
