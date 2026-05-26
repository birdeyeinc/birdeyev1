import React, { Component } from "react";
import PropTypes from "prop-types";
import Tag from "atoms/Tag";
import Styles from "./TagInput.module.scss";
import AlertImg from "assets/images/error.svg";
import Tooltip from "atoms/Tooltip";
import Button from "atoms/Button";
import { isEmpty } from "lodash";
import { red90 } from "sass/js/colors";
import { getEncodedStyleClass } from "utils/index";

const getStyle = (str) => getEncodedStyleClass(str, Styles);

class TagsInput extends Component {

    constructor(props) {
        super(props);
        const { defaultValue
        } = props;
        this.state = {
            tags: defaultValue ? defaultValue : [],
            errorState: {
                msg: "One of the email id is invalid",
                showError: false
            },
            hasFocus: false
        };
    }

    componentWillReceiveProps(newProps) {
        if (this.props.forceUpdateCounter !== newProps.forceUpdateCounter) {
            this.setState({
                tags: newProps.defaultValue ? newProps.defaultValue : []
            });
        }

        if (this.props.defaultValue && newProps.defaultValue
            && this.props.defaultValue.length !== newProps.defaultValue.length) {
            const oldValLen = this.props.defaultValue.length;
            this.setState({ tags: newProps.defaultValue }, () => {
                if (this.props.scrollToBottomOnAdd && oldValLen != 0) {
                    this.customScrollRef.scrollTop = this.customScrollRef.scrollHeight;
                }
            });
        }
    }

    handleClick = (e) => {
        const { tags } = this.state;

        const { onTagsUpdate, name, supportTextTags } = this.props;
        if ((supportTextTags )) {
            e.target.value = "";

            this.setState({ 
                tags,
                errorState:{
                    showError: false
                },
                hasFocus: false
            }, () => {
                onTagsUpdate(name, tags, {showError: false}); 
            });
        }
    }

    handleBlur = (e) => {
        let newTag = e.target.value;

        if (newTag.trim() === "" && !this.props.allowBlank) {
            return;
        }
        
        const { tags } = this.state;
        const { errorMsg = "One of the email id is  invalid", onTagsUpdate, name, supportTextTags, isMendatoryBeEmail, skipSFTPValidation } = this.props;
        const validateSftpState = () => {
            const currTags = this.state.tags;
            const nonBrdeyeEmailExist = currTags.filter((item) => item.indexOf("@birdeye.com") > -1).length !== currTags.length;
            
            this.setState({
                errorState:{
                    showError: nonBrdeyeEmailExist ? false : true,
                    msg: (!nonBrdeyeEmailExist && currTags.length > 0) ? "There should be at least one non-birdeye email is required" : errorMsg
                },
                hasFocus: false
            }, () => {
                let errorStateNew = this.state.errorState;
                let tagNew = currTags;                
                onTagsUpdate(name, tagNew, errorStateNew); 
            });
        };
        let validEmail = newTag && this.isEmailAddress(newTag);

        if ((supportTextTags || validEmail) && e.target.value.length) {
            const updatedTags = [...tags, newTag];
            e.target.value = "";

            if (isMendatoryBeEmail && !skipSFTPValidation) {
                this.setState({ tags: updatedTags }, () => {
                    validateSftpState();
                });
            } else {
                this.setState({
                    tags: updatedTags,
                    errorState:{
                        showError: false
                    },
                    hasFocus: false
                }, () => {
                    onTagsUpdate(name, updatedTags, {showError: false});
                });
            }

        } else if (e.target.value.length) {
            this.setState({ 
                tags,
                errorState:{
                    showError: true,
                    msg: errorMsg ? errorMsg : "One of the email id is  invalid"
                },
                hasFocus: false
            }, () => {
                let errorStateNew = this.state.errorState;
                let tagNew = this.state.tags;                
                onTagsUpdate(name, tagNew, errorStateNew); 
            });
        } else {
            !skipSFTPValidation && validateSftpState();
        }
    }

    handlePaste = (e) => {
        const { onlyBreakOnEnterTabAndComma, supportTextTags } = this.props;
        if (!onlyBreakOnEnterTabAndComma || !supportTextTags) return;

        const pastedText = e.clipboardData.getData('text');
        if (!pastedText.includes(",")) return;

        e.preventDefault();

        const { tags } = this.state;
        const { name, onTagsUpdate } = this.props;
        const newTags = pastedText.split(",").map(t => t.trim()).filter(t => t !== "");
        const updatedTags = [...tags, ...newTags];

        this.setState({
            tags: updatedTags,
            errorState: { showError: false }
        }, () => {
            onTagsUpdate(name, updatedTags, { showError: false });
        });
    }

    handleKeyDown = (e) => {
        const { keyCode, target } = e;
        const { tags } = this.state;
        const { errorMsg, name, onTagsUpdate, supportTextTags, onlyBreakOnEnterAndTab, onlyBreakOnEnterTabAndComma, allowBlank } = this.props;

        let newTag = target.value.trim();

        if (newTag === "" && !allowBlank) {
            return false;
        }

        const toBreak = onlyBreakOnEnterTabAndComma ? (
            keyCode === 13 || keyCode === 9 || keyCode === 188
        ) : onlyBreakOnEnterAndTab ? (
            keyCode === 13 || keyCode === 9
        ) : (
            keyCode === 13 || keyCode === 188 || keyCode === 9 || keyCode === 186 || keyCode === 32
        );

        if (toBreak) {

            if (newTag !== ""  &&  (supportTextTags ? true : this.isEmailAddress(newTag))) {
                const updatedTags = [...tags, newTag];
                target.value = "";

                this.setState({
                    tags: updatedTags,
                    errorState:{
                        showError: false
                    }
                }, () => {
                    onTagsUpdate(name, updatedTags, {showError: false});
                });
            } else if (e.target.value.trim().length) {
                this.setState({ 
                    tags,
                    errorState:{
                        showError: true,
                        msg: errorMsg ? errorMsg : "One of the email id is  invalid"
                    }
                }, () => {
                    let errorStateNew = this.state.errorState;
                    let tagNew = this.state.tags;                
                    onTagsUpdate(name, tagNew, errorStateNew); 
                });
            }

            e.preventDefault();
            return false;
        }

        if (keyCode === 8 && newTag === "" && tags.length > 0) {
            const updatedTags = tags.slice(0, -1);

            this.setState({
                tags: updatedTags,
                errorState:{
                    showError: false
                }
            }, () => {
                onTagsUpdate(name, updatedTags, {showError: false});
            });
        }
    };

    isEmailAddress (mail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (pattern.test(mail)) {
            return (true);
        }
        return (false);
    }

    removeAllTags = () => {
        let { tags, errorState } = this.state;
        const { name, onTagsUpdate } = this.props;
        tags = [];
        this.setState({ tags: []}, () => {
            onTagsUpdate(name, tags, errorState);
        });
    }

    removeTag = (indexToRemove) => {
        const { tags, errorState } = this.state;
        const { name, onTagsUpdate } = this.props;
        const oldTags = [...tags];
        const tag = tags[indexToRemove];
        const newTags = tags.filter((_, i) => i !== indexToRemove);
        this.setState({ tags: newTags }, () => {
            onTagsUpdate(name, newTags, tag, oldTags, errorState);
        });
    };

    assignNode = (node) => {
        this.node = node;
    };

    assignCustomScrollRef = (node) => {
        this.customScrollRef = node;
    }

    showBorderOnInputFocus = () => {
        this.setState({
            hasFocus: true
        });
    };

    render() {
        const { tags, errorState, hasFocus } = this.state;
        const { 
            placeholder, 
            color, 
            customError, 
            customErrorMessage, 
            labelText, 
            autoFocus, 
            showErrorOutside, 
            showLabel, 
            noHeight, 
            allowBlank, 
            tooltipPosition, 
            insightsInput, 
            onBlur, 
            onFocus,
            showAsTextArea,
            customPlaceholderText,
            showPinIcon = false,
            pinIconHtml,
            tagConfig = {
                variantType: "tonal",
                color: "grey"
            }

        } = this.props;
        return (
            <div data-testid="el-test-tagsinput" className={`${(errorState && errorState.showError) || customError ? `el-tag-input-invalid-error ${getStyle("invalid-error")}` : ""} tags-input-wrapper el-tags-input`}>
                <div style={{
                    borderColor: errorState && errorState.showError ? red90 : color
                }} onClick={() => {
                    this.node.focus();
                }}>
                    {showLabel ? <label className="label-outside">{labelText ? labelText : "Enter email addresses separated by a comma"}</label> : null}
                    <div className={`${insightsInput ? "insight-input-box" : ""} ${tags.length > 0 ? "inc-height" : ""} ${autoFocus ? "blue-border inc-height" : ""} ${getStyle(insightsInput ? `${tags.length > 0 ? "inc-height" : ""} form-input-box ${autoFocus ? "blue-border" : ""} ${noHeight ? "no-height" : ""}` : `${tags.length > 0 ? "inc-height" : ""} form-input-box ${hasFocus ? "blue-border" : ""} ${noHeight ? "no-height" : ""}`)}`}>
                        {showAsTextArea && (
                            <div className={`${insightsInput ? "placeholder-box" : ""}`}>
                                <span>{customPlaceholderText ? customPlaceholderText : `Type or select keywords`}</span>
                                <Button className={`${tags.length > 0 ? "clear-btn" : ""}`} onClick={this.removeAllTags}>Clear all</Button>
                            </div>
                        )}
                        <div className={`${getStyle("tag-wrap")} el-tag-input-wrap custom-scroll`} ref={this.assignCustomScrollRef}>
                            { tags.length > 0 ?
                                tags.map((tag, index) => {
                                    if (allowBlank) {
                                        return (
                                            <Tag
                                                title={tag}
                                                key={index}
                                                onRemove={() => this.removeTag(index)}
                                                size="small"
                                                variantType={tagConfig.variantType}
                                                color={tagConfig.color}
                                            />
                                        );
                                    } else {
                                        if (!isEmpty(tag)) {
                                            return (
                                                <Tag
                                                    title={tag}
                                                    key={index}
                                                    onRemove={() => this.removeTag(index)}
                                                    size="small"
                                                    variantType={tagConfig.variantType}
                                                    color={tagConfig.color}
                                                />
                                            );
                                        }
                                    }
                                })
                                :
                                null
                            }
                            <input
                                ref={this.assignNode}
                                placeholder={placeholder}
                                type="text"
                                data-testid="el-test-ti-input"
                                onBlur={insightsInput ? onBlur ? onBlur : null : this.handleBlur}
                                onClick={insightsInput ? this.handleClick : null}
                                onKeyDown={(event) => {
                                    const k = event ? event.which : window.event.keyCode;

                                    if (k === 32 && event.target.value.trim() === "" && !allowBlank) {
                                        event.preventDefault();
                                        return false;
                                    } else {
                                        this.handleKeyDown(event);
                                    }
                                }}
                                autoFocus={autoFocus}
                                onFocus={onFocus ? onFocus : this.showBorderOnInputFocus}
                                onPaste={this.handlePaste}
                            />
                        </div>
                        {
                          showPinIcon && <div className="error-tooltips">{pinIconHtml}</div>
                        }
                        {(errorState && errorState.showError) || customError ?
                            (
                                showErrorOutside ? <ul data-testid="el-test-ti-outside-error" className={`validation-errors ${getStyle("validation-errors")}`}><li>{ errorState.showError ? errorState.msg : customErrorMessage }</li></ul> :
                                    <div data-testid="el-test-ti-inside-error" className="error-tooltips"><Tooltip hideOnScroll text={errorState.showError ? errorState.msg : customErrorMessage} position={tooltipPosition ? tooltipPosition : "bottom"}> <img src={AlertImg} alt="error"/> </Tooltip></div>
                            ) 
                            :
                            ""}
                    </div>
                </div>
            </div>
        );
    }
}

TagsInput.propTypes = {
    placeholder: PropTypes.string,
    color: PropTypes.string,
    defaultValue: PropTypes.string,
    name: PropTypes.string,
    onTagsUpdate: PropTypes.func,
    errorMsg: PropTypes.string,
    customError: PropTypes.bool,
    customErrorMessage: PropTypes.string,
    labelText: PropTypes.string,
    autoFocus: PropTypes.bool,
    showErrorOutside: PropTypes.bool,
    showLabel: PropTypes.bool,
    supportTextTags: PropTypes.bool,
    noHeight: PropTypes.bool,
    onlyBreakOnEnterAndTab: PropTypes.bool,
    onlyBreakOnEnterTabAndComma: PropTypes.bool,
    allowBlank: PropTypes.bool,
    forceUpdateCounter: PropTypes.bool,
    tooltipPosition: PropTypes.string,
    insightsInput: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    scrollToBottomOnAdd: PropTypes,
    showAsTextArea: PropTypes,
    customPlaceholderText: PropTypes.string,
    isMendatory: PropTypes.bool,
    emptyErrorMessage: PropTypes.string,
    isMendatoryBeEmail: PropTypes.bool,
    skipSFTPValidation: PropTypes.bool,
    showPinIcon:PropTypes.bool,
    pinIconHtml:PropTypes.node,
    tagConfig: PropTypes.shape({
        variant: PropTypes.oneOf(["outlined", "filled","tonal","token"]),
        color: PropTypes.oneOf(["red","grey","green","yellow","purple","blue"]),
    })
};

TagsInput.defaultProps = {
    showLabel: true,
    allowBlank: true
};

export default TagsInput;