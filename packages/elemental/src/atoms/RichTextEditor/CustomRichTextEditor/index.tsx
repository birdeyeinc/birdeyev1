import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { CustomRichTextEditorProps } from '../interface';
import { uniqueId } from 'lodash';
import Styles from './CustomRichTextEditor.module.scss';
import RichTextEditor from '../RichTextEditor';
import CustomToolbar from './CustomToolbar';
import useClickOutside from '../../../hooks/useClickOutside';

const CustomRichTextEditor = React.forwardRef<any, CustomRichTextEditorProps>((props, ref) => {
    const {
        textColorConfig = [],
        backgroundColorConfig = [],
        customToolbarOptions = [],
        modules: _modules, // Extracting and ignoring modules from props as we would be using our own custom toolbar
        onChange,
        readOnly,
        showCustomJSXInEditor,
        renderCustomJSXInEditor,
        showTransparentInColorPicker,
        customRef,
        defaultShowToolBar,
        backgroundColor,
        onBackgroundColorChange,
        verticalAlign,
        onVerticalAlignChange,
        borderColor,
        ...restProps
    } = props;

    const [currentBackgroundColor, setCurrentBackgroundColor] = useState(
        backgroundColor || backgroundColorConfig[0]?.value
    );
    const [currentVerticalAlign, setCurrentVerticalAlign] = useState(verticalAlign || 'middle');
    const [showToolbar, setShowToolbar] = useState(defaultShowToolBar || false);
    const [hideTrailingEmptyLine, setHideTrailingEmptyLine] = useState(false);
    const [isContentOverflowing, setIsContentOverflowing] = useState(false);
    const toolbarId = useRef(uniqueId(`custom-toolbar-${Date.now()}`)).current;
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorRef: any = useRef(null);

    useImperativeHandle(ref, () => ({
        getEditor: () => editorRef.current?.getEditor?.(),
        focus: () => editorRef.current?.focus?.(),
        blur: () => editorRef.current?.blur?.(),
        showToolbar: showToolbar
    }));

    const { isComponentVisible, setIsComponentVisible } = useClickOutside(defaultShowToolBar || false, customRef || editorContainerRef);

    useEffect(() => {
        checkTrailingLine();
    }, []);

    useEffect(() => {
        const rafId = requestAnimationFrame(() => {
            checkTrailingLine();
        });
        return () => cancelAnimationFrame(rafId);
    }, [isComponentVisible, currentVerticalAlign]);

    useEffect(() => {
        if (readOnly) {
            setShowToolbar(false);
            return;
        }

        setShowToolbar(isComponentVisible);

        const quillEditor = editorRef.current?.getEditor?.();
        if (quillEditor) {
            if (isComponentVisible) {
                quillEditor.focus();
            } else {
                quillEditor.blur();
            }
        }
    }, [isComponentVisible, readOnly]);

    const modules = useMemo(
        () => ({
            toolbar: {
                container: `#${toolbarId}`,
            },
        }),
        [toolbarId]
    );

    const handleBackgroundColorChange = (colorValue: string) => {
        setCurrentBackgroundColor(colorValue);
        if (onBackgroundColorChange) {
            onBackgroundColorChange(colorValue);
        }
    };

    const handleEditorClick = () => {
        setIsComponentVisible(true);
    };

    const handleVerticalAlignChange = (align: 'top' | 'middle' | 'bottom') => {
        setCurrentVerticalAlign(align);
        if (onVerticalAlignChange) {
            onVerticalAlignChange(align);
        }
    };

    const checkTrailingLine = () => {
        const quill = editorRef.current?.getEditor?.();
        if (!quill) return;

        const root = quill.root;
        const overflowingNow = root.scrollHeight - root.clientHeight > 1;
        setIsContentOverflowing(prev => (prev !== overflowingNow ? overflowingNow : prev));
        const paragraphs = root.querySelectorAll('p'); 
        const count = paragraphs.length;
        
        // Determine the new state value based on logic
        let shouldHide = false;

        if (count > 1) {
            const lastP = paragraphs[count - 1];
            // Check text content (trim to handle whitespace-only lines)
            const text = lastP.textContent?.trim() || '';
            
            if (text === '') {
                shouldHide = true;
            }
        }
        
        setHideTrailingEmptyLine(prevState => {
            if (prevState !== shouldHide) {
                return shouldHide;
            }
            return prevState;
        });
    };

    const handleEditorChange = (content: string, delta: any, source: string, editor: any) => {
        checkTrailingLine();
        
        if (onChange) {
            onChange(content, delta, source, editor);
        }
    };

    return (
        <div
            className={Styles['custom-rich-text-wrapper']}
            ref={editorContainerRef}
            style={borderColor ? { '--rte-border-color': borderColor } as React.CSSProperties : undefined}
        >
            <CustomToolbar
                toolbarId={toolbarId}
                backgroundColor={currentBackgroundColor}
                onBackgroundColorChange={handleBackgroundColorChange}
                isVisible={showToolbar}
                textColorConfig={textColorConfig}
                backgroundColorConfig={backgroundColorConfig}
                customOptions={customToolbarOptions}
                showTransparentInColorPicker={showTransparentInColorPicker}
                verticalAlign={currentVerticalAlign}
                onVerticalAlignChange={handleVerticalAlignChange}
            />
            <div
                className={`
                    ${Styles['custom-rich-text-editor-container']} 
                    ${Styles[`vertical-align-${currentVerticalAlign}`]} 
                    ${hideTrailingEmptyLine ? Styles['hide-trailing-line'] : ''}
                    ${isContentOverflowing ? Styles['content-overflowing'] : ''}
                `}
                style={{ backgroundColor: currentBackgroundColor }}
                onClick={handleEditorClick}
            >
                <RichTextEditor
                    ref={editorRef}
                    modules={modules}
                    onChange={handleEditorChange}
                    readOnly={readOnly}
                    {...restProps}
                />
                {
                    showCustomJSXInEditor && renderCustomJSXInEditor ? (
                        <div className={Styles['custom-jsx-container']}>
                            {renderCustomJSXInEditor()}
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
});

CustomRichTextEditor.displayName = 'CustomRichTextEditor';

export default CustomRichTextEditor;