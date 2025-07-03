package project.blogmanagementapp.dto;

public class PostDto {
    private String title;
    private String content;
    private Long userId;
    private Long categoryId;
    private Long views;
    // Getters và Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public Long getViews() { return views; }
    public void setViews(Long views) { this.views = views; }
}