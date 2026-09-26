import { useEffect, useState } from "react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import type {
  Category,
  Project,
  ProjectTask,
} from "../types";

import {
  ProjectStatus,
  ProjectTaskStatus,
} from "../types";

import GlassButton from "../components/GlassButton";

import ProjectForm from "../components/dashboard/ProjectForm";
import TaskForm from "../components/dashboard/TaskForm";
import CategoryForm from "../components/dashboard/CategoryForm";

type FormType =
  | "project"
  | "task"
  | "category"
  | null;

export default function Dashboard() {
  const { logout } = useAuth();

  const [projects, setProjects] = useState<Project[]>(
    [],
  );

  const [tasks, setTasks] = useState<ProjectTask[]>(
    [],
  );

  const [categories, setCategories] = useState<Category[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] =
    useState<"projects" | "tasks" | "categories">(
      "projects",
    );

  const [message, setMessage] = useState("");

  const [activeForm, setActiveForm] =
    useState<FormType>(null);

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [editingTask, setEditingTask] =
    useState<ProjectTask | null>(null);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        projectsResponse,
        tasksResponse,
        categoriesResponse,
      ] = await Promise.all([
        api.get<Project[]>("/api/projects"),
        api.get<ProjectTask[]>("/api/tasks"),
        api.get<Category[]>("/api/categories"),
      ]);

      setProjects(projectsResponse.data);
      setTasks(tasksResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const closeForm = () => {
    setActiveForm(null);

    setEditingProject(null);
    setEditingTask(null);
    setEditingCategory(null);
  };

  const handleFormSuccess = async (
    successMessage: string,
  ) => {
    closeForm();

    setMessage(successMessage);

    await loadData();
  };

  const openNewProject = () => {
    setEditingProject(null);
    setActiveForm("project");
  };

  const openEditProject = (project: Project) => {
    setEditingProject(project);
    setActiveForm("project");
  };

  const openNewTask = () => {
    setEditingTask(null);
    setActiveForm("task");
  };

  const openEditTask = (task: ProjectTask) => {
    setEditingTask(task);
    setActiveForm("task");
  };

  const openNewCategory = () => {
    setEditingCategory(null);
    setActiveForm("category");
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setActiveForm("category");
  };

  const deleteProject = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this project?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/api/projects/${id}`);

      setMessage("Project deleted.");

      await loadData();
    } catch (error) {
      console.error(error);

      setMessage("Failed to delete project.");
    }
  };

  const deleteTask = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/api/tasks/${id}`);

      setMessage("Task deleted.");

      await loadData();
    } catch (error) {
      console.error(error);

      setMessage("Failed to delete task.");
    }
  };

  const deleteCategory = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this category?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/api/categories/${id}`);

      setMessage("Category deleted.");

      await loadData();
    } catch (error) {
      console.error(error);

      setMessage("Failed to delete category.");
    }
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="loading-state">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">
            ADMIN PANEL
          </span>

          <h1>Dashboard</h1>

          <p>
            Manage your projects, tasks and categories.
          </p>
        </div>

        <GlassButton
          variant="secondary"
          onClick={logout}
        >
          Logout
        </GlassButton>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <span>Projects</span>

          <strong>{projects.length}</strong>
        </div>

        <div className="stat-card glass-panel">
          <span>Tasks</span>

          <strong>{tasks.length}</strong>
        </div>

        <div className="stat-card glass-panel">
          <span>Categories</span>

          <strong>{categories.length}</strong>
        </div>

        <div className="stat-card glass-panel">
          <span>Completed</span>

          <strong>
            {
              tasks.filter(
                (task) =>
                  task.status ===
                  ProjectTaskStatus.Completed,
              ).length
            }
          </strong>
        </div>
      </div>

      {message && (
        <div className="dashboard-message">
          {message}
        </div>
      )}

      <div className="dashboard-tabs glass-panel">
        <button
          className={
            activeTab === "projects"
              ? "dashboard-tab active"
              : "dashboard-tab"
          }
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>

        <button
          className={
            activeTab === "tasks"
              ? "dashboard-tab active"
              : "dashboard-tab"
          }
          onClick={() => setActiveTab("tasks")}
        >
          Tasks
        </button>

        <button
          className={
            activeTab === "categories"
              ? "dashboard-tab active"
              : "dashboard-tab"
          }
          onClick={() =>
            setActiveTab("categories")
          }
        >
          Categories
        </button>
      </div>

      {activeTab === "projects" && (
        <section className="admin-section glass-panel">
          <div className="admin-section-header">
            <div>
              <span className="section-eyebrow">
                CONTENT
              </span>

              <h2>Projects</h2>
            </div>

            <GlassButton onClick={openNewProject}>
              + New Project
            </GlassButton>
          </div>

          <div className="admin-table">
            {projects.length === 0 ? (
              <div className="empty-state">
                No projects found.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  className="admin-row"
                  key={project.id}
                >
                  <div className="admin-main">
                    <strong>{project.name}</strong>

                    <span>
                      {project.categoryName ||
                        "Uncategorized"}
                    </span>
                  </div>

                  <span
                    className={
                      project.status ===
                      ProjectStatus.Published
                        ? "status status-success"
                        : "status"
                    }
                  >
                    {project.status ===
                    ProjectStatus.Published
                      ? "Published"
                      : "Draft"}
                  </span>

                  <div className="admin-actions">
                    <button
                      onClick={() =>
                        openEditProject(project)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="danger-text"
                      onClick={() =>
                        deleteProject(project.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === "tasks" && (
        <section className="admin-section glass-panel">
          <div className="admin-section-header">
            <div>
              <span className="section-eyebrow">
                WORKFLOW
              </span>

              <h2>Tasks</h2>
            </div>

            <GlassButton onClick={openNewTask}>
              + New Task
            </GlassButton>
          </div>

          <div className="admin-table">
            {tasks.length === 0 ? (
              <div className="empty-state">
                No tasks found.
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  className="admin-row"
                  key={task.id}
                >
                  <div className="admin-main">
                    <strong>{task.title}</strong>

                    <span>
                      Priority {task.priority}
                    </span>
                  </div>

                  <span className="status">
                    {task.status ===
                      ProjectTaskStatus.Todo &&
                      "Todo"}

                    {task.status ===
                      ProjectTaskStatus.InProgress &&
                      "In Progress"}

                    {task.status ===
                      ProjectTaskStatus.Completed &&
                      "Completed"}
                  </span>

                  <div className="admin-actions">
                    <button
                      onClick={() =>
                        openEditTask(task)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="danger-text"
                      onClick={() =>
                        deleteTask(task.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === "categories" && (
        <section className="admin-section glass-panel">
          <div className="admin-section-header">
            <div>
              <span className="section-eyebrow">
                ORGANIZATION
              </span>

              <h2>Categories</h2>
            </div>

            <GlassButton onClick={openNewCategory}>
              + New Category
            </GlassButton>
          </div>

          <div className="admin-table">
            {categories.length === 0 ? (
              <div className="empty-state">
                No categories found.
              </div>
            ) : (
              categories.map((category) => (
                <div
                  className="admin-row"
                  key={category.id}
                >
                  <div className="admin-main">
                    <strong>
                      {category.name}
                    </strong>

                    <span>
                      {category.description ||
                        "No description"}
                    </span>
                  </div>

                  <div className="admin-actions">
                    <button
                      onClick={() =>
                        openEditCategory(category)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="danger-text"
                      onClick={() =>
                        deleteCategory(
                          category.id,
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {activeForm === "project" && (
        <ProjectForm
          project={editingProject}
          categories={categories}
          onSuccess={() =>
            handleFormSuccess(
              editingProject
                ? "Project updated."
                : "Project created.",
            )
          }
          onCancel={closeForm}
        />
      )}

      {activeForm === "task" && (
        <TaskForm
          task={editingTask}
          projects={projects}
          onSuccess={() =>
            handleFormSuccess(
              editingTask
                ? "Task updated."
                : "Task created.",
            )
          }
          onCancel={closeForm}
        />
      )}

      {activeForm === "category" && (
        <CategoryForm
          category={editingCategory}
          onSuccess={() =>
            handleFormSuccess(
              editingCategory
                ? "Category updated."
                : "Category created.",
            )
          }
          onCancel={closeForm}
        />
      )}
    </main>
  );
}