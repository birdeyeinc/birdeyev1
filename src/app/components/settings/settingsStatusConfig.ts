export type SettingsConnectionStatus =
  | "connected"
  | "partial"
  | "needs_attention"
  | "not_connected"
  | "disconnected";

export interface SettingsStatusMeta {
  type: SettingsConnectionStatus;
  label: string;
}

export const STATUS_DOT_CLASS: Record<SettingsConnectionStatus, string> = {
  connected:       "bg-emerald-500 dark:bg-emerald-400",
  partial:         "bg-amber-500 dark:bg-amber-400",
  needs_attention: "bg-amber-500 dark:bg-amber-400",
  not_connected:   "bg-slate-400 dark:bg-slate-500",
  disconnected:    "bg-rose-500 dark:bg-rose-400",
};

export const STATUS_LABEL_CLASS: Record<SettingsConnectionStatus, string> = {
  connected:       "text-muted-foreground",
  partial:         "text-muted-foreground",
  needs_attention: "text-muted-foreground",
  not_connected:   "text-muted-foreground",
  disconnected:    "text-muted-foreground",
};
