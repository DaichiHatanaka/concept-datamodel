import { invoke } from "@tauri-apps/api/core";
import type { Project } from "@/types/project";

// Projects
export const listProjects = () => invoke<Project[]>("list_projects");

export const getProject = (id: string) => invoke<Project>("get_project", { id });

export const createProject = (name: string, description?: string) =>
  invoke<Project>("create_project", { name, description: description ?? null });

export const updateProject = (id: string, name: string, description?: string) =>
  invoke<Project>("update_project", { id, name, description: description ?? null });

export const deleteProject = (id: string) => invoke<void>("delete_project", { id });
