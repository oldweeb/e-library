using back_end.Domain;
using back_end.Domain.DTOs;

namespace back_end.Interfaces;

public interface IService<T> where T : UserBase
{
    Task<T?> ValidateAsync(UserDTO user, bool checkPassword = false);
    Task<T> CreateNewAsync(UserDTO user);
    Task<T?> FindAsync(ulong id);
    Task<T?> FindAsync(string email);
    Task UpdateAvatarAsync(string email, IFormFile file);
    Task UpdatePasswordAsync(T user, string @new);
}