import { useEffect, useState } from "react";

import api from "../../services/api";

import {
  ProjectTaskStatus,
  type Project,
  type ProjectTask,
  type TaskInput,
} from "../../types";

interface TaskFormProps {
  task?: ProjectTask | null;
  projects: Project[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TaskForm({
  task,
  projects,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const isEditing = !!task;

  const [form, setForm] = useState<TaskInput>({
    title: "",
    description: "",
    status: ProjectTaskStatus.Todo,
    priority: 1,
    dueDate: null,
    projectId: null,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
          ? task.dueDate.slice(0, 10)
          : null,
        projectId: task.projectId ?? null,
      });
    } else {
      setForm({
        title: "",
        description: "",
        status: ProjectTaskStatus.Todo,
        priority: 1,
        dueDate: null,
        projectId: null,
      });
    }

    setError("");
  }, [task]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "status"
          ? Number(value)
          : name === "priority"
            ? Number(value)
            : name === "projectId"
              ? value || null
              : name === "dueDate"
                ? value || null
                : value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload: TaskInput = {
        ...form,
        title: form.title.trim(),
        description:
          form.description?.trim() || undefined,
        dueDate: form.dueDate
          ? new Date(
              `${form.dueDate}T00:00:00`,
            ).toISOString()
          : null,
      };

      if (isEditing && task) {
        await api.put(
          `/api/tasks/${task.id}`,
          payload,
        );
      } else {
        await api.post("/api/tasks", payload);
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      setError(
        isEditing
          ? "Failed to update task."
          : "Failed to create task.",
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
              WORKFLOW
            </span>

            <h2>
              {isEditing
                ? "Edit Task"
                : "New Task"}
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
            <label className="form-field form-field-full">
              <span>Title</span>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Build authentication system"
                required
              />
            </label>

            <label className="form-field form-field-full">
              <span>Description</span>

              <textarea
                name="description"
                value={form.description ?? ""}
                onChange={handleChange}
                placeholder="Task description"
                rows={4}
              />
            </label>

            <label className="form-field">
              <span>Project</span>

              <select
                name="projectId"
                value={form.projectId ?? ""}
                onChange={handleChange}
              >
                <option value="">
                  No project
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Status</span>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value={ProjectTaskStatus.Todo}>
                  Todo
                </option>

                <option
                  value={ProjectTaskStatus.InProgress}
                >
                  In Progress
                </option>

                <option
                  value={ProjectTaskStatus.Completed}
                >
                  Completed
                </option>
              </select>
            </label>

            <label className="form-field">
              <span>Priority</span>

              <input
                name="priority"
                type="number"
                min="1"
                value={form.priority}
                onChange={handleChange}
              />
            </label>

            <label className="form-field">
              <span>Due Date</span>

              <input
                name="dueDate"
                type="date"
                value={form.dueDate ?? ""}
                onChange={handleChange}
              />
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
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}