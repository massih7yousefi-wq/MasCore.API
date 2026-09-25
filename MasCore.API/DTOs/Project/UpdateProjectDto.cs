using MasCore.API.Models.Enums;

namespace MasCore.API.DTOs.Project;

public class UpdateProjectDto
{
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
}