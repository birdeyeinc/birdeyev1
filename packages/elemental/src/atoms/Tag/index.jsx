import React, { useMemo } from "react";
import Chip from "atoms/Chip";
import Tooltip from "atoms/Tooltip";
import styles from "./Tag.module.scss";
import { getColorWithVariant, getSize } from "./helper";

const TagChip = (props) => {
    const {
        title,
        onClick,
        onRemove,
        active,
        size,
        isPDFLitePage,
        isValidEmail,
        isApprovalTab = false,
        aiSuggestion = false,
        isTagDeletable = () => true,
        variantType = "tonal",
        color = "grey"
    } = props;
    const tooltipConfig = {
        text: "This tag is automatically added to AI posts to categorize them and can't be edited or removed.",
        position: "bottom-left-pre",
        tooltipClass: "manage-tooltip",
        size: "x-small"
    }
    const {variant, colorType} = getColorWithVariant({active, isValidEmail, isApprovalTab, variantType, color});
    const derviedSize = getSize({size, isPDFLitePage});
    const tagDeletable = isTagDeletable(title, aiSuggestion);
    const tagHasTooltip = !tagDeletable && onClick && onRemove ? true : false;

    const {DEFAULT_LEFT_ICON, DEFAULT_RIGHT_ICON} = useMemo(()=> { 
        const defaultRightIcon = () => <a data-testid="el-test-tag-on-remove" name={title} className={`remove-tag icons icon_phoenix-reset ${styles["remove-icon"]}`} />,
        defaultLeftIcon = () => <i className="icon_phoenix-disable-business" />
        return {DEFAULT_LEFT_ICON: defaultLeftIcon, DEFAULT_RIGHT_ICON: defaultRightIcon}
    },[title]);
    const {leftIcon, rightIcon, onIconClick, customStyleClass} = useMemo(()=> {
        let leftIcon = null, rightIcon = null, onIconClick = null, customStyleClass = `${styles["chip-tag"]}`;
        if(onRemove && tagDeletable) {
            rightIcon = DEFAULT_RIGHT_ICON;
            onIconClick = onRemove;
        }
        if(!isValidEmail && onClick && onRemove){
            leftIcon = DEFAULT_LEFT_ICON;
        }
        if(!isValidEmail && isApprovalTab){
            customStyleClass += ` ${styles["warning-email-tag"]}`;
        }
        return {leftIcon, rightIcon, onIconClick, customStyleClass}
    },[isValidEmail, isApprovalTab]);
    
    const chipJSX = (
        <Chip
            label={title}
            variant={variant}
            colorType={colorType}
            size={derviedSize}
            rightIcon={rightIcon}
            onIconClick={onIconClick}
            leftIcon={leftIcon}
            clickable={!!onClick}
            onClick={onClick}
            customParentStyleClass={customStyleClass}

        />
    );
    if(tagHasTooltip)
        return (<Tooltip {...tooltipConfig}>
            {chipJSX}
        </Tooltip>)
    else
        return chipJSX;
}
export default TagChip;