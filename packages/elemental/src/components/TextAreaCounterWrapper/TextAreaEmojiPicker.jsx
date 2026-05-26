import React, { Component } from "react";
import { isEmpty } from "lodash";
import Styles from "./TextAreaCounter.module.scss";
import onClickOutside from "react-onclickoutside";
import { Picker } from "emoji-mart";
import PropTypes from "prop-types";
import "emoji-mart/css/emoji-mart.css";
import Tooltip from "atoms/Tooltip";
// import SpriteImage from "assets/images/copy-images/source/emoji-sprite-image.png";

class TextAreaEmojiPicker extends Component {

    constructor(props) {
        super(props);
    }

    handleClickOutside = () => {
        this.props.showEmojiPicker && this.props.toggleEmojiPicker(false);
    };

    render() {
        const {
            handleEmojiChange,
            textAreaId,
            toggleEmojiPicker,
            showEmojiPicker,
            emojiPickerPosition,
            emojiToolTipPosition,
            dynamicPickerPositioning,
            createPostInIframe,
            //validateDivContent,
            closeEmojiModal,
            isSocialTextArea,
            customToolTipText,
            disableEmojiPicker = false,
            isAvailabliabilityOfSpriteSheet = false
        } = this.props;

        const emojiPickerProps = {
            set:"apple",
            emojiSize:24,
            sheetSize:64,
            // perLine={7}
            emojiTooltip:false,
            title:"",
            showSkinTones:isSocialTextArea,
            showPreview:false,
            onClick:handleEmojiChange.bind(null, "emoji"),
            emoji:""
        };

        if (isAvailabliabilityOfSpriteSheet) {
            emojiPickerProps.backgroundImageFn = (_set, _sheetSize) => {
                return SpriteImage;
            };
        }

        return (
            <div unselectable="on" className={`pullRight ${showEmojiPicker ? Styles["active"] : ""}`}>
                <div className={`${Styles["emoji-picker"]} ${Styles["user-no-select"]}`}>
                    {/* Toggle emoji picker only on icon click */}
                    <Tooltip
                        text={!isEmpty(customToolTipText) ? customToolTipText : "Add emoji"}
                        position={emojiToolTipPosition || "bottom"}
                    >
                        <span className={`${showEmojiPicker && isSocialTextArea ? Styles["active"] : ""} ${disableEmojiPicker ? "opacity-disabled" : ""}`} onClick={toggleEmojiPicker}>
                            <i className={`phoenix-icon ${isSocialTextArea ? "light-smiley-icon" : ""} ${showEmojiPicker && isSocialTextArea && !disableEmojiPicker ? "icon_phoenix-smiley-fill" : "icon_phoenix-smiley"}`} />
                        </span>
                    </Tooltip>
                    {showEmojiPicker && !disableEmojiPicker ?
                        <div
                            unselectable="on"
                            id={`token-${textAreaId}-emoji`}
                            className={`${Styles["emoji-container"]} ${emojiPickerPosition && emojiPickerPosition} ${dynamicPickerPositioning ? "dynamic-emoji-positioner" : ""} ${createPostInIframe ? "IframeEmojiPicker" : ""}`}
                            onKeyDown={closeEmojiModal}
                            tabIndex={-1}>
                            <Picker
                                {...emojiPickerProps}
                            />
                        </div>
                        : null
                    }
                </div>
            </div>
        );
    }
}

TextAreaEmojiPicker.propTypes = {
    textAreaId: PropTypes.string,
    toggleEmojiPicker: PropTypes.func,
    handleEmojiChange: PropTypes.func,
    showEmojiPicker: PropTypes.bool,
    emojiPickerPosition: PropTypes.string,
    emojiToolTipPosition: PropTypes.string,
    dynamicPickerPositioning: PropTypes.bool,
    createPostInIframe: PropTypes.bool,
    validateDivContent: PropTypes.bool,
    closeEmojiModal :  PropTypes.bool,
    isSocialTextArea : PropTypes.bool,
    customToolTipText: PropTypes.string,
    disableEmojiPicker: PropTypes.bool,
    isAvailabliabilityOfSpriteSheet: PropTypes.bool
};

export default onClickOutside(TextAreaEmojiPicker);
