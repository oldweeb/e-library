namespace back_end.Domain.DTOs;

public abstract class UserDTOBase
{
    public string Email { get; set; }
    public string Password { get; set; }
    public IFormFile? Avatar { get; set; }
}