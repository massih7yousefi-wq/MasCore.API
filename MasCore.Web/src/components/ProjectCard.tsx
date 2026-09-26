import type { Project } from "../types";
import GlassButton from "./GlassButton";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const technologies =
    project.technologies
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  return (
    <article className="project-card">
      <div className="project-preview">
        {project.embedUrl ? (
          <iframe
            src={project.embedUrl}
            title={project.name}
            loading="lazy"
            className="project-iframe"
          />
        ) : (
          <div className="project-placeholder">
            <span>{project.name}</span>
            <small>No live preview</small>
          </div>
        )}

        <div className="preview-overlay" />

        {project.featured && (
          <span className="featured-badge">
            Featured
          </span>
        )}
      </div>

      <div className="project-content">
        <div className="project-heading">
          <div>
            {project.categoryName && (
              <span className="project-category">
                {project.categoryName}
              </span>
            )}

            <h3>{project.name}</h3>
          </div>
        </div>

        <p>
          {project.shortDescription ||
            "A digital project built with modern technologies."}
        </p>

        <div className="technology-list">
          {technologies.map((technology) => (
            <span key={technology}>
              {technology}
            </span>
          ))}
        </div>

        <div className="project-actions">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              <GlassButton>
                Open Project ↗
              </GlassButton>
            </a>
          )}

          {project.gitHubUrl && (
            <a
              href={project.gitHubUrl}
              target="_blank"
              rel="noreferrer"
            >
              <GlassButton variant="secondary">
                GitHub
              </GlassButton>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}