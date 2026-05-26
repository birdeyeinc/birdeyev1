import { Fragment } from "react";
import { Info, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { cn } from "@/app/components/ui/utils";
import { HOURS_TIME_OPTIONS, slugFieldDomPart, type HoursOfOperationSection } from "./settingsBusinessProfileData";
import { SETTINGS_FORM_FIELD_MAX_CLASS } from "./settingsFormLayout";

const ROW = "col-span-1 flex flex-col gap-2 py-4";

/** ~Half viewport max height so long time lists scroll (full list uses `HOURS_TIME_OPTIONS`). */
const HOURS_TIME_SELECT_CONTENT_CLASS = "max-h-[50dvh]";

/** Regular-hours mode radios: 13px label + scaled control (matches shell control scale). */
const HOURS_MODE_RADIO_ITEM_CLASS = "";
const HOURS_MODE_LABEL_CLASS = "text-[13px] font-normal leading-none text-foreground";

/** Weekday title + custom-hours row (13px rhythm with radios). */
const HOURS_DAY_HEADING_CLASS = "text-[13px] font-medium leading-none text-foreground";
/** Hours rows: keep default `ui/checkbox` sizing for consistency. */
const HOURS_CHECKBOX_CLASS = "transition-colors duration-150";
const HOURS_TIME_TRIGGER_CLASS = "h-8 w-[140px] text-[13px]";
const HOURS_TIME_RANGE_MUTED_CLASS = "text-[13px] text-muted-foreground";

const SCOPE = "hours-of-operation";

export function HoursOfOperationFields({
  section,
  fieldValues,
  setValue,
}: {
  section: HoursOfOperationSection;
  fieldValues: Record<string, string>;
  setValue: (key: string, value: string) => void;
}) {
  const mode = (fieldValues[`${SCOPE}:mode`] ?? section.regularMode) as "open24" | "appointment" | "custom";

  return (
    <div className="grid grid-cols-1">
      <div data-field-id={`${SCOPE}-timezone`} className={ROW}>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Time zone</p>
        </div>
        <div className="min-w-0">
          <Select
            value={fieldValues[`${SCOPE}:timezone`] || undefined}
            onValueChange={(v) => setValue(`${SCOPE}:timezone`, v)}
          >
            <SelectTrigger className={cn("w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}>
              <SelectValue placeholder="Select time zone" />
            </SelectTrigger>
            <SelectContent>
              {section.timeZoneOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div data-field-id={`${SCOPE}-business-status`} className={ROW}>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Business status</p>
        </div>
        <div className="min-w-0">
          <Select
            value={fieldValues[`${SCOPE}:businessStatus`] || undefined}
            onValueChange={(v) => setValue(`${SCOPE}:businessStatus`, v)}
          >
            <SelectTrigger className={cn("w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {section.businessStatusOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Fragment>
        <div data-field-id={`${SCOPE}-opened-on`} className={ROW}>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Opened on</p>
          </div>
          <div className="min-w-0">
            <Select
              value={fieldValues[`${SCOPE}:openedOn`] || undefined}
              onValueChange={(v) => setValue(`${SCOPE}:openedOn`, v)}
            >
              <SelectTrigger className={cn("w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}>
                <SelectValue placeholder={section.openedOnPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="May 06, 2026">May 06, 2026</SelectItem>
                <SelectItem value="Jan 01, 2024">Jan 01, 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="col-span-1">
          <Alert className="border-primary/20 bg-primary/5 text-foreground">
            <Info className="size-4 text-primary" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            <AlertDescription>
              If you select an Opened On date, Google will show the status as Recently Open. Other sites will show it as
              Open.
            </AlertDescription>
          </Alert>
        </div>
      </Fragment>

      <div className={ROW}>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Regular hours</p>
          <RadioGroup
            value={mode}
            onValueChange={(v) => setValue(`${SCOPE}:mode`, v)}
            className="mt-4 gap-2"
          >
            {(
              [
                ["open24", "Open 24/7"],
                ["appointment", "By appointment only"],
                ["custom", "Custom"],
              ] as const
            ).map(([val, label]) => (
              <div key={val} className="flex items-center gap-2">
                <RadioGroupItem
                  value={val}
                  id={`${SCOPE}-mode-${val}`}
                  className={HOURS_MODE_RADIO_ITEM_CLASS}
                />
                <Label htmlFor={`${SCOPE}-mode-${val}`} className={HOURS_MODE_LABEL_CLASS}>
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {mode === "custom"
        ? section.weekly.map((row) => {
            const closed = fieldValues[`${SCOPE}:day:${row.dayKey}:closed`] === "true";
            const start = fieldValues[`${SCOPE}:day:${row.dayKey}:int:0:start`] ?? row.intervals[0]?.start ?? "";
            const end = fieldValues[`${SCOPE}:day:${row.dayKey}:int:0:end`] ?? row.intervals[0]?.end ?? "";
            return (
              <div
                key={row.dayKey}
                data-field-id={`${SCOPE}-${slugFieldDomPart(row.dayLabel)}`}
                className={ROW}
              >
                <div className="min-w-0">
                  <p className={HOURS_DAY_HEADING_CLASS}>{row.dayLabel}</p>
                </div>
                <div className={cn("flex min-w-0 w-full flex-col gap-4", SETTINGS_FORM_FIELD_MAX_CLASS)}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${SCOPE}-${row.dayKey}-closed`}
                      checked={closed}
                      onCheckedChange={(s) => setValue(`${SCOPE}:day:${row.dayKey}:closed`, s === true ? "true" : "false")}
                      className={HOURS_CHECKBOX_CLASS}
                    />
                    <Label htmlFor={`${SCOPE}-${row.dayKey}-closed`} className={HOURS_MODE_LABEL_CLASS}>
                      Closed
                    </Label>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={closed ? undefined : start || undefined}
                      onValueChange={(v) => setValue(`${SCOPE}:day:${row.dayKey}:int:0:start`, v)}
                      disabled={closed}
                    >
                      <SelectTrigger className={HOURS_TIME_TRIGGER_CLASS}>
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent className={HOURS_TIME_SELECT_CONTENT_CLASS}>
                        {HOURS_TIME_OPTIONS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className={HOURS_TIME_RANGE_MUTED_CLASS}>–</span>
                    <Select
                      value={closed ? undefined : end || undefined}
                      onValueChange={(v) => setValue(`${SCOPE}:day:${row.dayKey}:int:0:end`, v)}
                      disabled={closed}
                    >
                      <SelectTrigger className={HOURS_TIME_TRIGGER_CLASS}>
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent className={HOURS_TIME_SELECT_CONTENT_CLASS}>
                        {HOURS_TIME_OPTIONS.map((t) => (
                          <SelectItem key={`e-${t}`} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      disabled={closed}
                      aria-label="Add hours interval"
                    >
                      <Plus className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        : null}

      <div data-field-id={`${SCOPE}-special-hours`} className={ROW}>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium text-foreground">Special hours</p>
            <Info className="size-3.5 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
          </div>
        </div>
        <div className="min-w-0">
          <Button type="button" variant="link" className="h-auto px-0 text-primary has-[>svg]:px-0">
            <Plus className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            Add special hours
          </Button>
        </div>
      </div>

      <div data-field-id={`${SCOPE}-google-more-hours`} className={ROW}>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Google – More hours</p>
        </div>
        <div className="min-w-0">
          <Button type="button" variant="link" className="h-auto px-0 text-primary has-[>svg]:px-0">
            <Plus className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            Add more hours
          </Button>
        </div>
      </div>

      <div data-field-id={`${SCOPE}-apple-more-hours`} className={ROW}>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Apple – More hours</p>
        </div>
        <div className="min-w-0">
          <Button type="button" variant="link" className="h-auto px-0 text-primary has-[>svg]:px-0">
            <Plus className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            Add more hours
          </Button>
        </div>
      </div>
    </div>
  );
}
