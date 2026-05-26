import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Editor } from "@tiptap/core";

const EditorOptionsContext = createContext<EditorOptionsState | null>(null);

export interface EditorOptionsState {
    refCanvas?: HTMLElement;
    customRte?: Editor;
    setRefCanvas: (ref: HTMLElement) => void;
    setCustomRte: (value: Editor) => void;
}

export const EditorOptionsProvider = ({ children }: { children?: ReactNode }) => {
    const [state, setState] = useState<EditorOptionsState>(() => ({
        setRefCanvas(refCanvas) {
            setState(state => ({ ...state, refCanvas }));
        },
        setCustomRte(customRte) {
            setState(state => ({ ...state, customRte }));
        }
    }));

    return <EditorOptionsContext.Provider value={state}>{children}</EditorOptionsContext.Provider>;
};

/**
 * Context used to keep the editor instance once initialized
 */
export const useEditorOptions = () => {
    const context = useContext(EditorOptionsContext);

    if (!context) {
        throw new Error("useEditorOptions must be used within EditorOptionsProvider");
    }

    return context;
};


export default EditorOptionsContext;
