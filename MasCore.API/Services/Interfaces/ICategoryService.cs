using MasCore.API.DTOs.Category;

namespace MasCore.API.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();

    Task<CategoryDto?> GetByIdAsync(Guid id);

    Task<CategoryDto> CreateAsync(
        CreateCategoryDto dto);

    Task<CategoryDto?> UpdateAsync(
        Guid id,
        UpdateCategoryDto dto);

    Task<bool> DeleteAsync(Guid id);
}