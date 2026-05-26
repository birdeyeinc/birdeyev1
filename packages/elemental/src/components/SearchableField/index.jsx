import React from "react";
import PropTypes from "prop-types";
import { cloneDeep, map, each } from "lodash";
import Search from "atoms/Search";
import { getEncodedStyleClass, isEmailAddress } from "utils";
import Tooltip from "atoms/Tooltip";
import styles from "./SearchableField.module.scss";
import Tag from "atoms/Tag";

const getStyle = str => getEncodedStyleClass(str,styles);

class SearchableField extends React.Component {
    constructor(props) {
        super(props);
        this.shouldUpdate = false;
        this.searchField = null;
        this.state = {
            focus: false,
            notShowList: false
            //showLoader: false
        };
    }

    UNSAFE_componentWillMount() {
        if (this.props.autoFocus) {
            this.setState({focus: true});
        }
    }
    shouldComponentUpdate() {
        return this.shouldUpdate;
    }

    componentDidUpdate() {
        this.shouldUpdate = false;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { searchableFieldAPIList, autoFocus } = newProps;
        if (this.props.autoFocus != autoFocus && this.props.handleTagInputFocus) {
            this.setState({ focus: autoFocus });
        }
        if (newProps.searchableFieldAPIList.length <= 0) {
            this.shouldUpdate = true;
        } else if (this.props.searchableFieldAPIList !== searchableFieldAPIList ) {
            this.setState({notShowList: false});
            this.shouldUpdate = true;
        } else if (this.props.searchableFieldValue && this.props.searchableFieldValue.length != newProps.searchableFieldValue.length) {
            this.shouldUpdate = true;
            this.setState({notShowList: false});
        }
    }

    withinLimit() {
        const { limit, searchableFieldValue, customSearchHolder } = this.props;
        let withinLimit = limit === undefined;

        if (limit) {
            withinLimit = searchableFieldValue.length < limit ? true : false;
        }
        if (customSearchHolder) {
            withinLimit = true;
        }
        return withinLimit;
    }

    handleKeyDown = (e) => {
        const { searchableFieldValue, resetStateWithNewValues, scope, isTagDeletable = () => true, aiSuggestion = false } = this.props;
        const { keyCode, target } = e;
        const { isDuplicate } = this;
        const tags = [...searchableFieldValue];
        const newTag = target.value;
        let validValuesExist = true;

        /** Go through each of the existing tags as well */
        tags.forEach(obj => {
            if (obj.isValid !== undefined && !obj.isValid) {
                validValuesExist = false;
            }
        });

        if (keyCode === 13 || keyCode === 188 || keyCode === 9 || keyCode === 186 ) {

            if (newTag !== ""  && isEmailAddress(newTag)) {
                const emailObjt = {
                    ...target,
                    isValid: true,
                    value: newTag,
                    isDuplicate: isDuplicate(newTag)
                };
                tags.push(emailObjt);
                target.value = "";

                resetStateWithNewValues({
                    searchableFieldValue: tags,
                    searchableFieldAPIList: [],
                    scope,
                    searchFieldErr: validValuesExist ? "" : "inValid",
                    action: "addTag"
                });
                this.shouldUpdate = true;
            } else {
                resetStateWithNewValues({
                    searchableFieldValue: tags,
                    searchableFieldAPIList: [],
                    scope,
                    searchFieldErr: "inValid",
                    action: "addTag",
                    keyword: newTag
                });
                this.shouldUpdate = true;
            }

            e.preventDefault();
            return false;
        }

        if ((keyCode === 8 || keyCode === 46) && newTag === "") {
            if (tags.length > 0) {
                const lastTag = tags[tags.length - 1];
                if (isTagDeletable(lastTag?.value, aiSuggestion)) {
                    const itemToRemove = tags.pop();
                    resetStateWithNewValues({
                        searchableFieldValue: tags,
                        searchableFieldAPIList: [],
                        scope,
                        searchFieldErr: tags.length === 0 ? "empty" : (validValuesExist ? "" : "inValid"),
                        action: "removeTag",
                        itemRemoved: itemToRemove
                    });
                    this.shouldUpdate = true;
                }
            }
        }
    };

    isDuplicate = (newTag) => {
        const { uniqueKey, multiple } = this.props;
        const emailList = cloneDeep(this.props.searchableFieldValue);
        let index = -1;

        each(emailList, (obj, key) => {
            if (obj[uniqueKey]?.indexOf(newTag) > -1 && !multiple) {
                index = key;
            }
        });

        return index > -1;
    };

    onToFieldChange = (data) => {
        const { searchableFieldValue, scope, multiple } = this.props;
        let newList = cloneDeep(searchableFieldValue);
        let multipleList = [];
        const errExists = multiple ? map(data, "isValid").indexOf(false) > -1 : map(newList, "isValid").indexOf(false) > -1;
        const { isDuplicate } = this;

        if (!multiple && typeof data[0] === "object") {
            data = data[0];
        } else if (!multiple) {
            data = {
                value: data
            };
        }

        if (!multiple && data && data.value && data.value.length) {
            const emailObj = {
                ...data,
                isValid: true,
                isDuplicate: isDuplicate(data.value)
            };
            newList = newList.concat(emailObj);
        }

        if (multiple) {
            if (data && data.length) {
                data.map((obj) => {
                    const list = {
                        ...obj,
                        isValid: true,
                        isDuplicate: isDuplicate(obj.value)
                    };
                    return multipleList = multipleList.concat(list);
                });
            }
        }

        this.props?.resetStateWithNewValues?.({
            searchableFieldValue: multiple ? multipleList : newList,
            searchableFieldAPIList: [],
            searchFieldErr: errExists ? "inValid" : "",
            scope,
            action: "changedTag",
            isDataChange: data?.value?.length !== 0
        });
        this.shouldUpdate = true;
    };

    removeTag = (tag) => {
        const { searchableFieldValue, resetStateWithNewValues, scope, uniqueKey } = this.props;
        let emailList = [], errExist = false;

        emailList = cloneDeep(searchableFieldValue);
        const index = map(emailList, uniqueKey).indexOf(tag[uniqueKey] || tag["name"]);
        const itemToRemove = emailList[index];
        emailList.splice(index, 1);
        errExist = map(emailList, "isValid").indexOf(false) > -1;

        resetStateWithNewValues({
            searchableFieldValue: emailList,
            searchFieldErr: errExist ? "inValid" : "",
            searchableFieldAPIList: [],
            scope,
            action: "removeTag",
            itemRemoved: itemToRemove
        });
        this.shouldUpdate = true;
    };

    getItemsAsync = (value) => {
        this.props.getItemsAsync(value);
        this.shouldUpdate = true;
    };

    validateEmailOnBlur = (value) => {
        const {
            searchableFieldValue,
            resetStateWithNewValues,
            scope,
            customSearchHolder
        } = this.props;

        let searchArr = cloneDeep(searchableFieldValue);
        let isValid = value !== "" ? isEmailAddress(value) : true;
        let err = "";
        if (!customSearchHolder ) {
            each(searchArr, (obj) => {
                if (obj.isValid !== undefined && !obj.isValid) {
                    isValid = false;
                }
            });
        }

        if (value) {
            const searchOb = {
                value,
                isValid
            };
            if (!customSearchHolder) {
                searchArr = searchArr.concat(searchOb);
            } else {
                searchArr = [];
                searchArr.push(searchOb);
            }
        }

        err = isValid ? "" : "inValid";

        if (searchableFieldValue.length === 0) {
            err = !isValid ? "inValid" : (value !== "" && isValid ? "" : "empty");
        }

        this.setState({
            focus: false
        });

        this.shouldUpdate = true;

        resetStateWithNewValues({
            searchableFieldValue: searchArr,
            searchFieldErr: err,
            searchableFieldAPIList: [],
            scope,
            action: "blurTag",
            keyword: value
        });
    };

    scrollIntoView = () => {
        this.searchField.scrollTop = this.searchField.scrollHeight;
        if (!this.props.handleTagInputFocus) {
            this.setState({
                focus: true
            });
        }
        this.shouldUpdate = true;
    };
    resetErrorState = () => {
        const { searchableFieldValueReset } = this.props;
        searchableFieldValueReset();
    }
    render() {
        const self = this;
        const { scrollIntoView } = this;

        const { focus } = this.state;

        const {
            searchableFieldValue,
            searchableFieldAPIList,
            searchFieldErr,
            fieldLabel,
            tooltipAllowed,
            searchFieldErrMessage,
            placeholder,
            showLoader,
            customSearchHolder,
            resetErrorState,
            sellerInfo,
            resetTextValue,
            NotFoundPlaceholder,
            renderCustomSuggestionsView,
            multiple,
            isItemIdInteger,
            preSelectedItem,
            maxSelected,
            disabled,
            customClassName,
            customAutoCompleteClasses,
            customModuleName,
            clearAllSelected,
            handleSelectCb,
            handleTagInputFocus,
            showClearAllAsCross,
            showLazyLoadLoader,
            clearText,
            showSuggestions, 
            showAlreadySelectedTags,
            addEllipsis,
            fromContact,
            showNoDataFound,
            isSetInitial
        } = this.props;

        const shouldShowClearButton = () => {
            const { searchableFieldValue, aiSuggestion = false, isTagDeletable = () => true } = this.props;
            if (searchableFieldValue.length === 0) return false;
            if (searchableFieldValue.length === 1) {
                const tag = searchableFieldValue[0];
                return isTagDeletable(tag?.value, aiSuggestion);
            }
            if (searchableFieldValue.length > 1) {
                const allTagsNonDeletable = searchableFieldValue.every((tag) => !isTagDeletable(tag.value, aiSuggestion));
                if (allTagsNonDeletable) return false;
                return true;
            }        
            return false;
        };

        return (
            <div id="searchable_field_wrapper" data-testid="el-test-searchable-field" className={`el-searchable-field-wrapper ${customClassName} ${getStyle(`search-fieldwrap ${disabled ? "disabled" : ""}`)}`}>
                {tooltipAllowed ?
                    <label className="title-label-bluejay">{fieldLabel}
                        <span className="bluejay-tooltip">
                            <Tooltip
                                text="Replies can only be sent to one email."
                                tooltipClass="inner">
                                <i className="icon-question"/>
                            </Tooltip>
                        </span>
                    </label>
                    : ""}
                <div
                    className={`${"" + (searchFieldErr == "empty" ? "error-border" : "" )} ${getStyle("box")}`}
                    onClick={scrollIntoView}
                    ref={(input) => {
                        self.searchField = input;
                    }}
                    data-testid='tags-search-wrapper'
                >

                    {map(searchableFieldValue, (tag) => {
                        tag.value = addEllipsis ? (tag.value.substring(0,10) + (tag.value.length > 10 ? "..." : "")) : tag.value;
                        return (
                            customSearchHolder ?
                                "" :
                                <Tag
                                    title={tag.value || tag.name}
                                    onClick={(e) => e.stopPropagation()}
                                    onRemove={() =>  this.removeTag(tag)}
                                    size="small"
                                    isValidEmail={!(tag?.isExternal)}
                                    isApprovalTab={this.props?.isApprovalTab}
                                    aiSuggestion={this.props?.aiSuggestion}
                                    isTagDeletable={this.props?.isTagDeletable}
                                />  
                        );
                    })}
                    {clearAllSelected  && shouldShowClearButton() ? showClearAllAsCross ? <span className="custom-clearbtn" onClick={clearAllSelected}><i className="icon_phoenix-enclose"/></span> : <span className="custom-clearbtn" onClick={clearAllSelected}>Clear All </span> : "" }

                    {self.withinLimit() && // if a limit is specified and number of values exceeds limit disable the search
                        <Search
                            delay={300}
                            onItemsChanged={self.onToFieldChange.bind(self)}
                            items={searchableFieldAPIList}
                            initialSelected={isSetInitial ? searchableFieldValue : []}
                            maxSelected={maxSelected || 1}
                            placeholder={placeholder ? placeholder : ""}
                            searchKey="value"
                            handleKeyDown={self.handleKeyDown.bind(self)}
                            getItemsAsync={self.getItemsAsync.bind(self)}
                            clearText={clearText}
                            blurCallback={self.validateEmailOnBlur.bind(self)}
                            focus={focus}
                            showLoader={showLoader}
                            searchFieldErr={searchFieldErr}
                            searchFieldErrMessage={searchFieldErrMessage}
                            customSearchHolder={customSearchHolder}
                            resetErrorState={resetErrorState}
                            sellerInfo={sellerInfo}
                            resetTextValue={resetTextValue}
                            NotFoundPlaceholder={NotFoundPlaceholder}
                            renderCustomSuggestionsView={renderCustomSuggestionsView}
                            /*TODO this is invalid value of autocomplete as 
                            *<b>autocomplete=off</b> was failing to skip autofill in chrome browser
                            *it will not break in legacy browsers i.e. ie/ff/safari
                            */
                            autoComplete="no" 
                            multiple={multiple}
                            isItemIdInteger={isItemIdInteger}
                            preSelectedItem={preSelectedItem}
                            searchableFieldValue={searchableFieldValue}
                            customAutoCompleteClasses={customAutoCompleteClasses}
                            customModuleName={customModuleName}
                            handleSelectCb={handleSelectCb}
                            handleFocus={handleTagInputFocus}
                            showLazyLoadLoader={showLazyLoadLoader}
                            showSuggestions={showSuggestions}
                            showAlreadySelectedTags={showAlreadySelectedTags}
                            fromContact={fromContact}
                            showNoDataFound={showNoDataFound}
                        />
                    }

                </div>
                {/*
                TO DO:
                there was no need of any checks here
                directly pass errorMessage prop and print
                */}

                <label className={`el-searchablefield-error-txt ${getStyle("error-txt")}`}>
                    {searchFieldErr == "empty" ?
                        searchFieldErrMessage ? searchFieldErrMessage :
                            "Please include at least one email address that will receive any replies to this email." :
                        (searchFieldErr == "inValid") ? "Invalid email. Please try with a different email." : searchFieldErrMessage
                    }
                </label>
            </div>
        );
    }
}

SearchableField.propTypes = {
    searchableFieldValue: PropTypes.array,
    searchableFieldAPIList: PropTypes.array,
    searchFieldErr: PropTypes.string,
    scope: PropTypes.string,
    getItemsAsync: PropTypes.func,
    resetStateWithNewValues: PropTypes.func,
    fieldLabel: PropTypes.string,
    limit: PropTypes.number,
    tooltipAllowed: PropTypes.bool,
    searchFieldErrMessage: PropTypes.string,
    placeholder: PropTypes.string,
    showLoader: PropTypes.bool,
    customSearchHolder: PropTypes.object,
    resetErrorState: PropTypes.func,
    searchableFieldValueReset: PropTypes.func,
    sellerInfo: PropTypes.object,
    resetTextValue: PropTypes.bool,
    NotFoundPlaceholder: PropTypes.string,
    renderCustomSuggestionsView: PropTypes.func,
    uniqueKey: PropTypes.string,
    multiple: PropTypes.bool,
    isItemIdInteger: PropTypes.bool,
    preSelectedItem: PropTypes.array,
    maxSelected: PropTypes.number,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    hasValidationErr: PropTypes.func,
    customClassName: PropTypes.string,
    customAutoCompleteClasses: PropTypes.string,
    customModuleName: PropTypes.string,
    clearAllSelected: PropTypes.func,
    handleSelectCb: PropTypes.func,
    handleTagInputFocus: PropTypes.func,
    showClearAllAsCross: PropTypes.bool,
    showLazyLoadLoader: PropTypes.bool,
    clearText: PropTypes.bool,
    showSuggestions: PropTypes.bool,
    showAlreadySelectedTags: PropTypes.bool,
    addEllipsis: PropTypes.bool,
    fromContact: PropTypes.bool,
    showNoDataFound: PropTypes.func,
    isApprovalTab: PropTypes.bool,
    isSetInitial: PropTypes.bool,
    aiSuggestion: PropTypes.bool,
    isTagDeletable: PropTypes.func
};

SearchableField.defaultProps = {
    uniqueKey: "value",
    multiple: false,
    isItemIdInteger: true,
    preSelectedItem: [],
    showSuggestions: true,
    showAlreadySelectedTags: true,
    clearText: true,
    addEllipsis: false
};

export default SearchableField;
