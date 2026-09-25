using MasCore.API.DTOs.Task;

namespace MasCore.API.Services.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetAllAsync();

    Task<TaskDto?> GetByIdAsync(Guid id);

    Task<TaskDto> CreateAsync(
        CreateTaskDto dto);

    Task<TaskDto?> UpdateAsync(
        Guid id,
        UpdateTaskDto dto);

    Task<bool> DeleteAsync(Guid id);
}