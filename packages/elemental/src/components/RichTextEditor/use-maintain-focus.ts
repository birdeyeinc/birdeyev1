import { useEffect } from "react";

export const useMaintainFocus = (editor?: any) => {
    
    useEffect(() => {
        const handleGlobalClick = (e: any) => {
            // Check if click is on toolbar or editor
            const isToolbarClick = e.target.closest("#rich-text-editor") || e.target.closest("#rich-text-toolbar");

            if (isToolbarClick) {
                e.preventDefault();
                e.stopPropagation();
                // Maintain editor focus
                if (editor && !editor?.isFocused) {
                    editor?.commands?.focus();
                }
            }
        };

        document.addEventListener("mousedown", handleGlobalClick, true);

        return () => {
            document.removeEventListener("mousedown", handleGlobalClick, true);
        };
    }, [editor]);

    return null;
};  