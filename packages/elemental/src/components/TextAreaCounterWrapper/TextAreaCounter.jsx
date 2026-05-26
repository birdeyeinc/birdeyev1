import React, { Component } from "react";
import Styles from "./TextAreaCounter.module.scss";
import PropTypes from "prop-types";
import { isEmpty, some, throttle, debounce } from "lodash";
import SingleSelect from "atoms/SingleSelect";
import Tooltip from "atoms/Tooltip";
import Button from "atoms/Button";

// import { FileUploader } from "components/FileUploader";
import { TOKEN_MENU_TYPE } from "./Constants";
import autosize from "autosize";
import { formatToHtml, formatToPlainText, numberWithCommas, getSingularPluralText, moveTextAreaCursorAtEnd, filterOutSecureTokens } from "./helper"
import { characterLimitMetaData, filterLink, highlightMentions, moveCursorToEnd, validateUrlRegex, checkLinkEndsWithComma } from "./helper";
import TextAreaEmojiPicker from "./TextAreaEmojiPicker";
import AlertImg from "assets/images/error.svg";
import MagicWand from "assets/images/magic-wand-grey.gif";
import Loader from "assets/images/dots-loader.gif";
import { Const } from "components/EmojiPicker/utils/constants";
import { formatToCustomToken } from "./helper"
import FileUploader from "components/FileUploader";
import { filteredSocialEngageTokens } from "utils/SocialPostTokens";
import { locationUrlTokens,locationMetadataTokens } from "utils/token";
import InfoComponent from "components/InfoComponent";
import RichTextEditor from "atoms/RichTextEditor";


let textAreadIdCount = 0;
class TextAreaCounter extends Component {
    constructor(props) {
        super(props);
        this.counter = 0;
        this.textAreadId = "text-area-" + ++textAreadIdCount;
        this.onChangeCalled = false;
        this.state = {
            showToken: props.showTokensInside !== undefined ? props.showTokensInside : false,
            showEmojiPicker: false,
            value: props.txtVal,
            showFocus: false,
            showFooterUp: false,
            showWarning: false,
            showMentionPopover: false,
            urlShortenerDiv: false,
            selectedMasterPostSocialTab: null,
            allMentionWords: [],
            currentTextValue: "",
            currentChannel: "master",
            currentToggleCount: 0,
            highlitedDiv: "",
            fromHighlightMentionBox: false,
            showPostLibModal: false,
            selectedPostLibId: null,
            showToolPopover: false,
            selectedTool: null,
            toolPopoverPosition: { top: 0, left: 0 },
            longUrlArr: [],
            isTemplatesOpen: false
            
        };
        this.textAreaInit = false;
        this.onChangeCallbackThrottle = throttle(this.onChangeCallback, 400);
        this.textAreaRef = null;
        this.secureTokensList = [];
        this.currentRange = null;
        this.mentionsSetRange = null;
        this.mentionsStartIndex = null;
        this.mentionsEndIndex = null;
        this.mentionsCaretOffset = null;
        this.mentionsKeyword = null;
        this.urlword = null;
        this.debounceTimeout = null;
        this.popverOptions = null;
        this.editTextVal = "";
        this.postLibModalListenerAdded = false;
        this.toolPopoverRef = React.createRef();
        if (typeof ResizeObserver !== "undefined") {
            this.resizeObserver = new ResizeObserver(debounce((entries) => {
                const self = this;
                const entry = entries[0];

                // self.textAreaRef.style.height = entry.contentRect.height;
                this.props.allowResizer && self.resizeTextAreaWithResizer(entry.contentRect.height);
            }));
        } else {
            console.warn("ResizeObserver is not supported in this environment.");
        }

        this.timeout = null;
    }
    onResizerThumbDown = () => {
        this.activateResizeObserver();
    }

    removeObserver = () => {
        if (!this.props.allowResizer) return;

        let rs = this.resizerSec;
        let tar = this.textAreaRef;
        if (rs.clientHeight <= 284) {
            tar.style.maxHeight = "200px";
        }
        // this.resizeObserver.unobserve(this.resizerSec);
    }

    activateResizeObserver = () => {
        if (!this.props.allowResizer || !this.resizeObserver) return;
        this.resizeObserver.observe(this.resizerSec);
    }

    resizeTextAreaWithResizer = (height) => {
        if (height > 200) {
            this.textAreaRef.style.maxHeight = "none";
        } else {
            this.textAreaRef.style.maxHeight = `${height - 60}px`;
        }
        this.textAreaRef.style.height = height;
    }

    checkAttachmentClickOutside = (e) => {
        const { setIsAttachmentPopOverOpen, isAttachmentPopOverOpen, setCloudMediaOptions, setComputerOptions } = this.props;
        if (!isAttachmentPopOverOpen) {
            return;
        }
        if (this.props.donotClosePopover) {
            this.props.handleDonotClosePopover();
            return;
        }
        if (this.popverOptions.current && !this.popverOptions.current.contains(e.target)) {
            this.shouldUpdate = true;
            setIsAttachmentPopOverOpen(false);
            setCloudMediaOptions({
                show: false,
                source: ""
            });
            setComputerOptions(false);
        }
        // this.props.handleDonotClosePopover();
    }

    componentWillMount() {
        const { tokenMenu, contentEditable, extraToken, isSocialTextArea = false } = this.props;
        const { value } = this.state;

        this.validate(tokenMenu && contentEditable ? formatToPlainText(value) : value);
        if (extraToken && extraToken.length) {
            this.secureTokensList = filterOutSecureTokens(extraToken);
        }
        if (isSocialTextArea) { // for social check
            this.popverOptions = React.createRef();
            document.addEventListener("click", this.checkAttachmentClickOutside);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { txtVal, contentEditable, label, error, extraToken, showWarning, isMentionsAvailable = false, isUrlShortenerAvailable = false, dontUpdateInnerHtml, clearAll, reGenerationCount, isRegeneratingResponse, initialDesp, showHighlight, toggleRestore, setToggleRestore, positionCursorAtEndIfTextPresent } = this.props;

        if (isMentionsAvailable) {
            if (this.props.txtVal != nextProps.txtVal && this.state.selectedPostLibId != nextProps.selectedPostLibId) {
                this.setState({
                    selectedPostLibId: nextProps.selectedPostLibId 
                });
                this.shouldUpdate;
                this.textAreaRef.innerHTML = formatToHtml(nextProps.txtVal);
                this.shouldUpdate = true;
                moveCursorToEnd(document.getElementById(this.getTextAreaId())); 
                this.textAreaRef.focus();
            }

            if (txtVal !== "" && this.editTextVal === "") {
                this.timeout = setTimeout(() => {
                    moveCursorToEnd(document.getElementById(this.getTextAreaId())); 
                } , 200);

                this.editTextVal = txtVal;
            }

            if (positionCursorAtEndIfTextPresent && this.editTextVal === "") {
                this.timeout = setTimeout(() => {
                    moveCursorToEnd(document.getElementById(this.getTextAreaId())); 
                } , 200);
            }
            
            if (this.state.currentChannel !== this.props.selectedChannel) {
                if (showHighlight) {
                    highlightMentions(this.getTextAreaId(),showHighlight,null,this.props.selectedChannel,false,(mention) => this.mentionsKeyword = mention , () => this.setState({ showMentionPopover : true }), (div) => this.setState({ highlitedDiv: div }), () => this.setState({fromHighlightMentionBox: true}), this.props.masterPostList,nextProps.txtVal, nextProps.mentionsData);
                    this.setState({ currentToggleCount: 0, fromHighlightMentionBox: false, highlitedDiv: null });
                    setToggleRestore(0);
                    this.mentionsKeyword = "";
                }
                this.setState({ currentChannel : this.props.selectedChannel, showMentionPopover: false });
                this.props.resetMentionsState();
                
                moveCursorToEnd(document.getElementById(this.getTextAreaId()));
            } else if (toggleRestore != this.state.currentToggleCount) {
                highlightMentions(this.getTextAreaId(),showHighlight,null,this.props.selectedChannel,false,(mention) => this.mentionsKeyword = mention , () => this.setState({ showMentionPopover : true }), (div) => this.setState({ highlitedDiv: div }), () => this.setState({fromHighlightMentionBox: true}), this.props.masterPostList,nextProps.txtVal, nextProps.mentionsData);
                this.setState({ currentToggleCount: toggleRestore, fromHighlightMentionBox: false, highlitedDiv: null });
            }
        }

        const { maxLen, placeholder } = this.props;

        if (maxLen !== nextProps.maxLen || placeholder !== nextProps.placeholder) {
            this.shouldUpdate = true;
        }

        // Update value content editable when data not provided on mounting but on some action, 
        // Messenger has this use case
        if (contentEditable && nextProps.updateValue) {
            /** TODO-revisit handle special case for messenger */
            if (nextProps.txtVal === "" && !this.state.showEmojiPicker && !dontUpdateInnerHtml) {
                this.textAreaRef.innerHTML = "";
            }
            if (nextProps.txtVal === "" && !this.state.showEmojiPicker && clearAll) {
                this.textAreaRef.innerHTML = "";
            }

            // Update innerHTML with new content when updateValue is true and txtVal is not empty
            if (nextProps.txtVal !== "" && !dontUpdateInnerHtml) {
                this.textAreaRef.innerHTML = formatToHtml(nextProps.txtVal);
                
                // Position cursor at end for AI-generated content or when positionCursorAtEndIfTextPresent is true
                if (positionCursorAtEndIfTextPresent) {
                    setTimeout(() => {
                        //  this.textAreaRef.focus();
                        moveCursorToEnd(document.getElementById(this.getTextAreaId()));
                    }, 100);
                }
            }

            this.setState({
                value: nextProps.txtVal
            });
            this.shouldUpdate = true;
        }
        if (isMentionsAvailable && (nextProps.selectedMasterPostSocialTab !== this.state.selectedMasterPostSocialTab)) {
            this.setState({
                selectedMasterPostSocialTab: nextProps.selectedMasterPostSocialTab
            });
            this.textAreaRef.innerHTML = formatToHtml(nextProps.txtVal);
            this.shouldUpdate = true;
            this.textAreaRef.focus();
        }

        if (txtVal !== nextProps.txtVal && !contentEditable) {
            this.setState({
                value: nextProps.txtVal
            });
            this.shouldUpdate = true;
        }

        if (label != nextProps.label) {
            this.shouldUpdate = true;
        }

        if (error != nextProps.error) {
            this.shouldUpdate = true;
        }

        if (extraToken && nextProps.extraToken && nextProps.extraToken.length !== extraToken.length) {
            this.shouldUpdate = true;
        }

        if (showWarning != nextProps.showWarning) {
            this.setState({ showWarning: nextProps.showWarning });
        }
        if (!nextProps.showMentionPopoverState && isMentionsAvailable) {
            this.setState({
                showMentionPopover: false
            });
        }
        if (!nextProps.showUrlShortenerPopoverState && isUrlShortenerAvailable) {
            this.setState({
                urlShortenerDiv: false
            });
        }
        if (this.props.txtVal && !this.props.isAIAgentTextArea) {
            this.getLongLink(this.props.txtVal);
        }

        if (isMentionsAvailable && this.state.value && this.state.value.includes("[@") && nextProps.updateValue && nextProps.isEditPost) {
            const mentions = this.props.masterPostList?.find(item => item.channel === this.props.selectedChannel)?.mentions;
            mentions?.length > 0 && highlightMentions(this.getTextAreaId(), false,null,this.props.selectedChannel,false,(mention) => this.mentionsKeyword = mention , () => this.setState({ showMentionPopover : true }), (div) => this.setState({ highlitedDiv: div }), () => this.setState({fromHighlightMentionBox: true}), this.props.masterPostList,nextProps.txtVal, mentions);
        }

        if (reGenerationCount !== nextProps.reGenerationCount) {
            this.shouldUpdate = true;
        }
        if (isRegeneratingResponse !== nextProps.isRegeneratingResponse) {
            this.shouldUpdate = true;
        }
        if (initialDesp !== nextProps.isRegeneratingResponse) {
            this.shouldUpdate = true;
        }

        if (nextProps?.txtVal !== txtVal) {
            if (this.props.autoSize) {
                setTimeout(() => {
                    autosize.update(this.textAreaRef);
                });
            }
        }

        // if (nextProps?.isToolAdded) {
        //     moveCursorToEnd(document.getElementById(this.getTextAreaId()));
        //     this.handleTokenChange("tool", {
        //         value: nextProps.selectedToolForConfig.label,
        //         label: nextProps.selectedToolForConfig.label,
        //         tokenType: "tool"
        //     });
        // }

        if (!this.state.showPostLibModal && this.postLibModalListenerAdded) {
            window.removeEventListener("message", this.handleEventFromPostLibModal);
            this.postLibModalListenerAdded = false;
        }
    }

    // eslint-disable-next-line no-unused-vars
    shouldComponentUpdate(nextProps,nextState) {
        const { isMentionsAvailable = false, isUrlShortenerAvailable = false, showMentionPopoverInViewport = false } = this.props;
        let mentionPopoverDiv = document.getElementById("mention-popover");
        let urlShortenerDivElement = document.getElementById("url-popover");
        if (isUrlShortenerAvailable && !isEmpty(urlShortenerDivElement)) {
            if (nextState.urlShortenerDiv) {
                const contenteditable = document.getElementById("app");
                const rect = this.mentionsSetRange?.getClientRects()[0];
                // wrt to viewport
                let parent = contenteditable.getBoundingClientRect();
                if (rect && parent) {
                    let x = rect.left - parent.left;
                    let y = rect.top - parent.top;
                    urlShortenerDivElement.setAttribute("aria-hidden", "false");
                    urlShortenerDivElement.setAttribute(
                        "style",
                        `left: ${x}px; top: ${y + 13}px;`
                    );
                }
            } else {
                urlShortenerDivElement.setAttribute("aria-hidden", "true");
                urlShortenerDivElement.setAttribute(
                    "style",
                    `display: none `
                );
            }
        }

        if (isMentionsAvailable && !isEmpty(mentionPopoverDiv)) {
            if (nextState.showMentionPopover) {
                const contenteditable = document.getElementById("app");
                const rect = this.mentionsSetRange?.getClientRects()[0];
                // wrt to viewport
                let parent = contenteditable.getBoundingClientRect();
                if (rect && parent) {
                    const mentionPopoverHeight = 358;
                    let diffFromTop = 0;
                    if (showMentionPopoverInViewport && (rect.top + mentionPopoverHeight > parent.height)) {
                        diffFromTop = (rect.top + mentionPopoverHeight - parent.height + 20);
                    } 
                    let x = rect.left - parent.left;
                    let y = rect.top - (parent.top - parent.y) - diffFromTop;
                    mentionPopoverDiv.setAttribute("aria-hidden", "false");
                    mentionPopoverDiv.setAttribute(
                        "style",
                        `left: ${x}px; top: ${y - 10}px;`
                    );
                }
            } else {
                mentionPopoverDiv.setAttribute("aria-hidden", "true");
                mentionPopoverDiv.setAttribute(
                    "style",
                    `display: none `
                );
            }
        }

        if (nextProps.selectedChannel !== this.state.currentChannel && nextProps.txtVal && this.props.isUrlShortenerAvailable && !this.props.isAIAgentTextArea && !this.props.fromReplyTemplateBox) {
            this.getLongLink(this.textAreaRef.innerHTML ?? "");
        }
        return this.shouldUpdate;
    }

     getLongLink(textContent) {
        const availableLongLink = [];
        let result = textContent?.replace(/<br>/g, " ");
        result = result.replace(/&amp;/g, "&");
        result = result.replace(/\n/g, " ");
        const wordArr = textContent ? result.split(" ") : [];
        for (let i = 0; i < wordArr.length; i++) {
            let item = wordArr[i];
            // check if word is a proper url
            if (!isEmpty(item)) {
                let alreadyShortenedLink = item.indexOf("https://birdeye.cx") > -1;
                const { isEndsWithComma } = checkLinkEndsWithComma(item);
                if (isEndsWithComma) {
                    item = item.replace(/,/g, "");
                }
                if (!alreadyShortenedLink && validateUrlRegex(item, true)) {
                    this.urlword = item;
                    availableLongLink.push(item);
                    this.setState({
                        urlShortenerDiv: true
                    });
                    this.shouldUpdate = true;
                }
            }
        }
        this.setState({
            longUrlArr: availableLongLink
        });
    }


    insertAtCursor(myField, myValue) {
        if (document.selection) {
            myField.focus();
            let sel = document.selection.createRange();
            sel.text = myValue;
        } else if (myField.selectionStart || myField.selectionStart === "") {
            let startPos = myField.selectionStart;
            let endPos = myField.selectionEnd;
            myField.value = myField.value.substring(0, startPos)
                + myValue
                + myField.value.substring(endPos, myField.value.length);
        } else {
            myField.value += myValue;
        }
    }

    attachToolClickListeners = (e) => {
        if (e.target.classList.contains("token-name") || e.target.classList.contains("token")) {
            this.handleToolMouseOver(e);
        }
    };

    removeSelectedTool = () => {
        const { selectedTool } = this.state;
        if (selectedTool && selectedTool.parentNode) {
            selectedTool.parentNode.removeChild(selectedTool);
            this.setState({ showToolPopover: false, selectedTool: null }, () => {
                this.updateContentHTML();
            });
        } else {
            this.setState({ showToolPopover: false, selectedTool: null });
        }
    };
    handleToolMouseOver = (e) => {
        const tokenDiv = e.target.closest(".token-cont");
        if (tokenDiv && tokenDiv !== this.state.selectedTool) {
            const rect = tokenDiv.getBoundingClientRect();
            const popoverHeight = 60;
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;
            const top = rect.top + scrollY - (popoverHeight) + 6;
            const left = rect.left + scrollX;
            const isToolToken = tokenDiv.innerHTML.includes("tool");
            this.setState({
                showToolPopover: isToolToken,
                selectedTool: tokenDiv,
                toolPopoverPosition: { top, left }
            });
        }
        this.updateContentHTML();
        this.forceUpdate();
    };
    handleToolMouseOut = (e) => {
        const toToken = e.relatedTarget?.closest?.(".token-cont");
        const toPopover = this.toolPopoverRef?.current?.contains(e.relatedTarget);
        if (!toToken && !toPopover) {
            this.setState({ showToolPopover: false, selectedTool: null });
            this.updateContentHTML();
            this.forceUpdate();
        }
    };

    getTokenMenuData = () => {
        const { hideQuesMess, tokenMenuType, hideRating, hideButtonLabel, addTokenGaData, resellerInfo, extraToken, hideReviewTemplate, referralCodeToken, templateType, referralTokens, isCampaignTemplate, showLocationUrlTokens, isCampaignAiTemplate } = this.props;
        let tokenMenu = [];
        const appointmentProductEnabled = window?.BE?.business?.productFeatures?.appointmentRemindersEnabled || 
            window?.BE?.business?.productFeatures?.appointmentSchedulingEnabled || 
            window?.BE?.business?.productFeatures?.appointmentRecallEnabled ||  window?.BE?.business?.productFeatures?.appointmentFormsEnabled;

        const appointmentTokens = appointmentProductEnabled && !isCampaignAiTemplate ? [{
            value: "[Patient First Name]",
            label: "Patient First Name",
            type: "appointment"
        }, {
            value: "[Patient Last Name]",
            label: "Patient Last Name ",
            type: "appointment"
        }, {
            value: "[Appointment Date]",
            label: "Appointment Date",
            type: "appointment"
        }, {
            value: "[Appointment Time]",
            label: "Appointment Time",
            type: "appointment"
        }, {
            value: "[Appointment Type]",
            label: "Appointment Type",
            type: "appointment"
        }, {
            value: "[Contact Email]",
            label: "Contact Email",
            type: "appointment"
        }, {
            value: "[Contact Phone Number]",
            label: "Contact Phone Number",
            type: "appointment"
        }, {
            value: "[Specialist Name]",
            label: "Specialist Name",
            type: "appointment"
        }, {
            value: "[Applicable CTAs]",
            label: "Applicable CTAs",
            type: "appointment"
        }
        ] : [];

        switch (tokenMenuType) {
     
            case "survey": {
                tokenMenu = [{
                    value: "[Business Name]",
                    label: "Business Name",
                    type: "business"
                }, {
                    value: "[Business Phone]",
                    label: "Business Phone",
                    type: "business"
                }, {
                    value: "[Contact first name]",
                    label: "Contact first name",
                    type: "customer"
                }, {
                    value: "[Contact last name]",
                    label: "Contact last name",
                    type: "customer"
                }, {
                    value: "[Location address]",
                    label: "Location address",
                    type: "business"
                }, {
                    value: "[EmployeeName]",
                    label: "Employee name",
                    type: "business"
                },  ...locationMetadataTokens, ...locationUrlTokens];
            }
                break;

            case TOKEN_MENU_TYPE.SURVEY_QUESTION_TITLE: {
                tokenMenu = [{
                    value: "[Business Name]",
                    label: "Business Name",
                    type: "business"
                },
                {
                    value: "[Location alias]",
                    label: "Location alias",
                    type: "business"
                }, {
                    value: "[Contact first name]",
                    label: "Contact first name",
                    type: "customer"
                }, {
                    value: "[Contact last name]",
                    label: "Contact last name",
                    type: "customer"
                }, {
                    value: "[Location address]",
                    label: "Location address",
                    type: "business"
                }, ...locationMetadataTokens, ...locationUrlTokens];
            }
                break;

            case TOKEN_MENU_TYPE.SURVEY_TITLE: {
                tokenMenu = [{
                    value: "[Business Name]",
                    label: "Business Name",
                    type: "business"
                },
                {
                    value: "[Location address]",
                    label: "Location address",
                    type: "business"
                }];
            }
                break;

            case TOKEN_MENU_TYPE.SMS_BODY: {
                tokenMenu = [...appointmentTokens, {
                    value: "[Business Name]",
                    label: "Business Name",
                    type: "business"
                }, {
                    value: "[Business Phone]",
                    label: "Business Phone",
                    type: "business"
                }, {
                    value: "[Product Name]",
                    label: "Product Name",
                    type: "business"
                }, {
                    value: "[Contact first name]",
                    label: "Contact first name",
                    type: "customer"
                }, {
                    value: "[Contact last name]",
                    label: "Contact last name",
                    type: "customer"
                }, {
                    value: "[EmployeeName]",
                    label: "Employee name",
                    type: "business"
                }, {
                    value: "[Business Address Inline]",
                    label: "Business Address Inline",
                    type: "business"
                },{
                    value: "[Business Email]",
                    label: "Business Email",
                    type: "business"
                },{
                    value: "[Appointment link]",
                    label: "Appointment link",
                    type: "business"
                }, {
                    value: "[Appointment form link]",
                    label: "Appointment form link",
                    type: "business"
                }];
                if (referralCodeToken) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Referral code]",
                        label: "Referral code",
                        type: "business"
                    }]);
                }
                if (templateType === Const.REVIEW_REQUEST_SMS) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Location alias]",
                        label: "Location alias",
                        type: "business"
                    }]);
                }
                if ((templateType === Const.APPOINTMENT_REMINDER_EMAIL) || (templateType === Const.APPOINTMENT_REMINDER_SMS)
                || (templateType === Const.APPOINTMENT_FORM_EMAIL) || (templateType === Const.APPOINTMENT_FORM_SMS)) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Day of the week]",
                        label: "Day of the week",
                        type: "appointment"
                    }, {
                        value: "[Location alias]",
                        label: "Location alias",
                        type: "business"
                    }]);
                }

                if ((templateType === Const.APPOINTMENT_RECALL_EMAIL) || (templateType === Const.APPOINTMENT_RECALL_SMS)) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Last Visit Date]",
                        label: "Last Visit Date",
                        type: "appointment"
                    },
                    {
                        value: "[Days Overdue]",
                        label: "Days Overdue",
                        type: "appointment"
                    },
                    {
                        value: "[Specialist First Name]",
                        label: "Specialist First Name",
                        type: "appointment"
                    },
                    {
                        value: "[Specialist Last Name]",
                        label: "Specialist Last Name",
                        type: "appointment"
                    },
                    {
                        value: "[Recall type]",
                        label: "Recall type",
                        type: "appointment"
                    },{
                        value: "[Day of the week]",
                        label: "Day of the week",
                        type: "appointment"
                    }, {
                        value: "[Location alias]",
                        label: "Location alias",
                        type: "business"
                    }]);
                }

            }
                break;

            case TOKEN_MENU_TYPE.CUSTOM_SMS_TEMPLATE: {
                tokenMenu = [...appointmentTokens, {
                    value: "[Location alias]",
                    label: "Location alias",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Location alias</strong>
                            <span>E.g. Alias</span>
                        </div>)
                },{
                    value: "[Contact first name]",
                    label: "Contact first name",
                    type: "customer",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Contact first name</strong>
                            <span>E.g. Jane</span>
                        </div>)
                }, {
                    value: "[Contact last name]",
                    label: "Contact last name",
                    type: "customer",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Contact last name</strong>
                            <span>E.g. Doe</span>
                        </div>)
                }, {
                    value: "[Business Name]",
                    label: "Business Name",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Name</strong>
                            <span>E.g. California</span>
                        </div>)
                }, {
                    value: "[Product Name]",
                    label: "Product Name",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Product Name</strong>
                            <span>E.g. {(resellerInfo && resellerInfo.reseller) ? resellerInfo.name : "Birdeye Inc"}</span>
                        </div>)
                }, {
                    value: "[Business Phone]",
                    label: "Business Phone",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Phone</strong>
                            <span>E.g. (541) 234 - 1120</span>
                        </div>)
                }, {
                    value: "[Your Name]",
                    label: "Your Name",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Your name</strong>
                            <span>E.g. Melanie Rogers</span>
                        </div>)
                }, {
                    value: "[Your first name]",
                    label: "Your first name",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Your first name</strong>
                            <span>E.g. Melanie</span>
                        </div>)
                }, {
                    value: "[Your last name]",
                    label: "Your last name",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Your last name</strong>
                            <span>E.g. Rogers</span>
                        </div>)
                }, {
                    value: "[Business Address Inline]",
                    label: "Business Address Inline",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Address Inline</strong>
                            <span>E.g. 250 Cambridge Ave #103</span>
                        </div>)
                }, {
                    value: "[Business Email]",
                    label: "Business Email",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Email</strong>
                            <span>E.g. lumenhealthcare@gmail.com</span>
                        </div>)
                }, {
                    value: "[Website URL]",
                    label: "Website URL",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["token-option"]}>
                            <strong>Website URL</strong>
                            <span>E.g. http://www.website.com</span>
                        </div>)
                }, {
                    value: "[Appointment link]",
                    label: "Appointment link",
                    type: "business"
                }, {
                    value: "[Appointment form link]",
                    label: "Appointment form link",
                    type: "business"
                }];
            }

                break;
            case TOKEN_MENU_TYPE.CUSTOM_VOICE_MAIL: {
                tokenMenu = [{
                    value: "[Business Name]",
                    label: "Business Name",
                    type: "business",
                    optionJSX:
                    (<div className={Styles["el-ss-token-option"]}>
                        <strong>Business Name</strong>
                        <span>E.g. California</span>
                    </div>)
                }, {
                    value: "[Business Phone]",
                    label: "Business Phone",
                    type: "business",
                    optionJSX:
                    (<div className={Styles["el-ss-token-option"]}>
                        <strong>Business Phone</strong>
                        <span>E.g. (541) 234 - 1120</span>
                    </div>)
                }, {
                    value: "[Business Address Inline]",
                    label: "Business Address Inline",
                    type: "business",
                    optionJSX:
                    (<div className={Styles["el-ss-token-option"]}>
                        <strong>Business Address Inline</strong>
                        <span>E.g. 250 Cambridge Ave #103</span>
                    </div>)
                }, {
                    value: "[Business Hours]",
                    label: "Business Hours",
                    type: "business",
                    optionJSX:
                    (<div className={Styles["el-ss-token-option"]}>
                        <strong>Business Hours</strong>
                        <span>E.g. Mon-Fri 9am - 6pm; Sat-Sun closed</span>
                    </div>)
                }];
                
            }
                break;
            case TOKEN_MENU_TYPE.FAQ: {
                tokenMenu = [{
                    value: "[Business Name]",
                    label: "Business Name",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Name</strong>
                            <span>E.g. California</span>
                        </div>)
                }, {
                    value: "[Business Phone]",
                    label: "Business Phone",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Phone</strong>
                            <span>E.g. (541) 234 - 1120</span>
                        </div>)
                }, {
                    value: "[Business Address Inline]",
                    label: "Business Address Inline",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Address Inline</strong>
                            <span>E.g. 250 Cambridge Ave #103</span>
                        </div>)
                }, {
                    value: "[Business hours]",
                    label: "Business Hours",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Hours</strong>
                            <span>E.g. Mon-Fri 9am - 6pm; Sat-Sun closed</span>
                        </div>)
                }, {
                    value: "[Business services]",
                    label: "Business Services",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Services</strong>
                            <span>E.g. (541) 234 - 1120</span>
                        </div>)
                }, {
                    value: "[Business payment options]",
                    label: "Business Payment Options",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Payment Options</strong>
                            <span>E.g. Credit, Debit Card</span>
                        </div>)
                }, {
                    value: "[Business languages]",
                    label: "Business Languages",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Languages</strong>
                            <span>E.g. English</span>
                        </div>)
                }, {
                    value: "[Business texting number]",
                    label: "Business Texting Number",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Texting Number</strong>
                            <span>E.g. (381) 264 - 1520</span>
                        </div>)
                }];
            }

                break;
            case TOKEN_MENU_TYPE.AUTO_REPLY: {
                tokenMenu = [{
                    value: "[Business Name]",
                    label: "Business Name",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Name</strong>
                            <span>E.g. California</span>
                        </div>)
                }, {
                    value: "[Business Phone]",
                    label: "Business Phone",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Phone</strong>
                            <span>E.g. (541) 234 - 1120</span>
                        </div>)
                }, {
                    value: "[Business Address Inline]",
                    label: "Business Address Inline",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Address Inline</strong>
                            <span>E.g. 250 Cambridge Ave #103</span>
                        </div>)
                }, {
                    value: "[Business Texting Number]",
                    label: "Business Texting Number",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Texting Number</strong>
                            <span>E.g. (381) 264 - 1520</span>
                        </div>)
                }, {
                    value: "[Contact first name]",
                    label: "Contact first name",
                    type: "customer",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Contact first name</strong>
                            <span>E.g. Jane Doe</span>
                        </div>)
                },{
                    value: "[Business Email]",
                    label: "Business Email",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Business Email</strong>
                            <span>E.g. lumenhealthcare@gmail.com</span>
                        </div>)
                }];
            }
                break;
            case TOKEN_MENU_TYPE.SOCIAL_POST_OPTIONS: {
                tokenMenu = socialPostPersonaliseTokens;
                break;
            }
            case TOKEN_MENU_TYPE.SOCIAL_ENGAGE_OPTIONS: {
                tokenMenu = filteredSocialEngageTokens;
                break;
            }
            case TOKEN_MENU_TYPE.AI_DIRECTIVE_OPTIONS: {
                tokenMenu = [{
                    value: "[Location name]",
                    label: "Location name",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["token-option"]}>
                            <strong>Location name</strong>
                            <span>E.g. Grand Junction - Northeast</span>
                        </div>)
                },
                {
                    value: "[Address]",
                    label: "Address",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["token-option"]}>
                            <strong>Address</strong>
                            <span>E.g. 150, Main Street</span>
                        </div>)
                },
                {
                    value: "[City]",
                    label: "City",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["token-option"]}>
                            <strong>City</strong>
                            <span>E.g. Grand Junction, CO</span>
                        </div>)
                },
                {
                    value: "[Zipcode]",
                    label: "Zipcode",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["token-option"]}>
                            <strong>Zip code</strong>
                            <span>E.g. 81504</span>
                        </div>)
                },
                {
                    value: "[State]",
                    label: "State",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["token-option"]}>
                            <strong>State</strong>
                            <span>E.g. Colorado</span>
                        </div>)
                },
                {
                    value: "[Country]",
                    label: "Country",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["token-option"]}>
                            <strong>Country</strong>
                            <span>E.g. USA</span>
                        </div>)
                },
                {
                    value: "[Phone]",
                    label: "Phone",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["token-option"]}>
                            <strong>Phone</strong>
                            <span>E.g. (514) 555-1212</span>
                        </div>)
                },
                {
                    value: "[Category]",
                    label: "Category",
                    type: "business",
                    optionJSX:
                        (<div className={Styles["token-option"]}>
                            <strong>Category</strong>
                            <span>E.g. Property Management, Dental</span>
                        </div>)
                },
                {
                    value: "[Business Description]",
                    label: "Business Description",
                    type: "business",
                    optionJSX:
                        (<div className="token-option">
                            <strong>Business Description</strong>
                            <span>E.g. XYZ Solutions is a leading provider of.. </span>
                        </div>)
                },
                {
                    value: "[Payment methods]",
                    label: "Payment methods",
                    type: "business",
                    optionJSX:
                        (<div className="token-option">
                            <strong>Payment methods</strong>
                            <span>E.g. Visa, ACH, Apple Pay</span>
                        </div>)
                }];
                break;
            }

            case TOKEN_MENU_TYPE.GMB_OPTIONS: {
                tokenMenu = [
                    {
                        value: "[Website URL]",
                        label: "Website URL",
                        type: "business",
                        optionJSX:
                            (<div className="token-option">
                                <strong>Website URL</strong>
                                <span>E.g. http://www.website.com</span>
                            </div>)
                    },
                    {
                        value: "[Menu URL]",
                        label: "Menu URL",
                        type: "business",
                        optionJSX:
                            (<div className="token-option">
                                <strong>Menu URL</strong>
                                <span>E.g. http://www.site.com/menu</span>
                            </div>)
                    },
                    {
                        value: "[Order Online URL]",
                        label: "Order Online URL",
                        type: "business",
                        optionJSX:
                            (<div className="token-option">
                                <strong>Order Online URL</strong>
                                <span>E.g. http://www.site.com/order</span>
                            </div>)
                    },
                    {
                        value: "[Appointment URL]",
                        label: "Appointment URL",
                        type: "business",
                        optionJSX:
                        (<div className={Styles["el-ss-token-option"]}>
                            <strong>Appointment URL</strong>
                            <span>E.g. http://www.site.com/appts</span>
                        </div>)
                    }, 
                    {
                        value: "[Microsite URL]",
                        label: "Microsite URL",
                        type: "business",
                        optionJSX:
                            (<div className={Styles["el-ss-token-option"]}>
                                <strong>Microsite URL</strong>
                                <span>E.g. http://website.com/microsite</span>
                            </div>)
                    }
                ];
                break;
            }
            case TOKEN_MENU_TYPE.FORM_URL: {
                tokenMenu = tokenMenu?.concat([{
                    value: "[Appointment link]",
                    label: "Appointment link",
                    type: "business"
                }, {
                    value: "[Appointment form link]",
                    label: "Appointment form link",
                    type: "business"
                }]);
                break;
            }
            default: {
                if (!hideReviewTemplate) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Business Name]",
                        label: "Business Name",
                        type: "business"
                    }, {
                        value: "[Business Phone]",
                        label: "Business Phone",
                        type: "business"
                    }]);
                }
                if (templateType === Const.REVIEW_REQUEST_EMAIL) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Location alias]",
                        label: "Location alias",
                        type: "business"
                    }]);
                }

                if (templateType === Const.REVIEW_REQUEST_SMS) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Location alias]",
                        label: "Location alias",
                        type: "business"
                    }]);
                }
                if (referralCodeToken) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Referral code]",
                        label: "Referral code",
                        type: "business"
                    }]);
                }
                if (!hideRating && !isCampaignAiTemplate) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[AvgRating]",
                        label: "AvgRating",
                        type: "business"
                    }, {
                        value: "[Review Count]",
                        label: "Review Count",
                        type: "business"
                    }]);
                }

                if (!hideQuesMess && !isCampaignAiTemplate) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Question]",
                        label: "Question",
                        type: "business"
                    }, {
                        value: "[Message]",
                        label: "Message",
                        type: "business"
                    }]);
                }

                if (!hideButtonLabel && !isCampaignAiTemplate) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Positive Button Label]",
                        label: "Positive Button Label",
                        type: "business"
                    }, {
                        value: "[Negative Button Label]",
                        label: "Negative Button Label",
                        type: "business"
                    }]);
                }

                if (tokenMenuType === TOKEN_MENU_TYPE.CUSTOM_HTML && !isCampaignAiTemplate) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Logo Image]",
                        label: "Logo Image",
                        type: "business"
                    }, {
                        value: "[BGColor]",
                        label: "BGColor",
                        type: "business"
                    }, {
                        value: "[TextColor]",
                        label: "TextColor",
                        type: "business"
                    }]);
                }
                if (!hideReviewTemplate) {
                    tokenMenu = tokenMenu?.concat([...appointmentTokens, {
                        value: "[Product Name]",
                        label: "Product Name",
                        type: "business"
                    }, {
                        value: "[Business Address Inline]",
                        label: "Business Address Inline",
                        type: "business"
                    }, {
                        value: "[Contact first name]",
                        label: "Contact first name",
                        type: "customer"
                    }, {
                        value: "[Contact last name]",
                        label: "Contact last name",
                        type: "customer"
                    }, {
                        value: "[Location address]",
                        label: "Location address",
                        type: "business"
                    }, {
                        value: "[EmployeeName]",
                        label: "Employee name",
                        type: "business"
                    }]);
                }
                if (referralTokens) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Referral code]",
                        label: "Referral code",
                        type: "business"
                    }, {
                        value: "[Referrer name]",
                        label: "Referrer's name",
                        type: "business"
                    }]);
                    if (referralTokens.hasOwnProperty("includeReferree") && referralTokens.includeReferree) {
                        tokenMenu = tokenMenu?.concat([{
                            value: "[Referee first name]",
                            label: "Referee first name",
                            type: "business"
                        }]);
                    }
                
                }
                if ((templateType === Const.APPOINTMENT_REMINDER_EMAIL) || (templateType === Const.APPOINTMENT_REMINDER_SMS)
                || (templateType === Const.APPOINTMENT_FORM_EMAIL) || (templateType === Const.APPOINTMENT_FORM_SMS)) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Day of the week]",
                        label: "Day of the week",
                        type: "appointment"
                    }, {
                        value: "[Location alias]",
                        label: "Location alias",
                        type: "business"
                    }]);
                }

                if ((templateType === Const.APPOINTMENT_RECALL_EMAIL) || (templateType === Const.APPOINTMENT_RECALL_SMS)) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Last Visit Date]",
                        label: "Last Visit Date",
                        type: "appointment"
                    },
                    {
                        value: "[Days Overdue]",
                        label: "Days Overdue",
                        type: "appointment"
                    },
                    {
                        value: "[Specialist First Name]",
                        label: "Specialist First Name",
                        type: "appointment"
                    },
                    {
                        value: "[Specialist Last Name]",
                        label: "Specialist Last Name",
                        type: "appointment"
                    },
                    {
                        value: "[Recall type]",
                        label: "Recall type",
                        type: "appointment"
                    },{
                        value: "[Day of the week]",
                        label: "Day of the week",
                        type: "appointment"
                    }, {
                        value: "[Location alias]",
                        label: "Location alias",
                        type: "business"
                    }]);
                }
                if (showLocationUrlTokens) {
                    tokenMenu = locationUrlTokens;
                }
                if (isCampaignTemplate) {
                    tokenMenu = tokenMenu?.concat([{
                        value: "[Appointment link]",
                        label: "Appointment link",
                        type: "business"
                    }, {
                        value: "[Appointment form link]",
                        label: "Appointment form link",
                        type: "business"
                    }]);
                }
                if (isCampaignAiTemplate) {
                    tokenMenu = tokenMenu?.concat([
                        {
                            label: "Privacy Policy URL",
                            value: "[Privacy Policy URL]",
                            type: "business"
                        },
                        {
                            label: "Terms of Service URL",
                            value: "[Terms of Service URL]",
                            type: "business"
                        },
                        {
                            label: "Homepage URL",
                            value: "[homepageUrl]",
                            type: "business"
                        },
                        {
                            label: "Unsubscribe Link",
                            value: "[UNSUBSCRIBE_LINK]",
                            type: "business"
                        },
                        {
                            label: "Logo URL",
                            value: "[Brand-Logo-Url]",
                            type: "business"
                        }
                    ]);
                }
            }
        }

        /** adding in the single select data */
        if (addTokenGaData) {
            tokenMenu.map((token) => {
                return token.gaData = addTokenGaData;
            });
        }

        if (extraToken && extraToken.length) {
            this.formatedToken = formatToCustomToken(extraToken.filter(option => !option.hidden), true, tokenMenuType);
            tokenMenu = tokenMenu?.concat(this.formatedToken);
        }

        return tokenMenu;
    };


    getListKeys = () => {
        return [{
            heading: "BUSINESS",
            type: "business"
        }, {
            heading: "CUSTOMER",
            type: "customer"
        }, {
            heading: "APPOINTMENTS",
            type: "appointment"
        }];
    }
 componentDidMount() {
      
        this.textAreaInit = true;
        if (this.props.autoSize) {
            autosize(this.textAreaRef);
        }

        if (this.props.textAreaDefaultFocus) {
            moveTextAreaCursorAtEnd(this.getTextAreaId());
            this.textAreaRef.focus();
        }
        if (this.props.replaceNewLineDivsByLineBreak && this.getTextAreaId()) {
            document.getElementById(this.getTextAreaId()).addEventListener("keydown", this.insertBrInHtml);
        }
        if (this.props.isAIAgentTextArea && this.props.contentEditable && this.textAreaRef) {
            this.textAreaRef.addEventListener("mouseover", this.handleToolMouseOver);
            this.textAreaRef.addEventListener("mouseout", this.handleToolMouseOut);
        }
        if (this.props.txtVal && this.props.isUrlShortenerAvailable && !this.props.isAIAgentTextArea) {
            this.getLongLink(this.props.txtVal);
        }
    }

    insertBrInHtml = (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            document.execCommand("insertLineBreak");
        }
    }

    tokenExists(arr, tokenName) {
        return arr.some(function (el) {
            return el.value === tokenName;
        });
    }

    checkIfTokenSecure(tokenName) {
        return this.secureTokensList.includes(tokenName);
    }

   handleTokenChange = (type, selectedVal) => {
        const { maxLen, contentEditable, extraToken, selectedExtraToken, tokenCls = "token", tokenMenuType, replaceTextByToken, isSocialTextArea = false, customHtmlTokens, setIsToolAdded = () => { }, isAIAgentTextArea = false } = this.props;
        this.counter++;
        const isEmoji = type && type === "emoji";
        const isTool = type && type === "tool";
        const val = isEmoji ? selectedVal.native : selectedVal.value.replace("[", "").replace("]", "");
        let tokenHtml = `<div class="token-cont"><token class=${tokenCls} contenteditable="false">${val}</token></div>`;
        if (isTool) {
            tokenHtml = `<div class="token-cont new-token" data-token="${val}">
            <token class="token" contenteditable="false" data-type="tool">
                <span class="settings-icon"><i class="icon_phoenix-setting2"></i></span>
                 <span class="token-name">${val}</span>
                 <span class="vertical-icon"><i class="icon_phoenix-vertical-dots"></i></span>
            </token>
        </div>&nbsp;`;
        } else if (tokenMenuType === TOKEN_MENU_TYPE.CUSTOM_SMS_TEMPLATE) {
            tokenHtml = `<div class="token-cont" data-type=${selectedVal.tokenType}><token class=${tokenCls} contenteditable="false">${val}</token></div>`;
        }
        
        if (contentEditable) {
            if (isEmoji) {
                if (formatToPlainText(this.textAreaRef.innerHTML).length + formatToPlainText(`${val}`).length <= maxLen || isSocialTextArea) {
                    this.textAreaRef.focus();
                    this.pasteHtmlAtCaret(`${val}`, false, false);
                }
                this.toggleEmojiPicker(false);
            } else if (isTool) {
                this.textAreaRef.focus();
                this.pasteHtmlAtCaret(tokenHtml, false, true);   
            } else if (formatToPlainText(this.textAreaRef.innerHTML).length + formatToPlainText(tokenHtml).length + 1 <= maxLen || isSocialTextArea || isAIAgentTextArea) {
                replaceTextByToken && (this.textAreaRef.innerHTML = null);
                this.textAreaRef.focus();
                const isTokenSecured = tokenMenuType === TOKEN_MENU_TYPE.FAQ ? this.checkIfTokenSecure(val) : false;
                let tokenHtml = `<div class="token-cont"><token class=${tokenCls} contenteditable="false">${val}${isTokenSecured ? "<i class=\"icon_phoenix-lock-fill ml-3 fz-10\"></i>" : ""}</token></div>&nbsp;`;
                if (tokenMenuType === TOKEN_MENU_TYPE.CUSTOM_SMS_TEMPLATE) {
                    tokenHtml = `<div class="token-cont" data-type=${selectedVal.tokenType}><token class=${tokenCls} contenteditable="false">${val}${isTokenSecured ? "<i class=\"icon_phoenix-lock-fill ml-3 fz-10\"></i>" : ""}</token></div>&nbsp;`;
                }
                this.pasteHtmlAtCaret(tokenHtml, false, true);
                if (extraToken && extraToken.length) {
                    if (this.tokenExists(this.formatedToken || extraToken, selectedVal.value)) {
                        selectedExtraToken && selectedExtraToken(selectedVal);
                    }
                }
            }
        } else {
            this.insertAtCursor(this.textAreaRef, selectedVal.value);
            if (customHtmlTokens) {
                if (extraToken && extraToken.length) {
                    if (this.tokenExists(this.formatedToken, selectedVal.value)) {
                        selectedExtraToken && selectedExtraToken(selectedVal);
                    }
                }
            }
        }

        this.updateContentHTML();
        if (setIsToolAdded && typeof setIsToolAdded === "function") {
            setIsToolAdded();
        }
    };
    validate = (value, validation) => {
        const self = this;
        let err = {
            show: false,
            msg: undefined
        };
        const { validateCallback, parentId, callGa } = self.props;

        if (this.onChangeCalled && callGa) {
            callGa();
        }
        this.onChangeCalled = false;

        if (!validation) {
            validation = self.props.validation;
        }

        some(validation, function (currValidation) {
            if (!currValidation.regex.test(value ? value : "")) {
                err = {
                    show: true,
                    msg: currValidation.msg
                };
                return true;
            }
        });

        validateCallback && validateCallback({
            error: err && err.show,
            id: self.getTextAreaId(),
            msg: err && err.msg,
            parentId
        });
    };

 componentWillUnmount() {
        const { validateCallback, parentId, isSocialTextArea = false, isMentionsAvailable } = this.props;

        validateCallback && validateCallback({
            error: false,
            id: this.getTextAreaId(),
            parentId
        });

        if (isSocialTextArea) {
            document.removeEventListener("click", this.checkAttachmentClickOutside);
        }

        if (this.props.autoSize) {
            autosize.destroy(this.textAreaRef);
        }

        if (isMentionsAvailable && this.timeout) {
            clearTimeout(this.timeout);
        }
        if (this.props.isAIAgentTextArea && this.props.contentEditable && this.textAreaRef) {
            this.textAreaRef.removeEventListener("mouseover", this.handleToolMouseOver);
            this.textAreaRef.removeEventListener("mouseout", this.handleToolMouseOut);
        }

    }


    autosizeOnFocus = (event) => {
        this.shouldUpdate = true;
        this.setState({
            showToken: true
        });
        autosize(event.currentTarget);
    };

    getTextAreaId = () => {
        const { id } = this.props;

        return id || this.textAreadId;
    };

    onChangeLocal = (val) => {
        const { onChange, mentionsData, isMentionsAvailable = false, updateMasterPostState, setMentionsDataForEngage } = this.props;
        if (isMentionsAvailable) {
            // deletion of mentions 
            let tokenRegex = /\[@(.*?)\]/g;
            let tokensArr = (formatToPlainText(val).match(tokenRegex)) || [];
            let newMentions = isEmpty(tokensArr) ? [] : isEmpty(mentionsData) ? [] : [...mentionsData];
            if (!isEmpty(mentionsData) && !isEmpty(newMentions)) {
                if (tokensArr.length < mentionsData.length) {
                    for (let i = 0; i < tokensArr.length;) {
                        const temptokenarr = [...tokensArr];
                        let el = temptokenarr[i].slice(1, temptokenarr[i].length - 1).replace("@", "");
                        let mention = newMentions[i]?.mentionValue;
                        if (el === mention) {
                            if (temptokenarr.length === i + 1) {
                                newMentions = newMentions.slice(0, i + 1);
                            }
                            i++;
                        } else {
                            newMentions = [...newMentions.slice(0, i), ...newMentions.slice(i + 1)];
                        }
                    }
                    updateMasterPostState && updateMasterPostState(val, "updateMentions", newMentions);
                    setMentionsDataForEngage && setMentionsDataForEngage(newMentions);
                }
            }
        }
        this.onChangeCalled = true;
        onChange(val);
    };

    onPaste = (e) => {
        const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

        if (!isIE11) {
            e.preventDefault();
        }

        const { maxLen, handleOnPasteFailed, isMaxCharRestricted = true } = this.props;
        let currLength, text;

        if (isIE11) {
            currLength = formatToPlainText(this.textAreaRef.innerHTML).length;
            text = formatToPlainText(window.clipboardData.getData("Text").replaceAll("\r", ""));
        } else {
            currLength = formatToPlainText(e.currentTarget.innerHTML).length;
            text = formatToPlainText(e.clipboardData.getData("text").replaceAll("\r", ""));
        }

        if (currLength + text.length <= maxLen || !isMaxCharRestricted) {
            document.execCommand("insertText", false, text);
            this.textAreaRef.scrollTop = this.textAreaRef.scrollHeight;
        } else {
            handleOnPasteFailed ? handleOnPasteFailed() : null;
            return false;
        }
    };

    getLinksIdentified = (e) => {
        let caretOffset = 0; let range;
        let elm = document.getElementById(this.getTextAreaId());
        if (window.getSelection) {
            range = window.getSelection().getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(elm);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString()?.replaceAll(/\r?\n|\r|\u2028/g, "").length;
        }
        this.mentionsSetRange = range;
        let entirestring = formatToPlainText(e.currentTarget.innerHTML);
        let tokenRegex = /\[(.*?)\]/g;
        let tokensArr = entirestring.match(tokenRegex);
        let finalModifiedString = "";
        if (!isEmpty(tokensArr)) {
            tokensArr && tokensArr.forEach(item => {
                let splitt = item.split(" ");
                let joined = splitt.join("_");
                finalModifiedString = (finalModifiedString || entirestring).replaceAll(item, joined);
            });
        } else {
            finalModifiedString = entirestring;
        }
        // string split with space -> hello www.google.com [@sdfc] [location_name] www.facebook.com
        let linkifyPublishContent = filterLink(finalModifiedString);
        let wordArr = linkifyPublishContent.split(" ");
        let sum = 0;
        this.closeUrlShortenerDiv();
        for (let i = 0; i < wordArr.length; i++) {
            if (i > 0) {
                ++sum;
            }
            let item = wordArr[i];
            caretOffset = item.indexOf("[") > -1 ? caretOffset + 2 : item.indexOf("\n") > -1 ? caretOffset + 3 : caretOffset;
            let startIndex = sum + 1;
            let endIndex = sum + item.length;
            sum = endIndex;
            // check if word is a proper url
            if (!isEmpty(item)) {
                let alreadyShortenedLink = item.indexOf("https://birdeye.cx") > -1;
                // find the link which contains the caretoffset position
                // BIRDEYE-139520: link shortner popup not coming  due to comma
                // https://www.firstambank.com/heloc-2024,
                const { isEndsWithComma } = checkLinkEndsWithComma(item);
                if (isEndsWithComma) {
                    item = item.replace(/,/g, "");
                }
                if (!alreadyShortenedLink && validateUrlRegex(item) && caretOffset >= startIndex && caretOffset <= endIndex) {
                    this.urlword = item;
                    this.setState({
                        urlShortenerDiv: true
                    });
                    this.shouldUpdate = true;
                    break;
                }
            }
        }
    }

    calculateCursorPosition = (e) => {
        const { isUrlShortenerAvailable = false, debounceDelay = 0 } = this.props;
        let caretOffset = 0; let range;
        let elm = document.getElementById(this.getTextAreaId());
        if (window.getSelection) {
            range = window.getSelection().getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(elm);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString()?.replaceAll(/\r?\n|\r|\u2028/g, "").length;
        }
        this.mentionsSetRange = range;
        let entirestring = formatToPlainText(e.currentTarget.innerHTML);
        let tokenRegex = /\[(.*?)\]/g;
        let tokensArr = entirestring.match(tokenRegex);
        let finalModifiedString = "";
        // this.textAreaRef.focus();
        if (!isEmpty(tokensArr)) {
            tokensArr && tokensArr.forEach(item => {
                let splitt = item.split(" ");
                let joined = splitt.join("_");
                finalModifiedString = (finalModifiedString || entirestring).replaceAll(item, joined);
            });
        } else {
            finalModifiedString = entirestring;
        }
        let breakwords = finalModifiedString.indexOf("\n") > -1 ? finalModifiedString.split("\n") : [finalModifiedString];
        let sum = 0;
        this.setState({
            showMentionPopover: false,
            urlShortenerDiv: false
        });
        let arr = [];
        for (let x = 0; x < breakwords.length; x++) {
            arr[x] = breakwords[x].split(" ");
        }
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let index = 0; index < arr[i].length; index++) {
                let item = arr[i][index];
                caretOffset = item.indexOf("[") > -1 ? caretOffset + 2 : caretOffset;
                if (index > 0) {
                    ++sum;
                }
                let startIndex = sum + 1;
                let endIndex = sum + item.length;
                sum = endIndex;
                if (i > 0 && count !== i) {
                    caretOffset++;
                    count = i;
                }
                if (i > 0 && index >= 0) {
                    startIndex = startIndex + i;
                    endIndex = endIndex + i;
                }
                if (caretOffset >= startIndex && caretOffset <= endIndex) {
                    const regExp = /@[A-Za-z0-9_]+/g;
                    let char = "@";
                    let totalMentions = item.match(regExp) && item.split(char).length - 1;
                    // const linksInContent = find(item);
                    // BIRDEYE-139520: link shortner popup not coming  due to comma
                    // https://www.firstambank.com/heloc-2024,
                    const { isEndsWithComma } = checkLinkEndsWithComma(item);
                    if (isEndsWithComma) {
                        item = item.replace(/,/g, "");
                    }
                    if (!isEmpty(item) && !validateUrlRegex(item)) {
                        this.setState({
                            urlShortenerDiv: false
                        });
                    }
                    if (item.charAt(0) === "@" && totalMentions === 1) {
                        this.debounceTimeout && clearTimeout(this.debounceTimeout);
                        this.debounceTimeout = setTimeout(() => {
                            this.debounceTimeout = null;
                            this.mentionsStartIndex = startIndex;
                            this.mentionsEndIndex = endIndex;
                            this.mentionsCaretOffset = caretOffset;
                            this.mentionsKeyword = item;
                            this.shouldUpdate = true;
                            this.setState({
                                showMentionPopover: this.props.openMentionPopover ? true : false
                            });
                            !this.props.openMentionPopover ? this.props.resetMentionsState() : "";
                        }, debounceDelay || 0);
                        break;
                    }
                }
            }
        }
        if (e.keyCode === 13 || e.keyCode === 32) {
            this.setState({
                showMentionPopover: false
            });
            isUrlShortenerAvailable ? this.closeUrlShortenerDiv() : null;
        }
    }

    validateDivContent = (e) => {
        if (this.props.replaceNewLineDivsByLineBreak && this.getTextAreaId()) {
            document.getElementById(this.getTextAreaId()).addEventListener("keydown", this.insertBrInHtml);
        }
        const { maxLen, allowEnter, allowSpecialKeysOnMaxLength, isMaxCharRestricted = true } = this.props;
        const inputVal = formatToPlainText(e.currentTarget.innerHTML);
        const keyUpValidation = e.keyCode !== 8 && inputVal.length >= maxLen && (e.keyCode !== 91 || e.ctrlKey) || e.keyCode === 13 && !allowEnter;
        /** allow arrow keys and backspace */
        const specialKeysValidation = allowSpecialKeysOnMaxLength && inputVal.length >= maxLen && ([37, 38, 39, 40, 91].indexOf(e.keyCode) !== -1 || e.ctrlKey || e.metaKey);
        const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        this.checkForMetaEnterAndTrigger(e);
        if (isIE11) {
            if (keyUpValidation && !specialKeysValidation && isMaxCharRestricted) {
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
                return false;
            } else {
                if ((e.keyCode == 86 || e.which == 86) && e.ctrlKey) {
                    /** paste event handle in IE */
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    document.execCommand("paste", false, window.clipboardData.getData("Text"));
                }
                this.updateContentHTML();
            }
        } else {
            if ((keyUpValidation && !specialKeysValidation && isMaxCharRestricted)) {
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
                return false;
            }
        }
    };
    closeEmojiModal = (e) => {
        const { maxLen, allowEnter, allowSpecialKeysOnMaxLength } = this.props;
        const inputVal = formatToPlainText(e.currentTarget.innerHTML);
        const keyUpValidation = e.keyCode !== 8 && inputVal.length >= maxLen && (e.keyCode !== 91 || e.ctrlKey) || e.keyCode === 13 && !allowEnter;
        this.checkForMetaEnterAndTrigger(e);
        /** allow arrow keys and backspace */
        const specialKeysValidation = allowSpecialKeysOnMaxLength && inputVal.length >= maxLen && ([37, 38, 39, 40, 91].indexOf(e.keyCode) !== -1 || e.ctrlKey || e.metaKey);
        if (keyUpValidation && !specialKeysValidation && e.keyCode == 27) {
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            return false;
        }
    }

    checkForMetaEnterAndTrigger = (e) => {
        const { onSubmit, onEnterSubmit, hideEmojiOnEscClick } = this.props;

        if (onSubmit && (e.ctrlKey || e.metaKey) && (e.keyCode == 13 || e.keyCode == 10)) {
            onSubmit();
        }

        if (onSubmit && onEnterSubmit && !e.shiftKey && (e.keyCode == 13 || e.keyCode == 10)) {
            e.preventDefault();
            onSubmit();
        }
        if (hideEmojiOnEscClick && e.keyCode == 27) {
            this.toggleEmojiPicker(false);
        }
    };

    pasteHtmlAtCaret = (html, selectPastedContent, isToken) => {
        let sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                const el = document.createElement("div");
                el.innerHTML = html;
                let frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                const firstNode = frag.firstChild;
                // when the textarea box losses focus it places the cursor at start and appends the new html from position 0, this line manually sets the correct cursor position to append html
                if (isToken && this.currentRange && (this.currentRange.commonAncestorContainer == this.textAreaRef || this.currentRange.commonAncestorContainer.parentElement == this.textAreaRef || this.textAreaRef.contains(this.currentRange.commonAncestorContainer.parentNode))) {
                    this.currentRange.insertNode(frag);
                } else {
                    range.insertNode(frag);
                }

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    if (selectPastedContent) {
                        range.setStartBefore(firstNode);
                    } else {
                        range.collapse(true);
                    }
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if ((sel = document.selection) && sel.type != "Control") {
            // IE < 9
            let originalRange = sel.createRange();
            originalRange.collapse(true);
            sel.createRange().pasteHTML(html);
            if (selectPastedContent) {
                range = sel.createRange();
                range.setEndPoint("StartToStart", originalRange);
                range.select();
            }
        }
    };

    getCharactersLeft = () => {
        const { maxLen, disabled, tokenMenu, contentEditable, supportHTML, counterWithText, showTwitter } = this.props;
        const { value } = this.state;

        if ((tokenMenu && contentEditable) || (contentEditable && supportHTML)) {
            //when a only personalised token is present and cleared with backspace it leaves <br> tag at the end.
            //here we are removing that <br> tag if it is present.
            if (this.textAreaInit && this.textAreaRef.innerHTML !== undefined && this.textAreaRef.innerHTML.match(/^<br>$/)) {
                this.textAreaRef.innerHTML = "";
            }
        }

        let txtValLenFinal = 0;
        if ((tokenMenu && contentEditable) || (contentEditable && supportHTML)) {
            txtValLenFinal = this.textAreaInit && this.textAreaRef.innerHTML !== undefined ? formatToPlainText(this.textAreaRef.innerHTML).length : formatToPlainText(value).length;
        } else {
            txtValLenFinal = value ? value.length : 0;
        }

        let leftCount = maxLen - txtValLenFinal;

        // if (this.textAreaInit && this.textAreaRef.innerHTML !== undefined && showTwitter) {
        //     leftCount = characterLimitMetaData.twitter - twitter.parseTweet(formatToPlainText(this.textAreaRef.innerHTML)).weightedLength;
        // }
        if (this.props.isSocialTextArea) {
            const { charExceedErr } = this.props;
            const exceedText = charExceedErr || "Post exceeds by";

            return maxLen && !disabled && (
                <span className={`${Styles["char-count"]} ${leftCount < 0 ? Styles["red"] : ""}`}>
                    {leftCount == 1
                        ? `${numberWithCommas(leftCount)} character left`
                        : leftCount < 0
                            ? `${exceedText} ${numberWithCommas(leftCount).replaceAll("-", "")} ${getSingularPluralText(numberWithCommas(leftCount).replaceAll("-", ""), "character")}`
                            : `${numberWithCommas(leftCount)} characters left`}
                </span>
            );
        }
        if (counterWithText) {
            return maxLen && !disabled && (<span className={`${Styles["char-count"]} ${leftCount < 0 ? Styles["red"] : ""}`}>
                {`${numberWithCommas(leftCount)} ${leftCount == 1 ? "character" : "characters"} left`}
            </span>);
        }
        return maxLen && !disabled && (<span className={`${Styles["char-count"]} ${leftCount < 0 && this.props.highlightError ? Styles["red"] : ""}`}>
            {`${numberWithCommas(txtValLenFinal)}/${numberWithCommas(maxLen)}`}
        </span>);
    };

        hasPersonalizeToken = (html = "") => {
        const tokenPatterns = [
            /<token[^>]*>.*?<\/token>/i,   // Matches <token ...>something</token>
            // eslint-disable-next-line no-useless-escape
            /\[\s*[^\[\]]+\s*\]/          // Matches [token text]
        ];
        return tokenPatterns.some(pattern => pattern.test(html));
    };

    getPersonalizeTokenWarning = () => {
        const { maxLen, disabled, tokenMenu, contentEditable, supportHTML, showTwitter, selectedChannel, showPersonalizeTokenWarning = false } = this.props;
        if (!showPersonalizeTokenWarning) return;
        const { value } = this.state;
        let channelName = selectedChannel;
        switch (selectedChannel) {
            case "tiktok":
                channelName = "TikTok";
                break;
            case "linkedin":
                channelName = "LinkedIn";
                break;
            case "youtube":
                channelName = "YouTube";
                break;
            default:
                channelName = startCase(selectedChannel);
                break;
        }
        const CHAR_LIMIT_WARNING = 30;
        const TOKEN_CHAR_WARNING_MSG = `Your reply might go over the ${channelName}’s character limit once placeholders like names or locations are filled in. Try leaving ${CHAR_LIMIT_WARNING} extra characters to avoid posting issues.`;
        if ((tokenMenu && contentEditable) || (contentEditable && supportHTML)) {
            if (this.textAreaInit && this.textAreaRef.innerHTML !== undefined && this.textAreaRef.innerHTML.match(/^<br>$/)) {
                this.textAreaRef.innerHTML = "";
            }
        }
        let txtValLenFinal = 0;
        if ((tokenMenu && contentEditable) || (contentEditable && supportHTML)) {
            txtValLenFinal = this.textAreaInit && this.textAreaRef.innerHTML !== undefined ? formatToPlainText(this.textAreaRef.innerHTML).length : formatToPlainText(value).length;
        } else {
            txtValLenFinal = value ? value.length : 0;
        }
        let leftCount = maxLen - txtValLenFinal;

        // if (this.textAreaInit && this.textAreaRef.innerHTML !== undefined && showTwitter) {
        //     leftCount = characterLimitMetaData.twitter - twitter.parseTweet(formatToPlainText(this.textAreaRef.innerHTML)).weightedLength;
        // }

        const txtVal = this.textAreaInit && this.textAreaRef.innerHTML !== undefined ? this.textAreaRef.innerHTML : value;

        if (this.props.isSocialTextArea && maxLen && !disabled && this.hasPersonalizeToken(txtVal) && leftCount < CHAR_LIMIT_WARNING) {
            return (
                <InfoComponent
                    infoHTML={
                        <span>
                            {TOKEN_CHAR_WARNING_MSG}
                        </span>
                    }
                    iconClassName="icon_phoenix-important"
                    infoType="redWarning"
                    customClassName="personalize-token-warning mb-0 w-100"
                />
            );
        }
    };

    textareaRef = (ref) => {
        this.textAreaRef = ref;
    };

    updateContentHTML = () => {
        const { contentEditable } = this.props;
        const value = !contentEditable && this.textAreaRef.value;

        this.shouldUpdate = true;
        this.onChangeCalled = true;

        const newState = contentEditable ? {} : { value };

        this.setState(newState, this.onChangeCallbackThrottle);
    };

    onChangeCallback = () => {
        const { contentEditable } = this.props;
        const { onChangeLocal, onChangeCalled } = this;

        onChangeCalled && onChangeLocal(contentEditable ? this.textAreaRef.innerHTML : this.textAreaRef.value);
    };

    handleContentFocus = () => {
        const { tokenMenu, onFocus, showTokensInside } = this.props;
        this.shouldUpdate = true;

        tokenMenu && this.setState({
            showToken: true
        });

        showTokensInside && this.setState({
            showFocus: true
        });

        this.setState({
            focus: true
        });

        this.props.setTextAreaFocus && this.props.setTextAreaFocus(true);

        this.onBlur = false;

        onFocus && onFocus();
    };

    handleContentBlur = (event) => {
        const { tokenMenu, onBlur, showTokensInside, txtVal, addEventOnlyOnce } = this.props;
        this.shouldUpdate = true;
        document.getElementById(this.getTextAreaId()).removeEventListener("keydown", this.insertBrInHtml);

        if (tokenMenu) {
            const body = document.getElementsByTagName("body")[0];
            this.onBlur = true;

            body.removeEventListener("click", this.handleClickOutside);
            if (addEventOnlyOnce) {
                body.addEventListener("click", this.handleClickOutside, { once: true });
            } else {
                body.addEventListener("click", this.handleClickOutside);
            }
        } else {
            this.validate(event.target.value || txtVal);
        }

        showTokensInside && this.setState({
            showFocus: false
        });

        this.setState({
            focus: false
        });

        this.props.setTextAreaFocus && this.props.setTextAreaFocus(false);

        onBlur && onBlur(event.target.value);
    };

    containsCheck = (elem) => {
        const { tokenMenu, showTokensInside } = this.props;
        const tokenElem = document.getElementById(`token-${this.getTextAreaId()}`);

        if (!elem || (tokenElem && !tokenElem.contains(elem))) {
            this.shouldUpdate = true;
            tokenMenu ? this.setState({ showToken: showTokensInside !== undefined ? true : false }, this.validateCallback) : this.validateCallback();
        }
    };

    validateCallback = () => {
        this.validate(formatToPlainText(this.textAreaRef.innerHTML), this.props.validation);
    };

    handleClickOutside = (e) => {
        const { getTextAreaId } = this;
        const textArea = document.getElementById(getTextAreaId());

        if (textArea && textArea.contains(e.target)) {
            return;
        }

        this.containsCheck(e.target);
    };

    toggleEmojiPicker = (showPickerFlag) => {
        this.shouldUpdate = true;
        this.setState((prevState) => {
            return {
                showEmojiPicker: !prevState.showEmojiPicker
            };
        }, () => {
            if (this.state.showEmojiPicker) {
                !this.props.setTextAreaFocus && this.textAreaRef.focus();
            }
            window.eventTracker && window.eventTracker.trackUserActivity("click:Emoji picker");
        });
    };

    componentDidUpdate() {
        this.shouldUpdate = false;
    }

    setUploader = () => {
        this.setState({ showFooterUp: true });
    }

    attachButtonJSX = (disabled) => {
        const { disabledAttachmentTooltip, attachmentTooltipPosition, attachmentTooltipText, openSelectFileDialogueBox, createPostInIframe, aiReplyBox = false, fromReplyTemplateBox = false } = this.props;
        return (<div>
            <Tooltip
                text={!disabled ? (attachmentTooltipText || "Attach an image (PNG, JPEG, JPG, GIF) or PDF") : (disabledAttachmentTooltip || "Only 1 attachment is allowed")}
                position={attachmentTooltipPosition || "bottom-left"}
                tooltipClass={createPostInIframe ? "change-tooltip-position" : ""}
            >
                <span className={`attach-btn fz-16 ${disabled ? "opacity-disabled" : ""}`} onClick={openSelectFileDialogueBox}>
                    {aiReplyBox || fromReplyTemplateBox ? <i className="icon_phoenix-camera-icon phoenix-icon" /> :  <i className="icon_phoenix-attachment phoenix-icon" />}
                </span>
            </Tooltip>
        </div>
        );
    };

    handleAttachmentPopOver = () => {
        const { setIsAttachmentPopOverOpen, isAttachmentPopOverOpen } = this.props;
        this.shouldUpdate = true;
        setIsAttachmentPopOverOpen(!isAttachmentPopOverOpen);
    }

    popOverButtonJSX = (disabled) => {
        return (<div ref={this.popverOptions} >
            <span className={`attach-btn fz-16 ${this.props.isAttachmentPopOverOpen && !disabled ? "active" : ""}`} onClick={this.handleAttachmentPopOver}>
                {disabled ? (
                    (
                        this.props.selLimitExceeded ? (<Tooltip
                            text="Reached max attachments of 10"
                            position={"bottom-left"}
                        >
                            <i className={`icon_phoenix-camera-icon phoenix-icon ${disabled ? "opacity-disabled" : ""}`} />
                        </Tooltip>) : (<Tooltip
                            text="Select a social channel to upload media"
                            position={"bottom-left"}
                        >
                            <i className={`icon_phoenix-camera-icon phoenix-icon ${disabled ? "opacity-disabled" : ""}`} />
                        </Tooltip>)
                    )
                ) : (
                    <Tooltip
                        text="Add media"
                        position={"bottom-left"}
                    >
                        <i className={`phoenix-icon ${this.props.isAttachmentPopOverOpen && !disabled ? "icon_phoenix-camera-fill" : "icon_phoenix-camera-icon"}`} />
                    </Tooltip>
                )}
            </span>
        </div>
        );
    };

    showOptionsPopOverJSX = () => {
        const { showOptions, isAttachmentPopOverOpen = false } = this.props;
        return (
            <div>
                {showOptions(isAttachmentPopOverOpen)}
            </div>
        );
    }

    renderToolPopoverJSX = () => {
        const { toolPopoverPosition } = this.state;
        return this.props.renderToolPopoverJSX({ toolPopoverRef: this.toolPopoverRef, toolPopoverPosition, handleToolMouseOut: this.handleToolMouseOut, removeSelectedTool: this.removeSelectedTool, hidePopup: () => this.setState({ showToolPopover: false }) });
    };

    getLabel = () => {
        const { tooltip, label, noFloatingLabel, aiEnabledReviewReply, disableLabel } = this.props;
        const isResellerDashbaord = window?.BE?.business?.type == "Reseller";
        const birdAISlug = window?.BE?.business?.accountType != 3 ? "BirdAI" : "AI";
        if (disableLabel) {
            return null;
        }
        return (
            <label key={`label_${this.getTextAreaId()}`} className={`${noFloatingLabel ? "label-outside" : ""}`}>
                {aiEnabledReviewReply ? (!isResellerDashbaord ? <span>Write a reply or generate one using {birdAISlug}</span> : "Write a reply to the review") : <span>{label}</span>}
                {
                    tooltip && <span className="bluejay-tooltip"><Tooltip
                        tooltipClass="inner"
                        text={tooltip}>
                        <i className={"icon-question"} />
                    </Tooltip>
                    </span>
                }
            </label>
        );
    }

    hideWarning = () => {
        this.setState({ showWarning: false });
        this.shouldUpdate = true;
    }

    getTextAreaBoxHeight = () => {
        let ele = document.getElementById(`${this.getTextAreaId()}-textAreaCounter`);
        return ele && ele.offsetHeight;
    };

    hideWarning = () => {
        this.setState({ showWarning: false });
        this.shouldUpdate = true;
    };

    saveCursorPosition = () => {
        let sel = document.getSelection();
        if (sel.anchorNode) {
            this.currentRange = sel.getRangeAt(0);
        }
    };

    positionCursorAfterMention = (elem, username) => {
        if (window.getSelection) {
            let range = document.createRange();
            let selection = window.getSelection();
            const contentNodes = Array.from(elem.childNodes);
            const contentNodesText = contentNodes.length > 0 ? contentNodes.map(element => element.textContent) : [];
            const idx = contentNodesText.length > 0 ? contentNodesText.indexOf(`@${username}`) : null;

            if (idx !== null) {
                range.setStart(elem.childNodes[idx + 1], 1);
                range.collapse(true);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    onClickofMentionName = (nameObj) => {
        // this.textAreaRef.focus();
        let item = {
            id: nameObj.id,
            channel: nameObj.key,
            value: nameObj.userName,
            name: nameObj.name,
            enabled: true,
            mentionValue: nameObj.mentionUserName
        };
        const { mentionsData, updateMasterPostState, setMentionsDataForEngage } = this.props;

        if (this.state.fromHighlightMentionBox && this.state.highlitedDiv) {
            let iconName;
            const { selectedChannel } = this.props;

            if (selectedChannel === "facebook") {
                iconName = "icon_phoenix-facebook-dark active";
            } else if (selectedChannel === "twitter") {
                iconName = "icon_phoenix-cross active";
            } else if (selectedChannel === "instagram") {
                iconName = "icon-instagram active";
            } else if (selectedChannel === "linkedin") {
                iconName = "icon-linkedin active";
            }

            const div = this.state.highlitedDiv;
            const mentionClickedPos = div.classList[0];
            let newarr = isEmpty(mentionsData) ? [] : [...mentionsData];
            newarr = [...newarr.slice(0, mentionClickedPos), item, ...newarr.slice(mentionClickedPos, newarr.length)];

            div.classList.add("token-count");
            div.removeAttribute("style");
            div.removeAttribute("class");
            div.removeAttribute("contenteditable");
            div.innerHTML = formatToHtml(`<token class=token contenteditable='false'><i class="${iconName}"></i>@${nameObj?.mentionUserName}</token>`);
            div.classList.add("token-cont");
            this.onChangeLocal(this.textAreaRef.innerHTML);
            updateMasterPostState && updateMasterPostState(formatToPlainText(document.getElementById(this.getTextAreaId()).innerHTML), "updateMentions", newarr);
            setMentionsDataForEngage && setMentionsDataForEngage(newarr);
        } else {
            let tokenRegex = /\[@(.*?)\]/g;
            let iconName = "";
            let entirestring = formatToPlainText(document.getElementById(this.getTextAreaId()).innerHTML, true);

            const xyz = entirestring.slice(0, this.mentionsStartIndex - 1);
            const count = (xyz.match(tokenRegex) || []).length;
            let newarr = isEmpty(mentionsData) ? [] : [...mentionsData];
            newarr = [...newarr.slice(0, count), item, ...newarr.slice(count, newarr.length)];

            let final = formatToHtml(entirestring.slice(0, this.mentionsStartIndex - 1)) + " " + `<div class="token-cont"><token class=token contenteditable='false'>@${nameObj.mentionUserName}</token></div>` + " " + formatToHtml((entirestring.slice(this.mentionsEndIndex + 1)));
            this.textAreaRef.innerHTML = final;
            updateMasterPostState && updateMasterPostState(formatToPlainText(final), "updateMentions", newarr);
            setMentionsDataForEngage && setMentionsDataForEngage(newarr);
            // insert icons for each token
            let divArr = (final).split(/<div/g);
            divArr = divArr.filter(item => item.indexOf(`='false'>@`) > -1);
            let finalModifiedString = "";
            divArr.forEach((item, index) => {
                let finalitem = item; let d;
                if (item.includes("@")) {
                    item = item.trim();
                    d = "<div" + " " + item;
                    if (!isEmpty(d)) {
                        let obj = newarr[index];
                        if (!isEmpty(obj)) {
                            if (obj.channel === "facebook") {
                                iconName = "icon_phoenix-facebook-dark active";
                            } else if (obj.channel === "twitter") {
                                iconName = "icon_phoenix-cross active";
                            } else if (obj.channel === "instagram") {
                                iconName = "icon-instagram active";
                            } else if (obj.channel === "linkedin") {
                                iconName = "icon-linkedin active";
                            }
                            let ab = d.split(`='false'>@`);
                            finalitem = `<div class="token-cont"><token class=token contenteditable='false'>` + `<i class="${iconName}"></i>@` + ab[1];
                        }
                    }
                }
                finalModifiedString = (finalModifiedString || final).replaceAll(d, finalitem);
            });
            this.textAreaRef.innerHTML = finalModifiedString;

            !setMentionsDataForEngage && highlightMentions(
                this.getTextAreaId(),
                this.props.showHighlight,
                null,
                this.props.selectedChannel,
                false,
                (mention) => this.mentionsKeyword = mention,
                () => this.setState({ showMentionPopover: true }),
                (div) => this.setState({ highlitedDiv: div }),
                () => this.setState({ fromHighlightMentionBox: true }),
                this.props.masterPostList,
                finalModifiedString,
                newarr
            );
            // this.positionCursorAfterMention(this.textAreaRef, nameObj.mentionUserName);
            this.onChangeLocal(finalModifiedString);
        }
        this.setState({ fromHighlightMentionBox: false });
        this.props.resetMentionsState();
    }

    closeMentionPopover = () => {
        if (this.state.fromHighlightMentionBox) {
            this.setState({ fromHighlightMentionBox: false, highlitedDiv: null });
            this.mentionsKeyword = "";
        }

        this.props.resetMentionsState();

        this.setState({
            showMentionPopover: false
        });
    }

    closeUrlShortenerDiv = () => {
        this.setState({
            urlShortenerDiv: false
        });
    };

    handleOnInput = (e) => {
        const { updateContentHTML, calculateCursorPosition } = this;
        const { isMentionsAvailable } = this.props;
        updateContentHTML(e);
        isMentionsAvailable && calculateCursorPosition(e);
    }

    updateAIGeneratedContentHTML = (updatedText) => {
        const { isCreatePost } = this.props;
        this.onChangeLocal(formatToPlainText(updatedText));
        if (isCreatePost) {
            // TODO-cursing move to end
            setTimeout(() => {
                moveTextAreaCursorAtEnd(this.getTextAreaId());
            }, 100);
        }
    }

    openPostLibModal = () => {
        this.setState({ showPostLibModal: true }, () => this.forceUpdate());
    }

    handleEventFromPostLibModal = (event) => {
        if (event?.data?.postLibId) {
            this.setState({ showPostLibModal: false }, () => {
                this.forceUpdate();
                this.props.setSelectedPostLibId && this.props.setSelectedPostLibId(event?.data?.postLibId);
            });
        }
    }
    handleSelectTemplate = (template) => {
        // Insert the template content into the text area
        const { contentEditable } = this.props;
        
        if (contentEditable) {
            // For content editable div (rich text)
            this.textAreaRef.innerHTML = template.content;
            this.onChangeLocal(this.textAreaRef.innerHTML);
        } else {
            // For regular textarea
            this.setState({ value: template.content }, () => {
                this.onChangeLocal(template.content);
            });
        }
        
        // Close the templates modal
        this.setState({ isTemplatesOpen: false });
        
        // Focus the text area
        if (this.textAreaRef) {
            this.textAreaRef.focus();
        }
    };

    stripHtml = (html) => {
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    }

    handleCreateTemplate = () => {
        // Here you would typically open a create template modal/form
    };
    
    handleAIToolName = (event) => {
        const tokenElement = event.target.closest("token[data-type=\"tool\"]");
        if (tokenElement) {
            const toolName = tokenElement.querySelector(".token-name")?.textContent?.trim() || tokenElement?.innerText?.trim();
            if (toolName) {
                const { setToolName, setTaskId } = this.props;
                setToolName(toolName);
                setTaskId();
            }
        }
    }; 

    renderAITools = () => {
        // backResponseToParent -- use to response updated data to the parent comp
        const { showHolidayPosts, showPostIdeas, showImages, showSummarize, showHashtags, txtVal, aiBtntooltipText, aiBtnTooltipPosition, disabledAllAIModifyOptions, aiSummaryGenerationCb, aiCreatePostGenerationCb, aiPopUpPosition, reGenerationCount, disableAiPopover = false, mentionsData, contentEditable = true, calculatePopoverPosition, disabledGenerateOptions = {}, isInbox = false, hideRephrasingOptions = false, isCreatePost = false, popOverDirection = "right", showReply = false, aiReviewReplyCb = null, showRegenerateOption = true, aiRegenerateCb = null, customCategory = null, openCallback = null, setIsAssistedByAI, aiToolsComponent = null } = this.props;
        const AIToolsComp = aiToolsComponent ? aiToolsComponent : null;
        const aiToolsProps = {
            backResponseToParent: this.updateAIGeneratedContentHTML,
            showHolidayPosts: showHolidayPosts,
            showPostIdeas: showPostIdeas,
            showImages: showImages,
            showHashtags: showHashtags,
            showSummarize: showSummarize,
            queryText: txtVal,
            aiBtnTooltipPosition: aiBtnTooltipPosition,
            aiBtntooltipText: aiBtntooltipText,
            disabledAllAIModifyOptions: disabledAllAIModifyOptions,
            aiSummaryGenerationCb: aiSummaryGenerationCb,
            aiCreatePostGenerationCb: aiCreatePostGenerationCb,
            position: aiPopUpPosition || "bottom-right",
            showRegenerateOption: reGenerationCount > 0 && showRegenerateOption,
            disableAiPopover: disableAiPopover,
            textBoxElemId: this.getTextAreaId(),
            mentionsData: mentionsData,
            isNotTextArea: contentEditable,
            calculatePopoverPosition: calculatePopoverPosition,
            disabledGenerateOptions: disabledGenerateOptions,
            isInbox: isInbox,
            hideRephrasingOptions: hideRephrasingOptions,
            isCreatePost: isCreatePost,
            popOverDirection: popOverDirection,
            showReply: showReply,
            aiReviewReplyCb: aiReviewReplyCb,
            aiRegenerateCb: aiRegenerateCb,
            customCategory: customCategory,
            openCallback: openCallback,
            fromPage: this.props.fromPage || "",
            mentionUserName: this.props.mentionUserName || "",
            reviewId: this.props?.aiObj?.id,
            setIsAssistedByAI: setIsAssistedByAI
        }
        return AIToolsComp ? (<AIToolsComp {...aiToolsProps} />) : null;
    }
    getReplySaveButton = () => {
        const { engageBtnCta = "Reply", disableReplyBtnForEngage, showReplyBtnFirstPosition = false } = this.props;
        return (
            <div className={`${Styles["social-replay-button"]} ${showReplyBtnFirstPosition ? "welcome-message-save-button" : ""}`}>
                <Button
                    theme={`${showReplyBtnFirstPosition ? "primary" : "link"}`}
                    label={engageBtnCta}
                    className=""
                    type="submit"
                    disabled={disableReplyBtnForEngage}
                    onClick={() => this.props.onSubmit()}
                />
            </div>
        );
    }

    render() {
       const {
            label,
            maxLen,
            rows = 1,
            placeholder,
            tokenMenu,
            tokenMenuType,
            error,
            allowEnter,
            disabled,
            contentEditable,
            tokenUp,
            customClass,
            top,
            emojiPicker,
            txtVal,
            customWidthOpen,
            emojiPickerPosition,
            hideCounter,
            showTokensInside,
            showAttachmentIcon,
            attachmentUploadCallback,
            attachmentErrorCallback,
            attachmentSupportedTypes,
            attachmentMaxSize,
            updateStateAssets,
            updatedAssets,
            multipleFiles,
            customSelectViewLabel,
            showDisabledAttachment,
            //disabledAttachmentTooltip,
            emojiToolTipPosition,
            showMaxSize,
            showErrorOutside,
            noFloatingLabel,
            topCount,
            noTextareaHeight,
            positionTooltip,
            alignTooltip,
            inboxFooterView,
            tokenCls = "token",
            showTokenSearch = true,
            showOnlyPinIcon,
            footerCustomStyles,
            attachmentJsx,
            dynamicPickerPositioning,
            scrollTokenListIntoView,
            browserOffline,
            attachmentResolution,
            doNotUploadImageAndVideoTogether,
            maxFilesAllowed,
            isValidateVideo,
            warningMessage,
            maxTextAreaHeight,
            attachmentsInEmojiPicker,
            renderMentionPopover,
            isMentionsAvailable = false,
            createPostInIframe,
            onClickofShortenLinkTooltip,
            forReviewReply,
            noInnerBorder,
            embedChatGPTMagicWand,
            isGeneratingAIResponse,
            aiObj,
            replyBoxContext,
            isVideoUploadRestricted,
            isImageUploadRestricted,
            enableFileUploaderPostView,
            counterFooterClassName,
            hideFileUploaderCameraIcon,
            displayLabel,
            allowResizer,
            showAITools,
            aiCtaLabel,
            resetComponentOnFileUpload,
            imageSizeLimit,
            videoSizeLimit,
            moduleName,
            replyBtnforEngage = false,
            cancelBtn = false,
            cancelBtnCta = "Cancel",
            disableCancelCTA = false,
            isSocialTextArea = false,
            reGeneratebutton,
            renderGenerateOrRegenerateButton,
            inboxPaymentJSX,
            inboxTemplateJSX,
            showRestoreOriginalContent,
            updateMasterPostState,
            showErrorBoundary,
            disablePersonalize = false,
            disablePersonalizeText,
            renderMediaSequence,
            showToolsDropdown = false,
            openToolDrawer = () => {},
            itemTextarea = false,
            hidePersonalize = false,
            isUrlShortenerAvailable = false,
            isLongLinkShortening,
            isShorteningComplete,
            defaultClassName,
            showReplyBtnFirstPosition = false,
            richText,
            showCloseReplyBtn,
            onCloseReplyCallback,
            ...otherProps
        } = this.props;
        const { showToken, value, showEmojiPicker, focus, showWarning, showPostLibModal, longUrlArr } = this.state;
        const errObject = !isEmpty(error) ? error.filter((x) => {
            return x.id == this.getTextAreaId();
        }) : [];
        const errMsg = !isEmpty(errObject) && (errObject[0]).msg;

        const {
            getTokenMenuData,
            getListKeys,
            textareaRef,
            handleTokenChange,
            getCharactersLeft,
            updateContentHTML,
            handleContentFocus,
            handleContentBlur,
            getTextAreaId,
            toggleEmojiPicker,
            attachButtonJSX,
            getLabel,
            getTextAreaBoxHeight,
            hideWarning,
            saveCursorPosition,
            onClickofMentionName,
            closeMentionPopover,
            handleOnInput,
            renderAITools,
            getPersonalizeTokenWarning
        } = this;

        const textAreaId = getTextAreaId();
        const className = `custom-scroll  ${contentEditable ? "txt-input-area" : ""} ${customClass ? customClass : ""} ${noTextareaHeight ? "no-height" : ""}  ${embedChatGPTMagicWand && txtVal ? "mb-30" : ""}`;
        const isNotEmpty = txtVal !== "";

        const secureTokensForDropdown = tokenMenuType === TOKEN_MENU_TYPE.FAQ ? this.secureTokensList : [];
        const personalizeTokenWarning = getPersonalizeTokenWarning();
        const generateAiCtaJSX = embedChatGPTMagicWand && (!isGeneratingAIResponse  ? <span  styleName="magic-wand" onClick={() => {
            return embedChatGPTMagicWand(this.getTextAreaId(), aiObj, replyBoxContext);
        }}>
            <img src={MagicWand} />
            {aiCtaLabel}
        </span> : <span className={Styles["generating-pill"]}>)
            <i className="icon_phoenix-magic inactive" />
            Generating
            <img src={Loader} />
        </span>);
        const customModuleEnabled = moduleName === "helpPanel" ? true : false;

        return (
            <div tabIndex="-1" style={{ pointerEvents: isGeneratingAIResponse ? "none" : "" }} className={`${reGeneratebutton ? Styles["ai-genrated-counter"] : ""} ${showErrorBoundary ? Styles["text-area-invalid-error"] : ""}`}>
                {noFloatingLabel ? getLabel() : null}
                <div id={`${textAreaId}-textAreaCounter`} className={`clearfix ${Styles["pos-rel"]} ${Styles["txtarea-input-cont"]} ${tokenUp ? " " + Styles["token-up"] : ""} ${browserOffline ? " " + Styles["browser-offline"] + " " : ""} ${inboxFooterView ? " " + Styles["inbox-footer-view"] + " " : ""} ${showTokensInside && isNotEmpty ? Styles["textarea-filled"] : ""} ${noFloatingLabel ? Styles["no-inside-label"] : ""}`}>
                    {!hideCounter &&
                        <div className={`${Styles["count-wrapper"]} ${topCount ? Styles["top-count"] : ""} counter-part`}>
                            {
                                getCharactersLeft()
                            }
                        </div>
                    }
                    <div
                        className={`${allowResizer ? "resizer-enabled" : ""} text-input-wrapper pos-rel ${Styles["text-input-wrapper"]} ${isSocialTextArea && !hideCounter ? "extra-bottom-sapcing" : ""} ${focus ? "text-focussed" + " " + Styles["text-focussed"] : ""} ${noTextareaHeight ? Styles["no-textarea-height"] : ""} ${isNotEmpty ? "textarea-filled" + " " + Styles["textarea-filled"] : ""} ${noInnerBorder ? Styles["no-inner-border"] : ""} ${reGeneratebutton ? Styles["ai-generated-design"] : ""}`}
                        // styleName={`text-input-wrapper ${noTextareaHeight ? "no-textarea-height" : ""} ${isNotEmpty ? "textarea-filled" : ""} ${focus ? "text-focussed" : ""} ${noInnerBorder ? "no-inner-border" : ""} ${reGeneratebutton ? "ai-generated-design" : ""}`} 
                        key={this.getTextAreaId() + "wrapper-parent"}
                        ref={(node) => {
                            this.resizerSec = node;
                        }}
                        onMouseDown={this.onResizerThumbDown}
                        onMouseUp={this.removeObserver}
                    >
                        {errMsg && !showErrorOutside && (
                            <div className={Styles["error-tooltips"]}>
                                <Tooltip
                                    hideOnScroll
                                    text={errMsg}
                                    align={alignTooltip}
                                    position={positionTooltip}
                                >
                                    <img src={AlertImg} alt="error" />
                                </Tooltip>
                            </div>)
                        }
                    {contentEditable ? <div id={"content-editable-div"} className={`scrollable-wrapper custom-scroll ${maxTextAreaHeight ? "textarea-max-height" : ""} ${isSocialTextArea ? "pos-rel" : ""}`} key={this.getTextAreaId() + "wrapper"} onMouseOver={this.handleAIToolName}>
                            <div id={this.getTextAreaId()}
                                onInput={handleOnInput}
                                onPaste={this.onPaste}
                                onKeyDown={this.validateDivContent}
                                // onKeyUp={isMentionsAvailable ? this.calculateCursorPosition : null}
                                data-placeholder={placeholder ? placeholder : ""}
                                ref={textareaRef}
                                dangerouslySetInnerHTML={{ __html: formatToHtml(value, false, tokenCls, secureTokensForDropdown, null, false , {}, itemTextarea) }}
                                contentEditable
                                className={className}
                                onFocus={handleContentFocus}
                                onBlur={handleContentBlur}
                                name={this.getTextAreaId()}
                                style={rows ? { height: (rows * 25) + "px" } : {}}
                                rows={rows}
                                key={this.getTextAreaId()}
                                tabIndex={1}
                                //onMouseUp={isUrlShortenerAvailable ? this.getLinksIdentified : null}
                                draggable={false}
                            />
                            {isMentionsAvailable && this.state.showMentionPopover && (
                                <div className={`${Styles["mention-default"]} mention-show`} id="mention-popover">
                                    {renderMentionPopover(onClickofMentionName, closeMentionPopover, this.mentionsKeyword, this.state.showMentionPopover,this.state.highlitedDiv)}
                                </div>
                            )}
                            {this.state.showToolPopover && this.renderToolPopoverJSX()}

                        </div>
                            :
                            <div className={`google-desc-aitext-container ${reGeneratebutton ? Styles["google-desc-aitext"] : "" }`}>
                                {richText ? <RichTextEditor
                                    theme="snow"
                                    ref={textareaRef}
                                    value={value}
                                    id={this.getTextAreaId() + "RichText"}
                                    onChange={(content, delta, source, editor) => {
                                        const plainText = editor.getText();
                                        if (typeof maxLen === "number" && plainText.length > maxLen) {
                                            const trimmed = editor.getText().slice(0, maxLen);
                                            this.setState({ value: trimmed }, () => {
                                                if (this.props.onChange) this.props.onChange(trimmed);
                                                if (typeof updateContentHTML === "function") updateContentHTML();
                                            });
                                            return;
                                        }
                                        this.setState({ value: content }, () => {
                                            if (this.props.onChange) this.props.onChange(content);
                                            if (typeof updateContentHTML === "function") updateContentHTML();
                                        });
                                    }}
                                    onFocus={this.handleContentFocus}
                                    onBlur={() => {
                                        this.handleContentBlur({ target: { value: this.stripHtml(value) } });
                                    }}
                                    autoFocus={!!this.props.textAreaDefaultFocus}
                                    readOnly={disabled}
                                    placeholder={placeholder ? placeholder : ""}
                                    className={className}
                                    style={{ minHeight: rows ? (rows * 25) + "px" : undefined }}
                                    modules={{
                                        toolbar: [
                                            ["bold", "italic", "underline", "link"]
                                        ]
                                    }}
                                    formats={[
                                        "bold", "italic", "underline",
                                        "link"
                                    ]}
                                /> :
                                    <textarea 
                                        {...otherProps}
                                        disabled={disabled}
                                        className={`${className} ${isNotEmpty ? Styles["textarea-filled"] : ""} ${forReviewReply ? Styles["forReviewReply"] : ""}`}
                                        id={this.getTextAreaId()}
                                        ref={textareaRef}
                                        name={label}
                                        rows={rows}
                                        value={value}
                                        maxLength={maxLen}
                                        onKeyDown={(e) => {
                                            if (e.keyCode === 13 && !allowEnter) {
                                                e.preventDefault();
                                                return false;
                                            }
                                        }}
                                        onInput={updateContentHTML}
                                        placeholder={placeholder ? placeholder : ""}
                                        onFocus={handleContentFocus}
                                        onBlur={handleContentBlur}
                                        onChange={() => {
                                            return false;
                                        }} 
                                    />}
                                {generateAiCtaJSX}
                                {reGeneratebutton &&  renderGenerateOrRegenerateButton(Loader, aiCtaLabel)}
                                {/* {embedChatGPTMagicWand && (!isGeneratingAIResponse  ? 
                                <span  className={Styles["magic-wand"]} onClick={() => {
                                    return embedChatGPTMagicWand(this.getTextAreaId(), aiObj, replyBoxContext);
                                }}>
                                    {/* <i className="icon_phoenix-magic inactive" /> 
                                    <img src={MagicWand}/>
                                    {aiCtaLabel}
                                </span> : <span className={Styles["generating-pill"]}>)
                                    <i className="icon_phoenix-magic inactive" />
                                Generating
                                    <img src={Loader}/>
                                </span>)}

                            {reGeneratebutton &&  renderGenerateOrRegenerateButton(Loader, aiCtaLabel)} */}
                            </div>
                        }
                        {!noFloatingLabel ? getLabel() : null}
                        {renderMediaSequence && renderMediaSequence()}
                    </div>
                    { personalizeTokenWarning }
                    {/* <!---Code for resizer icon here--> */}
                    {allowResizer ? <i className="icon_phoenix-resize resizer-thumb" id={`resizer-thumb-${this.getTextAreaId()}`} /> : null}
                    {!attachmentsInEmojiPicker && attachmentJsx && attachmentJsx}
                    {showWarning && <div className="warning-msg-wrapper">
                        <span><i className="icon_phoenix-warning-fill" />{warningMessage}<i className="icon_phoenix-enclose" onClick={() => hideWarning()} /></span>
                    </div>}

                    {showAttachmentIcon || emojiPicker || (tokenMenu && showToken) ?
                        <div className={`${Styles["counter-footer"]} ${footerCustomStyles ? footerCustomStyles : ""} ${counterFooterClassName || ""}`}>
                            <div className={Styles["emoji-file-wrap"]}>
                                {/* <div>
                                    {showAITools && !isSocialTextArea ? renderAITools() : null}
                                </div> */}
                                {inboxTemplateJSX ? inboxTemplateJSX : null}
                                {inboxPaymentJSX ? inboxPaymentJSX : null}
                            { hideFileUploaderCameraIcon ? null : enableFileUploaderPostView ? (
                                    showDisabledAttachment ? 
                                        this.popOverButtonJSX(true) : (<span className="attach-camera-wrapper">
                                            {this.popOverButtonJSX(false)}
                                            { this.showOptionsPopOverJSX()}
                                        </span>)
                                )
                                    :
                                    (showAttachmentIcon ?
                                        showDisabledAttachment ? attachButtonJSX(true) :
                                            (showOnlyPinIcon ? 
                                                attachButtonJSX() :
                                                <FileUploader
                                                    key={showDisabledAttachment ? "disabled-upl-key" : "upl-key"}
                                                    preview="off"
                                                    imageSizeLimit={customModuleEnabled ? imageSizeLimit : attachmentMaxSize}
                                                    videoSizeLimit={customModuleEnabled ? videoSizeLimit : attachmentMaxSize}
                                                    updateStateAssets={updateStateAssets}
                                                    updatedAssets={updatedAssets}
                                                    customselect
                                                    customSelectElement={this.attachButtonJSX()}
                                                    onChange={attachmentUploadCallback}
                                                    onError={attachmentErrorCallback}
                                                    //bodyClass={`imageUpload`}
                                                    multipleFiles={multipleFiles}
                                                    {...(showMaxSize && { maxSize: attachmentMaxSize })}
                                                    pdfSizeLimit={attachmentMaxSize}
                                                    acceptFileTypes={attachmentSupportedTypes}
                                                    doNotUploadImageAndVideoTogether={doNotUploadImageAndVideoTogether}
                                                    {...attachmentResolution}
                                                    isValidateVideo={isValidateVideo}
                                                    maxFilesAllowed={maxFilesAllowed}
                                                    isVideoUploadRestricted={isVideoUploadRestricted}
                                                    isImageUploadRestricted={isImageUploadRestricted}
                                                    resetComponentOnFileUpload={resetComponentOnFileUpload}
                                                />
                                            )
                                        : null
                                    )
                                }
                                {emojiPicker ?
                                    <div unselectable="on"
                                        id={`token-${textAreaId}-empoji-wrapper`}
                                        className={`${Styles["emoji-wrap"]} ${Styles["user-no-select"]}`}
                                    >
                                        <TextAreaEmojiPicker
                                            textAreaId={textAreaId}
                                            handleEmojiChange={handleTokenChange}
                                            toggleEmojiPicker={toggleEmojiPicker}
                                            showEmojiPicker={showEmojiPicker}
                                            emojiPickerPosition={emojiPickerPosition || "bottom"}
                                            emojiToolTipPosition={emojiToolTipPosition}
                                            createPostInIframe={createPostInIframe}
                                            dynamicPickerPositioning={dynamicPickerPositioning && getTextAreaBoxHeight() > 280}
                                            validateDivContent={this.validateDivContent}
                                            closeEmojiModal={this.closeEmojiModal}
                                            isSocialTextArea={isSocialTextArea}
                                            customToolTipText={this.props.customToolTipTextForEmoji}
                                            disableEmojiPicker={this.props.disableEmojiPicker}
                                        />
                                    </div>
                                    :
                                    null
                                }
                                {/* {!(compareWithBusinessType(window.BE.business, window.BE.business.type, { reseller: true })) && this.props.showPostLib && !createPostInIframe &&
                                    <Tooltip
                                        text={"Select from Post library"}
                                        position={"bottom-left"}
                                    >
                                        <i className="icon_phoenix-post-library" onClick={() => {
                                            this.openPostLibModal();
                                            window.addEventListener("message", this.handleEventFromPostLibModal);
                                            this.postLibModalListenerAdded = true;
                                            window.eventTracker && window.eventTracker.trackUserActivity("click:Post library icon");
                                        }} />

                                    </Tooltip>
                                } */}
                                {/* {showPostLibModal &&  <PostLibraryInModal
                                    showPostLibModal={showPostLibModal}
                                    callBackFunc={() => {
                                        this.setState({ showPostLibModal: false }, () => this.forceUpdate());
                                        window.removeEventListener("message", this.handleEventFromPostLibModal);
                                        this.postLibModalListenerAdded = false;
                                        window.eventTracker && window.eventTracker.trackUserActivity("modal-close:Post library modal");
                                    }}
                                />} */}
                                {showAITools ? renderAITools() : null}
                                 {!isLongLinkShortening && isUrlShortenerAvailable && longUrlArr?.length > 0 && (
                                    <Tooltip
                                        position={"bottom-left"}
                                        text={`Shorten link${longUrlArr.length > 1 ? "s" : ""}`}
                                    >
                                        <span className="shorten-links">
                                            <i className="icon_phoenix-shortern-link" onClick = {async() => { 
                                                await onClickofShortenLinkTooltip(longUrlArr);
                                                this.setState({ longUrlArr: [] });
                                            }
                                            }/>
                                            <span className="shorten-custom-tooltip">{`Shorten link${longUrlArr.length > 1 ? "s" : ""}`}</span>
                                        </span>
                                    </Tooltip>
                                )}
                                {isLongLinkShortening && <span className="loader-spinner" />}
                                {!isLongLinkShortening && isShorteningComplete && (
                                    <em className="icon_phoenix-success-fill shortern-link-success" />
                                )}
                                {!isLongLinkShortening && showRestoreOriginalContent && 
                                    <div onClick={async() => {
                                        await updateMasterPostState(null, "restoreOriginalContent");
                                        this.props.isUrlShortenerAvailable && this.getLongLink(this.textAreaRef.innerHTML);
                                    }}>
                                        <Tooltip
                                            text={"Restore initial content"}
                                            position={"bottom-left"}
                                        >
                                            <i className="icon_phoenix-arrow-clockwise" /> 
                                        </Tooltip>
                                    </div>
                                }
                            </div>
                            {
                                replyBtnforEngage && !showReplyBtnFirstPosition && (
                                    this.getReplySaveButton()
                                )
                            }
                            {
                                cancelBtn && (
                                    <div className={`${Styles["social-replay-button"]} ${showReplyBtnFirstPosition ? "welcome-message-cancel-button" : ""}`}>
                                        <Button 
                                            theme="link"
                                            label={cancelBtnCta}
                                            className="cancel-button"
                                            type="submit"
                                            disabled={disableCancelCTA}
                                            onClick={() => this.props.onCancel()}
                                        />
                                    </div>
                                )
                            }
                              {
                                showReplyBtnFirstPosition && (
                                    this.getReplySaveButton()
                                )
                            }
                                 <div className={`${showToolsDropdown ? "display-flex" : ""}`}>
                                {
                                    showToolsDropdown && <div className={`${Styles["tools-dropdown"]} mr-10`} onClick={openToolDrawer}>Tools <i className="icon-cheveron_open" /></div>
                                }
                                {
                                    tokenMenu && showToken && !hidePersonalize && <div unselectable="on"
                                        id={`token-${textAreaId}`}
                                        className={`add-token-dropdown ${errMsg ? " error" : ""}`}>
                                        <SingleSelect
                                            disableToggle={disablePersonalize}
                                            disablePersonalizeTooltipText={disablePersonalizeText}
                                            key={this.counter}
                                            options={getTokenMenuData()}
                                            listKeys={getListKeys()}
                                            selected={undefined}
                                            onChange={handleTokenChange.bind(null, "token")}
                                            placeholder={"Add token"}
                                            searchPlaceHolder="Search tokens"
                                            top={top}
                                            name="token"
                                            displayLabel={displayLabel ? displayLabel : "Personalize"}
                                            displayLabelCustomClass="label-capitalize"
                                            resetParam={{ value: "" }}
                                            customWidthOpen={customWidthOpen}
                                            showLinkDropdown
                                            className="link-dropdown"
                                            customSelectViewLabel={customSelectViewLabel}
                                            disableToggleOnLabelWhenOpen
                                            showSearch={showTokenSearch}
                                            scrollActionBoxIntoView={scrollTokenListIntoView}
                                            customOnClick={saveCursorPosition}
                                            supportMultipleList
                                            longTextEllipsis
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                        : null
                    }
                </div>
            </div>
        );
    }
}

TextAreaCounter.defaultProps = {
    showTokensInside: true,
    counterFooterClassName: "",
    aiGenerateSummaryCallback: () => { },
    showAiGenerateCta: false
};

TextAreaCounter.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    maxLen: PropTypes.number,
    txtVal: PropTypes.string,
    onChange: PropTypes.func,
    rows: PropTypes.number,
    placeholder: PropTypes.string,
    tooltip: PropTypes.node,
    error: PropTypes.object,
    tokenMenu: PropTypes.bool,
    validateCallback: PropTypes.func,
    allowEnter: PropTypes.bool,
    disabled: PropTypes.bool,
    contentEditable: PropTypes.bool,
    forReviewReply: PropTypes.bool,
    validation: PropTypes.array,
    parentId: PropTypes.string,
    customClass: PropTypes.string,
    tokenUp: PropTypes.bool,
    hideQuesMess: PropTypes.bool,
    callGa: PropTypes.func,
    top: PropTypes.bool,
    tokenMenuType: PropTypes.string,
    hideRating: PropTypes.bool,
    hideButtonLabel: PropTypes.bool,
    autoSize: PropTypes.bool,
    addTokenGaData: PropTypes.object,
    emojiPicker: PropTypes.bool,
    updateValue: PropTypes.bool,
    customWidthOpen: PropTypes.number,
    supportHTML: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    emojiPickerPosition: PropTypes.string,
    hideCounter: PropTypes.bool,
    showTokensInside: PropTypes.bool,
    showAttachmentIcon: PropTypes.bool,
    attachmentResolution: PropTypes.object,
    attachmentUploadCallback: PropTypes.func,
    attachmentErrorCallback: PropTypes.func,
    attachmentSupportedTypes: PropTypes.string,
    attachmentMaxSize: PropTypes.number,
    updatedAssets: PropTypes.array,
    multipleFiles: PropTypes.bool,
    updateStateAssets: PropTypes.bool,
    customSelectViewLabel: PropTypes.string,
    showDisabledAttachment: PropTypes.bool,
    disabledAttachmentTooltip: PropTypes.string,
    attachmentTooltipPosition: PropTypes.string,
    emojiToolTipPosition: PropTypes.string,
    showMaxSize: PropTypes.bool,
    allowSpecialKeysOnMaxLength: PropTypes.bool,
    resellerInfo: PropTypes.object,
    showErrorOutside: PropTypes.bool,
    noFloatingLabel: PropTypes.bool,
    attachmentTooltipText: PropTypes.string,
    extraToken: PropTypes.array,
    selectedExtraToken: PropTypes.func,
    hideReviewTemplate: PropTypes.bool, // To hide tokens for add/edit Review Template
    topCount: PropTypes.bool,
    noTextareaHeight: PropTypes.bool, //To support rows={1} and textinput like dimensions
    positionTooltip: PropTypes.string, //To align error tooltip inside box
    alignTooltip: PropTypes.string,
    tokenCls: PropTypes.string, //Custom token class
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    showTokenSearch: PropTypes.bool,
    inboxFooterView: PropTypes.bool,
    openSelectFileDialogueBox: PropTypes.func,
    showOnlyPinIcon: PropTypes.bool,
    footerCustomStyles: PropTypes.string,
    attachmentJsx: PropTypes.string,
    dynamicPickerPositioning: PropTypes.bool,
    scrollTokenListIntoView: PropTypes.bool,
    browserOffline: PropTypes.bool,
    doNotUploadImageAndVideoTogether: PropTypes.func,
    replaceTextByToken: PropTypes.bool, // replace text value inside text area with token selected
    counterWithText: PropTypes.bool,
    isValidateVideo: PropTypes.bool,
    maxFilesAllowed: PropTypes.number,
    showWarning: PropTypes.bool,
    warningMessage: PropTypes.string,
    maxTextAreaHeight: PropTypes.bool,
    handleOnPasteFailed: PropTypes.func,
    attachmentsInEmojiPicker: PropTypes.bool,
    renderMentionPopover: PropTypes.func,
    showMentionPopoverState: PropTypes.bool,
    mentionsData: PropTypes.array,
    setMentionsData: PropTypes.func,
    isMentionsAvailable: PropTypes.bool,
    openMentionPopover: PropTypes.bool,
    referralCodeToken: PropTypes.bool,
    templateType: PropTypes.string,
    referralTokens: PropTypes.bool,
    onEnterSubmit: PropTypes.bool,
    createPostInIframe: PropTypes.bool,
    renderUrlShortenerDiv: PropTypes.func,
    onClickofShortenLinkTooltip: PropTypes.func,
    isUrlShortenerAvailable: PropTypes.bool,
    showUrlShortenerPopoverState: PropTypes.bool,
    debounceDelay: PropTypes.number,
    noInnerBorder: PropTypes.bool,
    hideEmojiOnEscClick: PropTypes.bool,
    customText: PropTypes.string,
    embedChatGPTMagicWand: PropTypes.func,
    aiObj: PropTypes.object,
    replyBoxContext: PropTypes.object,
    dontUpdateInnerHtml: PropTypes.bool,
    clearAll: PropTypes.bool,
    isMaxCharRestricted: PropTypes.bool,
    isImageUploadRestricted: PropTypes.bool,
    isVideoUploadRestricted: PropTypes.bool,
    showOptions: PropTypes.func,
    enableFileUploaderPostView: PropTypes.bool,
    setIsAttachmentPopOverOpen: PropTypes.func,
    isAttachmentPopOverOpen: PropTypes.bool,
    counterFooterClassName: PropTypes.string,
    hideFileUploaderCameraIcon: PropTypes.bool,
    setTextAreaFocus: PropTypes.func,
    textAreaDefaultFocus: PropTypes.bool,
    displayLabel: PropTypes.string,
    showTwitter: PropTypes.bool,
    isGeneratingAIResponse: PropTypes.bool,
    module: PropTypes.string,
    aiCtaLabel: PropTypes.string,
    resetComponentOnFileUpload: PropTypes.bool,
    imageSizeLimit: PropTypes.number,
    videoSizeLimit: PropTypes.number,
    moduleName: PropTypes.string,
    donotClosePopover: PropTypes.bool,
    handleDonotClosePopover: PropTypes.func,
    replyBtnforEngage: PropTypes.bool,
    cancelBtn: PropTypes.bool,
    cancelBtnCta: PropTypes.string,
    engageBtnCta: PropTypes.string,
    disableReplyBtnForEngage: PropTypes.bool,
    setCloudMediaOptions: PropTypes.func,
    setComputerOptions: PropTypes.func,
    selLimitExceeded: PropTypes.bool,
    isSocialTextArea: PropTypes.bool,
    reGeneratebutton: PropTypes.bool,
    generateAiContent: PropTypes.func,
    reGenerationCount: PropTypes.number,
    isRegeneratingResponse: PropTypes.bool,
    renderGenerateOrRegenerateButton: PropTypes.func,
    showAiGenerateCta: PropTypes.bool,
    aiGenerateSummaryCallback: PropTypes.func,
    aiSummaryGenerationCb: PropTypes.func,
    aiCreatePostGenerationCb: PropTypes.func,
    aiPopUpPosition: PropTypes.string,
    disableAiPopover: PropTypes.bool,
    initialDesp: PropTypes.array,
    showHolidayPosts: PropTypes.bool,
    showPostIdeas: PropTypes.bool,
    showImages: PropTypes.bool,
    showSummarize: PropTypes.bool,
    showHashtags: PropTypes.bool,
    showAITools: PropTypes.bool,
    allowResizer: PropTypes.bool,
    aiBtnTooltipPosition: PropTypes.string,
    aiBtntooltipText: PropTypes.string,
    disabledAllAIModifyOptions: PropTypes.bool,
    updateMasterPostState: PropTypes.func,
    showRestoreOriginalContent: PropTypes.bool,
    selectedMasterPostSocialTab: PropTypes.string,
    showHighlight: PropTypes.bool,
    selectedChannel: PropTypes.string,
    calculatePopoverPosition: PropTypes.bool,
    disabledGenerateOptions: PropTypes.object,
    hideRephrasingOptions: PropTypes.bool,
    isInbox: PropTypes.bool,
    aiEnabledReviewReply: PropTypes.object,
    isCreatePost: PropTypes.bool,
    popOverDirection: PropTypes.string,
    showReply: PropTypes.bool,
    inboxPaymentJSX: PropTypes.node,
    inboxTemplateJSX: PropTypes.node,
    aiReviewReplyCb: PropTypes.func,
    showRegenerateOption: PropTypes.bool,
    aiRegenerateCb: PropTypes.func,
    customCategory: PropTypes.array,
    openCallback: PropTypes.func,
    toggleRestore: PropTypes.number,
    setToggleRestore: PropTypes.func,
    masterPostList: PropTypes.object,
    resetMentionsState: PropTypes.func,
    setMentionsDataForEngage: PropTypes.func,
    showMentionPopoverInViewport: PropTypes.func,
    fromPage: PropTypes.string,
    mentionUserName: PropTypes.string,
    addEventOnlyOnce: PropTypes.bool, // true in case multiple textareacounter on one page - add handleClickOutside only once
    setSelectedPostLibId: PropTypes.func,
    customToolTipTextForEmoji: PropTypes.string,
    disableEmojiPicker: PropTypes.bool,
    highlightError: PropTypes.bool,
    showPostLib:  PropTypes.bool,
    selectedPostLibId: PropTypes.number,
    customHtmlTokens: PropTypes.bool,
    disableLabel: PropTypes.bool,
    isCampaignTemplate: PropTypes.bool,
    showErrorBoundary: PropTypes.bool,
    replaceNewLineDivsByLineBreak: PropTypes.bool,
    showLocationUrlTokens: PropTypes.bool,
    disablePersonalize: PropTypes.bool,
    disablePersonalizeText:PropTypes.string,
    renderMediaSequence: PropTypes.func,
    isEditPost: PropTypes.bool,
    positionCursorAtEndIfTextPresent: PropTypes.bool,
    setIsAssistedByAI: PropTypes.func,
    aiPromptCb: PropTypes.func,
    showAiPrompts: PropTypes.bool,
    showToolsDropdown: PropTypes.bool,
    openToolDrawer: PropTypes.func,
    itemTextarea: PropTypes.bool,
    hidePersonalize: PropTypes.bool,
    openConfigureToolDrawer: PropTypes.func,
    isToolAdded: PropTypes.bool,
    setIsToolAdded: PropTypes.func,
    showTools: PropTypes.bool,
    selectedToolForConfig: PropTypes.string,
    isAIAgentTextArea: PropTypes.bool,
    isLongLinkShortening: PropTypes.bool,
    isShorteningComplete: PropTypes.bool,
    fromReplyTemplateBox: PropTypes.bool,
    aiReplyBox: PropTypes.bool,
    setToolName: PropTypes.func,
    setTaskId: PropTypes.func,
    renderToolPopoverJSX: PropTypes.func,
    disableCancelCTA: PropTypes.bool,
    defaultClassName: PropTypes.string,
    showReplyBtnFirstPosition: PropTypes.bool,
    showPersonalizeTokenWarning: PropTypes.bool,
    richText: PropTypes.bool,
    onCloseReplyCallback: PropTypes.func,
    showCloseReplyBtn: PropTypes.bool,
    isCampaignAiTemplate: PropTypes.bool
};


export default TextAreaCounter;
