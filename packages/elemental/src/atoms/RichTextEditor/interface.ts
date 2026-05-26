import { RichTextEditorProps } from './RichTextEditor';
import React from 'react';

export interface BackgroundColorConfig {
  label: string;
  value: string;
}

export interface TextColorConfig {
  label: string;
  value: string;
}

export interface CustomToolbarOption {
  id: string;
  render: () => React.ReactNode; // User provides complete JSX to render
}

export interface customToolbarVisibilityConfig {
  value: any;
  handler: Function;
}

export interface RichTextEditorWrapperProps extends RichTextEditorProps {
  isCustom?: boolean;
  textColorConfig?: TextColorConfig[];
  backgroundColorConfig?: BackgroundColorConfig[];
  customToolbarOptions?: CustomToolbarOption[];
  showCustomJSXInEditor?: boolean;
  renderCustomJSXInEditor?: () => React.ReactNode;
  backgroundColor?: any;
  onBackgroundColorChange?: (color: string) => void;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  onVerticalAlignChange?: (align: 'top' | 'middle' | 'bottom') => void;
  showTransparentInColorPicker?: boolean;
  customRef?: React.RefObject<HTMLDivElement>;
  defaultShowToolBar?: boolean;
  borderColor?: string;
}

export interface CustomRichTextEditorProps extends RichTextEditorWrapperProps {
  // Inherits all properties from RichTextEditorWrapperProps including customToolbarOptions
}
export interface CustomToolbarProps {
  toolbarId: string;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  isVisible: boolean;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  onVerticalAlignChange?: (align: 'top' | 'middle' | 'bottom') => void;
  textColorConfig: TextColorConfig[];
  backgroundColorConfig: BackgroundColorConfig[];
  customOptions?: CustomToolbarOption[];
  showTransparentInColorPicker?: boolean;
}