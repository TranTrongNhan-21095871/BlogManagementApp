package project.blogmanagementapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.blogmanagementapp.dto.PostDto;
import project.blogmanagementapp.entity.Post;
import project.blogmanagementapp.entity.User;
import project.blogmanagementapp.service.PostService;
import project.blogmanagementapp.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody PostDto postDto, Principal principal) {
        try {
            // Lấy user hiện tại từ principal
            User currentUser = userService.findByUsername(principal.getName());

            Post post = postService.createPost(
                    postDto.getTitle(),
                    postDto.getContent(),
                    currentUser.getId(), // Sử dụng ID của user đã đăng nhập
                    postDto.getCategoryId()
            );
            return ResponseEntity.ok("Post created with ID: " + post.getId());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updatePost(@PathVariable Long id, @RequestBody PostDto postDto) {
        try {
            Post post = postService.updatePost(id, postDto.getTitle(), postDto.getContent(), postDto.getCategoryId(), postDto.getViews());
            return ResponseEntity.ok("Post updated with ID: " + post.getId());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        try {
            postService.deletePost(id);
            return ResponseEntity.ok("Post deleted with ID: " + id);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}