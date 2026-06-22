import { Clock, CalendarDays, CircleCheck, History } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WaitlistSmsData } from "@/app/components/waitlistConversationMockData";

const VARIANT_CONFIG = {
  queued: {
    bg: "bg-blue-10 dark:bg-blue-400",
    Icon: Clock,
    label: "Added to waitlist",
  },
  slot_opened: {
    bg: "bg-yellow-10 dark:bg-yellow-800",
    Icon: CalendarDays,
    label: "A slot has opened",
  },
  booked: {
    bg: "bg-gray-20 dark:bg-gray-800",
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
          className="h-[14px] w-[14px] shrink-0 text-gray-900 dark:text-foreground"
          strokeWidth={1.6}
          absoluteStrokeWidth
        />
        <span className="text-[13px] font-medium text-gray-900 dark:text-foreground">
          {cfg.label}
        </span>
      </div>

      {/* Dashed divider */}
      <div className="mx-4 border-b border-dashed border-gray-60 dark:border-gray-500" />

      {/* Body */}
      <div className="flex flex-col gap-3 px-4 py-3">
        {/* Patient row (queued + booked) */}
        {(data.status === "queued" || data.status === "booked") && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-60 dark:bg-gray-500 text-[12px] font-medium text-gray-200 dark:text-muted-foreground">
              {data.patientInitials}
            </div>
            <span className="text-[13px] font-semibold text-gray-900 dark:text-foreground">
              {data.patientName}
            </span>
          </div>
        )}

        {/* Appointment type + provider */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-gray-80 dark:text-muted-foreground">Appointment</span>
          <span className="text-[13px] font-medium text-gray-900 dark:text-foreground">
            {data.appointmentType} · {data.provider}
          </span>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-gray-80 dark:text-muted-foreground">Location</span>
          <span className="text-[13px] font-medium text-gray-900 dark:text-foreground">
            {data.location}
          </span>
        </div>

        {/* Queue position (queued only) */}
        {data.status === "queued" && data.queuePosition != null && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-gray-80 dark:text-muted-foreground">Queue position</span>
            <span className="text-[13px] font-medium text-gray-900 dark:text-foreground">
              #{data.queuePosition} at {data.location.split(",")[0]}
            </span>
          </div>
        )}

        {/* Slot datetime (slot_opened + booked) */}
        {data.slotDatetime && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-gray-80 dark:text-muted-foreground">
              {data.status === "booked" ? "Confirmed for" : "Available slot"}
            </span>
            <span className="text-[13px] font-medium text-gray-900 dark:text-foreground">
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
            className="flex items-center gap-1 text-[13px] text-brand-color dark:text-blue-70 hover:opacity-75 transition-opacity"
          >
            <History className="h-[13px] w-[13px]" strokeWidth={1.6} absoluteStrokeWidth />
            Reschedule
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1 text-[13px] text-brand-color dark:text-blue-70 hover:opacity-75 transition-opacity"
          >
            <CircleCheck className="h-[13px] w-[13px]" strokeWidth={1.6} absoluteStrokeWidth />
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
