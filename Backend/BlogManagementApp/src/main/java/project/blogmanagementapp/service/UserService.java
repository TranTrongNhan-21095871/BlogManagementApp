package project.blogmanagementapp.service;

import project.blogmanagementapp.entity.User;

import java.util.Optional;

public interface UserService {
    User registerUser(String username, String password, String email, String role);
    User findByUsername(String username);
    Optional<User> getUserById(Long id);
}
