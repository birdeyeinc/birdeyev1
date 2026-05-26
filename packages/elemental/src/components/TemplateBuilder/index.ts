import RichTextToolbar from "./components/toolbars/rich-text-toolbar";
import OptionsToolbar from "./components/toolbars/options-toolbar";
import StyleManager from "./components/styles/style-manager";
import StylePropertyField from "./components/styles/style-property-field";
import TraitManager from "./components/traits/trait-manager";
import TraitPropertyField from "./components/traits/trait-property-field";
import BlockItem from "./components/blocks/block-item";
import BlockManager from "./components/blocks/block-manager";
import richTextPlugin from "./plugins/rich-text-plugin";
import basicBlocks from './plugins/blocks';
import loadDevices from './plugins/device';
import EditorProvider from "./components/editor/template-builder-editor-provider";
import TemplateBuilderProvider from "./components/editor/template-builder-provider";
import EditorCanvas from "./components/canvas/editor-canvas";
import { useComponentSelection } from "./hooks/use-component-selection";
import { useSelectedComponent } from "./hooks/use-selected-component";
import CanvasShimmer from "./components/loaders/editor-shimmer";
import { DEFAULT_EDITOR_CONFIG } from "./utils/constants";
import RightPanel from "./components/example/right-panel";
import LeftPanel from "./components/example/left-panel";

export {
    // UI Components
    BlockItem,
    BlockManager,
    StyleManager,
    StylePropertyField,
    RichTextToolbar,
    OptionsToolbar,
    TraitManager,
    TraitPropertyField,
    EditorProvider,
    TemplateBuilderProvider,
    EditorCanvas,
    CanvasShimmer,
    RightPanel,
    LeftPanel,
    // Hooks
    useComponentSelection,
    useSelectedComponent,
    // Plugins
    basicBlocks,
    richTextPlugin,
    loadDevices,
    // Constants
    DEFAULT_EDITOR_CONFIG
};