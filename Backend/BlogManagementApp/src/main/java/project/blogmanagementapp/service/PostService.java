package project.blogmanagementapp.service;

import project.blogmanagementapp.entity.Post;

import java.util.List;
import java.util.Optional;

public interface PostService {
    Post createPost(String title, String content, Long userId, Long categoryId);
    List<Post> getAllPosts();
    Optional<Post> getPostById(Long id);
    Post updatePost(Long id, String title, String content, Long categoryId, Long views);
    void deletePost(Long id);
}
