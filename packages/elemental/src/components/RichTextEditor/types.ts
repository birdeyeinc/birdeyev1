import { Editor } from "@tiptap/core";
import { ComponentProps, ReactNode } from "react";

export interface RichTextEditorProps {
    rteInstance: Editor | null;
    extraOptions?: ReactNode;
    grapesEditor?: any;
    isExtended?: boolean;
}

export interface ToggleButtonProps extends ComponentProps<"button"> {
    children: ReactNode;
    active: boolean;
    tooltipText?: string;
}