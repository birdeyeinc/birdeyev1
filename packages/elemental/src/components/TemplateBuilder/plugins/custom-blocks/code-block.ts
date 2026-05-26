import { Editor } from "grapesjs";

export const DEFAULT_CODE_BLOCK_HTML = `
        <div align="center" data-component-type="code-component" data-gjs-droppable="false" style="width: 100%; padding-top: 10px; padding-bottom: 10px;" class="code-component-container">
                    <div class="code-component" data-gjs-locked="true">
                        <p>Add custom HTML to your email</p>
                    </div>
        </div>
`;

export function codeBlock(editor: Editor) {
    editor.DomComponents.addType("code-component", {
        isComponent: (el) => el?.dataset?.componentType === "code-component",
        model: {
            defaults: {
                name: "HTML",
                draggable: true,
                droppable: false,
                stylable: false,
                editable: false,
                "code": "<p>Add custom HTML to your email</p>",
                traits: [
                    {
                        type: "code",
                        label: "Custom HTML",
                        name: "code",
                        placeholder: "<p>Add custom HTML to your email</p>",
                        changeProp: true,
                        setValue: ({ component, value }) => {
                            const codeComponent = component.find(".code-component")?.[0];
                            if (!codeComponent) return;
                            const valueToSet = value?.trim();
                            codeComponent.set("code", valueToSet);
                            codeComponent.components(valueToSet, { asDocument: true });
                        },
                        getValue: ({ component }) => {
                            const codeComponent = component.find(".code-component")?.[0];
                            if (!codeComponent) return;
                            const componentHTML = codeComponent?.components()?.map((item) => item?.toHTML()?.trim())?.join("\n");
                            return codeComponent.get("code")?.trim() || componentHTML;
                        }
                    }
                ],
            }
        }
    });
}