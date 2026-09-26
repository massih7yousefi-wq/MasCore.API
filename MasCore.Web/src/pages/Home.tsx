import { useEffect, useState } from "react";

import api from "../services/api";
import type { Project } from "../types";

import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await api.get<Project[]>(
          "/api/projects",
        );

        setProjects(response.data);
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const featuredProjects = projects.filter(
    (project) => project.featured,
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">
            FULL STACK • SECURITY • AI
          </span>

          <h1>
            Building digital
            <br />
            <span>experiences.</span>
          </h1>

          <p>
            A personal space for projects, experiments,
            ideas and things that are slightly more
            interesting than another CRUD application.
          </p>

          <div className="hero-actions">
            <a href="#projects">
              <button className="hero-button">
                Explore Projects
                <span>↓</span>
              </button>
            </a>

            <a
              href="mailto:massih7yousefi@gmail.com"
              className="hero-contact"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
      </section>

      <section
        id="projects"
        className="projects-section"
      >
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              SELECTED WORK
            </span>

            <h2>Projects</h2>
          </div>

          <p>
            A collection of applications, experiments
            and systems built along the way.
          </p>
        </div>

        {loading ? (
          <div className="loading-state">
            Loading projects...
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="projects-grid">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No projects published yet.
          </div>
        )}
      </section>

      <section className="about-strip">
        <div>
          <span className="section-eyebrow">
            WHAT I BUILD
          </span>

          <h2>
            Web applications that
            <br />
            actually do something.
          </h2>
        </div>

        <div className="about-points">
          <div>
            <span>01</span>
            Full Stack
          </div>

          <div>
            <span>02</span>
            Web Security
          </div>

          <div>
            <span>03</span>
            AI Integration
          </div>
        </div>
      </section>
    </main>
  );
}