using MasCore.API.Models.Enums;

namespace MasCore.API.DTOs.Task;

public class CreateTaskDto
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public ProjectTaskStatus Status { get; set; }

    public int Priority { get; set; }

    public DateTime? DueDate { get; set; }

    public Guid? ProjectId { get; set; }
}