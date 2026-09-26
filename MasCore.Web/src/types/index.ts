export interface Project {
  id: string;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
  gitHubUrl?: string | null;
  liveUrl?: string | null;
  embedUrl?: string | null;
  technologies?: string | null;
  status: ProjectStatus;
  featured: boolean;
  displayOrder: number;
  categoryId?: string | null;
  categoryName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ProjectStatus = {
  Draft: 0,
  Published: 1,
} as const;

export type ProjectStatus =
  (typeof ProjectStatus)[keyof typeof ProjectStatus];

export interface ProjectInput {
  name: string;
  shortDescription?: string;
  description?: string;
  gitHubUrl?: string;
  liveUrl?: string;
  embedUrl?: string;
  technologies?: string;
  status: ProjectStatus;
  featured: boolean;
  displayOrder: number;
  categoryId?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
}

export interface CategoryInput {
  name: string;
  description?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string | null;
  status: ProjectTaskStatus;
  priority: number;
  dueDate?: string | null;
  projectId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ProjectTaskStatus = {
  Todo: 0,
  InProgress: 1,
  Completed: 2,
} as const;

export type ProjectTaskStatus =
  (typeof ProjectTaskStatus)[keyof typeof ProjectTaskStatus];

export interface TaskInput {
  title: string;
  description?: string;
  status: ProjectTaskStatus;
  priority: number;
  dueDate?: string | null;
  projectId?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}