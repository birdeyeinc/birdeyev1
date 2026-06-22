"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

// ─── Context ─────────────────────────────────────────────────────────────────
interface PromptInputContextValue {
  disabled: boolean;
  isLoading: boolean;
}

const PromptInputContext = React.createContext<PromptInputContextValue>({
  disabled: false,
  isLoading: false,
});

function usePromptInput() {
  return React.useContext(PromptInputContext);
}

// ─── PromptInput (Root) ──────────────────────────────────────────────────────
interface PromptInputProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  disabled?: boolean;
  onSubmit?: () => void;
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      className,
      children,
      isLoading = false,
      disabled = false,
      onSubmit,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && onSubmit && !disabled && !isLoading) {
          e.preventDefault();
          onSubmit();
        }
      },
      [onSubmit, disabled, isLoading]
    );

    return (
      <PromptInputContext.Provider value={{ disabled, isLoading }}>
        <div
          ref={ref}
          data-slot="prompt-input"
          data-loading={isLoading || undefined}
          data-disabled={disabled || undefined}
          onKeyDown={handleKeyDown}
          className={cn(
            "relative rounded-xl border border-new-selected-color dark:border-border bg-white dark:bg-muted transition-all duration-200",
            "focus-within:border-blue-40 dark:focus-within:border-blue-80 focus-within:shadow-[0_0_0_2px_rgba(25,118,210,0.08)] dark:focus-within:shadow-[0_0_0_2px_rgba(37,82,237,0.2)]",
            "hover:border-gray-60 dark:hover:border-gray-500",
            disabled && "pointer-events-none opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    );
  }
);
PromptInput.displayName = "PromptInput";

// ─── PromptInputTextarea ─────────────────────────────────────────────────────
interface PromptInputTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(({ className, maxRows = 5, value, onChange, ...props }, ref) => {
  const internalRef = React.useRef<HTMLTextAreaElement>(null);
  const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;
  const { disabled } = usePromptInput();

  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const lineHeight = 20;
    const maxHeight = lineHeight * maxRows;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [maxRows, textareaRef]);

  React.useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <div className="px-3.5 pt-3 pb-1">
      <textarea
        ref={textareaRef}
        data-slot="prompt-input-textarea"
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent text-[13px] text-gray-900 dark:text-foreground placeholder:text-gray-80 dark:placeholder:text-muted-foreground outline-none leading-[20px]",
          className
        )}
        style={{ minHeight: "20px" }}
        {...props}
      />
    </div>
  );
});
PromptInputTextarea.displayName = "PromptInputTextarea";

// ─── PromptInputActions ──────────────────────────────────────────────────────
const PromptInputActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="prompt-input-actions"
      className={cn(
        "flex w-full min-w-0 items-center justify-between gap-2 px-2 pb-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
PromptInputActions.displayName = "PromptInputActions";

// ─── PromptInputAction ───────────────────────────────────────────────────────
interface PromptInputActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  asChild?: boolean;
}

const PromptInputAction = React.forwardRef<
  HTMLButtonElement,
  PromptInputActionProps
>(({ className, tooltip, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      data-slot="prompt-input-action"
      type="button"
      title={tooltip}
      className={cn(
        "p-1.5 rounded-lg transition-colors",
        "hover:bg-gray-20 dark:hover:bg-muted text-gray-80 dark:text-muted-foreground hover:text-gray-300 dark:hover:text-gray-90",
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
});
PromptInputAction.displayName = "PromptInputAction";

/** Apply to `PromptInputAction` for Myna’s circular gradient send. Documented in **UI / PromptInput → Branded send (Myna)**. */
export const PROMPT_INPUT_BRANDED_SEND_CLASSNAME =
  "rounded-full bg-gradient-to-r from-purple-80 to-brand-color text-white shadow-sm hover:opacity-95 hover:text-white disabled:opacity-40 disabled:hover:opacity-40 p-2";

/** Circular primary send/stop layout for prompt-kit–style composers (pair with `Button` variant `default`). */
export const PROMPT_INPUT_PRIMARY_ICON_SEND_CLASSNAME =
  "size-8 shrink-0 rounded-full p-0 shadow-sm";

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
  usePromptInput,
};