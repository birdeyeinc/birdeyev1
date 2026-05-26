import type { Editor, BlockProperties } from 'grapesjs';
import type { Plugin } from 'grapesjs';
import { codeBlock, DEFAULT_CODE_BLOCK_HTML } from './custom-blocks/code-block';
import { QUOTE_BLOCK_HTML, quoteBlock } from './custom-blocks/quote';
import { SPACER_BLOCK_HTML, spacerBlock } from './custom-blocks/spacer';
import imageBlock from './custom-blocks/image';
import { BUTTON_BLOCK_HTML, buttonBlock } from './custom-blocks/button';
import { DEFAULT_SOCIAL_LINKS_HTML, socialLinks } from './custom-blocks/social-links';
import { SPLIT_COMPONENT_HTML, splitComponent } from './custom-blocks/split-component';
import video from './custom-blocks/video';
import { DIVIDER_BLOCK_HTML, dividerBlock } from './custom-blocks/divider';

function loadBlocks(editor: Editor) {
    const bm = editor.BlockManager;

    const commonBlockProps: Partial<BlockProperties> = {
        category: "Content Blocks",
        select: true,
        activate: true
    };

    const flexStyle = `
        <style>
        .flex {
            display: flex;
        }

        .flex-row {
            flex-direction: row;
        }

        .flex-column {
            flex-direction: column;
        }

        .flex-1 {
            flex: 1;
        }
        .min-h-100 {
            min-height: 100px;
        } 
        </style>
    `;


    bm.add('column1', {
        ...commonBlockProps,
        label: "1 Column",
        category: "Layout",
        media: `icon_phoenix-one-rectangle`,
        content: `
        ${flexStyle}
        <div class="flex min-h-100"></div>
        `,
    });


    bm.add('column2', {
        ...commonBlockProps,
        label: "2 Columns",
        category: "Layout",
        media: `icon_phoenix-view-two-rectangle`,
        content: `
        ${flexStyle}
        <div class="flex flex-row min-h-100">
            <div class="flex-1"></div>
            <div class="flex-1"></div>
        </div>
        `
    });


    bm.add('column3', {
        ...commonBlockProps,
        label: "3 Columns",
        category: "Layout",
        media: `icon_phoenix-three-reactangle`,
        content: `
        ${flexStyle}
        <div class="flex flex-row min-h-100">
            <div class="flex-1"></div>
            <div class="flex-1"></div>
            <div class="flex-1"></div>
            </div>
        `
    });

    bm.add('split-component', {
        ...commonBlockProps,
        label: 'Split section',
        media: 'icon_phoenix-view-two-rectangle',
        content: SPLIT_COMPONENT_HTML,
        category: "Layout",
        activate: true,
        select: true
    });
    splitComponent(editor);

    bm.add('title', {
        ...commonBlockProps,
        activate: true,
        label: "Title",
        media: `icon_phoenix-title-image`,
        content: `
      <div style="display: flex; justify-content: center; align-items: center;">
  <h1 style="margin: 0">Enter title</h1>
</div>
      `
    });


    bm.add('text', {
        ...commonBlockProps,
        activate: true,
        label: "Text",
        media: `icon_phoenix-text-image`,
        content: {
            type: 'text',
            content: 'Insert your text here',
            style: { padding: '10px' },
        }
    });


    bm.add('link', {
        ...commonBlockProps,
        label: "Link",
        media: `icon_phoenix-link-image`,
        content: {
            type: 'link',
            content: 'Link',
            style: { color: "#2652ED" }
        }
    });
    editor.DomComponents.addType("link", {
        model: {
            defaults: {
                traits: [
                    {
                        type: "textarea",
                        label: "Link URL",
                        name: "href",
                        placeholder: "https://example.com"
                    }
                ]
            }
        }
    });

    bm.add('button', {
        ...commonBlockProps,
        label: 'Button',
        media: 'icon_phoenix-button-image',
        content: BUTTON_BLOCK_HTML,
        activate: true,
        select: true
    });
    buttonBlock(editor);

    bm.add('image', {
        ...commonBlockProps,
        activate: true,
        label: "Image",
        media: `icon_phoenix-block-image`,
        content: {
            style: { color: 'black' },
            type: 'image',
        }
    });
    imageBlock(editor);

    bm.add('video', {
        ...commonBlockProps,
        label: "Video",
        media: `icon_phoenix-smart_display`,
        content: {
            type: 'video',
            src: 'img/video2.webm',
            style: {
                height: '350px',
                width: '615px'
            }
        }
    });
    video(editor);

    // Divider Block Start
    bm.add("divider", {
        ...commonBlockProps,
        label: 'Divider',
        media: 'icon_phoenix-divider-image',
        content: DIVIDER_BLOCK_HTML,
        activate: true,
        select: true
    });
    dividerBlock(editor);
    // Divider Block End

    // QUOTE Block Start
    bm.add("quote", {
        ...commonBlockProps,
        label: 'Quote',
        media: "icon_phoenix-quotes",
        content: QUOTE_BLOCK_HTML,
        activate: true,
        select: true
    });
    quoteBlock(editor);
    // QUOTE Block End

    // Spacer Block Start
    bm.add('spacer', {
        ...commonBlockProps,
        label: 'Spacer',
        media: 'icon_phoenix-spacer-image',
        content: SPACER_BLOCK_HTML,
        activate: true,
        select: true
    });
    spacerBlock(editor);
    // Spacer Block End


    bm.add('social-links', {
        ...commonBlockProps,
        label: "Social Links",
        media: 'icon_phoenix-social-links',
        content: DEFAULT_SOCIAL_LINKS_HTML,
        activate: true,
        select: true
    });
    socialLinks(editor);


    // Code Block Start
    bm.add('code-component', {
        ...commonBlockProps,
        label: "HTML",
        media: `icon_phoenix-code`,
        content: DEFAULT_CODE_BLOCK_HTML,
        activate: true,
        select: true,
    });
    codeBlock(editor);
    // Code Block End

}

const plugin: Plugin = (editor, _ = {}) => {
    loadBlocks(editor);
};

export default plugin;

