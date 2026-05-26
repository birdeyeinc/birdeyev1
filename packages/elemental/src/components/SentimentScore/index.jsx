import React, { Component } from "react";
import Styles from "./SentimentScore.module.scss";
import PropTypes from "prop-types";
import Popover from "atoms/Popover";
import Tooltip from "atoms/Tooltip";
import Modal from "atoms/Modal";
import Button from "atoms/Button";
import Form from "components/Form";
import { isBoolean } from "lodash";
import { getEncodedStyleClass, getTimeDetails } from "utils/index";
import { red90 as errorRed, yellow90 as startActive, green100 as positiveSentiment, blue100 as brandColor, gray0 as white, red50 as redEC, yellow50 as yellowfff, green50 as lightGreenish } from "sass/js/colors";

const getStyle = str => getEncodedStyleClass(str, Styles);

class SentimentScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editedScore: this.props.score,
            isMouseEnter: false
        };
        this.mouseOverTimeout = null;
    }

    getSentimentDetails = () => {
        // From surveys
        //     NPS score of <2> from <customer satisfaction survey> - <Aug 9, 2020> 

        // From reviews
        //     Rated <3> stars on <Google> reviews - <Aug 9, 2020> [all except facebook]
        //     <Recommended, not recommended> on Facebook reviews - <Aug 9, 2020> [for facebook reviews]

        // From CX campaigns
        //     NPS score of <2> from CX <campaign name> - <Aug 9, 2020> 
        //     Rated <3> stars on CX <campaign name> - <Aug 9, 2020> 
        //     <positive, negative or neutral> sentiment from CX <campaign name> - <Aug 9, 2020> 

        const { source, sentimentType, eventDate, attributes, score } = this.props.popoverConfig;
        const { scoreLable = "NPS" } = this.props;
        let data = { title: sentimentType };
        let description = "";
        let timings = getTimeDetails(eventDate);
        let timeStamp = `${timings.date.split(",")[0]}, ${timings.year} `;
        let rating;
        if (attributes.rating >= 0) {
            rating = Math.floor(attributes.rating) == attributes.rating ? Math.floor(attributes.rating) : attributes.rating; // removed fractional part if 0
        }

        rating = Math.round(rating);

        switch (source) {
            case "survey":
                description = `<span>${scoreLable} score of ${rating} from <span class="${Styles['sentiment-bold'] || "el-sentiment-bold"}">${attributes.surveyName}</span></span>`;
                break;
            case "review":
                if (isBoolean(attributes.recommended)) {
                    description = `<span>${attributes.recommended ? "Recommended" : "Not recommended"} on ${attributes.reviewSource} reviews</span>`;
                } else {
                    description = `<span>Rated ${rating} star${rating > 1 ? "s" : ""} on <span title="${attributes.reviewSource}" class="${Styles['sentiment-bold'] || "el-sentiment-bold"}">${attributes.reviewSource} reviews</span></span>`;
                }
                break;
            case "campaign":
                switch (attributes.requestType) {
                    case "nps":
                        description = `<span>${scoreLable} score of ${rating} from CX <span class="${Styles['sentiment-bold'] || "el-sentiment-bold"}">${attributes.campaignName || "Request"}</span></span>`;
                        break;
                    case "star":
                        description = `<span>Rated ${rating} star${rating > 1 ? "s" : ""} on CX <span class="${Styles['sentiment-bold'] || "el-sentiment-bold"}">${attributes.campaignName || "Request"}</span></span>`;
                        break;
                    case "sentiment":
                        description = `${attributes.recommended == -1 ? "Negative" : attributes.recommended == 0 ? "Neutral" : "Positive"} sentiment from CX ${attributes.campaignName || "Request"}`;
                        break;
                }
                break;
            case "manual":
                description = `<span>${scoreLable} score ${score} set by <span class="${Styles['sentiment-bold'] || "el-sentiment-bold"}">${attributes.username}</span></span>`;
                break;
        }
        data.description = description ? `<span>${description} - ${timeStamp}</span>` : "";
        return data;
    };

    onMouseEnter = (isSentimentDescriptionAvailable) => {
        const { onMouseOver } = this.props;
        onMouseOver();
        isSentimentDescriptionAvailable && this.setState({ isMouseEnter: true });
    };

    onMouseLeave = () => {
        this.setState({ isMouseEnter: false });
        this.mouseOverTimeout && clearTimeout(this.mouseOverTimeout);
    };

    toggleEditModal = (open) => {
        this.setState({ editMode: open });
        this.setState({ editedScore: this.props.score });
    };

    onScoreChange = (evt) => {
        let val = evt.value;
        this.setState({ editedScore: val });
    };

    onFormSubmit = () => {
        const { onOverrideNPS } = this.props;
        const { editedScore } = this.state;
        let score = editedScore;
        onOverrideNPS({ score, sentimentType: this.props?.getSentimentDetailsBasedOnScore(score).type }, this.toggleEditModal.bind(this, false));
    };

    getColor = (i) => {
        if (i < 7) {
            return errorRed;
        } else if (i < 9) {
            return startActive;
        } else {
            return positiveSentiment;
        }
    }

    getColorClasses = (score) => {
        const opacity = this.state.isMouseEnter ? "" : "cc";
        if (score < 7) {
            return {
                color: errorRed,
                bg: redEC + opacity
            };
        } else if (score < 9) {
            return {
                color: startActive,
                bg: yellowfff + opacity
            };
        } else {
            return {
                color: positiveSentiment,
                bg: lightGreenish + opacity
            };
        }
    }

    render() {
        const { score, inTable, /* size = "", customClass = "",*/ enablePopover, popoverConfig, onMouseOver, /* enableManualEdit, customDescStyleName = "" */ popoverCustomClass, badgeCustomClass } = this.props;
        const { onMouseEnter, onMouseLeave, getSentimentDetails, toggleEditModal, onScoreChange, onFormSubmit, getColor } = this;
        const { editMode, editedScore } = this.state;
        const isValidScore = score !== undefined; // 0 is also a valid score

        let showLoader = enablePopover ? !popoverConfig || (popoverConfig && popoverConfig.isLoading) : false;
        const isSentimentDescriptionAvailable = !showLoader && enablePopover && getSentimentDetails()?.description ? true : false;

        let colorClasses = isValidScore ? this.getColorClasses(score) : {};
        const encodedStyle = getStyle(`${isValidScore ? (inTable ? "sentimentScore" : "") : "no-score"}`)
        const sentimentScoreBadge = (
            <Tooltip tooltipClass="inner"
                text="Click to edit experience score"
                hideOnScroll
                disabledTooltip={!isSentimentDescriptionAvailable}
                position="bottom-left"
            >
                <div
                    data-testid="el-test-sentiment-score"
                    className={`el-sentiment-score ${enablePopover ? "cursor-pointer" : "default-cursor"} ${badgeCustomClass} ${encodedStyle}`}
                    onMouseEnter={onMouseOver ? () => onMouseEnter(isSentimentDescriptionAvailable) : null}
                    onMouseLeave={onMouseOver ? onMouseLeave : null}
                    style={{
                        borderRadius: `100px`,
                        padding: "3px 6px",
                        fontSize: "9px",
                        fontWeight: "500",
                        lineHeight: "11px",
                        color: colorClasses.color,
                        backgroundColor: colorClasses.bg,
                        display: "inline-block",
                        marginTop: "1.6px"
                    }}
                    onClick={toggleEditModal.bind(this, true)}

                >
                    {isValidScore ? score : ""}
                </div>
            </Tooltip>

        );
        let displayTooltip = false;
        // let displaySentimentType = false;

        if (enablePopover) {
            // let showLoader = !popoverConfig || (popoverConfig && popoverConfig.isLoading);
            let sentimentDetails = !showLoader ? getSentimentDetails() : null;
            return (<Popover
                className={`dots-class ${popoverCustomClass}`}
                customWidth={44}
                fixed
                size="xx-large"
                custom={sentimentScoreBadge}
                includeBoxShadow
            >
                <ul className="mt-0 el-sentiment-score-enabled" data-testid="el-test-sentiment-score-enabled" /* "mt-0" */>
                    {!showLoader && sentimentDetails.description && <li>
                        <div className={getStyle(`popover-wrapper ${showLoader ? "loading" : ""}`)}>

                        </div>

                        {editMode && <Modal
                            dialogOptions={{
                                isOpen: editMode,
                                title: "",
                                onCloseModal: toggleEditModal.bind(this, false),
                                showCloseIcon: true,
                                dialogStyles: {
                                    content: {
                                        width: "395px",
                                        padding: "20px",
                                        borderRadius: "4px",
                                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)"
                                    }
                                },
                                classes: {
                                    closeIcon: {
                                        top: "28px",
                                        right: "21px",
                                        fontWeight: "500"
                                    }
                                }
                            }}
                            smallCloseIcon
                        >
                            <div data-testid="el-test-sentiment-score-modal" className={getStyle("edit-modal")}>
                                <h3 className={getStyle("title")}>
                                    <span className={getStyle("text")}>Override experience score</span>
                                    {displayTooltip && <Popover
                                        className={Styles["tooltip-popover"]}
                                        customWidth={44}
                                        fixed
                                        size="large"
                                        float="left"
                                        custom={<i className="icon_phoenix-question-circle" />}
                                        includeBoxShadow
                                    >
                                        <ul className="mt-0">
                                            <li>
                                                {this.props?.getSentimentFilterTooltipJsx()}
                                            </li>
                                        </ul>
                                    </Popover>}
                                </h3>
                                <Form
                                    id="overrideNPS"
                                    maxErrorsToShow={1}
                                    errorsInline
                                    showErrorsAtFormlevel
                                    onSubmit={onFormSubmit}
                                >
                                    <ul style={{ display: "flex" }} data-testid="el-test-sentiment-score-nps-list" className={getStyle("nps-score-list")}>
                                        {[...Array(11).keys()].map((i) => (
                                            <li key={`nps-${i}`}
                                                style={{
                                                    border: `1px solid ${editedScore == i ? brandColor : white}`,
                                                    color: getColor(i),
                                                    pointerEvents: editedScore == i ? "none" : "",
                                                    margin: editedScore == i ? "0px 2px" : ""
                                                }}
                                                onClick={() => onScoreChange({ value: i })}>
                                                <span>{i}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={getStyle("nps-review-sentiment")}><span dangerouslySetInnerHTML={{ __html: getSentimentDetails().description }} /></div>
                                    <div className={getStyle("nps-btnWrapper")}>
                                        <Button
                                            type={"link"}
                                            role={"button"}
                                            onClick={toggleEditModal.bind(this, false)}
                                            label={"Cancel"}
                                            className={Styles["cancel-nps"]}
                                        />
                                        <Button
                                            type="submit"
                                            id="submit-nps-score"
                                            role="submit"
                                            label={"Save"}
                                        />
                                    </div>
                                </Form>
                            </div>
                        </Modal>}
                    </li>}
                </ul>
            </Popover>);
        } else {
            return sentimentScoreBadge;
        }
    }
}

SentimentScore.propTypes = {
    score: PropTypes.number,
    inTable: PropTypes.bool,
    size: PropTypes.string, // small, large
    customClass: PropTypes.string,
    enablePopover: PropTypes.bool,
    popoverConfig: PropTypes.object,
    onMouseOver: PropTypes.func,
    enableManualEdit: PropTypes.bool,
    onOverrideNPS: PropTypes.func,
    customDescStyleName: PropTypes.string,
    popoverCustomClass: PropTypes.string,
    badgeCustomClass: PropTypes.string,
    getSentimentDetailsBasedOnScore: PropTypes.func,
    getSentimentFilterTooltipJsx: PropTypes.func,
    scoreLable: PropTypes.string
};

export default SentimentScore;
