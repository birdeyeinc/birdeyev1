import { useEditorMaybe } from "@grapesjs/react";

export const useSelectedComponent = () => {
    const editor = useEditorMaybe();
    const selected = editor?.getSelected();
    
    return selected;
};
