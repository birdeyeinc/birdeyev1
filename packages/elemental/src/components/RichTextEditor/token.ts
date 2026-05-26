import { Node, mergeAttributes } from "@tiptap/core";

export interface TokenOptions {
    HTMLTag?: string; // wrapper element tag name
    HTMLInnerTag?: string; // inner element tag name
    HTMLClass?: string; // wrapper class
    InnerClass?: string; // inner class
}

// Simple inline atom node to represent personalization tokens.
export const Token = Node.create<TokenOptions>({
    name: "tokenNode",
    group: "inline",
    inline: true,
    atom: true,
    selectable: true,

    addOptions() {
        return {
            HTMLTag: "span",
            HTMLInnerTag: "token",
            HTMLClass: "token-cont",
            InnerClass: "token"
        };
    },

    addAttributes() {
        return {
            value: {
                default: "",
                parseHTML: (element: HTMLElement) => element.getAttribute("data-value") || element.textContent || ""
            },
            type: {
                default: null,
                parseHTML: (element: HTMLElement) => element.getAttribute("data-type")
            }
        };
    },

    parseHTML() {
        return [
            { tag: `${this.options.HTMLTag}.${this.options.HTMLClass}` },
            { tag: `div.${this.options.HTMLClass}` }
        ];
    },

    renderHTML({ HTMLAttributes, node }) {
        const { value, type } = node.attrs;
        return [
            this.options.HTMLTag || "span",
            mergeAttributes(HTMLAttributes, {
                class: this.options.HTMLClass,
                "data-value": value,
                "data-type": type || ""
            }),
            [
                this.options.HTMLInnerTag || "token",
                { class: this.options.InnerClass, contenteditable: "false" },
                value
            ]
        ];
    }
});

export default Token;