// hooks/useComponentSelection.ts
import { useState, useEffect } from "react";
import { useEditorMaybe } from "@grapesjs/react";

export const useComponentSelection = () => {
    const editor = useEditorMaybe();
    const [isComponentSelected, setIsComponentSelected] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<any>(null);

    useEffect(() => {
        if (!editor) return;
        
        const handleSelected = () => {
            setIsComponentSelected(true)
            setSelectedComponent(editor?.getSelected()?.getName());
        };
        
        const handleDeselected = () => {
            // to re-calculate canvas offsets
            setTimeout(() => {
                editor.refresh();
            }, 0);
            setIsComponentSelected(false);
            setSelectedComponent(null);
        };

        editor.on("component:selected", handleSelected);
        editor.on("component:deselected", handleDeselected);
        
        return () => {
            editor.off("component:selected", handleSelected);
            editor.off("component:deselected", handleDeselected);
        };
    }, [editor]);

    return { isComponentSelected, setIsComponentSelected, selectedComponent };
};
