import { Button } from "@/app/components/ui/button";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";

export function ProvidersView() {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      <MainCanvasViewHeader
        title="Providers"
        description="Manage providers and their availability across all locations."
        actions={
          <Button type="button">Add provider</Button>
        }
      />
    </div>
  );
}
