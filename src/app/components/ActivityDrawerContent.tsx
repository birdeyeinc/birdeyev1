import { ArrowLeft, Clock3, Sparkles } from "lucide-react";
import { ActivityFeed } from "./ActivityFeed";

interface ActivityDrawerContentProps {
  postId: string;
  onClose: () => void;
}

export function ActivityDrawerContent({ postId, onClose }: ActivityDrawerContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-gray-10 dark:bg-gray-800 transition-colors duration-300">
      <div className="border-b border-gray-30 dark:border-gray-600 bg-[rgba(247,248,251,0.92)] dark:bg-[rgba(24,27,34,0.92)] px-6 py-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-2000 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-70 transition-colors hover:bg-blue-10 dark:hover:bg-gray-600"
              onClick={onClose}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[22px] tracking-[-0.6px] text-gray-900 dark:text-gray-2000">Activity</p>
                <span className="rounded-full bg-blue-10 dark:bg-blue-500 px-3 py-1 text-[12px] text-blue-100 dark:text-blue-80">
                  Timeline
                </span>
              </div>
              <p className="mt-1 text-[13px] text-gray-100 dark:text-gray-90">
                A cleaner audit trail for content edits, approvals, scheduling, and delivery changes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-gray-100 dark:text-gray-90">
            <div className="flex items-center gap-2 rounded-full border border-gray-30 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2">
              <Clock3 size={14} />
              <span>Most recent first</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gray-30 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-purple-100 dark:text-purple-70">
              <Sparkles size={14} />
              <span>Premium audit view</span>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-6 py-6">
        <div className="mx-auto max-w-[920px] rounded-[24px] border border-new-selected-color dark:border-gray-600 bg-white dark:bg-gray-700 p-2 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="rounded-[20px] bg-[linear-gradient(180deg,#ffffff_0%,#fafbfd_100%)] dark:bg-gray-700 px-2 py-2">
            <ActivityFeed postId={postId} />
          </div>
        </div>
      </div>
    </div>
  );
}
