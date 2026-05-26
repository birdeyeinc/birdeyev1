import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { Trait } from "grapesjs";
import copyImage from "assets/images/copy-image.svg";


interface CodeBlockProps {
    trait: Trait;
    displayNotification?: (payload: { message: string; type: "success" | "error" }) => void;
}

export const CodeBlock = ({ trait, displayNotification }: CodeBlockProps) => {
    const isRequired = trait.get("required" as any);
    const label = trait?.getLabel();
    const value = trait.getValue()?.trim() || "";

    const handleCopy = async (value: string) => {
        await navigator?.clipboard?.writeText(value || "");
        displayNotification && displayNotification({ message: "Code copied to clipboard", type: "success" });
    };
    return (
        <>
            <label style={{display: "flex"}} className={`display-flex label-outside  display-flex-center justify-content-betweeen mb-10 ${isRequired ? "required" : ""}`}>{label} <img onClick={() => handleCopy(value)} src={copyImage} className="pointer" /></label>
            <CodeMirror
                onChange={(value) => trait.setValue(value)}
                value={value}
                height="120px"
                extensions={[html(), css()]}
            />
        </>
    );
};