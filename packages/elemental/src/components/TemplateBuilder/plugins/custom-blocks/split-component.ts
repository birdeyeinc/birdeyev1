import { splitNumberAndUnit } from "components/TemplateBuilder/utils";
import { BACKGROUND_IMAGE_TRAITS } from "components/TemplateBuilder/utils/constants";
import type { Editor, Trait } from "grapesjs";

export const SPLIT_COMPONENT_HTML = `
    <style>
        .split-component-container {
            display: flex;
            width: 95%;
            padding-top:20px;
            padding-bottom:20px;
            padding-left:20px;
            padding-right:20px;
            overflow: hidden;
        }

        .column-cell {
            padding-top:10px;
            padding-bottom:10px;
            padding-left:10px;
            padding-right:10px;
            overflow: hidden;
        }

    </style>
    <div class="split-component-container" data-component-type="split-component">
        <!-- First column -->
        <div class="column-container-0 column-container" style="width: 50%">
            <div class="column-cell-0 column-cell"></div>
        </div>
        <!-- Second column -->
        <div class="column-container-1 column-container" style="width: 50%">
            <div class="column-cell-1 column-cell"></div>
        </div>
    </div>
`;

export const splitComponent = (editor: Editor) => {
    editor.DomComponents.addType("split-component", {
        isComponent: (el) => el.dataset?.componentType === "split-component",
        model: {
            defaults: {
                name: "Split section",
                traits: [
                    {
                        id: "column-width",
                        type: "composite",
                        name: "column-width",
                        label: "Width",
                        value: {
                            "column-width-0": "50%",
                            "column-width-1": "50%"
                        },
                        // @ts-ignore
                        properties: [
                            {
                                id: "column-width-0",
                                name: "column-width-0",
                                label: "Column 1",
                                type: "input-unit",
                                unit: "%",
                                units: ["%"],
                                value: "50%"
                            },
                            {
                                id: "column-width-1",
                                name: "column-width-1",
                                label: "Column 2",
                                type: "input-unit",
                                unit: "%",
                                units: ["%"],
                                value: "50%"
                            }
                        ],
                        setValue: ({ component, value, trait, emitUpdate }) => {
                            const { property, value: actualValue } = value || {};
                            const columnComponents = component.find("[class^='column-container-']");
                            const columnIndex = parseInt(property?.id?.split("-")?.pop() || 0); // Get the index from property id
                            const columnComponent = columnComponents?.at(columnIndex);
                            const otherColumnIndex = columnIndex === 0 ? 1 : 0;
                            const otherColumnComponent = columnComponents?.at(otherColumnIndex);
                            const { value: splitValue } = splitNumberAndUnit(actualValue);
                            const balanceColumnWidth = 100 - (splitValue || 0);
                            if (columnComponent && otherColumnComponent) {
                                columnComponent?.addStyle({ "width": actualValue });
                                // @ts-ignore
                                const columnTrait = trait?.get("properties")?.[columnIndex];
                                columnTrait.value = actualValue;
                                otherColumnComponent?.addStyle({ "width": `${balanceColumnWidth}%` });
                                // @ts-ignore
                                const otherColumnTrait = trait?.get("properties")?.[otherColumnIndex];
                                otherColumnTrait.value = `${balanceColumnWidth}%`;
                            }
                            emitUpdate();
                        },
                        getValue: ({ component, trait }) => {
                            const columnComponents = component?.find("[class^='column-container-']") || [];
                            // @ts-ignore
                            const traits = trait?.get("properties") || [];
                            traits.forEach((columnTrait: any, index: number) => {
                                columnTrait.value = columnComponents?.at(index)?.getStyle()?.["width"];
                            });
                            return {
                                "column-width-0": columnComponents?.at(0)?.getStyle()?.["width"],
                                "column-width-1": columnComponents?.at(1)?.getStyle()?.["width"]
                            };
                        }
                    },
                    ...BACKGROUND_IMAGE_TRAITS,
                ],
            }
        }
    });
};