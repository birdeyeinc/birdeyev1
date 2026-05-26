import { Clock, CalendarDays, CircleCheck, History } from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import type { WaitlistSmsData } from "@/app/components/waitlistConversationMockData";

const VARIANT_CONFIG = {
  queued: {
    bg: "bg-[#f0f4ff] dark:bg-[#1a2540]",
    Icon: Clock,
    label: "Added to waitlist",
  },
  slot_opened: {
    bg: "bg-[#fff8ec] dark:bg-[#3a2e10]",
    Icon: CalendarDays,
    label: "A slot has opened",
  },
  booked: {
    bg: "bg-[#f0f0f0] dark:bg-[#1e2533]",
    Icon: CircleCheck,
    label: "Appointment booked",
  },
} as const;

export function WaitlistSmsCard({
  data,
  onReschedule,
  onConfirm,
  className,
}: {
  data: WaitlistSmsData;
  onReschedule?: () => void;
  onConfirm?: () => void;
  className?: string;
}) {
  const cfg = VARIANT_CONFIG[data.status];
  const { Icon } = cfg;

  return (
    <div className={cn("w-[300px] rounded-2xl overflow-hidden", cfg.bg, className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <Icon
          className="h-[14px] w-[14px] shrink-0 text-[#212121] dark:text-foreground"
          strokeWidth={1.6}
          absoluteStrokeWidth
        />
        <span className="text-[13px] font-medium text-[#212121] dark:text-foreground">
          {cfg.label}
        </span>
      </div>

      {/* Dashed divider */}
      <div className="mx-4 border-b border-dashed border-[#d0d5dd] dark:border-[#3d4555]" />

      {/* Body */}
      <div className="flex flex-col gap-3 px-4 py-3">
        {/* Patient row (queued + booked) */}
        {(data.status === "queued" || data.status === "booked") && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d0d5dd] dark:bg-[#3d4555] text-[12px] font-medium text-[#475467] dark:text-muted-foreground">
              {data.patientInitials}
            </div>
            <span className="text-[13px] font-semibold text-[#212121] dark:text-foreground">
              {data.patientName}
            </span>
          </div>
        )}

        {/* Appointment type + provider */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-[#888] dark:text-muted-foreground">Appointment</span>
          <span className="text-[13px] font-medium text-[#212121] dark:text-foreground">
            {data.appointmentType} · {data.provider}
          </span>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-[#888] dark:text-muted-foreground">Location</span>
          <span className="text-[13px] font-medium text-[#212121] dark:text-foreground">
            {data.location}
          </span>
        </div>

        {/* Queue position (queued only) */}
        {data.status === "queued" && data.queuePosition != null && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#888] dark:text-muted-foreground">Queue position</span>
            <span className="text-[13px] font-medium text-[#212121] dark:text-foreground">
              #{data.queuePosition} at {data.location.split(",")[0]}
            </span>
          </div>
        )}

        {/* Slot datetime (slot_opened + booked) */}
        {data.slotDatetime && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#888] dark:text-muted-foreground">
              {data.status === "booked" ? "Confirmed for" : "Available slot"}
            </span>
            <span className="text-[13px] font-medium text-[#212121] dark:text-foreground">
              {data.slotDatetime}
            </span>
          </div>
        )}
      </div>

      {/* Actions (slot_opened only) */}
      {data.status === "slot_opened" && (
        <div className="flex items-center gap-4 px-4 pb-3">
          <button
            type="button"
            onClick={onReschedule}
            className="flex items-center gap-1 text-[13px] text-[#2552ED] dark:text-[#6b9bff] hover:opacity-75 transition-opacity"
          >
            <History className="h-[13px] w-[13px]" strokeWidth={1.6} absoluteStrokeWidth />
            Reschedule
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1 text-[13px] text-[#2552ED] dark:text-[#6b9bff] hover:opacity-75 transition-opacity"
          >
            <CircleCheck className="h-[13px] w-[13px]" strokeWidth={1.6} absoluteStrokeWidth />
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
