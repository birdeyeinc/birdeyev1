import { useEditorMaybe } from "@grapesjs/react";
import Button from "atoms/Button";
import FormInput from "atoms/FormInput";
import SingleSelect from "atoms/SingleSelect";
import Toggle from "atoms/Toggle";
import Tooltip from "atoms/Tooltip";
import ChromePickerInput from "components/ChromePickerInput";
import { Trait } from "grapesjs";
import Multiselect from "atoms/Multiselect";
import React from "react";
import TraitTabs from "../inputs/trait-tabs";
import TextArea from "atoms/TextArea";
import styles from "./trait-property-field.module.scss";
import { TraitInputWithDropdown } from "../inputs/trait-input-w-dropdown";
import { CompositeTraitInput } from "../inputs/composite-trait-input";
import { CodeBlock } from "../inputs/code-block";
import { ImageTrait } from "../inputs/image-trait";
import { SocialLinks } from "../inputs/social-links";


interface StylePropertyFieldProps extends React.HTMLProps<HTMLDivElement> {
    trait: Trait;
    isComposite?: boolean;
}

export default function TraitPropertyField({ trait, isComposite, ...rest }: StylePropertyFieldProps) {
    const editor = useEditorMaybe();
    const handleChange = (value: string) => {
        trait.setValue(value);
    };

    const onChange = (ev: any) => {
        handleChange(ev.target.value);
    };

    const handleButtonClick = () => {
        const command = trait.get("command");
        if (command) {
            typeof command === "string" ? editor?.runCommand(command) : command(editor!, trait);
        }
    };

    const type = trait.getType();
    const defValue = trait.getDefault() || trait.attributes.placeholder;
    const value = trait.getValue();
    const valueWithDef = typeof value !== "undefined" ? value : defValue;
    const onlyLabel = trait.get("label" as any);
    const labelOrName = trait?.getLabel();
    const isRequired = trait.get("required" as any);
    const subText = trait.get("subText" as any);
    const style = trait.get("style" as any);
    const isHref = trait?.getId() === "href";

    let inputToRender = (
        <>
            {onlyLabel && <label className={`label-outside ${styles["label-outside"]} mb-10 ${isRequired ? "required" : ""}`}>{onlyLabel}</label>}
            <FormInput
                id={`property-${trait?.getId()}`}
                name={labelOrName || onlyLabel}
                placeholder={defValue}
                type={trait?.getType()}
                value={value}
                onChange={onChange}
            />
            {subText ? <p className="mt-10 sub-text">{subText}</p> : null}
        </>
    );

    switch (type) {
        case "select":
            {
                const options = trait?.getOptions()?.map((item) => {
                    return {
                        label: item?.label || item?.name,
                        value: item?.id || item?.value,
                        optionJSX: item?.optionJSX ?? undefined,
                        disabled: item?.disabled ?? false
                    };
                });

                const traitValue = trait?.getValue();
                const validTraitValue = traitValue?.value !== undefined ? traitValue?.value : traitValue;
                const selected = trait?.getOptions()?.find((option: any) => typeof option.value === "string" ? option.value.includes(validTraitValue) : option.value === validTraitValue)?.value;
                const isHidden = trait.get("isHidden" as any);
                inputToRender = isHidden ? <></> : (
                    <>
                        {onlyLabel && <label className={`${isRequired ? "required" : ""} label-outside mb-10`}>{labelOrName}</label>}
                        <SingleSelect
                            displayLabel="Select"
                            label={trait?.getLabel()}
                            selected={selected}
                            options={options}
                            onChange={({ value, label }: any) => {
                                trait.setValue(value);
                            }}
                            showSearch={options?.length > 5 ? true : false}
                        />
                    </>
                );
            }
            break;
        case "multiselect": {
            const handleOnChange = (selections: any) => {
                const selectedValues = selections?.map((selection: any) => selection?.value);
                trait.setValue(selectedValues);
            };
            inputToRender = (
                <>
                    {onlyLabel && <label className={`${isRequired ? "required" : ""} label-outside mb-10`}>{labelOrName}</label>}
                    <Multiselect
                        name={labelOrName}
                        options={trait?.getOptions()}
                        selected={trait?.getValue()}
                        label={trait.get("placeholder")}
                        selectedAliasPlaceholder={trait.get("placeholder")}
                        showSearch={trait?.getOptions()?.length > 10}
                        placeholder={`Select ${trait.get("placeholder")}`}
                        onBlur={handleOnChange}
                        ctaButtonsEnabled
                    />
                </>
            );
            break;
        }
        case "image":
            {
                inputToRender = (
                    <ImageTrait trait={trait} />
                );
            }
            break;
        case "color":
            {
                inputToRender = (
                    <div className={`bg-block ${styles?.["bg-block"]}`}>
                        <ChromePickerInput
                            showColorInput={false}
                            label={trait?.getLabel()}
                            color={valueWithDef}
                            onChangeComplete={(color: any) => trait.setValue(color.hex)}
                        />
                    </div>
                );
            }
            break;
        case "checkbox":
            {
                inputToRender = (
                    <div className="display-flex display-align-center minus-mt-20">
                        <FormInput
                            checked={!!value}
                            className="checkBox"
                            id={`property-${trait?.getId()}`}
                            name={labelOrName}
                            onChange={(ev: any) => trait.setValue(ev.target.checked)}
                            type="checkbox"
                            value={!!value}
                        />
                        <label className={`${isRequired ? "required" : ""} label-outside mt-3`}>{labelOrName}</label>
                    </div>
                );
            }
            break;
        case "button":
            {
                inputToRender = (
                    <Button type="button" onClick={handleButtonClick}>
                        {trait.getLabel()}
                    </Button>
                );
            }
            break;
        case "toggle":
            {
                const isHidden = trait.get("isHidden" as any);
                const tooltipLabel = trait.get("tooltipLabel" as any);
                inputToRender = isHidden ? <></> : (
                    <div className="display-flex display-flex-center justify-content-betweeen">
                        <div className="display-flex display-flex-center">
                            <label className={`${isRequired ? "required" : ""} label-outside mb-10`}>{trait?.getLabel()}</label>
                            {tooltipLabel &&
                                <Tooltip
                                    text={<p>{tooltipLabel}</p>}
                                    isBlueJay
                                    size="large"
                                    customContainerClassName="mb-2"
                                    hideOnScroll
                                >
                                    <i className="icon_phoenix-info ml-5 mb-5" />
                                </Tooltip>}
                        </div>
                        <Toggle
                            roundedToggle
                            checked={trait?.getValue()}
                            _onChange={(_: any, event: any) => {
                                trait.setValue(event.target.checked);
                            }}
                            className="mr-8"
                        />
                    </div>
                );
            }
            break;
        case "tabs":
            {
                inputToRender = (
                    <>
                        <label className={`${isRequired ? "required" : ""} label-outside mb-10`}>{trait?.getLabel()}</label>
                        <TraitTabs
                            key={trait?.getId()}
                            tabsArray={trait.getOptions()?.map((option) => {
                                return {
                                    label: (option?.label || option?.name) as string,
                                    value: (option?.id || option?.value) as string
                                };
                            })}
                            selected={trait.getValue()}
                            onTabSelect={(value) => {
                                trait.setValue(value);
                            }}
                        />
                    </>
                );
            }
            break;
        case "input-unit":
            {
                inputToRender = (
                    <TraitInputWithDropdown prop={trait} onChange={onChange} />
                );
            }
            break;
        case "composite":
            {
                const compositeProp = trait as any;
                const properties = compositeProp.get("properties");
                inputToRender = (
                    <>
                        <div>
                            <div className="mb-10">{labelOrName}</div>
                        </div>
                        <div className="display-flex value-wrap">
                            {properties?.map((prop: any) => (
                                <CompositeTraitInput trait={trait} property={prop} />
                            ))}
                        </div>
                    </>
                );
            }
            break;
        case "code": {
            inputToRender = (
                <CodeBlock trait={trait} />
            );
            break;
        }
        case "banner": {
            inputToRender = (
                <>
                    <div className="display-flex display-flex-center" style={{ backgroundColor: "#ECF5FD", padding: "10px", borderRadius: "4px", fontWeight: 400, fontSize: "12px", lineHeight: "normal" }}>
                        <i className="icon_phoenix-info mr-3" style={{ paddingBottom: "14px" }} />
                        {labelOrName}
                    </div>
                </>
            );
            break;
        }
        case "textarea": {
            inputToRender = (
                <TextArea
                    key={trait?.component?.getId()}
                    name={labelOrName}
                    value={value}
                    label={isHref ? "Link URL" : onlyLabel}
                    onChange={onChange}
                />
            )
            break;
        }
        case "sortable-links": {
            inputToRender = (
                <SocialLinks trait={trait} editor={editor!} />
            );
            break;
        }
    }

    return (
        <div className={`trait-property-field mb-25 value-block ${styles?.["value-block"]}`} style={style || {}} {...rest}>
            {inputToRender}
        </div>
    );
}
