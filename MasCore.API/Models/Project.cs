using MasCore.API.Models.Enums;

namespace MasCore.API.Models;

public class Project
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? ShortDescription { get; set; }

    public string? Description { get; set; }

    public string? GitHubUrl { get; set; }

    public string? LiveUrl { get; set; }

    public string? EmbedUrl { get; set; }

    public string? Technologies { get; set; }

    public ProjectStatus Status { get; set; }

    public bool Featured { get; set; }

    public int DisplayOrder { get; set; }

    public Guid? CategoryId { get; set; }

    public Category? Category { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}