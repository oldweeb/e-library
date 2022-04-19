namespace back_end.Domain.DTOs
{
    public class UserDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public IFormFile? Avatar { get; set; }
        public UserRole? Role { get; set; }
    }

    public enum UserRole
    {
        User, Admin
    }
}
