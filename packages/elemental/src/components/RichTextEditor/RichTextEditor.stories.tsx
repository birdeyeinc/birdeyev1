import type { Meta, StoryObj } from '@storybook/react';
import React, { ComponentProps, useEffect } from 'react';
import RichTextEditor from "./index";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { Token } from "./token";
import { EditorContent, useEditor } from "@tiptap/react";
import editorContentStyle from "./editor-content.module.scss";
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list'


type RichTextEditorProps = ComponentProps<typeof RichTextEditor>;

const extensions = [
    TextStyleKit,
    StarterKit,
    Underline,
    TextAlign.configure({
        types: ["heading", "paragraph"]
    }),
    Token,
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "mailto", "tel", "https"],
        shouldAutoLink: () => true
    }),
    HardBreak,
    Heading.configure({
        levels: [1, 2, 3],
    }),
    BulletList,
    ListItem,
    OrderedList
];

const meta: Meta<RichTextEditorProps> = {
    title: "Component/RichTextEditor",
    component: RichTextEditor,
}

export default meta;

type Story = StoryObj<RichTextEditorProps>;

export const RichTextEditorComponent: Story = {
    args: {
        extraOptions: null
    },
    argTypes: {
        extraOptions: { control: 'text' }
    },
    render: (args) => {
        const [currentHTML, setCurrentHTML] = React.useState("<p></p>");
        const editorInstance = useEditor({
            // @ts-ignore
            extensions,
            content: `
                        <h2>
                Hi there,
            </h2>

            <p>
                this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
            </p>

            <p>
                Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
            </p>

            <p>
                I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
            </p>
`,
            onUpdate: ({ editor }) => {
                setCurrentHTML(editor.getHTML());
            }
        });

        return (
            <>
                <RichTextEditor rteInstance={editorInstance} extraOptions={args.extraOptions} />
                <EditorContent editor={editorInstance} className={editorContentStyle.tiptap} style={{ padding: "12px", border: "1px solid #eee", minHeight: "200px" }} />
            </>
        );
    }
};
