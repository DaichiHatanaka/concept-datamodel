import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProjectPanel from "@/components/panels/ProjectPanel";
import CommandPalette from "@/components/command-palette/CommandPalette";
import { useUiStore } from "@/stores/ui-store";
import { useProjectStore } from "@/stores/project-store";
import { cn } from "@/lib/utils";
import { PanelLeft, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function App() {
  const { isSidebarOpen, toggleSidebar, setCommandPaletteOpen } = useUiStore();
  const { activeProjectId } = useProjectStore();

  // Cmd/Ctrl+K でコマンドパレットを開く
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground flex h-screen w-screen flex-col overflow-hidden">
        {/* Top toolbar */}
        <header className="flex h-10 shrink-0 items-center gap-1 border-b px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleSidebar}>
                <PanelLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>サイドバーを切替</TooltipContent>
          </Tooltip>

          <div className="flex-1" />

          <span className="text-muted-foreground text-xs font-semibold">Tauri App</span>

          <div className="flex-1" />
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside
            className={cn(
              "flex w-64 shrink-0 flex-col border-r transition-all duration-200",
              !isSidebarOpen && "w-0 overflow-hidden border-0",
            )}
          >
            <ProjectPanel />
          </aside>

          {/* Main area */}
          <main className="relative flex-1 overflow-hidden">
            {activeProjectId ? (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3">
                <FolderOpen className="h-12 w-12 opacity-30" />
                <p className="text-sm">ここにメインコンテンツを追加してください</p>
              </div>
            ) : (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3">
                <FolderOpen className="h-12 w-12 opacity-30" />
                <p className="text-sm">サイドバーからプロジェクトを選択してください</p>
                <p className="text-xs opacity-60">⌘K でコマンドパレットを開く</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <CommandPalette />
    </TooltipProvider>
  );
}
