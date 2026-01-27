import { create } from 'zustand';
import type { ProjectStatus } from '../types/project';

/**
 * Store for projects list filter (Task 3).
 * Use this when implementing status filter (draft | active | completed).
 */
interface FilterState {
  status: ProjectStatus | null;
  setStatus: (status: ProjectStatus | null) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  status: null,
  setStatus: (status) => set({ status }),
}));
