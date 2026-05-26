import type { Editor } from "grapesjs";

export default function (editor: Editor) {
    editor?.DomComponents.addType("video", {
        isComponent: (el: HTMLElement) => el.tagName === "VIDEO",
        model: {
            defaults: {
                activate: false,
            },
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