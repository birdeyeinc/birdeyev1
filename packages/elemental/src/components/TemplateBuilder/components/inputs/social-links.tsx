import React, { ReactNode } from "react";
import { Editor, Trait } from "grapesjs";
import { SocialLinkOption, SocialLinkValue } from "../../utils/constants";
import {
    SortableContainer as sortableContainer,
    SortableElement as sortableElement,
    arrayMove,
    SortableHandle as sortableHandle
} from "react-sortable-hoc";
import TextArea from "atoms/TextArea";
import SingleSelect from "atoms/SingleSelect";
import styles from "./social-links.module.scss";


const SortableItem = sortableElement(({ value }: { value: ReactNode }) => <li>{value}</li>);

const DragHandle = sortableHandle(() => (
    <span tabIndex={0}>
        <i className="icon_phoenix-dots-lining pointer" />
    </span>
));

const SortableContainer = sortableContainer(({ children }: { children: ReactNode }) => {
    return <ul>{children}</ul>;
});


export const SocialLinks = ({ trait, editor }: { trait: Trait, editor: Editor }) => {
    const socialOptions: SocialLinkOption[] = trait?.get("socialOptions" as any) || [];
    const selectedSocialOptions: SocialLinkOption[] = trait?.getValue() || [];
    const selectedComponent = editor?.getSelected();


    const handleAddSocialLink = (value: SocialLinkValue) => {
        const selectedItem = socialOptions?.find((item) => item?.value === value);
        if (!selectedItem || !selectedComponent) return;
        trait.setValue([...selectedSocialOptions, selectedItem]);
    };

    const handleURLChange = ({ value, socialLink }: { value: SocialLinkValue, socialLink: SocialLinkOption }) => {
        const formattedText = value?.trim();
        const updatedLinks = selectedSocialOptions?.map((item) => {
            if (item?.value === socialLink?.value) {
                return {
                    ...item,
                    href: formattedText
                };
            }
            return item;
        });
        trait?.setValue(updatedLinks);
        // update component html
    };

    const options = socialOptions?.map((item) => {
        return {
            label: item?.label,
            value: item?.value,
            optionJSX: (
                <div className={`social-option-item ${styles["social-option-item"]}`}>
                    <img src={item?.icon} className="mr-8" width="20" height="20" />
                    <span>{item?.label}</span>
                </div>
            )
        };
    });

    const handleDeleteLink = (value: SocialLinkValue) => {
        const updatedLinks = selectedSocialOptions?.filter((item) => item?.value !== value);
        trait?.setValue(updatedLinks);
    }

    const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
        const items = [...selectedSocialOptions] as SocialLinkOption[];
        trait.setValue(arrayMove(items, oldIndex, newIndex));
    };


    const items = selectedSocialOptions;
    const isSingleItem = items?.length < 2;

    return (
        <>
            {/* sortable container */}
            <div className={`sortable-links-container ${styles["sortable-links-container"]}`}>
                {/* @ts-ignore */}
                <SortableContainer onSortEnd={onSortEnd} useDragHandle>
                    {items?.map((item, index) => (
                        <SortableItem key={`item-${item?.value}`} index={index}
                            // @ts-ignore
                            value={(
                                <div className={`social-link-item ${styles["social-link-item"]}`} key={item?.value}>
                                    <div className="display-flex display-flex-center justify-content-betweeen mb-10">
                                        <p className={`display-flex display-flex-center social-link-label ${styles["social-link-label"]}`}>
                                            <img src={`${item?.icon}`} className="mr-8" width="16" height="16" />
                                            {/* <i className={`${item?.icon} mr-8`} /> */}
                                            {item?.label}
                                        </p>
                                        <div className={`display-flex display-flex-center social-link-actions ${styles["social-link-actions"]}`}>
                                            {!isSingleItem ? (
                                                <div onClick={() => handleDeleteLink(item?.value)}>
                                                    <i className="icon_phoenix-delete mr-8 pointer" />
                                                </div>
                                            ) : null}
                                            <DragHandle />
                                        </div>
                                    </div>

                                    <TextArea
                                        name="link-url"
                                        key={`${trait?.component?.getId()}-${item?.value}`}
                                        value={item?.href || ""}
                                        placeholder={item?.defaultValue}
                                        onChange={(e: any) => handleURLChange({ socialLink: item, value: e?.target?.value as any })}
                                    />
                                </div>
                            )} />
                    ))}
                </SortableContainer>

                {/* Add social links */}
                {/* todo: this should be an ActionBox */}
                <div className="mb-10">
                    <label className="label-outside mb-10">Add social links</label>
                    <SingleSelect
                        displayLabel="Select    "
                        label={trait?.getLabel()}
                        selected={""}
                        options={options}
                        onChange={({ value }: any) => {
                            handleAddSocialLink(value);
                        }}
                    />
                </div>
            </div>
        </>
    );
};