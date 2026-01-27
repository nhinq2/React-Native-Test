import { api } from './client';
import type { Project, ProjectStatus, CreateProjectInput, UpdateProjectInput } from '../types/project';

export async function fetchProjects(status?: ProjectStatus): Promise<Project[]> {
  return api.get<Project[]>('/api/projects', status ? { status } : undefined);
}

export async function fetchProjectById(id: string): Promise<Project> {
  return api.get<Project>(`/api/projects/${id}`);
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  return api.post<Project>('/api/projects', input);
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  return api.put<Project>(`/api/projects/${id}`, input);
}

export async function deleteProject(id: string): Promise<void> {
  return api.delete(`/api/projects/${id}`);
}
