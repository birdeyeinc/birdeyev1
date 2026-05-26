import type { Editor } from "grapesjs";
import { splitNumberAndUnit } from "../../utils";

export const SPACER_BLOCK_HTML = `
        <div 
            data-gjs-droppable="false"
            class="spacer-container"
            data-component-type="spacer"
            style="width: 100%; margin: 0 !important; padding: 0 !important; height: 10px">
        </div>
`;

export const spacerBlock = (editor: Editor) => {
    editor.DomComponents.addType("spacer", {
        isComponent: (el) => el?.dataset?.componentType === "spacer",
        model: {
            defaults: {
                tagName: "div",
                name: "Spacer",
                stylable: false,
                droppable: false,
                editable: false,
                traits: [
                    {
                        id: "spacer-height",
                        label: "Height",
                        name: "height",
                        type: "input-unit",
                        unit: "px",
                        value: 10,
                        // @ts-ignore
                        units: ["px"],
                        min: 1,
                        changeProp: true,
                        setValue: ({ component, value, emitUpdate }) => {
                            component?.addStyle({ "height": `${value}` });
                            emitUpdate();
                        },
                        getValue: ({ component, trait }) => {
                            const componentStyle = component?.getStyle()?.["height"] || "";
                            const { unit } = splitNumberAndUnit(componentStyle as string);
                            trait.set("unit", unit || "px");
                            return componentStyle;
                        }
                    }, // thickness
                    {
                        id: "background",
                        label: "Background color",
                        name: "background",
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
                    } // background-color
                ],
            }
        }
    });
};