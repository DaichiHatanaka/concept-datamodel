import { useEffect } from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectStore } from "@/stores/project-store";
import { cn } from "@/lib/utils";

export default function ProjectPanel() {
  const { projects, activeProjectId, loadProjects, setActiveProject, createProject } =
    useProjectStore();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleNewProject = async () => {
    const name = `プロジェクト ${projects.length + 1}`;
    const project = await createProject(name);
    setActiveProject(project.id);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-semibold">プロジェクト</span>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleNewProject}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {projects.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 px-4 py-8 text-center text-sm">
            <FolderOpen className="h-8 w-8" />
            <span>プロジェクトがありません</span>
            <Button size="sm" variant="outline" onClick={handleNewProject}>
              新規作成
            </Button>
          </div>
        ) : (
          <div className="p-2">
            {projects.map((project) => (
              <button
                key={project.id}
                className={cn(
                  "hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm",
                  activeProjectId === project.id && "bg-accent font-medium",
                )}
                onClick={() => setActiveProject(project.id)}
              >
                <FolderOpen className="text-muted-foreground h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{project.name}</span>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
