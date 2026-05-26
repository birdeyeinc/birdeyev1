"use client";

import { useMemo, useState } from "react";
import { Building2, ChevronsUpDown, CirclePlus, Download, Phone, Search } from "lucide-react";
import { MainCanvasViewHeader } from "@/app/components/layout/MainCanvasViewHeader";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { cn } from "@/app/components/ui/utils";

type PhoneNumberRow = {
  id: string;
  label: string;
  number: string;
  agent: string;
  provider: string;
  type: "Local" | "Toll-free";
};

const PHONE_NUMBER_ROWS: PhoneNumberRow[] = [
  { id: "phnum_29944", label: "Head office", number: "+1 (210) 425-0208", agent: "No agent", provider: "Twilio", type: "Local" },
  { id: "phnum_29945", label: "Reservations", number: "+1 (210) 425-0211", agent: "No agent", provider: "Twilio", type: "Local" },
  { id: "phnum_29946", label: "Promotions", number: "+1 (888) 425-1122", agent: "No agent", provider: "Twilio", type: "Toll-free" },
];

export function JourneysChannelsView() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(PHONE_NUMBER_ROWS[0]?.id ?? "");

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return PHONE_NUMBER_ROWS;
    return PHONE_NUMBER_ROWS.filter((row) => (
      row.label.toLowerCase().includes(normalized) ||
      row.number.toLowerCase().includes(normalized) ||
      row.id.toLowerCase().includes(normalized)
    ));
  }, [query]);

  const selectedNumber = filteredRows.find((row) => row.id === selectedId) ?? filteredRows[0] ?? null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background transition-colors duration-300">
      <MainCanvasViewHeader
        title="Phone numbers"
        description="Manage all business phone numbers used by agent workflows."
        actions={(
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="outline">
              <Download className="size-4" strokeWidth={1.6} absoluteStrokeWidth />
              Import number
            </Button>
            <Button type="button">
              <CirclePlus className="size-4" strokeWidth={1.6} absoluteStrokeWidth />
              Add number
            </Button>
          </div>
        )}
      />
      <div className="min-h-0 flex-1 overflow-hidden px-6 pb-4">
        <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_340px] items-stretch gap-4 pt-4">
          <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-6 py-4">
              <div className="relative w-full max-w-md">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={1.6}
                  absoluteStrokeWidth
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-9"
                  placeholder="Search phone numbers"
                  aria-label="Search phone numbers"
                />
              </div>
              <Button type="button" variant="outline">
                All numbers
                <ChevronsUpDown className="size-4" strokeWidth={1.6} absoluteStrokeWidth />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto px-6 pb-6 pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone number</TableHead>
                    <TableHead>Assigned agent</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={cn("cursor-pointer", selectedNumber?.id === row.id && "bg-muted/60")}
                      onClick={() => setSelectedId(row.id)}
                    >
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-foreground">{row.number}</span>
                          <span className="text-xs text-muted-foreground">{row.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>{row.agent}</TableCell>
                      <TableCell>{row.provider}</TableCell>
                      <TableCell>{row.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-start gap-2 border-b border-border px-6 py-4">
              <div className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary dark:bg-primary/20">
                <Phone className="size-4" strokeWidth={1.6} absoluteStrokeWidth />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Phone number details</p>
                <p className="text-xs text-muted-foreground">Select a number to review assignment and provider.</p>
              </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
              {selectedNumber ? (
                <>
                  <div className="space-y-1">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Phone number</p>
                    <p className="text-sm font-medium text-foreground">{selectedNumber.number}</p>
                    <p className="text-xs text-muted-foreground">{selectedNumber.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Assigned agent</p>
                    <p className="text-sm text-foreground">{selectedNumber.agent}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Provider</p>
                    <div className="inline-flex items-center gap-2 text-sm text-foreground">
                      <Building2 className="size-4 text-muted-foreground" strokeWidth={1.6} absoluteStrokeWidth />
                      {selectedNumber.provider}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Number type</p>
                    <p className="text-sm text-foreground">{selectedNumber.type}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No phone numbers match your search.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
