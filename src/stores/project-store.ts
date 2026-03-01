import { create } from "zustand";
import type { Project } from "@/types/project";
import * as tauriApi from "@/lib/tauri";

interface ProjectStore {
  projects: Project[];
  activeProjectId: string | null;

  // Actions
  loadProjects: () => Promise<void>;
  setActiveProject: (id: string | null) => void;
  createProject: (name: string, description?: string) => Promise<Project>;
  updateProject: (id: string, name: string, description?: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  activeProjectId: null,

  loadProjects: async () => {
    const projects = await tauriApi.listProjects();
    set({ projects });
  },

  setActiveProject: (id) => set({ activeProjectId: id }),

  createProject: async (name, description) => {
    const project = await tauriApi.createProject(name, description);
    set((state) => ({ projects: [project, ...state.projects] }));
    return project;
  },

  updateProject: async (id, name, description) => {
    const updated = await tauriApi.updateProject(id, name, description);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
    }));
  },

  deleteProject: async (id) => {
    await tauriApi.deleteProject(id);
    const { activeProjectId } = get();
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      activeProjectId: activeProjectId === id ? null : activeProjectId,
    }));
  },
}));
