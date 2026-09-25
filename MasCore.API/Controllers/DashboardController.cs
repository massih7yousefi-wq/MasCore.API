using MasCore.API.Data;
using MasCore.API.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MasCore.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalProjects =
            await _context.Projects.CountAsync();

        var publishedProjects =
            await _context.Projects.CountAsync(
                x => x.Status == ProjectStatus.Published);

        var totalTasks =
            await _context.Tasks.CountAsync();

        var completedTasks =
            await _context.Tasks.CountAsync(
                x => x.Status == ProjectTaskStatus.Completed);

        var inProgressTasks =
            await _context.Tasks.CountAsync(
                x => x.Status == ProjectTaskStatus.InProgress);

        var todoTasks =
            await _context.Tasks.CountAsync(
                x => x.Status == ProjectTaskStatus.Todo);

        return Ok(new
        {
            totalProjects,
            publishedProjects,
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks
        });
    }
}