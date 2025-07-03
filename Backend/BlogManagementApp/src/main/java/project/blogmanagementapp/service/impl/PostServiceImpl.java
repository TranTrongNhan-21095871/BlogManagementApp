package project.blogmanagementapp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.blogmanagementapp.entity.Category;
import project.blogmanagementapp.entity.Post;
import project.blogmanagementapp.entity.User;
import project.blogmanagementapp.repository.PostRepository;
import project.blogmanagementapp.service.CategoryService;
import project.blogmanagementapp.service.PostService;
import project.blogmanagementapp.service.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryService categoryService;

    @Override
    public Post createPost(String title, String content, Long userId, Long categoryId) {
        User user = userService.getUserById(userId)
                .orElseThrow(()->new IllegalStateException("User not found with id: " + userId));
        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new IllegalStateException("Category not found with id: " + categoryId));

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setViews(0L);
        post.setUser(user);
        post.setCategory(category);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    @Override
    public Post updatePost(Long id, String title, String content, Long categoryId, Long views) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Post not found with id: " + id));
        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new IllegalStateException("Category not found with id: " + categoryId));

        post.setTitle(title);
        post.setContent(content);
        post.setUpdatedAt(LocalDateTime.now());
        post.setCategory(category);
        post.setViews(views != null ? views : post.getViews()); // Cập nhật views nếu có, giữ nguyên nếu null

        return postRepository.save(post);
    }

    @Override
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(()->new IllegalStateException("Post not found with id: " + id));
        postRepository.delete(post);
    }
}
