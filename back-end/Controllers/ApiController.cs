using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using back_end.DAL;
using back_end.Domain;
using back_end.Domain.DTOs;
using back_end.Helper;
using back_end.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace back_end.Controllers
{
    [Route("api")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        private readonly ELibraryDbContext _dbContext;
        private readonly ILogger<ApiController> _logger;
        private readonly PathContainer _container;
        private readonly IConfiguration _configuration;

        public ApiController(
            ELibraryDbContext dbContext,
            ILogger<ApiController> logger,
            PathContainer container,
            IConfiguration configuration
        )
        {
            _dbContext = dbContext;
            _logger = logger;
            _container = container;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("signup")]
        public async Task<ActionResult> SignUp([FromBody] UserDTO user)
        {
            user.Email = user.Email.Trim().ToLower();

            var existingUser = await ValidateUserAsync(user);

            if (existingUser is not null)
            {
                return Conflict(new { errorText = "User witch such email already exists." });
            }

            var newUser = await CreateNewUser(user);

            await _dbContext.Users.AddAsync(newUser);
            await _dbContext.SaveChangesAsync();
            return Ok(new
            {
                token = GenerateJwt(newUser),
                avatar = await GetFile(newUser.AvatarPath)
            });
        }

        private async Task<IFormFile> GetFile(string path)
        {
            await using var stream = System.IO.File.OpenRead(path);

            var fileName = Path.GetFileName(stream.Name);
            var extension = fileName.Split('.').Last();

            var contentType = extension is "pdf" ? "application/pdf" : $"image/{extension}";

            var file = new FormFile(stream, 0, stream.Length, "", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = contentType
            };

            return file;
        }

        private async Task<User?> ValidateUserAsync(UserDTO user)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u =>
                String.Compare(
                    user.Email,
                    u.Email,
                    StringComparison.InvariantCultureIgnoreCase
                ) == 0
            );
            return existingUser;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] UserDTO user)
        {
            user.Email = user.Email.ToLower().Trim();

            var existingUser = await ValidateUserAsync(user);
            if (existingUser is null)
            {
                return BadRequest(new {errorText = "Failed to verify user."});
            }

            return Ok(new {token = GenerateJwt(existingUser)});
        }

        private async Task<User> CreateNewUser(UserDTO user)
        {
            string encryptedPassword = PasswordHandler.Encrypt(user.Password);
            var avatarPath = "";

            if (user.Avatar is not null)
            {
                avatarPath = await PostFileAsync(user.Avatar);
            }

            var newUser = new User
            {
                Email = user.Email,
                Password = encryptedPassword,
                AvatarPath = avatarPath is "" ? _container.DefaultAvatarPath : avatarPath
            };
            return newUser;
        }

        private string GenerateJwt(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.AuthTime, DateTime.Now.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task<string> PostFileAsync(IFormFile file)
        {
            var extension = file.FileName.Split('.').LastOrDefault();
            if (extension is null)
            {
                return "";
            }

            extension = extension.ToLower();
            var allowedExtensions = new[] { "jpeg", "jpg", "png", "bmp", "pdf" };
            if (!allowedExtensions.Contains(extension))
            {
                return "";
            }

            if (extension is "pdf")
            {
                return await PostPdfAsync(file);
            }

            return await PostImageAsync(file);
        }

        private async Task<string> PostImageAsync(IFormFile file)
        {
            var fileExtension = file.FileName.Split('.').Last();
            var path = Path.Combine(_container.AvatarDirectory, $"{Guid.NewGuid()}.{fileExtension}");

            await using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream, CancellationToken.None);

            return path;
        }

        private async Task<string> PostPdfAsync(IFormFile file)
        {
            var path = Path.Combine(_container.BookDirectory, $"{Guid.NewGuid()}.pdf");

            await using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream, CancellationToken.None);

            return path;
        }
    }
}
