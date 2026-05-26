import { splitNumberAndUnit, splitValueFromUnit } from "components/TemplateBuilder/utils";
import type { Editor } from "grapesjs";

export const QUOTE_BLOCK_HTML = `
        <div
            data-gjs-droppable="false"
            class="quote-container"
            data-component-type="quote"
            style="width: 100%;">
            <div data-gjs-locked="true" style="width:100%; vertical-align: middle; border-collapse: collapse;">
                <div data-gjs-locked="true" class="quote" style="padding-top: 10px; padding-bottom: 20px; padding-left: 28px; padding-right: 36px;">
                    <div class="quote-img">
                        <img
                        src="https://ddjkm7nmu27lx.cloudfront.net/149546071353527/socialpublish/original/vsoz9rpy68/1768216279791.png"
                        alt="Quote"
                        width="48"
                        height="48"
                        />
                    </div>
                    <p
                        class="quote-text"
                        style="font-size: 24px; font-weight: 500; color: #212121; line-height: 36px; letter-spacing: -0.48px; margin-bottom: 12px; margin-top: 0px;"
                    >
                        We've got to be courageous and really lean in…<br />
                        That's the only way you're going to innovate
                    </p>
                    <div style="display: flex; align-items: center;">
                        <span>-</span>
                        <p
                            class="quote-author"
                            style="font-size: 14px; color: #555555; line-height: 20px; letter-spacing: -0.28px; margin-top: 0px; margin-bottom: 0px;"
                        >
                            Alex Craddock
                        </p>
                    </div>
                </div>
            </div>
        </div>
`;

export const quoteBlock = (editor: Editor) => {
    editor.DomComponents.addType("quote", {
        isComponent: (el) => el?.dataset?.componentType === "quote",
        model: {
            defaults: {
                name: "Quote",
                stylable: false,
                droppable: false,
                editable: false,
                hoverable: true,
                selectable: true,
                highlightable: true,
                traits: [
                    {
                        name: "quoteText",
                        label: "Quote Text",
                        type: "textarea",
                        changeProp: true,
                        value: "We've got to be courageous and really lean in…\nThat's the only way you're going to innovate",
                        placeholder: "Enter quote text",
                        setValue: ({ component, value }) => {
                            const quoteText = component.find(".quote-text")?.[0];
                            if (!quoteText) return;
                            // Replace line breaks with <br /> for display
                            const formattedValue = value ? value.replace(/\n/g, '<br />') : "";
                            quoteText.components(formattedValue);
                        },
                        getValue: ({ component }) => {
                            const quoteText = component.find(".quote-text")?.[0];
                            if (!quoteText) return "";
                            const html = quoteText.toHTML();
                            // Extract text content and convert <br /> back to line breaks
                            const content = html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
                            return content.trim();
                        }
                    },
                    {
                        name: "authorName",
                        label: "Author Name",
                        type: "text",
                        value: "Alex Craddock",
                        changeProp: true,
                        placeholder: "Enter author name",
                        setValue: ({ component, value }) => {
                            const author = component.find(".quote-author")?.[0];
                            if (!author) return;
                            const formattedValue = value ? `${value}` : "";
                            author.components(formattedValue);
                        },
                        getValue: ({ component }) => {
                            const author = component.find(".quote-author")?.[0];
                            if (!author) return "";
                            const html = author.toHTML();
                            const content = html.replace(/<[^>]*>/g, '');
                            // Remove the "– " prefix if present
                            return content.replace(/^–\s*/, '').trim();
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
                            component?.addStyle({ "background": value });
                            emitUpdate();
                        },
                        getValue: ({ component }) => {
                            const backgroundColor = component?.getStyle()?.["background"];
                            return backgroundColor;
                        }
                    },
                ]
            },
            init() {
                // Find the quote-container (which is this component itself)
                // Make only its children and nested children non-selectable
                const setChildProps = (component: any) => {
                    component.components().forEach((child: any) => {
                        child.set({
                            selectable: false,
                            hoverable: false,
                            editable: false,
                            draggable: false,
                            droppable: false,
                            badgable: false,
                            stylable: false,
                            highlightable: false,
                        });
                        // Recursively set for nested children
                        setChildProps(child);
                    });
                };
                
                // Apply to all children of quote-container (this component)
                setChildProps(this);
            }
        }
    });
};
