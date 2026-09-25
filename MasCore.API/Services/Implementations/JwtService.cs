using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MasCore.API.Models;
using MasCore.API.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace MasCore.API.Services.Implementations;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string Token, DateTime ExpiresAt) GenerateToken(
        AppUser user,
        string role)
    {
        var jwtSettings =
            _configuration.GetSection("Jwt");

        var key = jwtSettings["Key"]
            ?? throw new InvalidOperationException(
                "JWT key is not configured.");

        var issuer = jwtSettings["Issuer"];

        var audience = jwtSettings["Audience"];

        var expiresMinutes =
            int.Parse(
                jwtSettings["ExpiresInMinutes"] ?? "60");

        var expiresAt =
            DateTime.UtcNow.AddMinutes(expiresMinutes);

        var claims = new List<Claim>
        {
            new(
                ClaimTypes.NameIdentifier,
                user.Id),

            new(
                ClaimTypes.Email,
                user.Email ?? string.Empty),

            new(
                ClaimTypes.Name,
                user.UserName ?? string.Empty),

            new(
                ClaimTypes.Role,
                role)
        };

        var securityKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key));

        var credentials =
            new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return (
            new JwtSecurityTokenHandler()
                .WriteToken(token),
            expiresAt);
    }
}