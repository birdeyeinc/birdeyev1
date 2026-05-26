import React, { ComponentProps, PropsWithChildren } from "react";
import EditorProvider from "./template-builder-editor-provider";
import { EditorOptionsProvider } from "../../hooks/use-editor-options";

type TemplateBuilderProviderProps = PropsWithChildren<ComponentProps<typeof EditorProvider>>;

export default function TemplateBuilderProvider({ children, ...props }: TemplateBuilderProviderProps) {
    return (
        <EditorOptionsProvider>
            <EditorProvider {...props}>
                {children}
            </EditorProvider>
        </EditorOptionsProvider>
    );
};