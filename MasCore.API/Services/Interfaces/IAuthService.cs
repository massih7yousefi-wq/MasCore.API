using MasCore.API.DTOs.Auth;

namespace MasCore.API.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(
        LoginRequestDto request);
}