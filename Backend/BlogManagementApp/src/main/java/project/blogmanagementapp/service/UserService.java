package project.blogmanagementapp.service;

import project.blogmanagementapp.entity.User;

public interface UserService {
    User registerUser(String username, String password, String email);
    User findByUsername(String username);
}
