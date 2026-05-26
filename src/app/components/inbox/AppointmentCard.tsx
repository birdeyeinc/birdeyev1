import { CircleCheck, History, MoreHorizontal } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

export type AppointmentCardVariant = "booked" | "rescheduled";

export interface AppointmentCardData {
  patientName: string;
  patientInitials: string;
  category: string;
  appointmentType: string;
  bookingDatetime: string;
}

export interface AppointmentCardProps {
  variant: AppointmentCardVariant;
  data: AppointmentCardData;
  onReschedule?: () => void;
  onConfirm?: () => void;
  className?: string;
}

export function AppointmentCard({
  variant,
  data,
  onReschedule,
  onConfirm,
  className,
}: AppointmentCardProps) {
  const isRescheduled = variant === "rescheduled";

  return (
    <div
      className={cn(
        "w-[300px] rounded-2xl overflow-hidden",
        isRescheduled
          ? "bg-yellow-10 dark:bg-yellow-800"
          : "bg-gray-20 dark:bg-gray-800",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        {isRescheduled ? (
          <History
            className="h-[14px] w-[14px] shrink-0 text-gray-900 dark:text-foreground"
            strokeWidth={1.6}
            absoluteStrokeWidth
          />
        ) : (
          <CircleCheck
            className="h-[14px] w-[14px] shrink-0 text-gray-900 dark:text-foreground"
            strokeWidth={1.6}
            absoluteStrokeWidth
          />
        )}
        <span
          className="text-[13px] text-gray-900 dark:text-foreground"
          style={{ fontWeight: 500 }}
        >
          {isRescheduled ? "Appointment rescheduled" : "Appointment booked"}
        </span>
      </div>

      {/* Dashed divider */}
      <div className="mx-4 border-b border-dashed border-gray-60 dark:border-gray-500" />

      {/* Content */}
      <div className="flex flex-col gap-3 px-4 py-3">
        {/* Patient row */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-60 dark:bg-gray-500 text-[12px] text-gray-200 dark:text-muted-foreground" style={{ fontWeight: 500 }}>
            {data.patientInitials}
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-gray-900 dark:text-foreground">
              {data.patientName}
            </span>
            <span className="text-[12px] text-gray-80 dark:text-muted-foreground" style={{ fontWeight: 400 }}>
              {data.category}
            </span>
          </div>
        </div>

        {/* Appointment type */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-gray-80 dark:text-muted-foreground" style={{ fontWeight: 400 }}>
            Appointment type
          </span>
          <span className="text-[13px] text-gray-900 dark:text-foreground" style={{ fontWeight: 500 }}>
            {data.appointmentType}
          </span>
        </div>

        {/* Booking datetime */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-gray-80 dark:text-muted-foreground" style={{ fontWeight: 400 }}>
            Booking date and time
          </span>
          <span className="text-[13px] text-gray-900 dark:text-foreground" style={{ fontWeight: 500 }}>
            {data.bookingDatetime}
          </span>
        </div>
      </div>

      {/* Actions (rescheduled only) */}
      {isRescheduled && (
        <div className="flex items-center gap-4 px-4 pb-3">
          <button
            type="button"
            onClick={onReschedule}
            className="flex items-center gap-1 text-[13px] text-brand-color dark:text-blue-70 hover:opacity-75 transition-opacity"
            style={{ fontWeight: 400 }}
          >
            <History className="h-[13px] w-[13px]" strokeWidth={1.6} absoluteStrokeWidth />
            Reschedule
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1 text-[13px] text-brand-color dark:text-blue-70 hover:opacity-75 transition-opacity"
            style={{ fontWeight: 400 }}
          >
            <CircleCheck className="h-[13px] w-[13px]" strokeWidth={1.6} absoluteStrokeWidth />
            Confirm
          </button>
          <button
            type="button"
            className="ml-auto text-gray-80 dark:text-muted-foreground hover:opacity-75 transition-opacity"
          >
            <MoreHorizontal className="h-[14px] w-[14px]" strokeWidth={1.6} absoluteStrokeWidth />
          </button>
        </div>
      )}
    </div>
  );
}
