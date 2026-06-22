import { useState } from "react";
import { X, Link2, Copy, Check, Users } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { reportShareService, trackReportAction, buildEvent } from "./services";
import type { ReportContext } from "./types";

interface ShareReportModalProps {
  open: boolean;
  onClose: () => void;
  context: ReportContext;
}

export function ShareReportModal({ open, onClose, context }: ShareReportModalProps) {
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [access, setAccess] = useState<"view" | "edit">("view");
  const [sending, setSending] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  if (!open) return null;

  const shareLink = reportShareService.generateShareLink(context.reportId);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setJustCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setJustCopied(false), 2000);
  };

  const handleSend = async () => {
    const recipientList = recipients
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    if (recipientList.length === 0) {
      toast.error("Please add at least one recipient");
      return;
    }

    const validation = reportShareService.validateRecipients(recipientList);
    if (!validation.valid) {
      toast.error(validation.errors[0]);
      return;
    }

    setSending(true);
    await reportShareService.share({
      reportId: context.reportId,
      recipients: recipientList,
      message,
      accessLevel: access,
    });
    trackReportAction(buildEvent("share_report_completed", context, "share", { recipientCount: recipientList.length }));
    setSending(false);
    setRecipients("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-background border border-gray-50 dark:border-border rounded-[12px] w-full max-w-[480px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-light-grayish-blue dark:border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-color" />
            <h2 className="text-[15px] text-gray-900 dark:text-foreground tracking-[-0.3px]" style={{ fontWeight: 400 }}>
              Share report
            </h2>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="w-4 h-4 text-gray-80 dark:text-muted-foreground" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Report name */}
          <div className="flex items-center gap-2 bg-gray-10 dark:bg-muted rounded-[8px] px-3 py-2.5">
            <span className="text-[13px] text-gray-80 dark:text-muted-foreground font-regular">Report:</span>
            <span className="text-[13px] text-gray-900 dark:text-foreground" style={{ fontWeight: 400 }}>{context.reportName}</span>
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

          {/* Message */}
          <div>
            <label className="block text-[12px] text-gray-80 dark:text-muted-foreground mb-1.5 tracking-[-0.24px]" style={{ fontWeight: 400 }}>Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message..."
              rows={3}
              className="w-full px-3 py-2 text-[13px] text-gray-900 dark:text-foreground bg-white dark:bg-muted border border-new-selected-color dark:border-border rounded-[8px] outline-none focus:border-brand-color transition-colors resize-none placeholder:text-gray-70 dark:placeholder:text-gray-300"
              style={{ fontWeight: 400 }}
            />
          </div>

          {/* Access level */}
          <div>
            <label className="block text-[12px] text-gray-80 dark:text-muted-foreground mb-1.5 tracking-[-0.24px]" style={{ fontWeight: 400 }}>Access</label>
            <div className="flex gap-2">
              {(["view", "edit"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setAccess(level)}
                  className={`px-3 py-1.5 text-[12px] rounded-[8px] border transition-colors capitalize tracking-[-0.24px] ${
                    access === level
                      ? "text-brand-color dark:text-blue-70 bg-blue-10 dark:bg-blue-300 border-brand-color/20 dark:border-brand-color/30"
                      : "text-gray-80 dark:text-muted-foreground bg-white dark:bg-muted border-new-selected-color dark:border-border hover:bg-gray-20 dark:hover:bg-muted"
                  }`}
                  style={{ fontWeight: 400 }}
                >
                  Can {level}
                </button>
              ))}
            </div>
          </div>

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-[13px] text-brand-color dark:text-blue-70 hover:underline"
            style={{ fontWeight: 400 }}
          >
            {justCopied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
            {justCopied ? "Copied!" : "Copy share link"}
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-light-grayish-blue dark:border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-gray-900 dark:text-foreground border border-new-selected-color dark:border-border rounded-[8px] hover:bg-gray-20 dark:hover:bg-muted transition-colors"
            style={{ fontWeight: 400 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-4 py-2 text-[13px] text-white bg-brand-color hover:bg-brand-color rounded-[8px] transition-colors disabled:opacity-60"
            style={{ fontWeight: 400 }}
          >
            {sending ? "Sending..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}
