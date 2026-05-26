import FormInput from "atoms/FormInput";
import { PropertyNumber } from "grapesjs";
import useClickOutside from "hooks/useClickOutside";
import React from "react";

interface FormInputWithDropdownProps {
    prop: PropertyNumber;
    onChange: (ev: any) => void;
}

export const FormInputWithDropdown = ({ prop, onChange }: FormInputWithDropdownProps) => {
    const { ref, isComponentVisible, setIsComponentVisible } = useClickOutside();
    const units = prop?.getUnits() ?? [];
    const isUnits = units?.length > 0;
    const hasValue = prop?.hasValue();
    const value = prop?.getValue();
    const valueString = hasValue ? value : "";
    const selectedUnit = prop.getUnit() || units?.[0]; // Default to the first unit
   
    return (
        <>
            <div>
                <div className="label-outside mb-10">{prop?.getLabel()}</div>
            </div>
            <div className="form-dropdown">
                <FormInput
                    id={`property-${prop?.getId()}`}
                    name={prop?.getLabel()}
                    value={valueString}
                    placeholder="auto"
                    type="number"
                    onChange={onChange}
                />
                {isUnits ? (
                    <div ref={ref} onClick={() => setIsComponentVisible(!isComponentVisible)} className="form-dropdown-label">
                        <div className="display-flex display-flex-center">
                            <span className="selected-value">{selectedUnit}</span>
                            <i className="icon_phoenix-down-arrow ml-5" />
                        </div>
                        <ul className={isComponentVisible ? "show" : "hide"}>
                            {units?.map((unit) => (
                                <li onClick={() => prop?.upUnit(unit)} key={unit}>{unit}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        </>
    );
};