using System.Security.Claims;
using back_end.Domain;
using back_end.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AvatarController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IAdminService _adminService;
    private readonly IPathContainer _container;
    public AvatarController(IUserService userService, IAdminService adminService, IPathContainer container)
    {
        _userService = userService;
        _adminService = adminService;
        _container = container;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult> GetAvatar()
    {
        Claim? emailClaim = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "email-address");
        if (emailClaim is null)
        {
            return BadRequest(new { ErrorText = "Email claim is null." });
        }

        var email = emailClaim.Value.ToLower();

        UserBase? user = await _userService.FindAsync(email);
        user ??= await _adminService.FindAsync(email);

        if (user is null)
        {
            return BadRequest(new { ErrorText = "Failed to verify user." });
        }

        var path = _container.GetAvatarPath(user.AvatarPath);
        byte[] bytes = await System.IO.File.ReadAllBytesAsync(path);

        return File(bytes, "application/octet-stream", user.AvatarPath);
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult> UpdateAvatar([FromForm] IFormFile avatar)
    {
        Claim? emailClaim = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "email-address");
        if (emailClaim is null)
        {
            return BadRequest(new { ErrorText = "Email claim is null." });
        }

        var email = emailClaim.Value.ToLower();
        UserBase? user = await _userService.FindAsync(email);
        user ??= await _adminService.FindAsync(email);

        if (user is null)
        {
            return BadRequest(new { ErrorText = "Failed to verify user." });
        }

        try
        {
            if (user is User)
            {
                await _userService.UpdateAvatarAsync(email, avatar);
            }

            if (user is Administrator)
            {
                await _adminService.UpdateAvatarAsync(email, avatar);
            }
        }
        catch (Exception)
        {
            return NotFound(new {ErrorText = "Failed to update avatar."});
        }

        return NoContent();
    }
}