using System.Text.RegularExpressions;
using back_end.Domain.DTOs;
using back_end.Interfaces;

namespace back_end.Helpers
{
    public class UserValidator : IUserValidator
    {
        private readonly Regex _emailRegex;
        private readonly Regex _passwordRegex;

        public UserValidator()
        {
            _emailRegex = new Regex("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])");
            _passwordRegex = new Regex(@"^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=|\\,./?])[A-Za-z0-9!@#$%^&*()_\-+=|\\,./?]{8,}$");
        }
        public ValidationResult IsValid(UserDTO user)
        {
            if (!_emailRegex.IsMatch(user.Email) == false)
            {
                return ValidationResult.EmailInvalid;
            }

            if (_passwordRegex.IsMatch(user.Password) == false)
            {
                return ValidationResult.PasswordInvalid;
            }

            return ValidationResult.Valid;
        }
    }
}
