import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { InlineSelectField } from "@/app/components/ui/inline-select-field";
import { reportScheduleService, trackReportAction, buildEvent } from "./services";
import type { ReportContext } from "./types";

interface ScheduleReportModalProps {
  open: boolean;
  onClose: () => void;
  context: ReportContext;
}

export function ScheduleReportModal({ open, onClose, context }: ScheduleReportModalProps) {
  const frequencies = reportScheduleService.getFrequencyOptions();
  const days = reportScheduleService.getDayOptions();
  const times = reportScheduleService.getTimeOptions();
  const timezones = reportScheduleService.getTimezoneOptions();
  const formats = reportScheduleService.getFormatOptions();

  const [frequency, setFrequency] = useState<string>(frequencies[1]);
  const [day, setDay] = useState<string>(days[0]);
  const [time, setTime] = useState<string>(times[9]);
  const [timezone, setTimezone] = useState<string>("US/Eastern");
  const [format, setFormat] = useState<string>("pdf");
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState(`${context.reportName} report`);
  const [body, setBody] = useState(`Hi,\n\nPlease find the latest ${context.reportName} report attached.\n\nBest regards`);
  const [saving, setSaving] = useState(false);

  // Reset subject when context changes
  useEffect(() => {
    setSubject(`${context.reportName} report`);
    setBody(`Hi,\n\nPlease find the latest ${context.reportName} report attached.\n\nBest regards`);
  }, [context.reportName]);

  if (!open) return null;

  const handleSave = async () => {
    setSaving(true);
    const recipientList = recipients.split(",").map((r) => r.trim()).filter(Boolean);
    await reportScheduleService.create({
      reportId: context.reportId,
      frequency,
      day,
      time,
      timezone,
      format,
      recipients: recipientList,
      subject,
      body,
    });
    trackReportAction(buildEvent("schedule_report_completed", context, "schedule"));
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-background border border-gray-50 dark:border-border rounded-[12px] w-full max-w-[520px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-light-grayish-blue dark:border-border shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-color" />
            <h2 className="text-[15px] text-gray-900 dark:text-foreground tracking-[-0.3px]" style={{ fontWeight: 400 }}>
              Schedule report
            </h2>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="w-4 h-4 text-gray-80 dark:text-muted-foreground" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
          {/* Report name */}
          <div className="flex items-center gap-2 bg-gray-10 dark:bg-muted rounded-[8px] px-3 py-2.5">
            <span className="text-[13px] text-gray-80 dark:text-muted-foreground font-regular">Report:</span>
            <span className="text-[13px] text-gray-900 dark:text-foreground" style={{ fontWeight: 400 }}>{context.reportName}</span>
          </div>

          {/* Frequency / Day / Time row */}
          <div className="grid grid-cols-3 gap-3">
            <InlineSelectField size="md" label="Frequency" value={frequency} options={frequencies} onChange={setFrequency} />
            <InlineSelectField size="md" label="Day" value={day} options={days} onChange={setDay} />
            <InlineSelectField size="md" label="Time" value={time} options={times} onChange={setTime} />
          </div>

          {/* Timezone */}
          <InlineSelectField size="md" label="Timezone" value={timezone} options={timezones} onChange={setTimezone} />

          {/* Format */}
          <div>
            <label className="block text-[12px] text-gray-80 dark:text-muted-foreground mb-1.5 tracking-[-0.24px]" style={{ fontWeight: 400 }}>Format</label>
            <div className="flex gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`px-3 py-1.5 text-[12px] rounded-[8px] border transition-colors uppercase tracking-[0.3px] ${
                    format === f.id
                      ? "text-brand-color dark:text-blue-70 bg-blue-10 dark:bg-blue-300 border-brand-color/20 dark:border-brand-color/30"
                      : "text-gray-80 dark:text-muted-foreground bg-white dark:bg-muted border-new-selected-color dark:border-border hover:bg-gray-20 dark:hover:bg-muted"
                  }`}
                  style={{ fontWeight: 400 }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-[12px] text-gray-80 dark:text-muted-foreground mb-1.5 tracking-[-0.24px]" style={{ fontWeight: 400 }}>Recipients</label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="Enter email addresses, separated by commas"
              className="w-full px-3 py-2 text-[13px] text-gray-900 dark:text-foreground bg-white dark:bg-muted border border-new-selected-color dark:border-border rounded-[8px] outline-none focus:border-brand-color transition-colors placeholder:text-gray-70 dark:placeholder:text-gray-300"
              style={{ fontWeight: 400 }}
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[12px] text-gray-80 dark:text-muted-foreground mb-1.5 tracking-[-0.24px]" style={{ fontWeight: 400 }}>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-[13px] text-gray-900 dark:text-foreground bg-white dark:bg-muted border border-new-selected-color dark:border-border rounded-[8px] outline-none focus:border-brand-color transition-colors"
              style={{ fontWeight: 400 }}
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-[12px] text-gray-80 dark:text-muted-foreground mb-1.5 tracking-[-0.24px]" style={{ fontWeight: 400 }}>Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-[13px] text-gray-900 dark:text-foreground bg-white dark:bg-muted border border-new-selected-color dark:border-border rounded-[8px] outline-none focus:border-brand-color transition-colors resize-none"
              style={{ fontWeight: 400 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-light-grayish-blue dark:border-border shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-gray-900 dark:text-foreground border border-new-selected-color dark:border-border rounded-[8px] hover:bg-gray-20 dark:hover:bg-muted transition-colors"
            style={{ fontWeight: 400 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-[13px] text-white bg-brand-color hover:bg-brand-color rounded-[8px] transition-colors disabled:opacity-60"
            style={{ fontWeight: 400 }}
          >
            {saving ? "Saving..." : context.existingScheduleId ? "Update schedule" : "Create schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
