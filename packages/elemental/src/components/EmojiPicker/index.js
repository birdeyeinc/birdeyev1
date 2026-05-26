import React, { Component } from "react";
import PropTypes from "prop-types";
import { find, replace, uniq, isEmpty } from "lodash";
import "./index.module.scss";
// import CSSModules from "react-css-modules";
import { emojiIndex } from "emoji-mart";
import emojiRegex from "emoji-regex";
import { getValidations } from "./utils/index";
import TextAreaCounterWrapper from "components/TextAreaCounterWrapper";

const Const = {
    HEADING: "heading",
    EMPTY: "empty",
};

class EmojiPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPicker: false,
            inputNative: props.bodyText ? props.bodyText : "",
            textAreaFocused: false,
            caretPosition: {
                start: 0,
                end: 0
            },
            updateCounterWrapperText: props.updateValue,
            wrapperContent: null
        };
        this.emojiTextArea = null;
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.reset) {
            this.setState({
                showPicker: nextProps.disabled ? false : this.state.showPicker,
                inputNative: "",
                textAreaFocused: nextProps.disabled ? false : this.state.textAreaFocused,
                updateCounterWrapperText: true
            });
        } else {
            this.setState((prevState) => {
                return {
                    inputNative: this.props.isMentionsAvailable || this.props.fromPage == "social-engage" ? nextProps.bodyText : nextProps.bodyText ? nextProps.bodyText : prevState.inputNative,
                    updateCounterWrapperText: nextProps.updateValue
                };
            });
        }
    }

    handleTextAreaChange = (value) => {
        const { maxChar, replaceMaxChar } = this.props;
        if (maxChar && value.length > maxChar && replaceMaxChar) {
            value = value.substring(0, maxChar);
        }
        this.setState({
            inputNative: value
        });
        this.props.onChange(value);
    }

    setTextAreaRef = (ref) => {
        this.emojiTextArea = ref;
    }

    onFocusCallBack = () => {
        this.setState({
            textAreaFocused: true
        });
    }

    onBlurCallBack = () => {
        this.setState({ 
            textAreaFocused: false
        });
    }

    surveyFirstQuestion = () => {
        const { surveyObjectData, unsubscribeText } = this.props;
        let firstNonHiddenPageIndex;
        let firstNonHiddenQuestionIndex;
        let firstQuestion;
        let firstQuestionPrefix;
        let found = false;
        
        surveyObjectData.pages.map((page, p) => {
            if (!page.hidden && !found) {
                page.questions.map((question, q) => {
                    if (!question.hidden && !found) {
                        firstNonHiddenPageIndex = p;
                        firstNonHiddenQuestionIndex = q;
                        found = true;
                    }
                });
            }
        }); 

        if (firstNonHiddenPageIndex != undefined && firstNonHiddenQuestionIndex != undefined) {
            firstQuestion = surveyObjectData.pages[firstNonHiddenPageIndex] && surveyObjectData.pages[firstNonHiddenPageIndex].questions[firstNonHiddenQuestionIndex] && surveyObjectData.pages[firstNonHiddenPageIndex].questions[firstNonHiddenQuestionIndex].title;
            firstQuestionPrefix = surveyObjectData.pages[firstNonHiddenPageIndex] && surveyObjectData.pages[firstNonHiddenPageIndex].questions[firstNonHiddenQuestionIndex] && surveyObjectData.pages[firstNonHiddenPageIndex].questions[firstNonHiddenQuestionIndex].pulseSuffix ? surveyObjectData.pages[firstNonHiddenPageIndex].questions[firstNonHiddenQuestionIndex].pulseSuffix : "";
        } else {
            firstQuestion = "";
            firstQuestionPrefix = "";
        }

        return firstQuestion + " " + firstQuestionPrefix + " " + unsubscribeText;
    }

    render() {
        const { handleTextAreaChange, surveyFirstQuestion } = this;
        const {
            disabled,
            textArea,
            customStyle,
            maxChar,
            nonEditableText,
            placeholder,
            disabledNode,
            //attachBtnJsx,
            uploadFiles,
            handleUploadError,
            acceptFileTypes,
            //maxFilesUploadSize,
            updateStateAssets,
            updatedAssets,
            attachmentMaxSize,
            contentEditable = true,
            surveyObjectData,
            surveyType,
            loadingSurveyData,
            showDisabledAttachment = false,
            disabledAttachmentTooltip = "",
            attachmentTooltipText = "",
            attachmentResolution,
            hideAttachmentIcon,
            hideEmojiPicker,
            inboxFooterView,
            // newInboxFooter,
            openSelectFileDialogueBox,
            showOnlyPinIcon,
            footerCustomStyles,
            noFloatingLabel,
            browserOffline,
            doNotUploadImageAndVideoTogether,
            tokenMenuType,
            tokenMenu,
            customWidthOpen,
            showCounter,
            counterWithText,
            maxFilesAllowed,
            multipleFiles,
            showWarning,
            warningMessage,
            onSubmit,
            maxTextAreaHeight,
            handleOnPasteFailed,
            attachmentJsx,
            attachmentsInEmojiPicker,
            renderMentionPopover,
            showMentionPopoverState,
            mentionsData,
            setMentionsData,
            isMentionsAvailable = false,
            openMentionPopover,
            onEnterSubmit,
            createPostInIframe,
            onClickofShortenLinkTooltip,
            isUrlShortenerAvailable = false,
            showUrlShortenerPopoverState = false,
            debounceDelay = 0,
            emojiPickerPosition,
            hideEmojiOnEscClick,
            dontUpdateInnerHtml,
            clearAll,
            isMaxCharRestricted = true,
            isVideoUploadRestricted = true,
            isImageUploadRestricted = true,
            showOptions,
            renderAttachmentOptions,
            enableFileUploaderPostView,
            setIsAttachmentPopOverOpen,
            isAttachmentPopOverOpen,
            counterFooterClassName,
            hideFileUploaderCameraIcon,
            setTextAreaFocus,
            textAreaDefaultFocus,
            showTwitter,
            emojiToolTipPosition,
            donotClosePopover,
            handleDonotClosePopover,
            replyBtnforEngage = false,
            disableReplyBtnForEngage = false,
            isSocialTextArea = false,
            backResponseToParent,
            showHolidayPosts,
            showPostIdeas,
            showImages,
            showSummarize,
            showHashtags,
            showAITools,
            aiBtnTooltipPosition,
            aiBtntooltipText,
            disabledAllAIModifyOptions,
            showAiGenerateCta,
            aiGenerateSummaryCallback,
            aiSummaryGenerationCb,
            aiCreatePostGenerationCb,
            aiPopUpPosition,
            reGenerationCount,
            disableAiPopover,
            calculatePopoverPosition,
            disabledGenerateOptions,
            hideRephrasingOptions,
            isInbox = false,
            isCreatePost = false,
            brandingText,
            updateMasterPostState,
            showRestoreOriginalContent,
            selectedMasterPostSocialTab,
            showHighlight,
            selectedChannel,
            toggleRestore,
            setToggleRestore,
            masterPostList,
            showAIToolsAtDefault,
            setCloudMediaOptions,
            setComputerOptions,
            selLimitExceeded,
            setSelLimitExceeded,
            popOverDirection,
            resetComponentOnFileUpload,
            hideLabel,
            showReply = false,
            aiReviewReplyCb = null,
            showRegenerateOption = true,
            aiRegenerateCb = null,
            customCategory = null,
            openCallback = null,
            resetMentionsState,
            setMentionsDataForEngage = null,
            showMentionPopoverInViewport = false,
            attachmentTooltipPosition = "top",
            inboxPaymentJSX,
            inboxTemplateJSX,
            fromPage,
            mentionUserName,
            setSelectedPostLibId,
            selectedPostLibId,
            enableCustomTokens,
            replaceNewLineDivsByLineBreak = false,
            textAreaId,
            removeCustomClass,
            renderMediaSequence,
            isEditPost,
            positionCursorAtEndIfTextPresent,
            setIsAssistedByAI,
            aiPromptCb,
            showAiPrompts,
            socialSingleSelectPaginatedConfig,
            textAreaCounterPropKey,
            isLongLinkShortening,
            isShorteningComplete,
            fromReplyTemplateBox,
            aiReplyBox,
            isCampaignAiTemplate,
            showPersonalizeTokenWarning = false,
            onCloseReplyCallback,
            showCloseReplyBtn = false,
            aiToolsComponent
        } = this.props;
        const { inputNative, showPicker, textAreaFocused, updateCounterWrapperText } = this.state;
        let body = inputNative;
        const {
            onBlurCallBack,
            onFocusCallBack
        } = this;

        return (
            <div className={`${customStyle} ${showPicker || textAreaFocused ? "focus-on" : ""} ${inboxFooterView ? "new-inbox-footer" : ""}`}>
                {textArea && !disabledNode && (
                        <TextAreaCounterWrapper
                            maxLen={maxChar}
                            label={hideLabel ? "" : placeholder}
                            placeholder={placeholder}
                            txtVal={maxChar && isMaxCharRestricted ? body.substring(0, maxChar) : body}
                            onChange={handleTextAreaChange}
                            parentId={"emoji-picker-messenger"}
                            disabled={disabled}
                            error={[]}
                            validation={getValidations({
                                type: Const.HEADING,
                                validChecks: [Const.EMPTY],
                                name: "Text Message"
                            })}
                            validateCallback={() => { }}
                            allowEnter
                            onSubmit={onSubmit}
                            contentEditable={contentEditable}
                            required
                            emojiPicker={hideEmojiPicker ? false : !disabledNode}
                            updateValue={updateCounterWrapperText}
                            supportHTML
                            autoSize
                            hideCounter={showCounter ? false : true}
                            onFocus={onFocusCallBack}
                            onBlur={onBlurCallBack}
                            emojiPickerPosition={emojiPickerPosition || "top"}
                            customClass={`${removeCustomClass ? "" : disabled ? "disabled-textarea messenger-textarea" : "messenger-textarea"}`}
                            showAttachmentIcon={!hideAttachmentIcon}
                            showDisabledAttachment={showDisabledAttachment}
                            disabledAttachmentTooltip={disabledAttachmentTooltip ? disabledAttachmentTooltip : "Can't add attachments."}
                            attachmentUploadCallback={uploadFiles}
                            attachmentErrorCallback={handleUploadError}
                            attachmentSupportedTypes={acceptFileTypes}
                            attachmentMaxSize={attachmentMaxSize}
                            updateStateAssets={updateStateAssets}
                            emojiToolTipPosition={emojiToolTipPosition || "top"}
                            attachmentTooltipPosition={attachmentTooltipPosition}
                            updatedAssets={updatedAssets}
                            allowSpecialKeysOnMaxLength
                            attachmentTooltipText={attachmentTooltipText}
                            inboxFooterView={inboxFooterView}
                            openSelectFileDialogueBox={openSelectFileDialogueBox}
                            showOnlyPinIcon={showOnlyPinIcon}
                            footerCustomStyles={footerCustomStyles}
                            noFloatingLabel={noFloatingLabel}
                            browserOffline={browserOffline}
                            attachmentResolution={attachmentResolution}
                            doNotUploadImageAndVideoTogether={doNotUploadImageAndVideoTogether}
                            tokenMenu={tokenMenu}
                            tokenMenuType={tokenMenuType}
                            customWidthOpen={customWidthOpen}
                            counterWithText={counterWithText}
                            maxFilesAllowed={maxFilesAllowed}
                            multipleFiles={multipleFiles}
                            showWarning={showWarning}
                            warningMessage={warningMessage}
                            maxTextAreaHeight={maxTextAreaHeight}
                            handleOnPasteFailed={handleOnPasteFailed}
                            attachmentJsx={attachmentJsx}
                            attachmentsInEmojiPicker={attachmentsInEmojiPicker}
                            renderMentionPopover={renderMentionPopover}
                            showMentionPopoverState={showMentionPopoverState}
                            mentionsData={mentionsData}
                            setMentionsData={setMentionsData}
                            isMentionsAvailable={isMentionsAvailable}
                            openMentionPopover={openMentionPopover}
                            onEnterSubmit={onEnterSubmit}
                            hideEmojiOnEscClick={hideEmojiOnEscClick}
                            createPostInIframe={createPostInIframe}
                            onClickofShortenLinkTooltip={onClickofShortenLinkTooltip}
                            isUrlShortenerAvailable={isUrlShortenerAvailable}
                            showUrlShortenerPopoverState={showUrlShortenerPopoverState}
                            debounceDelay={debounceDelay}
                            customText={this.props.customText}
                            dontUpdateInnerHtml={dontUpdateInnerHtml}
                            clearAll={clearAll}
                            isMaxCharRestricted={isMaxCharRestricted}
                            showOptions={showOptions}
                            renderAttachmentOptions={renderAttachmentOptions}
                            enableFileUploaderPostView={enableFileUploaderPostView}
                            isVideoUploadRestricted={isVideoUploadRestricted}
                            isImageUploadRestricted={isImageUploadRestricted}
                            setIsAttachmentPopOverOpen={setIsAttachmentPopOverOpen}
                            isAttachmentPopOverOpen={isAttachmentPopOverOpen}
                            counterFooterClassName={counterFooterClassName}
                            hideFileUploaderCameraIcon={hideFileUploaderCameraIcon}
                            setTextAreaFocus={setTextAreaFocus}
                            textAreaDefaultFocus={textAreaDefaultFocus}
                            showTwitter={showTwitter}
                            donotClosePopover={donotClosePopover}
                            handleDonotClosePopover={handleDonotClosePopover}
                            replyBtnforEngage={replyBtnforEngage}
                            disableReplyBtnForEngage={disableReplyBtnForEngage}
                            isSocialTextArea={isSocialTextArea}
                            // below props related to AI Tools
                            backResponseToParent={backResponseToParent}
                            showHolidayPosts={showHolidayPosts}
                            showPostIdeas={showPostIdeas}
                            showImages={showImages}
                            showHashtags={showHashtags}
                            showSummarize={showSummarize}
                            showAITools={showAITools}
                            showAIToolsAtDefault={showAIToolsAtDefault}
                            aiBtnTooltipPosition={aiBtnTooltipPosition}
                            aiBtntooltipText={aiBtntooltipText}
                            disabledAllAIModifyOptions={disabledAllAIModifyOptions}
                            showAiGenerateCta={showAiGenerateCta}
                            aiGenerateSummaryCallback={aiGenerateSummaryCallback}
                            aiSummaryGenerationCb={aiSummaryGenerationCb}
                            aiCreatePostGenerationCb={aiCreatePostGenerationCb}
                            aiPopUpPosition={aiPopUpPosition}
                            reGenerationCount={reGenerationCount}
                            // disableAiPopover will disable AI icon
                            disableAiPopover={disableAiPopover}
                            updateMasterPostState={updateMasterPostState}
                            showRestoreOriginalContent={showRestoreOriginalContent}
                            selectedMasterPostSocialTab={selectedMasterPostSocialTab}
                            showHighlight={showHighlight}
                            selectedChannel={selectedChannel}
                            setCloudMediaOptions={setCloudMediaOptions}
                            setComputerOptions={setComputerOptions}
                            selLimitExceeded={selLimitExceeded}
                            setSelLimitExceeded={setSelLimitExceeded}
                            calculatePopoverPosition={calculatePopoverPosition}
                            disabledGenerateOptions={disabledGenerateOptions}
                            hideRephrasingOptions={hideRephrasingOptions}
                            isInbox={isInbox}
                            isCreatePost={isCreatePost}
                            resetComponentOnFileUpload={resetComponentOnFileUpload}
                            popOverDirection={popOverDirection}
                            showReply={showReply}
                            aiReviewReplyCb={aiReviewReplyCb}
                            showRegenerateOption={showRegenerateOption}
                            aiRegenerateCb={aiRegenerateCb}
                            customCategory={customCategory}
                            openCallback={openCallback}
                            toggleRestore={toggleRestore}
                            setToggleRestore={setToggleRestore}
                            masterPostList={masterPostList}
                            resetMentionsState={resetMentionsState}
                            setMentionsDataForEngage={setMentionsDataForEngage}
                            showMentionPopoverInViewport={showMentionPopoverInViewport}
                            inboxPaymentJSX={inboxPaymentJSX}
                            inboxTemplateJSX={inboxTemplateJSX}
                            fromPage={fromPage}
                            mentionUserName={mentionUserName}
                            setSelectedPostLibId={setSelectedPostLibId}
                            customToolTipTextForEmoji={this.props.customToolTipTextForEmoji}
                            disableEmojiPicker={this.props.disableEmojiPicker}
                            showPostLib={this.props.showPostLib}
                            selectedPostLibId={selectedPostLibId}
                            extraToken={this.props.extraToken}
                            enableCustomTokens={enableCustomTokens}
                            replaceNewLineDivsByLineBreak={replaceNewLineDivsByLineBreak}
                            id={textAreaId}
                            renderMediaSequence={renderMediaSequence}
                            isEditPost={isEditPost}
                            positionCursorAtEndIfTextPresent={positionCursorAtEndIfTextPresent}
                            setIsAssistedByAI={setIsAssistedByAI}
                            socialSingleSelectPaginatedConfig={socialSingleSelectPaginatedConfig}
                            textAreaCounterPropKey={textAreaCounterPropKey}
                            aiPromptCb={aiPromptCb}
                            showAiPrompts={showAiPrompts}
                            isLongLinkShortening={isLongLinkShortening}
                            isShorteningComplete={isShorteningComplete}
                            fromReplyTemplateBox={fromReplyTemplateBox}
                            aiReplyBox={aiReplyBox}
                            isCampaignAiTemplate={isCampaignAiTemplate}
                            showPersonalizeTokenWarning={showPersonalizeTokenWarning}
                            onCloseReplyCallback={onCloseReplyCallback}
                            showCloseReplyBtn={showCloseReplyBtn}
                            aiToolsComponent={aiToolsComponent}
                        />
                )}
                {disabledNode && disabledNode}
                {((nonEditableText && nonEditableText != "") || (brandingText && brandingText != "")) && <span className={"non-editable-input-wrapper"}>
                    <input className={"non-editable-input"} styleName={"non-editable-input"} value={(!loadingSurveyData ? (!isEmpty(surveyObjectData) && surveyType === "nps") ? surveyFirstQuestion() : nonEditableText : "") + `${brandingText ? brandingText : ""}`} disabled />
                </span>}
                {attachmentsInEmojiPicker && attachmentJsx && attachmentJsx }
            </div>
        );
    }
}

EmojiPicker.defaultProps = {
    autoClose: true,
    emojiSet: "apple",
    disabled: false,
    textArea: true,
    customStyle: "",
    nonEditableText: null,
    placeholder: "Write a reply...",
    attachmentMaxSize: 5120000,
    footerCustomStyles: "",
    replaceMaxChar: true,
    textAreaDefaultFocus: false,
    showAiGenerateCta: false,
    aiGenerateSummaryCallback: () => {},
    hideLabel: false,
    removeCustomClass: false,
    isCampaignAiTemplate: false
};

EmojiPicker.propTypes = {
    onChange: PropTypes.func,
    autoClose: PropTypes.bool,
    textArea: PropTypes.bool,
    disabled: PropTypes.bool,
    reset: PropTypes.bool,
    customStyle: PropTypes.string,
    emojiSet: PropTypes.string,
    maxChar: PropTypes.number,
    bodyText: PropTypes.string,
    nonEditableText: PropTypes.string,
    onEmojiSelect: PropTypes.func,
    placeholder: PropTypes.string,
    disabledNode: PropTypes.node,
    updateValue: PropTypes.bool,
    attachBtnJsx: PropTypes.node,
    uploadFiles: PropTypes.func,
    handleUploadError: PropTypes.func,
    acceptFileTypes: PropTypes.string,
    updateStateAssets: PropTypes.bool,
    maxFilesUploadSize: PropTypes.number,
    updatedAssets: PropTypes.array,
    attachmentMaxSize: PropTypes.number,
    contentEditable: PropTypes.bool,
    surveyObjectData: PropTypes.object,
    surveyType: PropTypes.string,
    loadingSurveyData: PropTypes.bool,
    unsubscribeText: PropTypes.string,
    showDisabledAttachment: PropTypes.bool,
    disabledAttachmentTooltip: PropTypes.string,
    attachmentTooltipText: PropTypes.string,
    hideAttachmentIcon: PropTypes.bool,
    attachmentResolution: PropTypes.object,
    hideEmojiPicker: PropTypes.bool,
    onSubmit: PropTypes.func,
    inboxFooterView: PropTypes.bool,
    // newInboxFooter: PropTypes.bool,
    openSelectFileDialogueBox: PropTypes.func,
    showOnlyPinIcon: PropTypes.bool,
    footerCustomStyles: PropTypes.string,
    noFloatingLabel: PropTypes.bool,
    browserOffline: PropTypes.bool,
    doNotUploadImageAndVideoTogether: PropTypes.func,
    tokenMenuType: PropTypes.string,
    tokenMenu: PropTypes.bool,
    customWidthOpen: PropTypes.string,
    showCounter: PropTypes.bool,
    counterWithText: PropTypes.bool,
    maxFilesAllowed: PropTypes.number,
    multipleFiles: PropTypes.bool,
    showWarning: PropTypes.bool,
    warningMessage: PropTypes.string,
    maxTextAreaHeight: PropTypes.bool,
    replaceMaxChar: PropTypes.bool,
    handleOnPasteFailed: PropTypes.func,
    attachmentJsx: PropTypes.node,
    attachmentsInEmojiPicker: PropTypes.bool,
    renderMentionPopover: PropTypes.func,
    showMentionPopoverState: PropTypes.bool,
    mentionsData: PropTypes.array,
    setMentionsData: PropTypes.func,
    isMentionsAvailable: PropTypes.bool,
    openMentionPopover: PropTypes.bool,
    onEnterSubmit: PropTypes.bool,
    createPostInIframe: PropTypes.bool,
    onClickofShortenLinkTooltip: PropTypes.func,
    isUrlShortenerAvailable: PropTypes.bool,
    showUrlShortenerPopoverState: PropTypes.bool,
    debounceDelay: PropTypes.number,
    emojiPickerPosition: PropTypes.string,
    hideEmojiOnEscClick: PropTypes.bool,
    customText: PropTypes.string,
    dontUpdateInnerHtml: PropTypes.bool,
    clearAll: PropTypes.bool,
    isMaxCharRestricted: PropTypes.bool,
    isImageUploadRestricted: PropTypes.bool,
    isVideoUploadRestricted: PropTypes.bool,
    showOptions: PropTypes.func,
    renderAttachmentOptions: PropTypes.func,
    enableFileUploaderPostView: PropTypes.bool,
    setIsAttachmentPopOverOpen: PropTypes.func,
    isAttachmentPopOverOpen: PropTypes.bool,
    counterFooterClassName: PropTypes.string,
    hideFileUploaderCameraIcon: PropTypes.bool,
    setTextAreaFocus: PropTypes.func,
    textAreaDefaultFocus: PropTypes.bool,
    showTwitter: PropTypes.bool,
    emojiToolTipPosition: PropTypes.string,
    donotClosePopover: PropTypes.bool,
    handleDonotClosePopover: PropTypes.func,
    replyBtnforEngage: PropTypes.bool,
    disableReplyBtnForEngage: PropTypes.bool,
    isSocialTextArea: PropTypes.bool,
    backResponseToParent: PropTypes.func,
    showHolidayPosts: PropTypes.bool,
    showPostIdeas: PropTypes.bool,
    showImages: PropTypes.bool,
    showSummarize: PropTypes.bool,
    showHashtags: PropTypes.bool,
    showAITools: PropTypes.bool,
    aiBtnTooltipPosition: PropTypes.string,
    aiBtntooltipText: PropTypes.string,
    disabledAllAIModifyOptions: PropTypes.bool,
    showAiGenerateCta: PropTypes.bool,
    aiGenerateSummaryCallback: PropTypes.func,
    aiSummaryGenerationCb: PropTypes.func,
    aiCreatePostGenerationCb: PropTypes.func,
    aiPopUpPosition: PropTypes.string,
    setCloudMediaOptions: PropTypes.func,
    setComputerOptions: PropTypes.func,
    selLimitExceeded: PropTypes.bool,
    setSelLimitExceeded: PropTypes.func,
    reGenerationCount: PropTypes.number,
    disableAiPopover: PropTypes.bool,
    updateMasterPostState: PropTypes.func,
    showRestoreOriginalContent: PropTypes.bool,
    selectedMasterPostSocialTab: PropTypes.string,
    showHighlight: PropTypes.bool,
    selectedChannel: PropTypes.string,
    calculatePopoverPosition: PropTypes.bool,
    showAIToolsAtDefault: PropTypes.bool,
    disabledGenerateOptions: PropTypes.object,
    hideRephrasingOptions: PropTypes.bool,
    isInbox: PropTypes.bool,
    isCreatePost: PropTypes.bool,
    brandingText: PropTypes.string,
    resetComponentOnFileUpload: PropTypes.bool,
    hideLabel: PropTypes.bool,
    showReply: PropTypes.bool,
    aiReviewReplyCb: PropTypes.func,
    showRegenerateOption: PropTypes.func,
    aiRegenerateCb: PropTypes.func,
    customCategory: PropTypes.array,
    openCallback: PropTypes.func,
    attachmentTooltipPosition: PropTypes.string,
    toggleRestore: PropTypes.number,
    setToggleRestore: PropTypes.func,
    masterPostList: PropTypes.object,
    popOverDirection: PropTypes.string,
    resetMentionsState: PropTypes.func,
    setMentionsDataForEngage: PropTypes.func,
    showMentionPopoverInViewport: PropTypes.bool,
    inboxPaymentJSX: PropTypes.node,
    inboxTemplateJSX: PropTypes.node,
    mentionUserName: PropTypes.string,
    fromPage: PropTypes.string,
    setSelectedPostLibId: PropTypes.func,
    customToolTipTextForEmoji: PropTypes.string,
    disableEmojiPicker: PropTypes.bool,
    showPostLib: PropTypes.bool,
    selectedPostLibId: PropTypes.number,
    extraToken:PropTypes.array,
    enableCustomTokens:PropTypes.bool,
    replaceNewLineDivsByLineBreak: PropTypes.bool,
    textAreaId: PropTypes.string,
    removeCustomClass: PropTypes.bool,
    renderMediaSequence: PropTypes.func,
    isEditPost: PropTypes.bool,
    positionCursorAtEndIfTextPresent: PropTypes.bool,
    setIsAssistedByAI: PropTypes.func,
    aiPromptCb: PropTypes.func,
    showAiPrompts: PropTypes.bool,
    socialSingleSelectPaginatedConfig: PropTypes.object,
    textAreaCounterPropKey: PropTypes.string,
    isLongLinkShortening: PropTypes.bool,
    isShorteningComplete: PropTypes.bool,
    fromReplyTemplateBox: PropTypes.bool,
    aiReplyBox: PropTypes.bool,
    isCampaignAiTemplate: PropTypes.bool,
    showPersonalizeTokenWarning: PropTypes.bool,
    onCloseReplyCallback: PropTypes.func,
    showCloseReplyBtn: PropTypes.bool
};

export const Emojify = (string) => {
    if (!string) return string;
    const regex = new RegExp("(\\:)([a-zA-Z0-9-_+]{1,}?)(\\:)", "g");
    let inputString = string;
    let match = uniq(inputString.match(regex));
    while (match.length > 0) {
        const emojiColons = match.pop();
        const emojiObj = find(emojiIndex.emojis, { colons: emojiColons });
        const replaceWith = emojiObj && emojiObj.native ? emojiObj.native : emojiColons;
        inputString = replace(inputString, new RegExp(emojiColons, "g"), replaceWith);
    }
    return inputString;
};

export const Textify = (string) => {
    if (!string) return string;
    const regex = emojiRegex();
    let inputString = string;
    let match = uniq(inputString.match(regex));
    while (match.length > 0) {
        const emoji = match.pop();
        const emojiObj = find(emojiIndex.emojis, { native: emoji });
        const replaceWith = emojiObj && emojiObj.colons ? emojiObj.colons : emoji;
        inputString = replace(inputString, new RegExp(emoji, "g"), replaceWith);
    }
    return inputString;
};

export default EmojiPicker;
