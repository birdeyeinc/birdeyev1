import React, { ReactNode } from 'react';
import GrapesJsEditor, { EditorProps } from '@grapesjs/react';
import { Plugin, PluginOptions, usePlugin } from 'grapesjs';
import basicBlocks from '../../plugins/blocks';
import loadDevices from '../../plugins/device';
import richTextPlugin from '../../plugins/rich-text-plugin';
import { useEditorOptions } from '../../hooks/use-editor-options';
import { DEFAULT_EDITOR_CONFIG } from 'components/TemplateBuilder/utils/constants';

interface EditorProviderProps extends EditorProps {
    extraPlugins?: Plugin<PluginOptions>[];
    children?: ReactNode;
    includeDefaultBlocks?: boolean; // 👈 New prop to control default blocks
}
const EditorProvider = ({ grapesjs, children, includeDefaultBlocks = true, ...props }: EditorProviderProps) => {
    const { customRte, setCustomRte } = useEditorOptions();
    
    // Build plugins array conditionally
    const plugins = [
        ...(includeDefaultBlocks ? [usePlugin(basicBlocks)] : []), // 👈 Only include if flag is true
        usePlugin(loadDevices),
        usePlugin(richTextPlugin, { rteInstance: customRte, setRteInstance: setCustomRte }),
        ...(props.extraPlugins || []).map(plugin => usePlugin(plugin))
    ];
    return (
        <GrapesJsEditor
            grapesjs={grapesjs}
            grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
            options={DEFAULT_EDITOR_CONFIG}
            plugins={plugins}
            {...props}
        >
            {children}
        </GrapesJsEditor>
    )
};


export default EditorProvider;