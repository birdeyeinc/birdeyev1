import FormInput from "atoms/FormInput";
import { splitNumberAndUnit } from "components/TemplateBuilder/utils";
import { Trait } from "grapesjs";
import useClickOutside from "hooks/useClickOutside";
import React from "react";

interface CompositeTraitInputProps {
    trait: Trait;
    property: Record<string, any>;
}

export const CompositeTraitInput = ({ trait, property }: CompositeTraitInputProps) => {
    const { ref, isComponentVisible, setIsComponentVisible } = useClickOutside();
    // @ts-ignore
    const units = property?.units ?? ["px"];
    const isUnits = units?.length > 0;
    const id = property?.id;
    const value = trait?.getValue()?.[property?.name] ||  property?.value;
    const label = property?.label;
    const valueString = value ?? "";
    const { value: number, unit } = splitNumberAndUnit(valueString);
    const selectedUnit = unit || property?.unit || units?.[0]; // Default to the first unit
    const selectedValue = number || "";

    const handleChange = (e: any) => {
        const combinedValue = {
            property,
            value: (e?.target?.value || 0) + selectedUnit
        };
        trait.setValue(combinedValue);
    };

    const handleUnitChange = (unit: any) => {
        const combinedValue = {
            property,
            value: (selectedValue || 0) + unit
        };
        trait.setValue(combinedValue);
    };

    return (
        <div className="value-block">
            <div>
                <div className="label-outside mb-10">{label}</div>
            </div>
            <div className="form-dropdown">
                <FormInput
                    id={id}
                    name={label}
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
                            {units?.filter((unit: any) => unit === "px" || unit === "%")?.map((unit: any) => (
                                <li onClick={() => {
                                    handleUnitChange(unit);
                                    setIsComponentVisible(false);
                                }} key={unit}>{unit}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        </div>
    );
};