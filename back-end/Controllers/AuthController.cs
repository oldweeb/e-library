using back_end.Domain;
using back_end.Domain.DTOs;
using back_end.Interfaces;
using back_end.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly JwtTokenService _jwtTokenService;
    private readonly IUserService _userService;
    private readonly IAdminService _adminService;

    public AuthController(
        JwtTokenService tokenService,
        IUserService userService,
        IAdminService adminService
    )
    {
        _jwtTokenService = tokenService;
        _userService = userService;
        _adminService = adminService;
    }

    [AllowAnonymous]
    [HttpPost]
    [Route("signup")]
    public async Task<ActionResult> SignUp([FromForm] UserDTO user)
    {
        user.Email = user.Email.Trim().ToLower();

        if (user.Role == UserRole.Admin)
        {
            return await SignUp(user, _adminService);
        }

        return await SignUp(user, _userService);
    }

    [AllowAnonymous]
    [HttpPost]
    [Route("login")]
    public async Task<ActionResult> Login([FromBody] UserDTO user)
    {
        user.Email = user.Email.ToLower().Trim();

        var existingUser = await _userService.ValidateAsync(user, true);
        if (existingUser is null)
        {
            return BadRequest(new { ErrorText = "Failed to verify user." });
        }

        return Ok(new
        {
            Token = _jwtTokenService.GenerateJwt(existingUser)
        });
    }

    private async Task<ActionResult> SignUp<T>(UserDTO user, IService<T> service) where T : UserBase
    {
        var existing = await service.ValidateAsync(user);

        if (existing is not null)
        {
            return Conflict(new { ErrorText = "User with such email already exists." });
        }

        var @new = await service.CreateNewAsync(user);

        return Ok(new
        {
            Token = _jwtTokenService.GenerateJwt(@new)
        });
    }
}