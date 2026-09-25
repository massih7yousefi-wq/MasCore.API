using MasCore.API.Models;

namespace MasCore.API.Services.Interfaces;

public interface IJwtService
{
    (string Token, DateTime ExpiresAt) GenerateToken(
        AppUser user,
        string role);
}