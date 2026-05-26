import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";

interface SettingsItemDetailViewProps {
  sectionLabel: string;
  itemLabel: string;
}

export function SettingsItemDetailView({ sectionLabel, itemLabel }: SettingsItemDetailViewProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto pb-8">
        <MainCanvasViewHeader
          title={itemLabel}
          titleAs="h2"
          description={`${sectionLabel} settings`}
        />
        <div className="px-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Detailed settings for <span className="text-foreground font-medium">{itemLabel}</span> will render here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

