import { useEffect, useState } from "react";

import api from "../../services/api";

import {
  ProjectStatus,
  type Category,
  type Project,
  type ProjectInput,
} from "../../types";

interface ProjectFormProps {
  project?: Project | null;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({
  project,
  categories,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const isEditing = !!project;

  const [form, setForm] = useState<ProjectInput>({
    name: "",
    shortDescription: "",
    description: "",
    gitHubUrl: "",
    liveUrl: "",
    embedUrl: "",
    technologies: "",
    status: ProjectStatus.Draft,
    featured: false,
    displayOrder: 0,
    categoryId: null,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name,
        shortDescription: project.shortDescription ?? "",
        description: project.description ?? "",
        gitHubUrl: project.gitHubUrl ?? "",
        liveUrl: project.liveUrl ?? "",
        embedUrl: project.embedUrl ?? "",
        technologies: project.technologies ?? "",
        status: project.status,
        featured: project.featured,
        displayOrder: project.displayOrder,
        categoryId: project.categoryId ?? null,
      });
    } else {
      setForm({
        name: "",
        shortDescription: "",
        description: "",
        gitHubUrl: "",
        liveUrl: "",
        embedUrl: "",
        technologies: "",
        status: ProjectStatus.Draft,
        featured: false,
        displayOrder: 0,
        categoryId: null,
      });
    }

    setError("");
  }, [project]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "displayOrder"
          ? Number(value)
          : name === "status"
            ? Number(value)
            : name === "categoryId"
              ? value || null
              : value,
    }));
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: checked,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload: ProjectInput = {
        ...form,
        name: form.name.trim(),
        shortDescription:
          form.shortDescription?.trim() || undefined,
        description: form.description?.trim() || undefined,
        gitHubUrl: form.gitHubUrl?.trim() || undefined,
        liveUrl: form.liveUrl?.trim() || undefined,
        embedUrl: form.embedUrl?.trim() || undefined,
        technologies: form.technologies?.trim() || undefined,
      };

      if (isEditing && project) {
        await api.put(
          `/api/projects/${project.id}`,
          payload,
        );
      } else {
        await api.post("/api/projects", payload);
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      setError(
        isEditing
          ? "Failed to update project."
          : "Failed to create project.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-form-overlay">
      <div className="dashboard-form glass-panel">
        <div className="dashboard-form-header">
          <div>
            <span className="section-eyebrow">
              PROJECT
            </span>

            <h2>
              {isEditing
                ? "Edit Project"
                : "New Project"}
            </h2>
          </div>

          <button
            type="button"
            className="form-close-button"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Name</span>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="My Project"
                required
              />
            </label>

            <label className="form-field">
              <span>Category</span>

              <select
                name="categoryId"
                value={form.categoryId ?? ""}
                onChange={handleChange}
              >
                <option value="">
                  Uncategorized
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field form-field-full">
              <span>Short Description</span>

              <input
                name="shortDescription"
                value={form.shortDescription ?? ""}
                onChange={handleChange}
                placeholder="Short description of the project"
              />
            </label>

            <label className="form-field form-field-full">
              <span>Description</span>

              <textarea
                name="description"
                value={form.description ?? ""}
                onChange={handleChange}
                placeholder="Full project description"
                rows={5}
              />
            </label>

            <label className="form-field">
              <span>GitHub URL</span>

              <input
                name="gitHubUrl"
                value={form.gitHubUrl ?? ""}
                onChange={handleChange}
                placeholder="https://github.com/..."
                type="url"
              />
            </label>

            <label className="form-field">
              <span>Live URL</span>

              <input
                name="liveUrl"
                value={form.liveUrl ?? ""}
                onChange={handleChange}
                placeholder="https://..."
                type="url"
              />
            </label>

            <label className="form-field form-field-full">
              <span>Embed URL</span>

              <input
                name="embedUrl"
                value={form.embedUrl ?? ""}
                onChange={handleChange}
                placeholder="https://..."
                type="url"
              />
            </label>

            <label className="form-field form-field-full">
              <span>Technologies</span>

              <input
                name="technologies"
                value={form.technologies ?? ""}
                onChange={handleChange}
                placeholder="React, TypeScript, ASP.NET Core"
              />
            </label>

            <label className="form-field">
              <span>Status</span>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value={ProjectStatus.Draft}>
                  Draft
                </option>

                <option value={ProjectStatus.Published}>
                  Published
                </option>
              </select>
            </label>

            <label className="form-field">
              <span>Display Order</span>

              <input
                name="displayOrder"
                type="number"
                value={form.displayOrder}
                onChange={handleChange}
                min="0"
              />
            </label>

            <label className="form-checkbox">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleCheckboxChange}
              />

              <span>Featured project</span>
            </label>
          </div>

          <div className="dashboard-form-actions">
            <button
              type="button"
              className="form-secondary-button"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="form-primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Project"
                  : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}