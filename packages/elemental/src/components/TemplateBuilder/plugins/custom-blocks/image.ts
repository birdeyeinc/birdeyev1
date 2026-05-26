import { TRAIT_SIZE_OPTIONS } from "components/TemplateBuilder/utils/constants";
import type { Editor } from "grapesjs";

export default function (editor: Editor) {
    editor?.DomComponents.addType("image", {
        isComponent: (el: HTMLElement) => el.tagName === "IMG",
        model: {
            src: "",
            defaults: {
                tagName: "img",
                activate: false,
                styles: {
                    width: "100%",
                    height: "auto"
                },
                traits: [
                    {
                        type: "image",
                        name: "src",
                        label: "Image",
                        changeProp: true
                    },
                    {
                        type: "tabs",
                        name: "size",
                        label: "Size",
                        changeProp: true,
                        options: TRAIT_SIZE_OPTIONS
                    },
                    {
                        type: "text",
                        name: "alt",
                        label: "Alt Text",
                        value: "Image",
                        changeProp: true
                    }
                ],
                name: "Image"
            },
            init() {
                this.on("change:size", (_, value) => {
                    this.setStyle({
                        "object-fit": value
                    });
                });
                this.on("change:src", (_, value) => {
                    // Handle src change
                    this.set("src", value);
                    this?.setStyle({
                        width: "100%",
                        height: "auto"
                    });
                });
            }
        },
        view: {
            onActive(ev) {
                // Prevent Asset Manager from opening
                ev && ev.stopPropagation();
                // Optionally do something else, or just leave it empty
            },
            events() {
                return {
                    click: "initResize",
                    error: "onError",
                    load: "onLoad",
                    dragstart: "noDrag"
                };
            }
        }
    });
}