import React from "react";
import { FormInputWithDropdown } from "../inputs/input-w-dropdown";
import type { Property, PropertySelect, PropertyComposite, PropertyNumber, PropertyRadio, PropertySlider } from "grapesjs";
import rgbHex from "rgb-hex";
import { useEditorMaybe } from "@grapesjs/react";
import FormInput from "atoms/FormInput";
import SingleSelect from "atoms/SingleSelect";
import ChromePickerInput from "components/ChromePickerInput";
import style from "./style-property-field.module.scss";
import TabsToggle from "../inputs/trait-tabs";
import { capitalize, startCase } from "lodash";

interface StylePropertyFieldProps extends React.HTMLProps<HTMLDivElement> {
    prop: Property;
    isComposite?: boolean;
}

export default function StylePropertyField({ prop, isComposite, ...rest }: StylePropertyFieldProps) {
    const editor = useEditorMaybe();
    const handleChange = (value: string) => {
        // For composite sub-properties, be more careful about empty values  
        if (isComposite && !value && !prop.hasValue()) {
            return; // Don't set empty values on composite sub-properties that have no existing value  
        }
        // For regular properties and composite parent properties, always allow updates
        prop.upValue(value);
    };

    const onChange = (ev: any) => {
        handleChange(ev.target.value);
    };

    const type = prop.getType();
    const defValue = prop.getDefaultValue();
    const hasValue = prop.hasValue();
    const value = prop.getValue();
    const valueString = hasValue ? value : "";
    const valueWithDef = hasValue ? value : defValue;

    let inputToRender = (
        <>
            <div>
                <div className={`label-outside mb-10 ${style?.["label-outside"]}`}>{prop.getLabel()}</div>
            </div>
            <FormInput
                id={`property-${prop?.getId()}`}
                name={prop?.getLabel()}
                value={valueString}
                placeholder="Enter value"
                type="number"
                onChange={onChange}
            />
        </>
    );

    switch (type) {
        case "select":
            {
                const selectProp = prop as PropertySelect;
                let options = selectProp?.getOptions()?.map((item) => {
                    return {
                        label: startCase(selectProp?.getOptionLabel(item)),
                        value: selectProp?.getOptionId(item),
                        // @ts-ignore
                        optionJSX: item?.optionJSX
                    };
                });

                let computedValue = value;
                const isValidValue = !valueWithDef?.startsWith("var");
                const isFontFamily = prop?.getId() === "font-family";
                const isFontWeight = prop?.getId() === "font-weight";
                if (isFontFamily) {
                    options = options?.map((option) => ({
                        ...option,
                        optionJSX: <div style={{fontFamily: option?.value}}>{startCase(option?.label)}</div>
                    }));
                }
                if (isFontWeight) {
                    options = options?.map((option) => ({
                        ...option,
                        optionJSX: <div style={{fontWeight: option?.value}}>{startCase(option?.label)}</div>
                    }));
                }
                const isInheritedValue = isFontFamily && (!hasValue || !isValidValue);
                if (isInheritedValue) {
                    try {
                        const selectedComponent = editor?.getSelected();
                        if (selectedComponent) {
                            const element = selectedComponent?.getEl();
                            if (element) {
                                const computedStyle = window?.getComputedStyle(element);
                                computedValue = computedStyle?.getPropertyValue("font-family")?.replace(/['"]/g, '');
                            }
                        }
                    } catch (error) {
                        console.warn("Could not get computed font-family:", error);
                    }
                }

                const selectedValue = isInheritedValue ? options?.find(option => option?.value?.includes(computedValue) || computedValue?.includes(option?.value))?.value ?? computedValue : value;
                inputToRender = (
                    <>
                        <div>
                            <div className={`label-outside mb-10 ${style?.["label-outside"]}`}>{selectProp.getLabel()}</div>
                        </div>
                        <SingleSelect
                            displayLabel="Select"
                            onChange={(value: any) => {
                                handleChange(value?.value);
                            }}
                            selected={selectedValue}
                            options={options}
                        />
                    </>
                );
            }
            break;
        case "color":
            {
                const selectedComponent = editor?.getSelected();
                const frameWindow = selectedComponent?.getEl()?.ownerDocument?.defaultView;
                const computedStyle = frameWindow?.getComputedStyle(selectedComponent?.getEl()!);
                const propId = prop?.getId();
                const propValue = computedStyle?.getPropertyValue(propId);
                // todo: fix rgb in first try issue or use better color picker
                const computedValue = propValue && propValue !== "rgba(0, 0, 0, 0)" ? `#${rgbHex(propValue)}` : "#FFFFFF";
                const isValidValue = valueWithDef && valueWithDef?.startsWith("#") ? true : false;
                const colorVal = isValidValue ? valueWithDef : computedValue;
                inputToRender = (
                    <div className={`display-flex display-flex-center justify-content-betweeen color-picker-block ${style?.["color-picker-block"]}`}>
                        <div>
                            <div className={`label-outside mb-10 ${style?.["label-outside"]}`}>{prop.getLabel()}</div>
                        </div>
                        <div className={`bg-block ${style?.["bg-block"]}`}>
                            <ChromePickerInput
                                showColorInput={false}
                                color={colorVal}
                                onChangeComplete={(color: any) => handleChange(color?.hex)}
                            />
                        </div>
                    </div>
                );
            }
            break;
        case "composite":
            {
                const compositeProp = prop as PropertyComposite;
                inputToRender = (
                    <>
                        <div>
                            <div className="mb-10">{compositeProp.getLabel()}</div>
                        </div>
                        <div className={`display-flex value-wrap ${style?.["value-wrap"]}`}>
                            {compositeProp?.getProperties()?.map(prop => (
                                <StylePropertyField key={prop?.getId()} prop={prop} isComposite={true} />
                            ))}
                        </div>
                    </>
                );
            }
            break;
        case "number":
            const numberProp = prop as PropertyNumber;
            {
                inputToRender = (
                    <FormInputWithDropdown prop={numberProp} onChange={onChange} />
                );
            }
            break;
        case "slider": {
            const sliderProp = prop as PropertySlider;
            inputToRender = (
                <>
                    <div className={`label-outside mb-10 ${style?.["label-outside"]}`}>{prop.getLabel()}</div>
                    <div className={`range-input-container ${style?.["range-input-container"]}`}>
                        <input
                            type="range"
                            value={parseFloat(value)}
                            onChange={onChange}
                            min={sliderProp.getMin()}
                            max={sliderProp.getMax()}
                            step={sliderProp.getStep()}
                        />
                        <div>{parseFloat(value)}</div>
                    </div>
                </>
            )
            break;
        }
        case "radio": {
            const radioProp = prop as PropertyRadio;
            inputToRender = (
                <>
                    <div className={`label-outside mb-10 ${style?.["label-outside"]}`}>{prop.getLabel()}</div>
                    <TabsToggle
                        key={radioProp?.getId()}
                        tabsArray={radioProp.getOptions()?.map((option) => {
                            return {
                                label: capitalize(radioProp.getOptionLabel(option)) as string,
                                value: radioProp.getOptionId(option) as string
                            };
                        })}
                        selected={value}
                        onTabSelect={(value) => {
                            prop.upValue(value)
                        }}
                    />
                </>
            )
            break;
        }
        case "stack": {
            inputToRender = (
                <></>
            )
            break;
        }
    }

    return (
        <div className={`style-property-field value-block ${style?.["value-block"]} ${type === `color` ? `w-full ${style?.["w-full"]}` : ""}`} {...rest}>
            {inputToRender}
        </div>
    );
}
