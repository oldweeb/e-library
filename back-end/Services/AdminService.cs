using back_end.DAL;
using back_end.Domain;
using back_end.Domain.DTOs;
using back_end.Helpers;
using back_end.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services
{
    public class AdminService : IAdminService
    {
        private readonly ELibraryDbContext _dbContext;
        private readonly DbSet<Administrator> _admins;
        private readonly IPathContainer _container;
        private readonly IFileService _fileService;

        public AdminService(ELibraryDbContext dbContext, IPathContainer container, IFileService fileService)
        {
            _dbContext = dbContext;
            _admins = _dbContext.Set<Administrator>();
            _container = container;
            _fileService = fileService;
        }

        public async Task<Administrator?> ValidateAsync(UserDTO user, bool checkPassword = false)
        {
            var existingUser = await _admins.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (checkPassword && existingUser is not null)
            {
                var password = PasswordHandler.Encrypt(user.Password);
                return password.Equals(existingUser.Password) ? existingUser : null;
            }

            return existingUser;
        }

        public async Task<Administrator> CreateNewAsync(UserDTO user)
        {
            string encryptedPassword = PasswordHandler.Encrypt(user.Password);
            var avatarPath = "";

            if (user.Avatar is not null)
            {
                avatarPath = await _fileService.PostAvatarAsync(user.Avatar);
            }

            var newAdmin = new Administrator
            {
                Email = user.Email,
                Password = encryptedPassword,
                AvatarPath = avatarPath is "" ? _container.DefaultAvatarName : avatarPath
            };

            await _admins.AddAsync(newAdmin);
            await _dbContext.SaveChangesAsync();

            return newAdmin;
        }

        public async Task<Administrator?> FindAsync(ulong id)
        {
            return await _admins.FirstOrDefaultAsync(admin => admin.Id == id);
        }

        public async Task<Administrator?> FindAsync(string email)
        {
            return await _admins.FirstOrDefaultAsync(admin => admin.Email == email);
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
    }
}
