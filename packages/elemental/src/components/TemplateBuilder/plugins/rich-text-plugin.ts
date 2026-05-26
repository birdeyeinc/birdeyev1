import { Editor, Node } from "@tiptap/core";
import type { Editor as GrapesEditor } from "grapesjs";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import HardBreak from "@tiptap/extension-hard-break";
import { ListKit } from "@tiptap/extension-list";
import Token from "components/RichTextEditor/token";


const TEXT_RELATED_PROPERTIES = [
  "color",
  "background-color",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "text-decoration",
  // "text-align",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-transform",
  "text-indent",
  "white-space"
];

function getCSSTextTextStyles(element: Element | null | undefined): string {
  if (!element) return "";

  let value = "";
  try {
    const style = getComputedStyle(element);
    if (!style) return "";

    TEXT_RELATED_PROPERTIES.forEach(property => {
      const elementValue = style.getPropertyValue(property);
      if (elementValue && elementValue !== "") {
        value += `${property}:${elementValue};`;
      }
    });
  } catch (e) {
    console.warn("Failed to get computed styles:", e);
  }

  return value;
}

/**
 * Block-level element tags that don't need wrapping
 */
const BLOCK_ELEMENTS = ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "pre", "table", "hr"];

/**
 * Checks if an element needs its content wrapped in a <p> tag.
 * Returns true if:
 * 1. There are bare text nodes as direct children, OR
 * 2. Direct children are inline elements (like <span>, <b>, <i>) that need block wrapping
 */
function needsContentWrapping(element: HTMLElement | null | undefined): boolean {
  if (!element || !element.childNodes) return false;

  const TEXT_NODE = 3;
  const ELEMENT_NODE = 1;

  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];

    // Check for bare text nodes
    if (child.nodeType === TEXT_NODE) {
      const textContent = child.textContent?.trim();
      if (textContent && textContent.length > 0) {
        return true;
      }
    }

    // Check for inline elements (non-block elements)
    if (child.nodeType === ELEMENT_NODE) {
      const tagName = (child as HTMLElement).tagName?.toLowerCase();
      if (tagName && !BLOCK_ELEMENTS.includes(tagName)) {
        // It's an inline element like <span>, <b>, <i>, <a>, etc.
        return true;
      }
    }
  }
  return false;
}

/**
 * Wraps all children of the cloned node in a single <p> tag with the parent's computed styles.
 * This ensures TipTap receives properly structured content with styles preserved.
 */
function wrapContentWithStyledParagraph(sourceNode: HTMLElement | null | undefined, clonedNode: HTMLElement | null | undefined): void {
  if (!sourceNode || !clonedNode) return;

  // Wrap if there are bare text nodes OR inline elements at the root level
  if (!needsContentWrapping(sourceNode)) return;

  try {
    // Get the parent's computed styles
    const parentStyles = getCSSTextTextStyles(sourceNode);

    // Create a wrapper <p> tag with the parent's styles
    const wrapper = document.createElement("p");
    wrapper.setAttribute("data-content-wrapper", "true");
    if (parentStyles) {
      wrapper.style.cssText = parentStyles;
    }

    // Move all children into the wrapper
    while (clonedNode.firstChild) {
      wrapper.appendChild(clonedNode.firstChild);
    }

    // Append the wrapper to the cloned node
    clonedNode.appendChild(wrapper);
  } catch (e) {
    console.warn("Failed to wrap content with styled paragraph:", e);
  }
}

export function cloneElementTextStyles(node: HTMLElement | null | undefined): HTMLElement | null {
  if (!node) return null;

  try {
    // @ts-ignore - cloneNode returns Node but we know it's HTMLElement for HTMLElement input  
    const clonedNode: HTMLElement = node.cloneNode(true);
    if (!clonedNode) return null;

    // FIRST: Apply styles to all elements BEFORE adding any wrapper  
    // This ensures proper index alignment between source and target arrays  
    const nodeElements = node.getElementsByTagName("*");
    const clonedElements = clonedNode.getElementsByTagName("*");
    // @ts-ignore - getElementsByTagName returns HTMLCollection which contains HTMLElements  
    const sourceElements: HTMLElement[] = [node, ...Array.from(nodeElements || [])];
    // @ts-ignore - getElementsByTagName returns HTMLCollection which contains HTMLElements  
    const targetElements: HTMLElement[] = [clonedNode, ...Array.from(clonedElements || [])];

    sourceElements.forEach((sourceElement, index) => {
      const targetElement = targetElements[index];
      if (targetElement && sourceElement) {
        const tagName = sourceElement.tagName?.toLowerCase();
        const INLINE_ELEMENTS = ["span", "b", "i", "strong", "em", "u", "strike"];

        if (INLINE_ELEMENTS.includes(tagName)) {
          // Only preserve existing inline styles, don't use computed styles  
          const existingStyle = sourceElement.getAttribute('style');
          if (existingStyle) {
            // Remove text-align from existing inline styles  
            const cleanStyle = existingStyle.replace(/text-align\s*:\s*[^;]+;?/gi, '').trim();
            if (cleanStyle) {
              targetElement.setAttribute('style', cleanStyle);
            } else {
              targetElement.removeAttribute('style');
            }
          }
        }
      }
    });

    // THEN: If root has bare text nodes, wrap all content in a styled <p> tag  
    // The wrapper gets the parent's styles which we already computed  
    wrapContentWithStyledParagraph(node, clonedNode);

    return clonedNode;
  } catch (e) {
    console.warn("Failed to clone element text styles:", e);
    return null;
  }
}

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute("id"),
        renderHTML: attributes => {
          if (!attributes.id) return {};
          return { id: attributes.id };
        }
      },
      class: {
        default: null,
        parseHTML: element => element.getAttribute("class"),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        }
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute("style"),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      }
    };
  }
});

const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: element => element.getAttribute("id"),
        renderHTML: attributes => {
          if (!attributes.id) return {};
          return { id: attributes.id };
        }
      },
      class: {
        default: null,
        parseHTML: element => element.getAttribute("class"),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        }
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute("style"),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      }
    };
  }
});

const CustomDiv = Node.create({
  name: "customDiv",

  group: "block", // Treat div as a block element
  content: "inline*", // Only allow inline elements inside div (no p tags)
  // content: 'block*',

  parseHTML() {
    return [
      {
        tag: "div"
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  }
});

const CustomBold = Bold.extend({
  parseHTML() {
    return [
      {
        tag: "strong"
      },
      {
        tag: "b"
      }
    ];
  },
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute("id"),
        renderHTML: attributes => {
          if (!attributes.id) return {};
          return { id: attributes.id };
        }
      },
      class: {
        default: null,
        parseHTML: element => element.getAttribute("class"),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        }
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute("style"),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      }
    };
  }
});

const CustomTextStyleKit = TextStyleKit.configure({
  fontFamily: {
    types: ['textStyle'],
  },
  fontSize: {
    types: ['textStyle'],
  },
  color: {
    types: ['textStyle'],
  },
  lineHeight: {
    types: ['textStyle'],
  },
});

/**
 * Unwraps TipTap content if it would create invalid nested block elements.
 * When GrapesJS element is a <p> and TipTap outputs a single block element,
 * returns the inner content to avoid nesting (e.g., <p><p>text</p></p>).
 * Also copies styles from TipTap's block element to the target element and updates
 * the GrapesJS component model so styles persist in getHTML output.
 * 
 * @param el - The GrapesJS target element
 * @param content - The HTML content from TipTap
 * @param grapesEditor - The GrapesJS editor instance to update the component model
 * @returns The content, unwrapped if necessary
 */
function unwrapNestedBlockContent(el: HTMLElement, content: string, grapesEditor: GrapesEditor): string {
  if (el.tagName?.toLowerCase() !== 'p') {
    return content;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // Filter out whitespace-only text nodes
  const children = Array.from(tempDiv.childNodes).filter(
    node => node.nodeType !== 3 || node.textContent?.trim()
  );

  // Block elements that shouldn't be nested inside <p>
  const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote', 'pre'];
  const firstChildTag = children[0]?.nodeName?.toLowerCase();

  if (children.length === 1 && blockElements.includes(firstChildTag)) {
    const tiptapBlock = children[0] as HTMLElement;
    // Copy any style from TipTap's block element to the original el
    const tiptapStyle = tiptapBlock.getAttribute('style');
    if (tiptapStyle) {
      // Update the DOM element
      el.setAttribute('style', tiptapStyle);

      // Also update the GrapesJS component model so styles persist in getHTML
      try {
        const component = grapesEditor.getSelected();
        if (component && component.getEl() === el) {
          component.addAttributes({ style: tiptapStyle });
        }
      } catch (e) {
        console.warn('Failed to update GrapesJS component style:', e);
      }
    }
    // Return the inner content to avoid nested block elements
    return tiptapBlock.innerHTML;
  }

  return content;
}


export default function richTextPlugin(editor: GrapesEditor, options: { rteInstance: Editor, setRteInstance: (instance: any) => void }) {
  const { setRteInstance } = options;

  editor.setCustomRte({
    // parseContent: true, // CAUSING ISSUE
    focus: (el: HTMLElement, rte: Editor) => {
      // Do nothing if already focused
      if (rte && rte?.isFocused) {
        return;
      }
      el.setAttribute("contenteditable", "true");
      rte && rte.commands.focus("all", { scrollIntoView: true });
    },
    enable: (el, rte: Editor | null) => {
      // Clean up existing instance if present
      if (rte) {
        try {
          rte.destroy();
          setRteInstance(null);
        } catch (e) {
          console.warn(e);
        }
      }

      // Extract content, handling reloaded pages with existing ProseMirror content
      // Falls back to original innerHTML if cloning fails
      const clonedElement = cloneElementTextStyles(el);
      const currentHTML = clonedElement?.innerHTML || el?.innerHTML || "";
      console.log("<== STEP 1: ENABLE ==> ", { el, rte, currentHTML, innerHtml: el?.innerHTML });

      el.innerHTML = ""; // Clear element to avoid duplication

      // Initialize TipTap editor
      rte = new Editor({
        element: el,
        extensions: [
          Document,
          CustomDiv,
          CustomParagraph,
          Text,
          CustomTextStyleKit,
          CustomHeading,
          CustomBold,
          Italic,
          Strike,
          Underline,
          ListKit,
          HardBreak,
          TextAlign.configure({
            types: ["heading", "paragraph"]
          }),
          Token
        ],
        content: currentHTML,
        injectCSS: false,
        onCreate: ({ editor }) => {
          editor.commands.focus("all", { scrollIntoView: true });
        }
      });

      setRteInstance(rte);
      return rte;
    },

    disable: (el, rte: Editor | null) => {
      el.setAttribute("contenteditable", "false");
      rte?.destroy();
      setRteInstance(null);
      return { forceSync: true };
    },

    getContent: (el, rte: Editor | null) => {
      // CAUSING ISSUE
      const htmlContent = rte?.getHTML() || "";
      if (rte && !rte?.isDestroyed) {
        const content = rte.getHTML();
        return unwrapNestedBlockContent(el, content, editor);
      }
      return el.innerHTML;
    }
  });
};

