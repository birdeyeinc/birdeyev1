import { useCallback, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Instagram,
  MoreVertical,
  Search,
  XCircle,
} from "lucide-react";
import { POST_DATA } from "@/mocks/postData";
import { APPROVAL_DATA, type ApprovalLocation, type WorkflowApprover } from "@/mocks/approvalData";

const RV = { fontVariationSettings: "'wdth' 100" } as const;

interface AwaitingApprovalContentProps {
  postId: string;
  onClose: () => void;
}

type LocationState = { status: "pending" | "approved" | "rejected"; rejectionReason?: string };

function Avatar({ name, size = 38 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        backgroundImage: "linear-gradient(135deg, rgb(211,220,255) 0%, rgb(236,227,252) 100%)",
        color: "var(--purple-300)",
        fontWeight: 500,
        ...RV,
      }}
    >
      {initials}
    </div>
  );
}

function FacebookBadge() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-blue-90 text-white">
      <span className="text-[15px] font-semibold">f</span>
    </div>
  );
}

function InstagramBadge() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[linear-gradient(135deg,#f9ce34_0%,#ee2a7b_50%,#6228d7_100%)] text-white">
      <Instagram size={14} />
    </div>
  );
}

function LinkedInBadge() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-fb-bg text-white">
      <span className="text-[12px] font-semibold">in</span>
    </div>
  );
}

function PlatformPill({ platform }: { platform: "facebook" | "instagram" | "linkedin" }) {
  const icon =
    platform === "facebook" ? <FacebookBadge /> : platform === "instagram" ? <InstagramBadge /> : <LinkedInBadge />;
  const label = platform === "facebook" ? "Facebook" : platform === "instagram" ? "Instagram" : "LinkedIn";

  return (
    <div className="flex items-center gap-2 rounded-[999px] border border-new-selected-color bg-white px-3 py-1.5 text-[12px] text-gray-200">
      <div className="scale-[0.75]">{icon}</div>
      <span>{label}</span>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-new-selected-color bg-white p-5">
      <div className="mb-4">
        <h3 className="text-[16px] font-medium tracking-[-0.24px] text-gray-900" style={RV}>
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-[13px] leading-[20px] text-gray-100" style={RV}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function RejectionModal({
  targetName,
  onConfirm,
  onCancel,
}: {
  targetName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  const isValid = reason.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[520px] rounded-[8px] border border-new-selected-color bg-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
        <div className="border-b border-gray-20 px-6 py-5">
          <p className="text-[20px] tracking-[-0.4px] text-gray-900" style={RV}>
            Reject {targetName}
          </p>
          <p className="mt-1 text-[13px] text-gray-100" style={RV}>
            Add a clear reason so the creator can revise confidently.
          </p>
        </div>
        <div className="px-6 py-5">
          <label className="mb-2 block text-[12px] uppercase tracking-[0.12em] text-gray-90">
            Rejection reason
          </label>
          <textarea
            className="min-h-[130px] w-full rounded-[8px] border border-gray-2000 bg-gray-10 px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-90 focus:border-blue-100 focus:bg-white"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain what needs to change before this post can be approved."
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-20 px-6 py-4">
          <button
            onClick={onCancel}
            className="h-10 rounded-[8px] border border-gray-2000 bg-white px-4 text-[14px] text-gray-900 transition-colors hover:bg-gray-10"
          >
            Cancel
          </button>
          <button
            onClick={() => isValid && onConfirm(reason.trim())}
            disabled={!isValid}
            className={`h-10 rounded-[8px] px-4 text-[14px] text-white transition-opacity ${
              isValid ? "bg-red-100 hover:opacity-95" : "cursor-not-allowed bg-red-60"
            }`}
          >
            Confirm rejection
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  step,
  isCurrent,
}: {
  step: ReturnType<typeof APPROVAL_DATA[string]["steps"]>[number];
  isCurrent: boolean;
}) {
  const icon =
    step.status === "complete" ? (
      <CheckCircle2 size={18} className="text-green-200" />
    ) : step.status === "rejected" ? (
      <XCircle size={18} className="text-red-100" />
    ) : (
      <Clock3 size={18} className={isCurrent ? "text-blue-100" : "text-gray-90"} />
    );

  const summary =
    step.status === "complete"
      ? `${step.approvers.map((a) => (a.isCurrentUser ? "You" : a.name)).join(" and ")} approved this step`
      : step.status === "rejected"
      ? `${step.approvers.find((a) => a.action === "rejected")?.isCurrentUser ? "You" : step.approvers.find((a) => a.action === "rejected")?.name || "A reviewer"} rejected this step`
      : `Pending approvals from ${step.approvers
          .filter((a) => !a.responded)
          .map((a) => (a.isCurrentUser ? "You" : a.name))
          .join(" and ")}`;

  return (
    <div className="relative flex gap-3">
      <div className="flex w-8 shrink-0 justify-center">
        <div className="relative z-[1] mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-new-selected-color bg-white">
          {icon}
        </div>
      </div>
      <div className="flex-1 px-1 py-0.5">
        <p className="text-[14px] text-gray-900" style={RV}>
          {step.title}
        </p>
        <p className="mt-1 text-[13px] leading-[20px] text-gray-100" style={RV}>
          {summary}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {step.approvers.map((approver) => (
            <span
              key={approver.id}
              className="rounded-[999px] border border-new-selected-color bg-white px-3 py-1 text-[12px] text-gray-200"
            >
              {approver.isCurrentUser ? "You" : approver.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LocationRow({
  location,
  state,
  canReview,
  onApprove,
  onReject,
}: {
  location: ApprovalLocation;
  state: LocationState;
  canReview: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const badge =
    state.status === "approved"
      ? { label: "Approved", bg: "#edf8ef", color: "var(--green-200)" }
      : state.status === "rejected"
      ? { label: "Rejected", bg: "#fff1f0", color: "var(--red-100)" }
      : { label: "Pending", bg: "#fff4da", color: "var(--yellow-300)" };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[8px] border border-gray-20 bg-gray-10 px-4 py-3">
      <Avatar name={location.name} size={34} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] text-gray-900" style={RV}>
          {location.name}
        </p>
        <p className="mt-0.5 text-[12px] text-gray-90" style={RV}>
          {location.city}
        </p>
        {state.status === "rejected" && state.rejectionReason && (
          <p className="mt-2 text-[12px] leading-[18px] text-red-100" style={RV}>
            {state.rejectionReason}
          </p>
        )}
      </div>
      <span
        className="rounded-[999px] px-3 py-1 text-[12px]"
        style={{ backgroundColor: badge.bg, color: badge.color, ...RV }}
      >
        {badge.label}
      </span>
      {canReview && state.status === "pending" && (
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onReject}
            className="h-9 rounded-[8px] border border-red-40 bg-white px-3 text-[13px] text-red-100 transition-colors hover:bg-red-10"
          >
            Reject
          </button>
          <button
            onClick={onApprove}
            className="h-9 rounded-[8px] bg-blue-100 px-3 text-[13px] text-white transition-opacity hover:opacity-95"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}

export function AwaitingApprovalContent({ postId, onClose }: AwaitingApprovalContentProps) {
  const post = POST_DATA[postId];
  const approvalData = APPROVAL_DATA[postId];

  const [locationStates, setLocationStates] = useState<Record<string, LocationState>>(() =>
    Object.fromEntries(
      (approvalData?.locations || []).map((loc) => [
        loc.id,
        { status: loc.status, rejectionReason: loc.rejectionReason },
      ]),
    ),
  );
  const [rejectionTarget, setRejectionTarget] = useState<{ id: string; name: string } | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>(() => approvalData?.locations?.[0]?.id || "");
  const [search, setSearch] = useState("");

  const approveLocation = useCallback((id: string) => {
    setLocationStates((prev) => ({ ...prev, [id]: { status: "approved" } }));
  }, []);

  const myLocations = useMemo(() => (approvalData?.locations || []).filter((l) => l.isCurrentUserScope), [approvalData]);
  const currentStep = useMemo(() => approvalData?.steps.find((s) => s.status === "current"), [approvalData]);
  const currentUserIsPendingReviewer =
    currentStep?.approvers.some((a) => a.isCurrentUser && !a.responded) ?? false;
  const allMyDone = myLocations.every((loc) => locationStates[loc.id]?.status !== "pending");
  const selectedLocation =
    approvalData?.locations.find((loc) => loc.id === selectedLocationId) || approvalData?.locations[0];

  const filteredLocations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!approvalData) return [];
    if (!q) return approvalData.locations;
    return approvalData.locations.filter(
      (loc) => loc.name.toLowerCase().includes(q) || loc.city.toLowerCase().includes(q),
    );
  }, [approvalData, search]);

  const rejectAll = useCallback(() => {
    setRejectionTarget({ id: "__all__", name: "all pending locations" });
  }, []);

  const approveAll = useCallback(() => {
    setLocationStates((prev) => {
      const next = { ...prev };
      myLocations.forEach((loc) => {
        if (next[loc.id]?.status === "pending") next[loc.id] = { status: "approved" };
      });
      return next;
    });
  }, [myLocations]);

  const confirmRejection = useCallback(
    (reason: string) => {
      if (!rejectionTarget) return;
      if (rejectionTarget.id === "__all__") {
        setLocationStates((prev) => {
          const next = { ...prev };
          myLocations.forEach((loc) => {
            if (next[loc.id]?.status === "pending") {
              next[loc.id] = { status: "rejected", rejectionReason: reason };
            }
          });
          return next;
        });
      } else {
        setLocationStates((prev) => ({
          ...prev,
          [rejectionTarget.id]: { status: "rejected", rejectionReason: reason },
        }));
      }
      setRejectionTarget(null);
    },
    [myLocations, rejectionTarget],
  );

  if (!post || !approvalData) return null;

  const statusBadge =
    post.status === "rejected"
      ? { label: "Rejected", bg: "#fff1f0", color: "var(--red-100)" }
      : { label: "Awaiting approval", bg: "#fff4da", color: "var(--yellow-300)" };

  const previewStatus = locationStates[selectedLocation?.id || ""]?.status;

  return (
    <div className="flex h-full min-h-0 flex-col bg-gray-10">
      <div className="sticky top-0 z-20 border-b border-gray-30 bg-[rgba(247,248,251,0.96)] px-6 py-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-gray-2000 bg-white text-gray-600 transition-colors hover:bg-blue-10"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[22px] tracking-[-0.6px] text-gray-900" style={RV}>
                  Post details
                </p>
                <span
                  className="rounded-[999px] px-3 py-1 text-[12px]"
                  style={{ backgroundColor: statusBadge.bg, color: statusBadge.color, ...RV }}
                >
                  {statusBadge.label}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-gray-100" style={RV}>
                Review content, approvals, and page-level delivery in one focused workspace.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {post.status === "rejected" ? (
              <>
                <button className="h-10 rounded-[8px] border border-gray-2000 bg-white px-4 text-[14px] text-gray-900 transition-colors hover:bg-gray-10">
                  Edit post
                </button>
                <button className="h-10 rounded-[8px] bg-blue-100 px-4 text-[14px] text-white transition-opacity hover:opacity-95">
                  Resubmit
                </button>
              </>
            ) : currentUserIsPendingReviewer && !allMyDone ? (
              <>
                <button
                  onClick={rejectAll}
                  className="h-10 rounded-[8px] border border-red-40 bg-white px-4 text-[14px] text-red-100 transition-colors hover:bg-red-10"
                >
                  Reject all
                </button>
                <button
                  onClick={approveAll}
                  className="h-10 rounded-[8px] bg-blue-100 px-4 text-[14px] text-white transition-opacity hover:opacity-95"
                >
                  Approve all
                </button>
              </>
            ) : null}
            <button className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-gray-2000 bg-white text-gray-300 transition-colors hover:bg-gray-10">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 xl:grid-cols-2">
        <div className="min-h-0 overflow-auto border-b border-gray-30 bg-[linear-gradient(180deg,#f1f5fb_0%,#f7f8fb_26%,#f7f8fb_100%)] px-7 py-7 xl:border-b-0 xl:border-r">
          <div className="mx-auto max-w-[620px] xl:sticky xl:top-7">
            <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-gray-90">Preview</p>
            <div className="rounded-[8px] border border-gray-2000 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <div className="flex flex-wrap items-center gap-2">
                {post.platforms.map((platform) => (
                  <PlatformPill key={platform} platform={platform} />
                ))}
              </div>

              <div className="mt-4 rounded-[8px] border border-gray-20 bg-gray-10 px-4 py-3">
                <p className="text-[12px] uppercase tracking-[0.12em] text-gray-90">Previewing page</p>
                <div className="mt-3 flex items-center gap-3">
                  <Avatar name={selectedLocation?.name || post.location} size={44} />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] text-gray-900" style={RV}>
                      {selectedLocation?.name || `Motto Mortgage ${post.location}`}
                    </p>
                    <p className="mt-1 text-[12px] text-gray-100" style={RV}>
                      {post.date} · {post.time}
                    </p>
                  </div>
                </div>
                {previewStatus && (
                  <div className="mt-3 inline-flex rounded-[999px] bg-white px-3 py-1 text-[12px] text-gray-100">
                    {previewStatus === "approved"
                      ? "Approved"
                      : previewStatus === "rejected"
                      ? "Rejected"
                      : "Pending review"}
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-[8px] border border-gray-20 bg-gray-10 p-5">
                <p
                  className="whitespace-pre-wrap text-[15px] leading-[24px] text-gray-800"
                  style={{ ...RV }}
                >
                  {post.caption}
                </p>
                {post.hashtags && (
                  <p
                    className="mt-4 text-[15px] leading-[24px] text-blue-100"
                    style={{ ...RV }}
                  >
                    {post.hashtags}
                  </p>
                )}
              </div>

              {post.image && (
                <div className="mt-5 overflow-hidden rounded-[8px] border border-gray-2000 bg-blue-20">
                  <img src={post.image} alt="Post preview" className="h-auto w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="min-h-0 overflow-auto px-7 py-7">
          <div className="mx-auto flex max-w-[620px] flex-col gap-4">
            {currentUserIsPendingReviewer && allMyDone && post.status !== "rejected" && (
              <div className="rounded-[8px] border border-green-40 bg-green-20 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 text-green-200" />
                  <p className="text-[14px] leading-[22px] text-green-200" style={RV}>
                    You’ve actioned all of your assigned locations. Other reviewers may still be pending.
                  </p>
                </div>
              </div>
            )}

            <div className="xl:sticky xl:top-7">
              <div className="flex flex-col gap-4">
                <SectionCard
                  title="Manager review"
                  subtitle={`${approvalData.workflowTitle} · Submitted by ${approvalData.submittedBy}${approvalData.deadline ? ` · Due ${approvalData.deadline}` : ""}`}
                >
                  <div className="space-y-4">
                    {approvalData.steps.map((step, index) => (
                      <div key={step.stepNumber} className="relative">
                        {index < approvalData.steps.length - 1 && (
                          <div className="absolute left-4 top-10 h-[calc(100%-18px)] w-px bg-gray-20" />
                        )}
                        <ReviewStep step={step} isCurrent={step.status === "current"} />
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Post metadata" subtitle="Operational context for approval and distribution.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[8px] border border-gray-20 bg-gray-10 p-4">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-gray-90">Status</p>
                      <p className="mt-3 text-[14px] leading-[22px] text-gray-200" style={RV}>
                        {post.status === "rejected"
                          ? "Rejected and waiting for edits before resubmission."
                          : currentUserIsPendingReviewer
                          ? "Awaiting your action for at least one assigned location."
                          : "Pending additional reviewers."}
                      </p>
                    </div>
                    <div className="rounded-[8px] border border-gray-20 bg-gray-10 p-4">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-gray-90">Timing</p>
                      <p className="mt-3 text-[14px] leading-[22px] text-gray-200" style={RV}>
                        {post.date}{post.time ? ` · ${post.time}` : ""}
                      </p>
                    </div>
                    <div className="rounded-[8px] border border-gray-20 bg-gray-10 p-4">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-gray-90">Channels</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.platforms.map((platform) => (
                          <PlatformPill key={platform} platform={platform} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[8px] border border-gray-20 bg-gray-10 p-4">
                      <p className="text-[12px] uppercase tracking-[0.12em] text-gray-90">Selected page</p>
                      <p className="mt-3 text-[14px] leading-[22px] text-gray-200" style={RV}>
                        {selectedLocation?.name || `Motto Mortgage ${post.location}`}
                      </p>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </div>

            <SectionCard title="Assigned pages" subtitle="Action pages directly from here while keeping the preview visible.">
              <div className="mb-4 flex items-center gap-2 rounded-[8px] border border-gray-20 bg-gray-10 px-3 py-2">
                <Search size={14} className="text-gray-90" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pages"
                  className="w-full bg-transparent text-[13px] text-gray-900 outline-none placeholder:text-gray-90"
                />
              </div>

              <div className="space-y-3">
                {filteredLocations.map((location) => (
                  <div key={location.id} className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedLocationId(location.id)}
                      className={`flex-1 rounded-[8px] text-left transition-colors ${
                        selectedLocationId === location.id ? "ring-2 ring-blue-20" : ""
                      }`}
                    >
                      <LocationRow
                        location={location}
                        state={locationStates[location.id]}
                        canReview={currentUserIsPendingReviewer && location.isCurrentUserScope}
                        onApprove={() => approveLocation(location.id)}
                        onReject={() => setRejectionTarget({ id: location.id, name: location.name })}
                      />
                    </button>
                    <button
                      onClick={() => setSelectedLocationId(location.id)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-gray-2000 bg-white text-gray-100 transition-colors hover:bg-gray-10"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>

            <details className="rounded-[8px] border border-new-selected-color bg-white">
              <summary className="cursor-pointer list-none px-5 py-4 text-[14px] font-medium text-gray-900">
                Less important metadata
              </summary>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border-t border-gray-20 px-5 py-4">
                  <p className="text-[12px] uppercase tracking-[0.12em] text-gray-90">Workflow owner</p>
                  <p className="mt-2 text-[14px] text-gray-200" style={RV}>
                    {approvalData.submittedBy}
                  </p>
                </div>
                <div className="border-t border-gray-20 px-5 py-4">
                  <p className="text-[12px] uppercase tracking-[0.12em] text-gray-90">Deadline</p>
                  <p className="mt-2 text-[14px] text-gray-200" style={RV}>
                    {approvalData.deadline || "No deadline set"}
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {rejectionTarget && (
        <RejectionModal
          targetName={rejectionTarget.name}
          onConfirm={confirmRejection}
          onCancel={() => setRejectionTarget(null)}
        />
      )}
    </div>
  );
}
