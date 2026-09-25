using MasCore.API.DTOs.Auth;
using MasCore.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace MasCore.API.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly UserManager<Models.AppUser> _userManager;

    private readonly SignInManager<Models.AppUser> _signInManager;

    private readonly IJwtService _jwtService;

    public AuthService(
        UserManager<Models.AppUser> userManager,
        SignInManager<Models.AppUser> signInManager,
        IJwtService jwtService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto?> LoginAsync(
        LoginRequestDto request)
    {
        var user =
            await _userManager.FindByEmailAsync(
                request.Email);

        if (user is null)
            return null;

        var result =
            await _signInManager.CheckPasswordSignInAsync(
                user,
                request.Password,
                false);

        if (!result.Succeeded)
            return null;

        var roles =
            await _userManager.GetRolesAsync(user);

        var role =
            roles.FirstOrDefault() ?? "User";

        var jwt =
            _jwtService.GenerateToken(
                user,
                role);

        return new LoginResponseDto
        {
            Token = jwt.Token,
            ExpiresAt = jwt.ExpiresAt,
            UserId = user.Id,
            Email = user.Email ?? string.Empty,
            Role = role
        };
    }
}