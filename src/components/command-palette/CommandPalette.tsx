import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUiStore } from "@/stores/ui-store";
import { useProjectStore } from "@/stores/project-store";
import { FolderOpen } from "lucide-react";

export default function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  const { projects, createProject, setActiveProject } = useProjectStore();

  const handleClose = () => setCommandPaletteOpen(false);

  const handleNewProject = async () => {
    handleClose();
    const name = `プロジェクト ${projects.length + 1}`;
    await createProject(name);
  };

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="コマンドを入力..." />
      <CommandList>
        <CommandEmpty>コマンドが見つかりません</CommandEmpty>
        <CommandGroup heading="プロジェクト">
          <CommandItem onSelect={handleNewProject}>
            <FolderOpen className="mr-2 h-4 w-4" />
            新規プロジェクト作成
          </CommandItem>
        </CommandGroup>
        {projects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="プロジェクトを開く">
              {projects.map((p) => (
                <CommandItem
                  key={p.id}
                  onSelect={() => {
                    handleClose();
                    setActiveProject(p.id);
                  }}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {p.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
