import React, { Component } from "react";
import PropTypes from "prop-types";
import { cloneDeep, last } from "lodash";
import FormInput from "atoms/FormInput";
import Tooltip from "atoms/Tooltip";
import AlertImg from "assets/images/error.svg";
import SearchableField from "components/SearchableField";
import Style from "./EmailReviews.module.scss";
import Button from "atoms/Button";
class EmailReviews extends Component {
    constructor(props) {
        super(props);
        let { user } = props.BE;
        let userValue = `${user.firstName} ${user.lastName} <${user.emailId}>`;
        this.state = {
            searchableFieldAPIList: [],
            searchableFieldValue: [{
                isDuplicate: false,
                isValid: true,
                value: userValue
            }],
            showLoader: false,
            emailSubject: props.emailSubject,
            emailErrorMsg: "",
            subjectErrorMsg: ""
        };
        this.searchUserStr = "";
    }

    componentWillMount() {
        const { BE } = this.props;
        this.sellerInfo = {
            reseller: BE.business.accountType !== 1,
            name: BE.business.resellerInfo ? BE.business.resellerInfo.name : BE.business.brandInfo ? BE.business.brandInfo.name : ""
        };
    }

    componentWillReceiveProps(nextProps) {
        const { accessUsersList } = nextProps;
        const { searchableFieldValue } = this.state;
        let userList = [];
        (accessUsersList && accessUsersList.length) && accessUsersList.forEach(user => {
            let userAdded = false;
            searchableFieldValue.forEach(tag => {
                if (tag.value.indexOf(user.emailId) > -1) {
                    userAdded = true;
                }
            });
            if (!userAdded) {
                userList.push(user);
            }
        });
        this.setState({
            searchableFieldAPIList: this.mapUserAsPerComponent(userList),
            showLoader: false
        });

    }

    mapUserAsPerComponent(data) {
        let newUserList = [];
        data.map((d, i) => {
            newUserList.push({
                index: i,
                value: d.emailId,
                role: d.role,
                name: d.name,
                userId: d.userId || d.id,
                pristineValue: d.emailId,
                pristineName: d.name
            });
        });
        return newUserList;
    }

    getListItemsAsync = (value) => {
        if (value) {
            const { getListOfUsers } = this.props;
            this.setState({
                showLoader: true,
                searchableFieldAPIList: []
            }, () => {
                getListOfUsers(value.trim());
            });
            this.searchUserStr = value;
        } else {
            this.setState({ searchableFieldAPIList: [] });
            this.searchUserStr = "";
        }
    };

    onReplyToUpdateLocal = (val) => {
        const { searchableFieldValue, searchableFieldAPIList } = this.state;
        let displayValue = "";
        let isAddCase = false;
        let lastItem = last(val.searchableFieldValue);
        let emailId = "";
        let userId = "";

        if (val.searchFieldErr != "inValid" && (val.action === "blurTag" || val.action === "addTag" || val.action === "changedTag")) {
            let userExist = false;
            isAddCase = true;
            searchableFieldAPIList.forEach(user => {
                if (lastItem && user.pristineValue === lastItem.value) {
                    userExist = true;
                    displayValue = `${user.pristineName} <${user.pristineValue}>`;
                    emailId = user.value;
                    userId = user.userId;
                }
            });
            if (!userExist) {
                if (val.action === "addTag" && val.searchFieldErr != "inValid") {
                    searchableFieldValue.splice(-1);
                    this.setState({ searchableFieldValue });
                }
                return;
            }
        }

        let tempSearchableFieldValue = [];
        val.searchableFieldValue.forEach(selected => {
            if (!selected.isDuplicate && selected.isValid) {
                tempSearchableFieldValue.push(selected);
            }
        });

        if (tempSearchableFieldValue.length) {
            if (isAddCase) {
                let tempValue = last(tempSearchableFieldValue);
                tempValue.value = displayValue;
                tempValue.emailId = emailId;
                tempValue.userId = userId;
                tempSearchableFieldValue.splice(-1, 1, tempValue);
            }
            this.setState({ emailErrorMsg: "" });
        } else if (!tempSearchableFieldValue.length) {
            this.setState({ emailErrorMsg: "Please enter atleast one email id" });
        }
        this.setState({
            showLoader: false,
            searchableFieldValue: tempSearchableFieldValue,
            searchableFieldAPIList: []
        });
    }

    handleEmailSubjectChange = (event) => {
        const value = event.target.value;
        this.setState((prevState) => {
            prevState["emailSubject"] = value;
            prevState["errorSubject"] = value ? false : true;
            prevState["subjectErrorMsg"] = "Please enter Email Subject";
            return prevState;
        });
    }

    emailAllLoc = () => {
        const { searchableFieldValue, emailSubject, errorSubject } = this.state;
        if (errorSubject) return;
        this.setState({ emailErrorMsg: "" });
        let emailIds = searchableFieldValue.map(id => {
            let tempValue = id.value.substring(id.value.indexOf("<") + 1);
            return tempValue.substring(0, tempValue.length - 1);
        });
        if (!(emailIds && emailIds.length)) {
            this.setState({ emailErrorMsg: "Please enter atleast one email id" });
            return;
        }
        this.props.emailAccuracyData({
            emailIds,
            emailSubject,
            searchableEmailIds: searchableFieldValue
        });
        this.searchUserStr = "";
    };

    renderCustomSuggestionsView = (itemParam) => {
        let item = cloneDeep(itemParam);
        let initials = item.name.split(" ");
        initials = (initials[0] ? initials[0].substring(0, 1).toUpperCase() : "") + (initials[1] ? initials[1].substring(0, 1).toUpperCase() : "");
        if (this.searchUserStr) {
            const replaceStr = this.searchUserStr.replace(/,/g, "|");
            const reg = new RegExp(`(${replaceStr})`, "gi");
            item.name = item.name.replace(reg, `<b class={Style["suggestions-hightlight"]}>$&</b>`);

            if (item.value) {
                item.value = item.value.replace(reg, `<b class={Style["suggestions-hightlight"]}>$&</b>`);
            }
        }
        return (
            <div>
                <div className={Style["suggestions-initials"]}>
                    {initials}
                </div>
                <div className={Style["suggestions-details"]}>
                    <div className={Style["suggestions-name"]} dangerouslySetInnerHTML={{ __html: item.name }} title={item.pristineName} />
                    <div className={Style["suggestions-email"]} dangerouslySetInnerHTML={{ __html: item.value }} title={item.pristineValue} />
                </div>
            </div>
        );
    }

    render() {
        const { searchableFieldAPIList, searchableFieldValue, showLoader, emailSubject, errorSubject, subjectErrorMsg, emailErrorMsg } = this.state;
        const { onCloseDialog } = this.props;
        return (
            <div className={`el-custom-modal-field-box ${Style["custom-modal-field-box"]}`}>
                <div className={Style["field-box"]}>
                    <div className={emailErrorMsg ? "invalid-error" : ""}>
                        <label className="label-outside">Send to</label>
                        <div className="pos-rel">
                            <SearchableField
                                searchableFieldAPIList={searchableFieldAPIList}
                                searchableFieldValue={searchableFieldValue}
                                getItemsAsync={this.getListItemsAsync}
                                resetStateWithNewValues={this.onReplyToUpdateLocal.bind(this)}
                                searchFieldErrMessage=""
                                searchFieldErr=""
                                placeholder={"Enter name or email"}
                                limit={20}
                                showLoader={showLoader}
                                NotFoundPlaceholder="We can’t find this user in your account"
                                sellerInfo={this.sellerInfo}
                                renderCustomSuggestionsView={(item) => this.renderCustomSuggestionsView(item)}
                            />
                            {emailErrorMsg ?
                                <div className="error-tooltips">
                                    <Tooltip
                                        hideOnScroll
                                        text={emailErrorMsg}
                                    >
                                        <img src={AlertImg} alt="error" />
                                    </Tooltip>
                                </div>
                                : null
                            }
                        </div>
                    </div>
                </div>
                <div className={`mb-20 pos-rel ${Style["field-box"]}`}>
                    <FormInput
                        id="subject"
                        name="subject"
                        autocomplete="off"
                        value={emailSubject}
                        label="Subject"
                        placeholder=""
                        className={`${Style["formInputStyle"]} ${errorSubject ? "invalid-error" : ""}`}
                        onChange={this.handleEmailSubjectChange.bind(this)}
                        required
                        errorMessages={{
                            required: "Please enter Email Subject"
                        }}
                    />
                    {errorSubject ?
                        <div className="error-tooltips with-label">
                            <Tooltip
                                hideOnScroll
                                text={subjectErrorMsg}
                            >
                                <img src={AlertImg} alt="error" />
                            </Tooltip>
                        </div>
                        : null
                    }
                </div>
                <div className="btnWrapper">
                    <Button label="Cancel" type="link" data-type="cancel" onClick={onCloseDialog} />
                    <Button type="primary" label="Send" onClick={this.emailAllLoc} />
                </div>
            </div>
        );
    }
}

EmailReviews.propTypes = {
    accessUsersList: PropTypes.array,
    BE: PropTypes.object,
    getListOfUsers: PropTypes.func,
    emailAccuracyData: PropTypes.func,
    onCloseDialog: PropTypes.func,
    emailSubject: PropTypes.string
};

export default EmailReviews;