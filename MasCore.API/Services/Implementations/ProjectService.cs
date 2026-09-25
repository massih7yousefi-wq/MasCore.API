using MasCore.API.Data;
using MasCore.API.DTOs.Project;
using MasCore.API.Models;
using MasCore.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MasCore.API.Services.Implementations;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProjectDto>> GetAllAsync(
        bool publishedOnly = false)
    {
        var query = _context.Projects
            .AsNoTracking()
            .Include(x => x.Category)
            .AsQueryable();

        if (publishedOnly)
        {
            query = query.Where(x =>
                x.Status == Models.Enums.ProjectStatus.Published);
        }

        return await query
            .OrderBy(x => x.DisplayOrder)
            .ThenByDescending(x => x.CreatedAt)
            .Select(x => new ProjectDto
            {
                Id = x.Id,
                Name = x.Name,
                ShortDescription = x.ShortDescription,
                Description = x.Description,
                GitHubUrl = x.GitHubUrl,
                LiveUrl = x.LiveUrl,
                EmbedUrl = x.EmbedUrl,
                Technologies = x.Technologies,
                Status = x.Status,
                Featured = x.Featured,
                DisplayOrder = x.DisplayOrder,
                CategoryId = x.CategoryId,
                CategoryName = x.Category != null
                    ? x.Category.Name
                    : null,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<ProjectDto?> GetByIdAsync(Guid id)
    {
        return await _context.Projects
            .AsNoTracking()
            .Include(x => x.Category)
            .Where(x => x.Id == id)
            .Select(x => new ProjectDto
            {
                Id = x.Id,
                Name = x.Name,
                ShortDescription = x.ShortDescription,
                Description = x.Description,
                GitHubUrl = x.GitHubUrl,
                LiveUrl = x.LiveUrl,
                EmbedUrl = x.EmbedUrl,
                Technologies = x.Technologies,
                Status = x.Status,
                Featured = x.Featured,
                DisplayOrder = x.DisplayOrder,
                CategoryId = x.CategoryId,
                CategoryName = x.Category != null
                    ? x.Category.Name
                    : null,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto request)
    {
        var project = new Project
        {
            Id = Guid.NewGuid(),

            Name = request.Name,
            ShortDescription = request.ShortDescription,
            Description = request.Description,

            GitHubUrl = request.GitHubUrl,
            LiveUrl = request.LiveUrl,
            EmbedUrl = request.EmbedUrl,

            Technologies = request.Technologies,

            Status = request.Status,
            Featured = request.Featured,
            DisplayOrder = request.DisplayOrder,

            CategoryId = request.CategoryId,

            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Projects.Add(project);

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(project.Id))!;
    }

    public async Task<ProjectDto?> UpdateAsync(
        Guid id,
        UpdateProjectDto request)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(x => x.Id == id);

        if (project is null)
        {
            return null;
        }

        project.Name = request.Name;

        project.ShortDescription = request.ShortDescription;

        project.Description = request.Description;

        project.GitHubUrl = request.GitHubUrl;

        project.LiveUrl = request.LiveUrl;

        project.EmbedUrl = request.EmbedUrl;

        project.Technologies = request.Technologies;

        project.Status = request.Status;

        project.Featured = request.Featured;

        project.DisplayOrder = request.DisplayOrder;

        project.CategoryId = request.CategoryId;

        project.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(project.Id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(x => x.Id == id);

        if (project is null)
        {
            return false;
        }

        _context.Projects.Remove(project);

        await _context.SaveChangesAsync();

        return true;
    }
}