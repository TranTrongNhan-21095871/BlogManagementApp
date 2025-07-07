package project.blogmanagementapp.dto;

public class AuthDto {

    // DTO cho đăng ký
    public static class RegistrationRequest {
        private String username;
        private String password;
        private String email;
        private String role;  // Thêm trường role (ADMIN, AUTHOR, USER)

        // Getters và Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    // DTO cho đăng nhập
    public static class LoginRequest {
        private String username;
        private String password;

        // Getters và Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}