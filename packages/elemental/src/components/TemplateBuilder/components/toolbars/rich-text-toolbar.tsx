import { useEditorMaybe } from "@grapesjs/react";
import RichTextEditor from "../../../RichTextEditor/index";
import React, { ReactNode } from "react";
import { useEditorOptions } from "../../hooks/use-editor-options";

interface RichTextToolbarProps {
    extraOptions?: ReactNode;
}

export default function RichTextToolbar({ extraOptions }: RichTextToolbarProps){
    const { customRte: rteInstance } = useEditorOptions();
    const editor = useEditorMaybe();

    if(!rteInstance || !editor) return null;

    return (
        <RichTextEditor
            rteInstance={rteInstance}
            grapesEditor={editor}
            extraOptions={extraOptions}
        />
    )
};

