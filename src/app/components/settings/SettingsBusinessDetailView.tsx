import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, ChevronDown, Info, Plus, Search, Sparkles } from "lucide-react";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { MAIN_VIEW_PRIMARY_HEADING_CLASS } from "@/app/components/layout/mainViewTitleClasses";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SELECT_TRIGGER_SHELL_CLASSNAME,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { cn } from "@/app/components/ui/utils";
import { CHILD_ACTIVE, CHILD_INACTIVE } from "@/app/components/L2NavLayout.v1";
import type { SettingsBusinessRow } from "./settingsBusinessTableData";
import { HoursOfOperationFields } from "./HoursOfOperationFields";
import { SettingsMapMarkerField } from "./SettingsMapMarkerField";
import {
  buildBusinessProfileSearchIndex,
  getSettingsBusinessProfileData,
  seedBusinessInformationValues,
  seedHoursOfOperationValues,
  slugFieldDomPart,
  type BusinessInformationField,
  type ProfileField,
  type ProfileFieldControl,
} from "./settingsBusinessProfileData";
import { SETTINGS_FORM_FIELD_MAX_CLASS } from "./settingsFormLayout";

const SOCIAL_URL_PLACEHOLDER = "Please enter a URL";

/** Single-column field rows: label and control stack vertically (used across business profile settings). */
const ROW_GRID_CLASS = "col-span-1 flex flex-col gap-2 py-4";

function defaultActiveSectionKey(initial: string | undefined, items: { key: string }[]): string {
  if (initial && items.some((s) => s.key === initial)) return initial;
  return items[0]?.key ?? "business-information";
}

interface SettingsBusinessDetailViewProps {
  row: SettingsBusinessRow;
  onNavigateHome?: () => void;
  onNavigateTable?: () => void;
  activeTab?: "business-info" | "reviews";
  onTabChange?: (tab: "business-info" | "reviews") => void;
  /** Storybook / tests: e.g. `channel-0` for Google business listing */
  initialSectionKey?: string;
}

function resolveControl(field: ProfileField, isSocialUrl: boolean): ProfileFieldControl {
  if (isSocialUrl) return "url";
  if (field.control) return field.control;
  if (field.maxLength != null && field.maxLength > 0) return "textarea";
  if (/description|impressum/i.test(field.label)) return "textarea";
  return "text";
}

function formatCounter(current: number, max: number): string {
  const spaced = max > 1000;
  const c = current.toLocaleString();
  const m = max.toLocaleString();
  return spaced ? `${c} / ${m}` : `${c}/${m}`;
}

function SectionFormCard({
  title,
  badge,
  children,
  className,
}: {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  /** Optional shell (e.g. channel accent border). */
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
    >
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3 className={MAIN_VIEW_PRIMARY_HEADING_CLASS}>{title}</h3>
          {badge}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-4">{children}</div>
    </div>
  );
}

function renderBusinessInformationFields(
  fields: BusinessInformationField[],
  fieldValues: Record<string, string>,
  setValue: (key: string, value: string) => void,
  categoryOpen: boolean,
  setCategoryOpen: (open: boolean) => void,
): ReactNode[] {
  return fields.map((field) => {
    const bi = "business-information";

    switch (field.kind) {
      case "name":
        return (
          <div key={field.id} data-field-id={`${bi}-${field.id}`} className={ROW_GRID_CLASS}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {field.label}
                <span className="text-destructive"> *</span>
              </p>
            </div>
            <div className="min-w-0 space-y-2">
              <Input
                value={fieldValues.name ?? ""}
                onChange={(e) => setValue("name", e.target.value)}
                className={cn("w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}
              />
              <p className="text-xs text-muted-foreground">
                {field.guidelineBefore}
                <a href={field.guidelineHref} className="text-primary underline-offset-4 hover:underline">
                  {field.guidelineLinkText}
                </a>
              </p>
            </div>
          </div>
        );

      case "type":
        return (
          <div key={field.id} data-field-id={`${bi}-${field.id}`} className={ROW_GRID_CLASS}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{field.label}</p>
            </div>
            <div className="min-w-0">
              <RadioGroup
                value={fieldValues.type ?? ""}
                onValueChange={(v) => setValue("type", v)}
                className="gap-2"
              >
                {field.options.map((opt) => (
                  <div key={opt} className="flex items-center gap-2">
                    <RadioGroupItem value={opt} id={`${bi}-type-${slugFieldDomPart(opt)}`} />
                    <Label htmlFor={`${bi}-type-${slugFieldDomPart(opt)}`} className="font-normal text-foreground">
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case "address":
        return (
          <div key={field.id} data-field-id={`${bi}-${field.id}`} className={ROW_GRID_CLASS}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {field.label}
                <span className="text-destructive"> *</span>
              </p>
            </div>
            <div className={cn("min-w-0 flex flex-col gap-4", SETTINGS_FORM_FIELD_MAX_CLASS)}>
              <Select
                value={fieldValues["address:country"] || undefined}
                onValueChange={(v) => setValue("address:country", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {field.countryOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={fieldValues["address:street"] ?? ""}
                onChange={(e) => setValue("address:street", e.target.value)}
                placeholder={field.streetPlaceholder}
              />
              <Input
                value={fieldValues["address:apt"] ?? ""}
                onChange={(e) => setValue("address:apt", e.target.value)}
                placeholder={field.aptPlaceholder}
              />
              <Input
                value={fieldValues["address:city"] ?? ""}
                onChange={(e) => setValue("address:city", e.target.value)}
                placeholder={field.cityPlaceholder}
              />
              {field.stateOptions?.length ? (
                <Select
                  value={fieldValues["address:state"] || undefined}
                  onValueChange={(v) => setValue("address:state", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={field.statePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.stateOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={fieldValues["address:state"] ?? ""}
                  onChange={(e) => setValue("address:state", e.target.value)}
                  placeholder={field.statePlaceholder}
                />
              )}
              <Input
                value={fieldValues["address:zip"] ?? ""}
                onChange={(e) => setValue("address:zip", e.target.value)}
                placeholder={field.zipPlaceholder}
              />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`${bi}-hide-listing`}
                    checked={fieldValues["address:hideListing"] === "true"}
                    onCheckedChange={(s) => setValue("address:hideListing", s === true ? "true" : "false")}
                  />
                  <div className="flex items-center gap-1">
                    <Label htmlFor={`${bi}-hide-listing`} className="font-normal text-foreground">
                      {field.hideAddressLabel}
                    </Label>
                    <Info className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`${bi}-service-customer`}
                    checked={fieldValues["address:serviceAtCustomer"] === "true"}
                    onCheckedChange={(s) => setValue("address:serviceAtCustomer", s === true ? "true" : "false")}
                  />
                  <Label htmlFor={`${bi}-service-customer`} className="font-normal text-foreground">
                    {field.serviceAtCustomerLabel}
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      case "mapMarker": {
        return (
          <div key={field.id} data-field-id={`${bi}-${field.id}`} className={ROW_GRID_CLASS}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {field.label}
                <span className="text-destructive"> *</span>
              </p>
            </div>
            <div className={cn("min-w-0 flex flex-col gap-4", SETTINGS_FORM_FIELD_MAX_CLASS)}>
              <SettingsMapMarkerField query={fieldValues["map:query"] ?? ""} emptyMessage={field.emptyMessage} />
              <Input
                value={fieldValues["map:query"] ?? ""}
                onChange={(e) => setValue("map:query", e.target.value)}
                placeholder="Search or adjust map location"
                aria-label="Map location query"
              />
            </div>
          </div>
        );
      }

      case "mainPhone":
        return (
          <div key={field.id} data-field-id={`${bi}-${field.id}`} className={ROW_GRID_CLASS}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{field.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{field.description}</p>
            </div>
            <div className="min-w-0">
              <Input
                type="tel"
                value={fieldValues.mainPhone ?? ""}
                onChange={(e) => setValue("mainPhone", e.target.value)}
                className={cn("w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}
              />
            </div>
          </div>
        );

      case "email":
        return (
          <div key={field.id} data-field-id={`${bi}-${field.id}`} className={ROW_GRID_CLASS}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{field.label}</p>
            </div>
            <div className="min-w-0">
              <Input
                type="email"
                value={fieldValues.email ?? ""}
                onChange={(e) => setValue("email", e.target.value)}
                className={cn("w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}
              />
            </div>
          </div>
        );

      case "website":
        return (
          <div key={field.id} data-field-id={`${bi}-${field.id}`} className={ROW_GRID_CLASS}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{field.label}</p>
            </div>
            <div className="min-w-0">
              <Input
                type="url"
                value={fieldValues.website ?? ""}
                onChange={(e) => setValue("website", e.target.value)}
                className={cn("w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}
              />
            </div>
          </div>
        );

      case "category": {
        const primaryVal = fieldValues["category:primary"] ?? "";
        return (
          <div key={field.id} data-field-id={`${bi}-${field.id}`} className={ROW_GRID_CLASS}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{field.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{field.intro}</p>
            </div>
            <div className={cn("min-w-0 flex flex-col gap-4", SETTINGS_FORM_FIELD_MAX_CLASS)}>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {field.primaryLabel}
                  {field.primaryRequired ? <span className="text-destructive"> *</span> : null}
                </p>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      role="combobox"
                      aria-expanded={categoryOpen}
                      className={cn(
                        SELECT_TRIGGER_SHELL_CLASSNAME,
                        "h-9 font-normal",
                        primaryVal ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate text-left">
                        {primaryVal ? primaryVal : "Find category"}
                      </span>
                      <ChevronDown className="size-4 shrink-0 opacity-50" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className={cn(
                      "w-[var(--radix-popover-trigger-width)] p-0",
                      SETTINGS_FORM_FIELD_MAX_CLASS,
                    )}
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Find" />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {field.primaryOptions.map((opt) => (
                            <CommandItem
                              key={opt}
                              value={opt}
                              onSelect={() => {
                                setValue("category:primary", opt);
                                setCategoryOpen(false);
                              }}
                            >
                              <Check
                                className={cn("mr-2 size-4", primaryVal === opt ? "opacity-100" : "opacity-0")}
                                strokeWidth={1.6}
                                absoluteStrokeWidth
                                aria-hidden
                              />
                              {opt}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-foreground">{field.additionalLabel}</p>
                  <Info className="size-3.5 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </div>
                <Input
                  value={fieldValues["category:additional"] ?? ""}
                  onChange={(e) => setValue("category:additional", e.target.value)}
                  placeholder={field.additionalPlaceholder}
                />
              </div>
            </div>
          </div>
        );
      }

      case "description": {
        const max = field.maxLength;
        const value = fieldValues.description ?? "";
        const len = value.length;
        const descriptionId = `${bi}-description`;
        return (
          <div key={field.id} data-field-id={`${bi}-${field.id}`} className={ROW_GRID_CLASS}>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <Label htmlFor={descriptionId} className="text-foreground">
                  {field.label}
                </Label>
                {field.showInfoIcon ? (
                  <Info className="size-3.5 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                ) : null}
              </div>
            </div>
            <div className="min-w-0">
              <div className={cn("relative w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}>
                <Textarea
                  id={descriptionId}
                  value={value}
                  onChange={(e) => {
                    let v = e.target.value;
                    if (v.length > max) v = v.slice(0, max);
                    setValue("description", v);
                  }}
                  placeholder={field.placeholder}
                  rows={4}
                  className="min-h-[120px] w-full pb-9 pl-10 pr-12 text-left"
                />
                <span className="pointer-events-none absolute bottom-2 right-2 z-[1] text-xs tabular-nums text-muted-foreground">
                  {formatCounter(len, max)}
                </span>
                <button
                  type="button"
                  className="absolute bottom-2 left-2 rounded-md p-1 text-primary hover:bg-primary/10"
                  aria-label="BirdAI"
                >
                  <Sparkles className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </button>
              </div>
            </div>
          </div>
        );
      }

      case "gbpCheckbox":
        return (
          <div key={field.id} data-field-id={`${bi}-${field.id}`} className={ROW_GRID_CLASS}>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{field.sectionHeading}</p>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`${bi}-gbp`}
                  checked={fieldValues.gbp === "true"}
                  onCheckedChange={(s) => setValue("gbp", s === true ? "true" : "false")}
                />
                <Label htmlFor={`${bi}-gbp`} className="font-normal text-foreground">
                  {field.checkboxLabel}
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  });
}

export function SettingsBusinessDetailView({
  row,
  onNavigateHome,
  onNavigateTable,
  activeTab = "business-info",
  onTabChange,
  initialSectionKey,
}: SettingsBusinessDetailViewProps) {
  const isBusinessTab = activeTab === "business-info";
  const profile = useMemo(
    () => getSettingsBusinessProfileData(row),
    [row.id, row.businessName, row.location, row.status, row.type, row.timezone, row.owner],
  );
  const sectionItems = useMemo(
    () => [
      { key: "business-information", label: profile.businessInformation.title },
      { key: "hours-of-operation", label: profile.hoursOfOperation.title },
      { key: "additional-information", label: profile.additionalInformation.title },
      { key: "media-gallery", label: "Media gallery" },
      ...profile.channelOverrides.map((section, index) => ({
        key: `channel-${index}`,
        label: section.title,
      })),
      { key: "social-profiles", label: "Social profiles" },
      { key: "custom-fields", label: "Custom fields" },
    ],
    [profile],
  );
  const [activeSectionKey, setActiveSectionKey] = useState(() =>
    defaultActiveSectionKey(initialSectionKey, sectionItems),
  );
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingFieldDomId, setPendingFieldDomId] = useState<string | null>(null);
  const [biCategoryOpen, setBiCategoryOpen] = useState(false);
  const [mediaAlbumTab, setMediaAlbumTab] = useState("exterior");

  const searchIndex = useMemo(() => buildBusinessProfileSearchIndex(profile), [profile]);

  const searchHits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter((hit) => hit.haystack.includes(q));
  }, [searchIndex, searchQuery]);

  useEffect(() => {
    setActiveSectionKey(defaultActiveSectionKey(initialSectionKey, sectionItems));
  }, [row.id, initialSectionKey, sectionItems]);

  useEffect(() => {
    const next: Record<string, string> = {};
    const addFields = (scope: string, fields: ProfileField[]) => {
      fields.forEach((field) => {
        next[`${scope}:${field.label}`] = field.value ?? "";
      });
    };
    Object.assign(next, seedBusinessInformationValues(profile.businessInformation.fields));
    Object.assign(next, seedHoursOfOperationValues(profile.hoursOfOperation));
    addFields("additional-information", profile.additionalInformation.fields);
    profile.channelOverrides.forEach((section, index) => addFields(`channel-${index}`, section.fields));
    addFields(
      "social-profiles",
      profile.socialProfiles.map((field) => ({ label: field.platform, value: field.value })),
    );
    addFields("custom-fields", profile.customFields);
    profile.mediaGallery.forEach((media) => {
      next[`media-gallery:${media.label}`] = media.value ?? "";
    });
    setFieldValues(next);
  }, [profile, row.id]);

  useEffect(() => {
    if (!pendingFieldDomId) return;
    const timer = window.setTimeout(() => {
      const el = document.querySelector(`[data-field-id="${pendingFieldDomId}"]`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      setPendingFieldDomId(null);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [pendingFieldDomId, activeSectionKey]);

  const setValue = useCallback((fieldKey: string, nextValue: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldKey]: nextValue }));
  }, []);

  const onPickSearchHit = useCallback(
    (sectionKey: string, fieldDomId: string) => {
      setActiveSectionKey(sectionKey);
      setSearchQuery("");
      setSearchOpen(false);
      setPendingFieldDomId(fieldDomId);
    },
    [],
  );

  const renderControl = (
    field: ProfileField,
    fieldKey: string,
    control: ProfileFieldControl,
    placeholder: string,
  ) => {
    const value = fieldValues[fieldKey] ?? "";

    if (control === "heading") return null;

    if (control === "readOnlyLink") {
      const href = field.value ?? value;
      if (!href) return <p className="text-sm text-muted-foreground">—</p>;
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline break-all"
        >
          {href}
        </a>
      );
    }

    if (control === "linkAction") {
      return (
        <Button type="button" variant="link" className="h-auto px-0 text-primary">
          {field.linkActionLabel ?? `Add ${field.label}`}
        </Button>
      );
    }

    if (control === "multiSelect" && field.options?.length) {
      const selected = value ? value.split(",").filter(Boolean) : [];
      const toggle = (opt: string) => {
        const set = new Set(selected);
        if (set.has(opt)) set.delete(opt);
        else set.add(opt);
        setValue(fieldKey, [...set].join(","));
      };
      const summary =
        selected.length === 0 ? (field.placeholder ?? "Select payment methods") : `${selected.length} selected`;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                SELECT_TRIGGER_SHELL_CLASSNAME,
                "h-9 font-normal",
                selected.length === 0 ? "text-muted-foreground" : "text-foreground",
                SETTINGS_FORM_FIELD_MAX_CLASS,
              )}
            >
              <span className="min-w-0 flex-1 truncate text-left">{summary}</span>
              <ChevronDown className="size-4 shrink-0 opacity-50" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="start">
            <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
              {field.options.map((opt) => (
                <div key={opt} className="flex items-center gap-2">
                  <Checkbox
                    id={`${fieldKey}-${opt}`}
                    checked={selected.includes(opt)}
                    onCheckedChange={() => toggle(opt)}
                  />
                  <Label htmlFor={`${fieldKey}-${opt}`} className="font-normal text-foreground">
                    {opt}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    if (control === "number") {
      return (
        <Input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(fieldKey, e.target.value)}
          placeholder={placeholder}
          className={cn("w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}
        />
      );
    }

    if (control === "checkbox") {
      const checked = value === "true";
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            id={fieldKey}
            checked={checked}
            onCheckedChange={(state) => setValue(fieldKey, state === true ? "true" : "false")}
          />
          {field.checkboxLabel ? (
            <Label htmlFor={fieldKey} className="font-normal text-foreground">
              {field.checkboxLabel}
            </Label>
          ) : null}
        </div>
      );
    }

    if (control === "select" && field.options?.length) {
      return (
        <Select value={value || undefined} onValueChange={(v) => setValue(fieldKey, v)}>
          <SelectTrigger className={cn("w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (control === "textarea") {
      const max = field.maxLength;
      const len = value.length;
      return (
        <div className={cn("relative w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}>
          <Textarea
            value={value}
            onChange={(e) => {
              let v = e.target.value;
              if (max != null && v.length > max) v = v.slice(0, max);
              setValue(fieldKey, v);
            }}
            placeholder={placeholder}
            rows={4}
            className={cn(
              "min-h-[120px] w-full text-left",
              max != null && "pb-9 pr-12",
              field.showAiHint && "pl-10",
            )}
          />
          {max != null ? (
            <span className="pointer-events-none absolute bottom-2 right-2 z-[1] text-xs tabular-nums text-muted-foreground">
              {formatCounter(len, max)}
            </span>
          ) : null}
          {field.showAiHint ? (
            <button
              type="button"
              className="absolute bottom-2 left-2 rounded-md p-1 text-primary hover:bg-primary/10"
              aria-label="BirdAI"
            >
              <Sparkles className="size-4" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
            </button>
          ) : null}
        </div>
      );
    }

    const inputType =
      control === "email" ? "email" : control === "url" || control === "tel" ? control : "text";

    return (
      <Input
        type={inputType}
        value={value}
        onChange={(e) => setValue(fieldKey, e.target.value)}
        placeholder={placeholder}
        className={cn("w-full", SETTINGS_FORM_FIELD_MAX_CLASS)}
      />
    );
  };

  const renderFieldRows = (scope: string, fields: ProfileField[], options?: { isSocial?: boolean }) => {
    let lastSubsection = "";
    return fields.map((field) => {
      const fieldKey = `${scope}:${field.label}`;
      const rowDomId = `${scope}-${slugFieldDomPart(field.label)}`;
      const isSocial = options?.isSocial ?? false;
      const control = resolveControl(field, isSocial);
      const placeholder =
        field.placeholder ?? (isSocial ? SOCIAL_URL_PLACEHOLDER : `Enter ${field.label.toLowerCase()}`);

      const subsectionBlock =
        field.subsection && field.subsection !== lastSubsection ? (
          <h4 className="col-span-1 pt-6 text-sm font-semibold text-foreground first:pt-0">{field.subsection}</h4>
        ) : null;
      if (field.subsection) lastSubsection = field.subsection;

      if (control === "heading") {
        return (
          <Fragment key={fieldKey}>
            <div data-field-id={rowDomId} className="col-span-1 pb-2 pt-6">
              <h4 className="text-sm font-semibold tracking-wide text-foreground">{field.label}</h4>
            </div>
          </Fragment>
        );
      }

      return (
        <Fragment key={fieldKey}>
          {subsectionBlock}
          <div
            data-field-id={rowDomId}
            className={cn(
              ROW_GRID_CLASS,
              control === "linkAction" && "items-center",
            )}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <p className={cn("text-sm font-medium text-foreground", isSocial && "font-semibold")}>
                  {field.label}
                  {field.required ? <span className="text-destructive"> *</span> : null}
                </p>
                {field.showHelpIcon ? (
                  <Info className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-label="Help" />
                ) : null}
              </div>
              {field.description ? (
                <p className="mt-1 text-xs text-muted-foreground">{field.description}</p>
              ) : null}
            </div>
            <div className="min-w-0">{renderControl(field, fieldKey, control, placeholder)}</div>
          </div>
        </Fragment>
      );
    });
  };

  const activeSectionContent = useMemo(() => {
    if (activeSectionKey === "business-information") {
      return (
        <SectionFormCard
          title={profile.businessInformation.title}
          badge={
            <Badge className="rounded-sm border-border bg-muted px-2 py-0 text-[11px] text-muted-foreground">
              Required
            </Badge>
          }
        >
          <div className="grid grid-cols-1">
            {renderBusinessInformationFields(
              profile.businessInformation.fields,
              fieldValues,
              setValue,
              biCategoryOpen,
              setBiCategoryOpen,
            )}
          </div>
        </SectionFormCard>
      );
    }
    if (activeSectionKey === "hours-of-operation") {
      return (
        <SectionFormCard title={profile.hoursOfOperation.title}>
          <HoursOfOperationFields section={profile.hoursOfOperation} fieldValues={fieldValues} setValue={setValue} />
        </SectionFormCard>
      );
    }
    if (activeSectionKey === "additional-information") {
      return (
        <SectionFormCard title={profile.additionalInformation.title}>
          <div className="grid grid-cols-1">
            {renderFieldRows("additional-information", profile.additionalInformation.fields)}
          </div>
        </SectionFormCard>
      );
    }
    if (activeSectionKey === "media-gallery") {
      const logo = profile.mediaGallery[0];
      const coverCells = profile.mediaGallery.slice(1, 4);
      const albumBlock = profile.mediaGallery[4];
      const albumTabs = [
        { id: "exterior", label: "Exterior" },
        { id: "interior", label: "Interior" },
        { id: "at-work", label: "At work" },
        { id: "teams", label: "Teams" },
        { id: "additional", label: "Additional" },
      ];
      return (
        <SectionFormCard title="Media gallery">
          <div className="flex flex-col gap-8">
            {logo ? (
              <div data-field-id={`media-gallery-${slugFieldDomPart(logo.label)}`} className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{logo.label}</p>
                  <Badge variant="secondary" className="rounded-sm text-[11px] font-normal">
                    All
                  </Badge>
                  <Info className="size-3.5 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </div>
                <div className="flex aspect-square w-40 max-w-full items-center justify-center rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground">
                  {fieldValues[`media-gallery:${logo.label}`] ? "Logo preview" : "Upload logo"}
                </div>
                <ul className="flex flex-wrap gap-2">
                  {logo.rules.map((rule) => (
                    <li key={rule} className="text-xs text-muted-foreground">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <p className="text-sm font-medium text-foreground">Cover photos</p>
              <div className="mt-4 grid grid-cols-1 gap-4">
                {coverCells.map((cell) => (
                  <div key={cell.label} data-field-id={`media-gallery-${slugFieldDomPart(cell.label)}`} className="space-y-2">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-medium text-foreground">{cell.label.replace("Cover photos - ", "")}</p>
                      <Info className="size-3.5 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                    </div>
                    <button
                      type="button"
                      className="flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary bg-primary/5 px-4 py-6 text-primary transition-colors hover:bg-primary/10"
                    >
                      <Plus className="size-6" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                      <span className="text-sm font-medium">Upload photo</span>
                    </button>
                    <ul className="flex flex-wrap gap-2">
                      {cell.rules.slice(0, 2).map((rule) => (
                        <li key={rule} className="text-xs text-muted-foreground">
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {albumBlock ? (
              <div data-field-id={`media-gallery-${slugFieldDomPart(albumBlock.label)}`} className="space-y-4">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-foreground">{albumBlock.label}</p>
                  <Info className="size-3.5 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                </div>
                <div className="flex flex-wrap gap-4 border-b border-border pb-2">
                  {albumTabs.map((tab) => {
                    const active = mediaAlbumTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setMediaAlbumTab(tab.id)}
                        className={cn(
                          "text-sm font-medium pb-2 -mb-px border-b-2 transition-colors",
                          active ? "border-primary text-foreground" : "border-transparent text-muted-foreground",
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="flex min-h-[140px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary bg-primary/5 px-4 py-8 text-primary transition-colors hover:bg-primary/10"
                >
                  <Plus className="size-6" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                  <span className="text-sm font-medium">Upload photos/videos</span>
                </button>
              </div>
            ) : null}
          </div>
        </SectionFormCard>
      );
    }
    if (activeSectionKey === "social-profiles") {
      return (
        <SectionFormCard title="Social profiles" className="border-primary/20">
          <div className="grid grid-cols-1">
            {renderFieldRows(
              "social-profiles",
              profile.socialProfiles.map((s) => ({ label: s.platform, value: s.value })),
              { isSocial: true },
            )}
          </div>
        </SectionFormCard>
      );
    }
    if (activeSectionKey === "custom-fields") {
      return (
        <SectionFormCard title="Custom fields">
          <div className="grid grid-cols-1">{renderFieldRows("custom-fields", profile.customFields)}</div>
        </SectionFormCard>
      );
    }
    if (activeSectionKey.startsWith("channel-")) {
      const channelIndex = Number.parseInt(activeSectionKey.replace("channel-", ""), 10);
      const section = profile.channelOverrides[channelIndex];
      if (!section) return null;
      const channelAccent = section.title === "Microsite listing" || section.title === "Yelp listing";
      return (
        <SectionFormCard title={section.title} className={channelAccent ? "border-primary/20" : undefined}>
          <div className="grid grid-cols-1">{renderFieldRows(activeSectionKey, section.fields)}</div>
        </SectionFormCard>
      );
    }
    return null;
  }, [activeSectionKey, profile, fieldValues, setValue, biCategoryOpen, mediaAlbumTab]);

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-white transition-colors duration-300 dark:bg-background">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="shrink-0 bg-card px-6 pb-3 pt-5">
          <div className="min-w-0 flex-1">
            <Breadcrumb>
              <BreadcrumbList className="gap-1.5">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-primary hover:text-primary">
                    <button type="button" onClick={onNavigateHome}>
                      Settings
                    </button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-primary hover:text-primary">
                    <button type="button" onClick={onNavigateHome}>
                      {isBusinessTab ? "Business info" : "Reviews"}
                    </button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-primary hover:text-primary">
                    <button type="button" onClick={onNavigateTable}>
                      {isBusinessTab ? "Business" : "Response templates"}
                    </button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="inline-flex items-center gap-1.5 font-medium">
                    {row.businessName}
                    <ChevronDown size={14} strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {isBusinessTab ? (
          <>
            <MainCanvasViewHeader
              title="Edit your business profile"
              titleAs="h2"
              actions={(
                <div className="relative flex items-center gap-2">
                  {searchOpen ? (
                    <div className="relative w-60 shrink-0">
                      <Search
                        className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                        strokeWidth={1.6}
                        absoluteStrokeWidth
                        aria-hidden
                      />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => {
                          if (searchQuery === "") setSearchOpen(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setSearchQuery("");
                            setSearchOpen(false);
                          }
                        }}
                        autoFocus
                        placeholder="Find a field to update"
                        className="h-8 w-full rounded-lg border border-border bg-card py-0 pr-2 pl-8 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        aria-label="Find a field to update"
                      />
                      {searchHits.length > 0 ? (
                        <ul
                          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-md"
                          role="listbox"
                        >
                          {searchHits.slice(0, 40).map((hit, i) => (
                            <li key={`${hit.fieldDomId}-${hit.fieldLabel}-${i}`} role="option">
                              <button
                                type="button"
                                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => onPickSearchHit(hit.sectionKey, hit.fieldDomId)}
                              >
                                <span className="font-medium text-foreground">{hit.sectionTitle}</span>
                                <span className="text-muted-foreground"> → </span>
                                <span>{hit.fieldLabel}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      aria-label="Open field search"
                      title="Find a field"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Search className="size-3.5 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth aria-hidden />
                    </Button>
                  )}
                  <Button type="button" variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button type="button" size="sm">
                    Save changes
                  </Button>
                </div>
              )}
            />
            <div className="min-h-0 flex-1 overflow-hidden px-6 pb-4">
              <div className="grid h-full grid-cols-[220px_minmax(0,1fr)] items-stretch gap-4 pt-4">
                <div className="flex h-full min-h-0 w-[220px] shrink-0 flex-col overflow-hidden text-muted-foreground transition-colors duration-300">
                  <div className="min-h-0 flex-1 overflow-y-auto px-0 pb-4 pt-0">
                    <div className="flex flex-col gap-1">
                      {sectionItems.map((section) => {
                        const active = section.key === activeSectionKey;
                        return (
                          <button
                            key={section.key}
                            type="button"
                            onClick={() => setActiveSectionKey(section.key)}
                            className={cn(active ? CHILD_ACTIVE : CHILD_INACTIVE, "cursor-pointer justify-start px-3")}
                            style={{ fontWeight: active ? 400 : 300 }}
                          >
                            {section.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="min-h-0 min-w-0">{activeSectionContent}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            <div className="rounded-lg border border-border bg-card p-6 pt-4 text-sm text-muted-foreground">
              Reviews tab routing is now active. Detailed review settings for this item are the next surface to wire.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
