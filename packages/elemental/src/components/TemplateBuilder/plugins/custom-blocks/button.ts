import { type Editor } from "grapesjs";

export const BUTTON_BLOCK_HTML = `
<style>
    .button-component-cell {
        width: auto;
        display: flex;
        justify-content: center;
    }
    .button-component {
        display: inline-block;
        text-decoration: none; 
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #1976D2;
        vertical-align: middle;
        color: #ffffff;
        text-align: center;
        font-size: 16px;
        box-sizing: border-box;
        font-weight: 400;
        border-radius: 4px;
    }
</style>    
<div data-component-type="button-component" class="button-component-cell">
        <a 
            data-gjs-editable="false"
            class="button-component"
            href=""
            target="_blank">
            Button
        </a>
    </div>
`;

export const buttonBlock = (editor: Editor) => {
    editor.DomComponents.addType("button-component", {
        isComponent: (el) => el?.dataset?.componentType === "button-component",
        model: {
            defaults: {
                name: "Button",
                editable: false,
                droppable: false,
                traits: [
                    {
                        name: "content",
                        label: "Text",
                        type: "text",
                        value: "Button",
                        changeProp: true,
                        placeholder: "Enter button text",
                        setValue: ({ component, value }) => {
                            const button = component.find(".button-component")?.[0];
                            if (!button) return;
                            button?.set("content", value ? value : "Button");
                            button?.components(value ? value : "Button");
                        },
                        getValue: ({ component }) => {
                            const button = component.find(".button-component")?.[0];
                            if (!button) return;
                            const value = button?.get("content") || button?.components()?.models?.[0]?.get("content") || "";
                            return value?.trim();
                        }
                    },
                    {
                        name: "url",
                        label: "Link",
                        type: "textarea",
                        changeProp: true,
                        value: "",
                        placeholder: "Enter button URL",
                        setValue: ({ component, value }) => {
                            const button = component.find(".button-component")?.[0];
                            if (!button) return;
                            button.addAttributes({ href: value });
                        },
                        getValue: ({ component }) => {
                            const button = component.find(".button-component")?.[0];
                            if (!button) return;
                            return button?.getAttributes()?.["href"] || "";
                        }
                    },
                    {
                        label: "Horizontal align",
                        name: "button-align",
                        type: "tabs",
                        value: "center",
                        changeProp: true,
                        options: [
                            { id: "left", value: "left", name: "Left" },
                            { id: "center", value: "center", name: "Center" },
                            { id: "right", value: "right", name: "Right" }
                        ],
                        setValue: ({ value, component, emitUpdate }) => {
                            const buttonCell = component;
                            if (buttonCell) {
                                buttonCell.addStyle({ "justify-content": value });
                                emitUpdate();
                            }
                        },
                        getValue: ({ component }) => {
                            const buttonCell = component;
                            if (!buttonCell) return;
                            return buttonCell.getStyle()?.["justify-content"] || "center";
                        }
                    },
                    {
                        label: "Button fit",
                        name: "button-fit",
                        type: "tabs",
                        value: "fit",
                        changeProp: true,
                        options: [
                            { id: "auto", value: "auto", name: "Fit to text" },
                            { id: "100%", value: "100%", name: "Full width" },
                        ],
                        setValue: ({ value, component, emitUpdate }) => {
                            const button = component.find(".button-component")?.[0];
                            if (button) {
                                button.addStyle("width", value);
                            }
                            emitUpdate();
                        },
                        getValue: ({ component }) => {
                            const button = component?.find(".button-component")?.[0];
                            if (!button) return;
                            return button?.getStyle()?.["width"] || "auto";
                        }
                    },
                ],
            }
        }
    });
};