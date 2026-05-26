import React, { useEffect, useState, useRef, useMemo } from "react";
// assets
import boldImage from "assets/images/bold-image.svg";
import italicImage from "assets/images/italic-image.svg";
import underlineImage from "assets/images/underline-image.svg";
import strikeImage from "assets/images/strike-image.svg";
import bulletedList from "assets/images/list.svg";
import orderedList from "assets/images/list-ordered.svg";

// atoms
import ActionBox from "atoms/ActionBox";
import SingleSelect from "atoms/SingleSelect";
import Tooltip from "atoms/Tooltip";
import { ToggleButton } from "./toggle-button";
// utils, types, constants
import { RichTextEditorProps } from "./types";
import { TEXT_ALIGN_OPTIONS, TEXT_HEADING_OPTIONS, FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS, LETTER_SPACING_OPTIONS, LINE_HEIGHT_OPTIONS } from "./constants";
import { calculateLineHeightForFontSize } from "./rich-text-utils";
// styles
import style from "./rich-text-editor.module.scss";
import { Editor } from "@tiptap/core";
import { useMaintainFocus } from "./use-maintain-focus";
// import ChromePickerInput from "components/ChromePickerInput";
import rgbHex from "rgb-hex";

const RichTextEditor = ({ rteInstance = null, extraOptions = null, grapesEditor = null }: RichTextEditorProps) => {
    // Utility function to get computed styles from DOM when TipTap doesn't have explicit attributes
    const getComputedStyleFromSelection = (cssProperty: string, defaultValue: string): string => {
        if (!rteInstance) return defaultValue;

        const { view } = rteInstance;
        if (!view) return defaultValue;

        const { state } = view;
        const { from } = state.selection;

        try {
            const domAtPos = view.domAtPos(from);
            const node = domAtPos?.node;
            const element = node?.nodeType === Node.TEXT_NODE
                ? node.parentElement
                : node as HTMLElement;

            if (element) {
                const computed = window.getComputedStyle(element);
                return computed.getPropertyValue(cssProperty) || defaultValue;
            }
        } catch (e) {
            // Selection might be outside editable area
        }

        return defaultValue;
    };

    const [isBoldActive, setIsBoldActive] = useState(rteInstance?.isActive("bold") || false);
    const [isItalicActive, setIsItalicActive] = useState(rteInstance?.isActive("italic") || false);
    const [isUnderlineActive, setIsUnderlineActive] = useState(rteInstance?.isActive("underline") || false);
    const [isStrikeActive, setIsStrikeActive] = useState(rteInstance?.isActive("strike") || false);
    const [currentAlignment, setCurrentAlignment] = useState(TEXT_ALIGN_OPTIONS[0].value);
    const [isBulletListActive, setIsBulletListActive] = useState(rteInstance?.isActive('bulletList') || false);
    const [isOrderedListActive, setIsOrderedListActive] = useState(rteInstance?.isActive('orderedList') || false);
    const [currentHeading, setCurrentHeading] = useState<any>(TEXT_HEADING_OPTIONS[0].value);
    // @ts-ignore
    const [currentFontFamily, setCurrentFontFamily] = useState(getActiveFontFamily() || FONT_FAMILY_OPTIONS[0]?.value);
    const [currentFontSize, setCurrentFontSize] = useState<string>(FONT_SIZE_OPTIONS[4].value); // Default to 16px
    const [currentFontColor, setCurrentFontColor] = useState<string>("#000000");
    const [currentLineHeight, setCurrentLineHeight] = useState<string>(LINE_HEIGHT_OPTIONS[2].value); // Default to 1.5
    
    // Helper to create a dynamic font size option if not in predefined list
    const getFontSizeOptions = useMemo(() => {
        if (!currentFontSize) return [...FONT_SIZE_OPTIONS];
        
        const exists = FONT_SIZE_OPTIONS.some(opt => opt.value === currentFontSize);
        if (exists) return [...FONT_SIZE_OPTIONS];
        
        // Create dynamic option for the computed value
        const numericValue = parseFloat(currentFontSize);
        const label = currentFontSize.replace('px', '');
        const dynamicOption = { label, value: currentFontSize };
        
        // Insert in sorted order based on numeric value
        const options = [...FONT_SIZE_OPTIONS] as { label: string; value: string }[];
        const insertIndex = options.findIndex(opt => parseFloat(opt.value) > numericValue);
        if (insertIndex === -1) {
            options.push(dynamicOption);
        } else {
            options.splice(insertIndex, 0, dynamicOption);
        }
        
        return options;
    }, [currentFontSize]);
    
    // Helper to create a dynamic line height option if not in predefined list
    const getLineHeightOptions = useMemo(() => {
        if (!currentLineHeight) return [...LINE_HEIGHT_OPTIONS];
        
        const exists = LINE_HEIGHT_OPTIONS.some(opt => opt.value === currentLineHeight);
        if (exists) return [...LINE_HEIGHT_OPTIONS];
        
        // Create dynamic option for the computed value
        const numericValue = parseFloat(currentLineHeight);
        // Format the label - if it's a ratio show it directly, if px show the value
        const isPxValue = currentLineHeight.endsWith('px');
        const label = isPxValue 
            ? currentLineHeight 
            : `${numericValue}`;
        const dynamicOption = { label, value: currentLineHeight };
        
        // Insert in sorted order based on numeric value
        const options = [...LINE_HEIGHT_OPTIONS] as { label: string; value: string }[];
        const insertIndex = options.findIndex(opt => parseFloat(opt.value) > numericValue);
        if (insertIndex === -1) {
            options.push(dynamicOption);
        } else {
            options.splice(insertIndex, 0, dynamicOption);
        }
        
        return options;
    }, [currentLineHeight]);
    
    // Refs to control dropdowns directly
    const fontFamilyRef = useRef<any>(null);
    const fontSizeRef = useRef<any>(null);
    const headingRef = useRef<any>(null);
    const lineHeightRef = useRef<any>(null);
    
    const closeAllDropdowns = (exceptRef?: React.RefObject<any>) => {
        [fontFamilyRef, fontSizeRef, headingRef, lineHeightRef].forEach(ref => {
            if (ref !== exceptRef && ref.current && ref.current.setState) {
                ref.current.setState({ show: false });
            }
        });
    };

    useMaintainFocus(grapesEditor);

    const handleActiveState = ({ editor }: { editor: Editor }) => {
        if (editor) {
            setIsBoldActive(editor.isActive("bold"));
            setIsItalicActive(editor.isActive("italic"));
            setIsUnderlineActive(editor.isActive("underline"));
            setIsStrikeActive(editor.isActive("strike"));
            setIsBulletListActive(editor.isActive('bulletList'));
            setIsOrderedListActive(editor.isActive('orderedList'));
            setCurrentFontColor(getCurrentTextColor(editor) || "#000000");
            setCurrentFontFamily(getActiveFontFamily());
            setCurrentFontSize(getActiveFontSize());
            setCurrentLineHeight(getCurrentLineHeight(editor) || LINE_HEIGHT_OPTIONS[2].value);
            setCurrentHeading(getCurrentHeading(editor));
        }
    };

    useEffect(() => {
        if (rteInstance) {
            rteInstance.on("selectionUpdate", handleActiveState);
            rteInstance.on("update", handleActiveState);

        }
        return () => {
            if (rteInstance) {
                rteInstance.off("selectionUpdate", handleActiveState);
                rteInstance.off("update", handleActiveState);
            }
        };
    }, [rteInstance]);


    if (!rteInstance) {
        return null;
    }

    function getActiveFontSize() {
        // First check TipTap's explicit attributes
        const fontSize = rteInstance?.getAttributes('textStyle')?.fontSize;
        if (fontSize) return fontSize;

        // Fallback to computed style from DOM
        const computedFontSize = getComputedStyleFromSelection('font-size', '');
        if (computedFontSize) {
            // Try to match with our options, or return the computed value
            const matchedOption = FONT_SIZE_OPTIONS.find(opt => opt.value === computedFontSize);
            return matchedOption ? matchedOption.value : computedFontSize;
        }

        return FONT_SIZE_OPTIONS[4].value; // Default to 16px
    }

    const getSelectedAlignmentLabel = () => {
        const selectedOption = TEXT_ALIGN_OPTIONS.find(option => currentAlignment === option.value);

        return selectedOption ? selectedOption.label : TEXT_ALIGN_OPTIONS[0].label;
    };

    const getSelectedAlignmentValue = () => {
        const selectedOption = TEXT_ALIGN_OPTIONS.find(option => currentAlignment === option.value);

        return selectedOption ? selectedOption.value : TEXT_ALIGN_OPTIONS[0].value;
    };
    const getSelectedHeadingLabel = () => {
        const selectedOption = TEXT_HEADING_OPTIONS.find(option => currentHeading === option.value);

        return selectedOption ? selectedOption.label : TEXT_HEADING_OPTIONS[0].label;
    };

    const getSelectedHeadingValue = () => {
        const selectedOption = TEXT_HEADING_OPTIONS.find(option => currentHeading === option.value);
        return selectedOption ? selectedOption.value : TEXT_HEADING_OPTIONS[0].value;
    };

    function getActiveFontFamily() {
        // Sort options by primary font name length (longest first) to match more specific fonts first
        // e.g., "Arial Black" should be matched before "Arial"
        const sortedFontOptions = [...FONT_FAMILY_OPTIONS].sort((a, b) => {
            const aValue = a?.value?.split(",")[0]?.trim()?.replace(/["']/g, '') || '';
            const bValue = b?.value?.split(",")[0]?.trim()?.replace(/["']/g, '') || '';
            return bValue.length - aValue.length;
        });

        // First check TipTap's explicit attributes
        const tiptapFontFamily = rteInstance?.getAttributes('textStyle')?.fontFamily;
        if (tiptapFontFamily) {
            const selectedOption = sortedFontOptions.find(option => {
                const optionValue = option?.value?.split(",")[0];
                return tiptapFontFamily.includes(optionValue);
            });
            if (selectedOption) return selectedOption.value;
        }

        // Fallback to computed style from DOM
        const computedFontFamily = getComputedStyleFromSelection('font-family', '');
        if (computedFontFamily) {
            // Try to match computed font with our options
            const matchedOption = sortedFontOptions.find(option => {
                const optionValue = option?.value?.split(",")[0]?.trim()?.replace(/["']/g, '');
                // Computed font-family may have quotes and be a stack
                return computedFontFamily.toLowerCase().includes(optionValue.toLowerCase());
            });
            if (matchedOption) return matchedOption.value;
        }

        return FONT_FAMILY_OPTIONS[0]?.value;
    };

    function getCurrentTextColor(editor: Editor) {
        if (!editor) {
            return null;
        }

        // Get the attributes of the currently active 'textStyle' mark
        const attributes = editor.getAttributes('textStyle');
        
        let colorValue = attributes?.color;
        
        // Fallback to computed style if no explicit color
        if (!colorValue) {
            colorValue = getComputedStyleFromSelection('color', '');
        }
        
        if (!colorValue) {
            return null;
        }
        
        if (colorValue.startsWith("#")) {
            return colorValue;
        }
        
        try {
            const color = rgbHex(colorValue);
            return color.startsWith(`#`) ? color : `#${color}`;
        } catch (e) {
            return null;
        }
    };

    function getCurrentLineHeight(editor: Editor) {
        if (!editor) {
            return null;
        }

        // Get the attributes of the currently active 'textStyle' mark
        const attributes = editor.getAttributes('textStyle');
        if (attributes?.lineHeight) {
            return attributes.lineHeight;
        }
        
        // Fallback to computed style from DOM
        const computedLineHeight = getComputedStyleFromSelection('line-height', '');
        if (computedLineHeight) {
            // Computed line-height may be in px (e.g., "24px") or a number
            // Try to match with our options or convert to ratio
            const matchedOption = LINE_HEIGHT_OPTIONS.find(opt => opt.value === computedLineHeight);
            if (matchedOption) return matchedOption.value;
            
            // If it's a pixel value, try to calculate ratio based on font size
            if (computedLineHeight.endsWith('px')) {
                const lineHeightPx = parseFloat(computedLineHeight);
                const fontSizePx = parseFloat(getComputedStyleFromSelection('font-size', '16px'));
                if (fontSizePx > 0) {
                    const ratio = (lineHeightPx / fontSizePx).toFixed(1);
                    const ratioOption = LINE_HEIGHT_OPTIONS.find(opt => opt.value === ratio);
                    if (ratioOption) return ratioOption.value;
                }
            }
            
            return computedLineHeight;
        }
        
        return null;
    }

    function getCurrentHeading(editor: Editor) {
        if (!editor) {
            return null;
        }
        
        // Get the level of the currently active heading
        for (let level = 1; level <= 6; level++) {
            if (editor.isActive('heading', { level })) {
                return level;
            }
        }
        return null;
    }

    return (
        <section className={`rich-text-editor-container ${style["rich-text-editor-container"]}`}>
            <div id="rich-text-editor" className={"rich-text-editor"}>
                <div className={`text-alignment-dropdown-wrap ${style["text-alignment-dropdown-wrap"]}`}>
                    <SingleSelect
                        ref={headingRef}
                        options={TEXT_HEADING_OPTIONS}
                        selected={getSelectedHeadingValue()}
                        onChange={(selectedOption: any) => {
                            if (selectedOption?.value === "body") {
                                rteInstance.chain().focus().setParagraph().setFontSize(selectedOption?.size).run();
                            } else {
                                rteInstance.chain().focus().setHeading({ level: selectedOption?.value }).setFontSize(selectedOption?.size).run();
                            }
                            setCurrentHeading(selectedOption?.value);
                        }}
                        searchPlaceHolder="Search"
                        placeholder="Select heading"
                        customSize="small"
                        displayLabel={getSelectedHeadingLabel() || "Select"}
                        customOnClick={() => {
                            closeAllDropdowns(headingRef);
                        }}
                        showTooltipOnHover
                        tooltipHoverText="Heading"
                    />
                </div>
                <div className={`text-alignment-dropdown-wrap font-family-wrap ${style["text-alignment-dropdown-wrap"]} ${style["font-family-wrap"]}`}>
                    <SingleSelect
                        ref={fontFamilyRef}
                        options={FONT_FAMILY_OPTIONS}
                        selected={currentFontFamily}
                        onChange={(selectedOption: any) => {
                            // @ts-ignore
                            console.log("editor ", rteInstance);
                            rteInstance.chain().focus()?.setFontFamily(selectedOption.value).run();
                            setCurrentFontFamily(selectedOption.value);
                        }}
                        showSearch={true}
                        searchPlaceHolder="Search"
                        placeholder="Select font family"
                        customSize="small"
                        displayLabel={currentFontFamily || "Select"}
                        customOnClick={() => {
                            closeAllDropdowns(fontFamilyRef);
                        }}
                        showTooltipOnHover
                        tooltipHoverText="Font family"
                    />
                </div>
                {/* FONT SIZE */}
                <div className={`text-alignment-dropdown-wrap font-size-wrap ${style["text-alignment-dropdown-wrap"]}`}>
                    <SingleSelect
                        ref={fontSizeRef}
                        options={getFontSizeOptions}
                        selected={currentFontSize}
                        onChange={(selectedOption: any) => {
                            // @ts-ignore
                            console.log("Setting font size:", selectedOption.value);
                            const newLineHeight = calculateLineHeightForFontSize(selectedOption.value);
                            rteInstance.chain().focus().setFontSize(selectedOption.value).toggleTextStyle({ lineHeight: newLineHeight }).run();
                            setCurrentFontSize(selectedOption.value);
                            setCurrentLineHeight(newLineHeight);
                        }}
                        showSearch={true}
                        searchPlaceHolder="Search"
                        placeholder="Font size"
                        customSize="small"
                        displayLabel={currentFontSize || "Select"}
                        customOnClick={() => {
                            closeAllDropdowns(fontSizeRef);
                        }}
                        showTooltipOnHover
                        tooltipHoverText="Font size"
                    />
                </div>
                
                {/* @ts-ignore */}
                <ToggleButton active={isBoldActive} onClick={() => rteInstance.chain().focus().toggleBold().run()} tooltipText="Bold">
                    <img src={boldImage} alt="Bold" />
                </ToggleButton>
                {/* ITALIC */}
                {/* @ts-ignore */}
                <ToggleButton active={isItalicActive} onClick={() => rteInstance.chain().focus().toggleItalic().run()} tooltipText="Italic">
                    <img src={italicImage} alt="Italic" />
                </ToggleButton>
                {/* UNDERLINE */}
                {/* @ts-ignore */}
                <ToggleButton active={isUnderlineActive} onClick={() => rteInstance.chain().focus()?.toggleUnderline()?.run()} tooltipText="Underline">
                    <img src={underlineImage} alt="Underline" />
                </ToggleButton>
                {/* STRIKETHROUGH */}
                {/* @ts-ignore */}
                <ToggleButton active={isStrikeActive} onClick={() => rteInstance.chain().focus().toggleStrike().run()} tooltipText="Strikethrough">
                    <img src={strikeImage} alt="strike" />
                </ToggleButton>
                {/* ALIGNMENT */}

                <div className={`text-alignment-dropdown-wrap ${style["text-alignment-dropdown-wrap"]}`}>
                    <ActionBox
                        actionClickCb={({ value }: { value: any }) => {
                            // @ts-ignore
                            rteInstance.chain().focus()?.toggleTextAlign(value).run();
                            setCurrentAlignment(value);
                        }}
                        actionConfig={{
                            categories: [
                                {
                                    options: TEXT_ALIGN_OPTIONS.map(option => ({
                                        ...option,
                                        className: currentAlignment === option.value ? "selected" : ""
                                    })),
                                    title: ""
                                }
                            ]
                        }}
                        selectedVal={getSelectedAlignmentValue()}
                        customDropdownIcon="icon_phoenix-cheveron_open"
                        customHeaderClassName=""
                        popOverDirection="right"
                        ActionLabel={getSelectedAlignmentLabel()}
                    />
                </div>
                <div className={`text-alignment-dropdown-wrap  ${style["text-alignment-dropdown-wrap"]}`}>
                    <Tooltip text="Font color">
                        <input
                            type="color"
                            onInput={event => rteInstance.chain().focus().setColor(event?.currentTarget?.value).run()}
                            value={currentFontColor}
                            data-testid="setColor"
                        />
                    </Tooltip>
                </div>
                {/* LINE HEIGHT */}
                <div className={`text-alignment-dropdown-wrap line-height-block font-size-wrap ${style["text-alignment-dropdown-wrap"]}`}>
                    <SingleSelect
                        ref={lineHeightRef}
                        options={getLineHeightOptions}
                        selected={currentLineHeight}
                        onChange={(selectedOption: any) => {
                            // @ts-ignore
                            rteInstance.chain().focus().toggleTextStyle({ lineHeight: selectedOption?.value }).run();
                            setCurrentLineHeight(selectedOption?.value);
                        }}
                        placeholder="Line height"
                        customSize="small"
                        displayLabel={currentLineHeight || "Line Height"}
                        customOnClick={() => {
                            closeAllDropdowns(lineHeightRef);
                        }}
                        showLeftIcon
                        customLeftIconClass="icon_phoenix-spacer-image"
                        showTooltipOnHover
                        tooltipHoverText="Line height"
                    />
                </div>
                <ToggleButton active={isBulletListActive} onClick={() => rteInstance?.chain()?.focus()?.toggleBulletList()?.run()} tooltipText="Bullet list">
                    <img src={bulletedList} alt="bulletList" className={`toggle-image-button ${style["toggle-image-button"]}`} />
                </ToggleButton>
                <ToggleButton active={isOrderedListActive} onClick={() => rteInstance?.chain()?.focus()?.toggleOrderedList()?.run()} tooltipText="Ordered list">
                    <img src={orderedList} alt="orderedList" className={`toggle-image-button ${style["toggle-image-button"]}`} />
                </ToggleButton>
                {extraOptions}
            </div>
        </section>
    );
};

export default RichTextEditor;