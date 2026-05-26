import React from 'react';
import RichTextEditor from './RichTextEditor';
import CustomRichTextEditor from './CustomRichTextEditor';
import { RichTextEditorWrapperProps } from './interface';

const RichTextEditorWrapper = React.forwardRef<any, RichTextEditorWrapperProps>(({
  isCustom = false, //Added this prop to enable the option to use a version of rich text editor where we can add custom options in the toolbar
  ...props
}, ref) => {
  if (isCustom) {
    return <CustomRichTextEditor ref={ref} {...props} />;
  }
  
  return <RichTextEditor ref={ref} {...props} />;
});

RichTextEditorWrapper.displayName = 'RichTextEditorWrapper';

export default RichTextEditorWrapper;
