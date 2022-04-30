using back_end.Domain.DTOs;

namespace back_end.Interfaces
{
    public interface IUserValidator
    {
        ValidationResult IsValid(UserDTO user);
    }

    public enum ValidationResult { Valid, EmailInvalid, PasswordInvalid }
}
