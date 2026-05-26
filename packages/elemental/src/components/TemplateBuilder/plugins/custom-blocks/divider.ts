import { splitNumberAndUnit, splitValueFromUnit } from "components/TemplateBuilder/utils";
import { getDividerStyleOptions } from "components/TemplateBuilder/utils/constants";
import type { Editor } from "grapesjs";

export const DIVIDER_BLOCK_HTML = `
        <div
            data-gjs-droppable="false"
            class="divider-container"
            data-component-type="divider"
            style="width: 100%; padding-top: 10px; padding-bottom: 10px">
            <div data-gjs-locked="true" style="width:100%; vertical-align: middle; border-collapse: collapse;">
                <div class="divider" style="width: 100%; vertical-align: middle; padding: 0 !important; border-top-width: 1px; border-top-style: solid; border-top-color: #CCC; margin: 0 auto;"></div>
            </div>
        </div>
`;

export const dividerBlock = (editor: Editor) => {
    editor.DomComponents.addType("divider", {
        isComponent: (el) => el?.dataset?.componentType === "divider",
        model: {
            defaults: {
                name: "Divider",
                stylable: false,
                droppable: false,
                editable: false,
                traits: [
                    {
                        id: "divider-width",
                        label: "Line width",
                        name: "thickness",
                        type: "input-unit",
                        unit: "px",
                        value: 1,
                        // @ts-ignore
                        units: ["px"],
                        min: 1,
                        changeProp: true,
                        setValue: ({ component, value, emitUpdate }) => {
                            const divider = component.find(".divider")?.[0];
                            if (!divider) return;
                            divider?.addStyle({ "border-top-width": value });
                            emitUpdate();
                        },
                        getValue: ({ component, trait }) => {
                            const divider = component.find(".divider")?.[0];
                            if (!divider) return 1;
                            const borderTopWidth = divider?.getStyle()?.["border-top-width"] as string;
                            const { unit } = splitNumberAndUnit(borderTopWidth);
                            trait.set("unit", unit || "px");
                            return borderTopWidth || "1px";
                        }
                    }, // thickness
                    {
                        id: "divider-style",
                        label: "Line style",
                        name: "divider-style",
                        type: "select",
                        options: getDividerStyleOptions(),
                        value: "solid",
                        changeProp: true,
                        setValue: ({ component, value, emitUpdate }) => {
                            const divider = component.find(".divider")?.[0];
                            if (!divider) return;
                            divider?.addStyle({ "border-top-style": value });
                            emitUpdate();
                        },
                        getValue: ({ component }) => {
                            const divider = component.find(".divider")?.[0];
                            if (!divider) return;
                            const componentStyle = divider?.getStyle();
                            const borderTopStyle = componentStyle?.["border-top-style"] as string;
                            return borderTopStyle || "solid";
                        }
                    }, // style
                    {
                        id: "divider-color",
                        label: "Line color",
                        name: "divider-color",
                        type: "color",
                        value: "#000",
                        changeProp: true,
                        setValue: ({ component, value, emitUpdate }) => {
                            const divider = component.find(".divider")?.[0];
                            if (!divider) return;
                            divider?.addStyle({ "border-top-color": value });
                            emitUpdate();
                        },
                        getValue: ({ component }) => {
                            const divider = component.find(".divider")?.[0];
                            if (!divider) return;
                            const borderTopColor = divider?.getStyle()?.["border-top-color"] as string;
                            return borderTopColor || "#000";
                        }
                    }, // color
                    {
                        id: "block-padding",
                        label: "Block padding",
                        name: "block-padding",
                        type: "input-unit",
                        value: 10,
                        unit: "px",
                        // @ts-ignore,
                        units: ["px"],
                        changeProp: true,
                        setValue: ({ component, value, emitUpdate }) => {
                            component?.addStyle({ "padding-top": `${value}` });
                            component?.addStyle({ "padding-bottom": `${value}` });
                            emitUpdate();
                        },
                        getValue: ({ component, trait }) => {
                            const paddingTop = component?.getStyle()?.["padding-top"] as string;
                            const { unit } = splitValueFromUnit(paddingTop);
                            trait.set("unit", unit || "px");
                            return paddingTop || "10px";
                        }
                    },
                    {
                        id: "block-background",
                        label: "Block background",
                        name: "block-background",
                        type: "color",
                        value: "#FFFFFF",
                        changeProp: true,
                        setValue: ({ component, value, emitUpdate }) => {
                            component?.addStyle({ "background-color": value });
                            emitUpdate();
                        },
                        getValue: ({ component }) => {
                            const backgroundColor = component?.getStyle()?.["background-color"];
                            return backgroundColor;
                        }
                    },
                ],
            }
        }
    });
};

