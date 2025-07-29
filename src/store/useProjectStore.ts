import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ProjectResponse } from '@/types/api';
import { projectApi } from '@/service/projectService';

interface ProjectState {
    projects: ProjectResponse[];
    isLoading: boolean;
    error: string | null;
    selectedProject: ProjectResponse | null;
    fetchProjects: () => Promise<void>;
    addProject: (projectData: any) => Promise<void>;
    updateProject: (id: number, projectData: any) => Promise<boolean>;
    deleteProject: (id: number) => Promise<void>;
    setSelectedProject: (project: ProjectResponse | null) => void;
}

export const useProjectStore = create<ProjectState>()(
    devtools(
        (set) => ({
            projects: [],
            isLoading: false,
            error: null,
            selectedProject: null,
            fetchProjects: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const data = await projectApi.getAllProjects();
                    set({ projects: data, isLoading: false });
                } catch (err) {
                    set({ error: err instanceof Error ? err.message : 'Failed to load projects', isLoading: false });
                }
            },
            addProject: async (projectData) => {
                try {
                    set({ isLoading: true, error: null });
                    const newProject = await projectApi.createProject(projectData);
                    set((state) => ({
                        projects: [...state.projects, newProject],
                        isLoading: false
                    }));
                } catch (err) {
                    set({ error: err instanceof Error ? err.message : 'Failed to add project', isLoading: false });
                }
            },
            updateProject: async (id, projectData): Promise<boolean> => {
                try {
                    set({ isLoading: true, error: null });
                    const updatedProject = await projectApi.updateProject(id, projectData);
                    set((state) => ({
                        projects: state.projects.map(project =>
                            project.id === id ? updatedProject : project
                        ),
                        isLoading: false
                    }));
                    return true;
                } catch (err) {
                    console.log("updateProject");
                    console.log(err);
                    set({ error: err instanceof Error ? err.message : 'Failed to update project', isLoading: false });
                    return false;
                }
            },
            deleteProject: async (id) => {
                try {
                    set({ isLoading: true, error: null });
                    await projectApi.deleteProject(id);
                    set((state) => ({
                        projects: state.projects.filter(project => project.id !== id),
                        isLoading: false
                    }));
                } catch (err) {
                    set({ error: err instanceof Error ? err.message : 'Failed to delete project', isLoading: false });
                }
            },
            setSelectedProject: (project) => {
                set({ selectedProject: project });
            }
        })
    )
); 