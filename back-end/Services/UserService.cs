using back_end.DAL;
using back_end.Domain;
using back_end.Domain.DTOs;
using back_end.Helpers;
using back_end.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services;

public class UserService : IUserService
{
    private readonly ELibraryDbContext _dbContext;
    private readonly DbSet<User> _users;
    private readonly IPathContainer _container;
    private readonly IFileService _fileService;

    public UserService(
        ELibraryDbContext dbContext,
        IPathContainer container,
        IFileService service
    )
    {
        _dbContext = dbContext;
        _users = _dbContext.Set<User>();
        _container = container;
        _fileService = service;
    }

    public async Task<User?> ValidateAsync(UserDTO user, bool checkPassword = false)
    {
        var existingUser = await _users.FirstOrDefaultAsync(u => u.Email == user.Email);

        if (checkPassword && existingUser is not null)
        {
            var password = PasswordHandler.Encrypt(user.Password);
            return password.Equals(existingUser.Password) ? existingUser : null;
        }

        return existingUser;
    }

    public async Task<User> CreateNewAsync(UserDTO user)
    {
        string encryptedPassword = PasswordHandler.Encrypt(user.Password);
        var avatarPath = "";

        if (user.Avatar is not null)
        {
            avatarPath = await _fileService.PostAvatarAsync(user.Avatar);
        }

        var newUser = new User
        {
            Email = user.Email,
            Password = encryptedPassword,
            AvatarPath = avatarPath is "" ? _container.DefaultAvatarName : avatarPath
        };

        await _users.AddAsync(newUser);
        await _dbContext.SaveChangesAsync();

        return newUser;
    }

    public async Task<User?> FindAsync(string email)
    {
        return await _users.FirstOrDefaultAsync(user => user.Email == email);
    }

    public async Task UpdateAvatarAsync(string email, IFormFile file)
    {
        var admin = await FindAsync(email);
        if (admin is null)
        {
            throw new InvalidOperationException();
        }

        var avatarPath = await _fileService.PostAvatarAsync(file);
        admin.AvatarPath = avatarPath;

        _dbContext.Entry(admin).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdatePasswordAsync(User user, string @new)
    {
        var password = PasswordHandler.Encrypt(@new);
        user.Password = password;
        _dbContext.Entry(user).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task<User?> FindAsync(ulong id)
    {
        return await _users.FirstOrDefaultAsync(user => user.Id == id);
    }
}