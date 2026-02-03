import { api } from './client';
import type { Project, ProjectStatus, CreateProjectInput, UpdateProjectInput, PaginatedProjects } from '../types/project';

const DEFAULT_PAGE_SIZE = 20;

export interface FetchProjectsParams {
  status?: ProjectStatus;
  limit?: number;
  offset?: number;
}

export async function fetchProjects(params?: FetchProjectsParams): Promise<PaginatedProjects> {
  const search: Record<string, string> = {};
  if (params?.status) search.status = params.status;
  if (params?.limit != null) search.limit = String(params.limit);
  if (params?.offset != null) search.offset = String(params.offset);
  return api.get<PaginatedProjects>('/api/projects', Object.keys(search).length ? search : undefined);
}

export async function fetchProjectsPage(
  status: ProjectStatus | undefined,
  offset: number,
  limit: number = DEFAULT_PAGE_SIZE
): Promise<PaginatedProjects> {
  return fetchProjects({ status, limit, offset });
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
