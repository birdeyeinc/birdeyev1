import React from "react";
import { Trait } from "grapesjs";
import useClickOutside from "hooks/useClickOutside";
import FormInput from "atoms/FormInput";
import { splitNumberAndUnit } from "components/TemplateBuilder/utils";

interface FormInputWithDropdownProps {
    prop: Trait;
    onChange: (ev: any) => void;
}

export const TraitInputWithDropdown = ({ prop }: FormInputWithDropdownProps) => {
    const { ref, isComponentVisible, setIsComponentVisible } = useClickOutside();
    // @ts-ignore
    const units = prop?.get("units") ?? ["px"];
    const isUnits = units?.length > 0;
    const value = prop?.getValue();
    const valueString = value ?? "";
    const { value: number, unit } = splitNumberAndUnit(valueString);
    const selectedUnit = unit || prop.get("unit") || units?.[0]; // Default to the first unit
    const selectedValue = number || "";

    const handleChange = (e: any) => {
        prop.setValue((e?.target?.value || 0) + selectedUnit);
    };

    return (
        <>
            <div>
                <div className="label-outside mb-10">{prop?.getLabel()}</div>
            </div>
            <div className="form-dropdown">
                <FormInput
                    id={`property-${prop?.getId()}`}
                    name={prop?.getLabel()}
                    value={selectedValue}
                    placeholder="auto"
                    type="number"
                    onChange={handleChange}
                />
                {isUnits ? (
                    <div ref={ref} onClick={() => setIsComponentVisible(!isComponentVisible)} className="form-dropdown-label">
                        <div className="display-flex display-flex-center">
                            <span className="selected-value">{selectedUnit}</span>
                            <i className="icon_phoenix-down-arrow ml-5" />
                        </div>
                        <ul className={isComponentVisible ? "show" : "hide"}>
                            {units?.map((unit: any) => (
                                <li onClick={() => {
                                    prop?.set("unit", unit);
                                    prop?.setValue((selectedValue || 0) + unit);
                                    setIsComponentVisible(false);
                                }} key={unit}>{unit}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        </>
    );
};