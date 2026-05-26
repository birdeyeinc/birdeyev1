import React from 'react';
import { WithEditor } from '@grapesjs/react';
import grapesjs from 'grapesjs';
import LeftPanel from './left-panel';
import RightPanel from './right-panel';
import OptionsToolbar from '../toolbars/options-toolbar';
import RichTextToolbar from '../toolbars/rich-text-toolbar';
import style from "./example-editor.module.scss";
import EditorCanvas from '../canvas/editor-canvas';
import TemplateBuilderProvider from "../editor/template-builder-provider";


export const TemplateBuilderExample = () => {
    return (
        <TemplateBuilderProvider grapesjs={grapesjs}>
            <div className={`display-flex editor-main-container ${style?.["editor-main-container"]}`}>
                <LeftPanel />
                <div className={`template-design-section ${style?.["template-design-section"]}`}>
                    <WithEditor>
                        <OptionsToolbar>
                            <OptionsToolbar.Default/>
                        </OptionsToolbar>
                    </WithEditor>
                    <WithEditor>
                        <RichTextToolbar />
                    </WithEditor>
                    <div className={`display-flex editor-container ${style?.["editor-container"]}`} >
                        <EditorCanvas />
                        <WithEditor>
                            <RightPanel />
                        </WithEditor>
                    </div>

                </div>
            </div>
        </TemplateBuilderProvider>
    );
};