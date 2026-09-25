using MasCore.API.Data;
using MasCore.API.DTOs.Task;
using MasCore.API.Models;
using MasCore.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MasCore.API.Services.Implementations;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskDto>> GetAllAsync()
    {
        return await _context.Tasks
            .Include(x => x.Project)
            .AsNoTracking()
            .OrderBy(x => x.Status)
            .ThenByDescending(x => x.Priority)
            .ThenBy(x => x.DueDate)
            .Select(x => new TaskDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                Status = x.Status,
                Priority = x.Priority,
                DueDate = x.DueDate,
                ProjectId = x.ProjectId,
                ProjectName = x.Project != null
                    ? x.Project.Name
                    : null,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<TaskDto?> GetByIdAsync(Guid id)
    {
        return await _context.Tasks
            .Include(x => x.Project)
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new TaskDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                Status = x.Status,
                Priority = x.Priority,
                DueDate = x.DueDate,
                ProjectId = x.ProjectId,
                ProjectName = x.Project != null
                    ? x.Project.Name
                    : null,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<TaskDto> CreateAsync(
        CreateTaskDto dto)
    {
        var task = new ProjectTask
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            ProjectId = dto.ProjectId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Tasks.Add(task);

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(task.Id))!;
    }

    public async Task<TaskDto?> UpdateAsync(
        Guid id,
        UpdateTaskDto dto)
    {
        var task =
            await _context.Tasks
                .FirstOrDefaultAsync(x => x.Id == id);

        if (task is null)
            return null;

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Status = dto.Status;
        task.Priority = dto.Priority;
        task.DueDate = dto.DueDate;
        task.ProjectId = dto.ProjectId;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(task.Id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var task =
            await _context.Tasks
                .FirstOrDefaultAsync(x => x.Id == id);

        if (task is null)
            return false;

        _context.Tasks.Remove(task);

        await _context.SaveChangesAsync();

        return true;
    }
}