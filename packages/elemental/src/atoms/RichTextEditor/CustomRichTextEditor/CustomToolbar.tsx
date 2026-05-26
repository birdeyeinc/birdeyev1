import React, { useEffect, useRef, useState } from 'react';
import Styles from './CustomRichTextEditor.module.scss';
import { CustomToolbarProps, CustomToolbarOption } from '../interface';
import useClickOutside from '../../../hooks/useClickOutside';

const CustomToolbar: React.FC<CustomToolbarProps> = (props) => {
    const {
        toolbarId,
        backgroundColor,
        onBackgroundColorChange,
        isVisible = true,
        textColorConfig,
        backgroundColorConfig,
        showTransparentInColorPicker,
        customOptions = [],
        verticalAlign = 'top',
        onVerticalAlignChange,
    } = props;
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showAlignPicker, setShowAlignPicker] = useState(false);
    const paintButtonRef = useRef<HTMLDivElement>(null);
    const alignButtonRef = useRef<HTMLDivElement>(null);

    const isBackgroundActive = backgroundColor !== backgroundColorConfig[0]?.value;
    const isVerticalAlignActive = verticalAlign !== 'top';

    const { isComponentVisible: isBackgroundColorVisible, setIsComponentVisible: setIsBackgroundColorVisible } = useClickOutside(showColorPicker, paintButtonRef);
    const { isComponentVisible: isAlignVisible, setIsComponentVisible: setIsAlignVisible } = useClickOutside(showAlignPicker, alignButtonRef);

    useEffect(() => {
        if (!isBackgroundColorVisible && showColorPicker) {
            setShowColorPicker(false);
        }
    }, [isBackgroundColorVisible, showColorPicker]);

    useEffect(() => {
        if (!isAlignVisible && showAlignPicker) {
            setShowAlignPicker(false);
        }
    }, [isAlignVisible, showAlignPicker]);

    const toggleColorPicker = () => {
        const newValue = !showColorPicker;
        setShowColorPicker(newValue);
        setIsBackgroundColorVisible(newValue);
    };

    const handleColorSelect = (colorValue: string) => {
        onBackgroundColorChange(colorValue);
        setShowColorPicker(false);
        setIsBackgroundColorVisible(false);
    };

    const toggleAlignPicker = () => {
        const newValue = !showAlignPicker;
        setShowAlignPicker(newValue);
        setIsAlignVisible(newValue);
    };

    const handleAlignSelect = (align: 'top' | 'middle' | 'bottom') => {
        if (onVerticalAlignChange) {
            onVerticalAlignChange(align);
        }
        setShowAlignPicker(false);
        setIsAlignVisible(false);
    };

    const colorIndicatorStyle = {
        backgroundColor:
            backgroundColor === 'transparent'
                ? 'transparent'
                : backgroundColor,
    };

    const renderCustomOption = (option: CustomToolbarOption) => {
        return <React.Fragment key={option.id}>{option.render()}</React.Fragment>;
    };

    const getVerticalAlignIcon = (align: string) => {
        switch (align) {
            case 'middle':
                return (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 19h3v4h2v-4h3l-4-4-4 4zm8-14h-3V1h-2v4H8l4 4 4-4zM4 11v2h16v-2H4z" />
                    </svg>
                );
            case 'bottom':
                return (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z" />
                    </svg>
                );
            case 'top':
            default:
                return (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z" />
                    </svg>
                );
        }
    };

    return (
        <div
            id={toolbarId}
            className={Styles['custom-toolbar-container']}
            style={{ display: isVisible ? 'flex' : 'none' }}
            aria-label="Text formatting toolbar"
        >
            {/* Standard Quill Formats */}
            <span className="ql-formats">
                <select className="ql-size" defaultValue="Normal">
                    <option value="small"></option>
                    <option value="Normal"></option>
                    <option value="large"></option>
                    <option value="huge"></option>
                </select>
            </span>
            <span className={`${Styles['custom-toolbar-btn-wrapper']} ql-formats`}>
                <select className="ql-color" defaultValue={textColorConfig[0]?.value}>
                    {textColorConfig.map((color, index) => (
                        <option key={index} value={color.value} />
                    ))} 
                </select>
                {backgroundColorConfig?.length > 0 && <div className={Styles['custom-toolbar-btn-wrapper']} ref={paintButtonRef}>
                    <button
                        type="button"
                        className={`${Styles['ql-custom-paint']} ${showColorPicker ? Styles['active'] : ''} ${isBackgroundActive ? Styles['selected-value'] : ''}`}
                        onClick={toggleColorPicker}
                        aria-label="Background color"
                    >
                        <div className={Styles['icon-container']}>
                            <div className={Styles['paint-icon-wrapper']}>
                                <i className="icon_phoenix-colors" />
                                <div
                                    className={Styles['color-indicator']}
                                    style={colorIndicatorStyle}
                                />
                            </div>
                           
                        </div>
                        

                    </button>
                    {showColorPicker && (
                        <div className={Styles['toolbar-color-popover']}>
                            <div className={Styles['color-grid']}>
                                {backgroundColorConfig.map((color, index) => (
                                    <button
                                        key={color.label}
                                        type="button"
                                        className={`${color.value === 'transparent' || (showTransparentInColorPicker && index === backgroundColorConfig.length - 1) ? Styles['none-indicator'] : ''} ${Styles['color-option']} ${backgroundColor === color.value
                                            ? Styles['selected']
                                            : ''
                                            }`}
                                        style={{
                                            backgroundColor:
                                                color.value === 'transparent'
                                                    ? 'transparent'
                                                    : showTransparentInColorPicker && index === backgroundColorConfig.length - 1
                                                        ? 'white'
                                                        : color.value,
                                        }}
                                        onClick={() => handleColorSelect(color.value)}
                                        aria-label={`Select ${color.label}`}
                                    >
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>}
            </span>

            <span className="ql-formats">
                <select className="ql-align"></select>
                {onVerticalAlignChange && (
                    <div className={Styles['custom-toolbar-btn-wrapper']} ref={alignButtonRef}>
                        <button
                            type="button"
                            className={`${Styles['ql-custom-paint']} ${showAlignPicker ? Styles['active'] : ''} ${isVerticalAlignActive ? Styles['selected-value'] : ''}`}
                            onClick={toggleAlignPicker}
                            aria-label="Vertical alignment"
                        >
                            <div className={Styles['icon-container']}>
                                {getVerticalAlignIcon(verticalAlign)}
                            </div>
                        </button>
                        {showAlignPicker && (
                            <div className={Styles['toolbar-color-popover']}>
                                <div className={Styles['color-grid']}>
                                    {['top', 'middle', 'bottom'].map((align) => (
                                        <button
                                            key={align}
                                            type="button"
                                            className={`${Styles['align-option']} ${verticalAlign === align ? Styles['selected'] : ''}`}
                                            onClick={() => handleAlignSelect(align as 'top' | 'middle' | 'bottom')}
                                            aria-label={`Align ${align}`}
                                        >
                                            {getVerticalAlignIcon(align)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </span>
            <span className="ql-formats">
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
            </span>
            <span className='ql-formats'>
                {customOptions.map((option) => renderCustomOption(option))}
            </span>
        </div>
    );
};

export default CustomToolbar;