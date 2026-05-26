import AlertImg from 'assets/images/error.svg';
import SearchableField from "components/SearchableField"
import Tag from 'atoms/Tag';
import Tooltip from 'atoms/Tooltip';
import { isEmpty, last, trim } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './EmailCreator.scss';

const EmailCreator = ({
    accessUsersList,
    BE,
    getListOfUsers,
    initialEmailSubject,
    initialEmailBody,
    initialUserRecipientValue,
    showNonSearchableTagInput,
    emailRecipientNoSearchVal: propEmailRecipientNoSearchVal,
    saveEmailComponentData,
    emailSubjectPlaceHolder,
    maxRecipients,
    contentEditableFalse,
    disableEmailBodyEdit,
    searchShowLoader,
    searchableFieldPlaceholder = '',
    configLabel,
    onErrorsChange
}) => {
    const [userSuggestionList, setUserSuggestionList] = useState([]);
    const [searchableFieldValue, setSearchableFieldValue] = useState(initialUserRecipientValue || []);
    const [showLoader, setShowLoader] = useState(searchShowLoader);
    const [emailSubject, setEmailSubject] = useState(initialEmailSubject || '');
    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    const [emailBody, setEmailBody] = useState(initialEmailBody || '');
    const [emailRecipientNoSearchVal, setEmailRecipientNoSearchVal] = useState(propEmailRecipientNoSearchVal || '');
    const [tagCustomErr, setTagCustomErr] = useState(false);
    const [searchUserStr, setSearchUserStr] = useState('');
    const [subjectError, setSubjectError] = useState('');

    const sellerInfo = useMemo(
        () => ({
            reseller: BE.business.accountType !== 1,
            name: BE.business.resellerInfo?.name || BE.business.brandInfo?.name || '',
        }),
        [BE.business],
    );

    useEffect(() => {
        if (showNonSearchableTagInput) {
            onTagInputChange('', emailRecipientNoSearchVal || '');
        }
        if (isEmpty(initialUserRecipientValue)) {
            setEmailErrorMsg('Please enter at least 1 recipient');
        }
    }, [showNonSearchableTagInput, emailRecipientNoSearchVal, initialUserRecipientValue]);

    useEffect(() => {
        setUserSuggestionList(
            accessUsersList
                ?.filter((user) => !searchableFieldValue.some((tag) => tag.emailId === user.emailId))
                .map((user, index) => ({
                    index,
                    value: user.emailId,
                    role: user.role,
                    name: user.name,
                    userId: user.id,
                    pristineValue: user.emailId,
                    pristineName: user.name,
                })) || [],
        );
    }, [accessUsersList]);

    useEffect(() => {
        setShowLoader(searchShowLoader);
        if (searchShowLoader) {
            setUserSuggestionList([]);
        }
    }, [searchShowLoader]);

    useEffect(() => {
        const errors = {
            emailError: !!emailErrorMsg,
            subjectError: !!subjectError
        };
    
        onErrorsChange(errors, onEmailSubjectBlur);
    }, [emailErrorMsg, subjectError]);

    const getUserList = useCallback(
        (value) => {
            if (value) {
                getListOfUsers(trim(value));
            } else {
                setUserSuggestionList([]);
            }
        },
        [getListOfUsers],
    );

    const handleEmailSubjectChange = useCallback((event) => {
        const value = event.target.value;
        setEmailSubject(value);
    }, []);

    const handleEmailBodyChange = useCallback((event) => {
        const value = event.target.value;
        setEmailBody(value);
    }, []);

    const onEmailSubjectBlur = useCallback(() => {
        if (!emailSubject.trim()) {
            setSubjectError('Email Subject cannot be blank');
        } else {
            setSubjectError('');
        }
    }, [emailSubject]);

    const sendDataToParentComponent = useCallback(() => {
        const emailReciepent = showNonSearchableTagInput ? changeTagsInputToEmailObj(emailRecipientNoSearchVal) : searchableFieldValue;
        saveEmailComponentData({
            emailReciepent,
            emailBody: emailBody.replaceAll('\n', '<br>').replaceAll('&nbsp;', ' '),
            emailSubject: emailSubject.replaceAll('\n', '').replaceAll('&nbsp;', ' ').replaceAll('<br>', ''),
        });
    }, [emailBody, emailSubject, emailRecipientNoSearchVal, searchableFieldValue, showNonSearchableTagInput, saveEmailComponentData]);

    const changeTagsInputToEmailObj = useCallback((emailStr) => {
        return emailStr
            .split(',')
            .map((email) => ({
                emailId: email.trim(),
                userId: null,
            }))
            .filter((email) => email.emailId);
    }, []);

    const onTagInputChange = useCallback(
        (tags, value) => {
            setEmailRecipientNoSearchVal(value);
            setTagCustomErr(!value);
            setEmailErrorMsg(value ? '' : 'Please enter at least 1 recipient');
            sendDataToParentComponent();
        },
        [sendDataToParentComponent],
    );

    const resetSearchableFieldValues = useCallback(
        (val) => {
            let displayValue = '';
            let emailId = '';
            let userId = '';
            const lastItem = last(val.searchableFieldValue);

            let isAddCase = val.searchFieldErr !== 'inValid' && (val.action === 'blurTag' || val.action === 'addTag' || val.action === 'changedTag');
            if (isAddCase) {
                const userExist = userSuggestionList.some((user) => {
                    const exists = lastItem && user.pristineValue === lastItem.value;
                    if (exists) {
                        displayValue = user.pristineName;
                        emailId = user.value;
                        userId = user.userId;
                    }
                    return exists;
                });

                if (!userExist) {
                    if (val.action === 'addTag' && val.searchFieldErr != 'inValid') setSearchableFieldValue((current) => current.slice(0, -1));
                    return; // Exit early since no valid user was added
                }
            }
            const tempSearchableFieldValue = val.searchableFieldValue.filter((selected) => !selected.isDuplicate && selected.isValid);

            if (tempSearchableFieldValue.length && isAddCase) {
                const updatedLastItem = { ...last(tempSearchableFieldValue), value: displayValue, emailId, userId };
                tempSearchableFieldValue[tempSearchableFieldValue.length - 1] = updatedLastItem;
            }

            setEmailErrorMsg(tempSearchableFieldValue.length ? '' : 'Please enter at least 1 recipient');
            setSearchableFieldValue(tempSearchableFieldValue);
            setUserSuggestionList([]); // Assuming you want to reset this list after updates
            sendDataToParentComponent();
        },
        [userSuggestionList, sendDataToParentComponent],
    );

    const renderCustomSuggestionsView = useCallback(
        (itemParam) => {
            const item = { ...itemParam };

            if (searchUserStr) {
                const replaceStr = searchUserStr.replace(/,/g, '|');
                const reg = new RegExp(`(${replaceStr})`, 'gi');
                item.name = item.name.replace(reg, `<b class="suggestions-highlight">$&</b>`);
                item.value = item.value.replace(reg, `<b class="suggestions-highlight">$&</b>`);
            }

            return (
                <div className="suggestions-details">
                    <div className="suggestions-name" dangerouslySetInnerHTML={{ __html: item.name }} title={item.pristineName} />
                    <div className="suggestions-email" dangerouslySetInnerHTML={{ __html: item.value }} title={item.pristineValue} />
                </div>
            );
        },
        [searchUserStr],
    );
    return (
        <div className="email-creator-container">
            <h1 className="container-title">{configLabel || 'Send email to'}</h1>
            <div className="field-box">
                <div className={emailErrorMsg ? 'invalid-error' : ''}>
                    <label className="label-outside">Recipients</label>
                    <div className="pos-rel">
                        {showNonSearchableTagInput ? (
                            <Tag
                                name="email-tags"
                                placeholder="Enter email addresses separated by a comma"
                                onTagsUpdate={onTagInputChange}
                                defaultValue={emailRecipientNoSearchVal}
                                customErrorMessage={emailErrorMsg}
                                customError={tagCustomErr}
                                labelText="Recipients"
                                tooltipPosition="left"
                            />
                        ) : (
                            <SearchableField
                                label="Recepitent"
                                searchableFieldAPIList={userSuggestionList}
                                searchableFieldValue={searchableFieldValue}
                                getItemsAsync={getUserList}
                                resetStateWithNewValues={resetSearchableFieldValues}
                                placeholder={searchableFieldPlaceholder || 'Name'}
                                searchFieldErrMessage=""
                                searchFieldErr=""
                                limit={maxRecipients || 50}
                                showLoader={showLoader}
                                NotFoundPlaceholder="We can’t find this user in your account"
                                sellerInfo={sellerInfo}
                                disabled={searchableFieldValue.length === 50}
                                renderCustomSuggestionsView={renderCustomSuggestionsView}
                            />
                        )}
                        {emailErrorMsg && (
                            <div className="error-message">
                                <Tooltip align="left" position="top" text={emailErrorMsg}>
                                    <img src={AlertImg} alt="Error" />
                                </Tooltip>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-20 pos-rel">
                <label className="label-outside">
                    Subject<sup>*</sup>
                </label>
                <textarea
                    id="emailSubject"
                    name="emailSubject"
                    className={`search-fieldwrap sub-field ${subjectError ? 'error-field' : ''}`}
                    placeholder={emailSubjectPlaceHolder || 'Enter email subject'}
                    value={emailSubject}
                    onChange={handleEmailSubjectChange}
                    onBlur={onEmailSubjectBlur}
                    readOnly={contentEditableFalse}
                    rows="1"
                    required
                ></textarea>
                {subjectError && (
                    <div className="error-message">
                        <Tooltip align="left" position="top" text={subjectError}>
                            <img src={AlertImg} alt="Error" />
                        </Tooltip>
                    </div>
                )}
            </div>

            {!disableEmailBodyEdit && (
                <div className="mb-20 pos-rel message-txt-box">
                    <label className="label-outside">Message</label>
                    <textarea
                        id="emailBody"
                        name="emailBody"
                        className={`search-fieldwrap`}
                        placeholder="Write your email here..."
                        value={emailBody}
                        onChange={handleEmailBodyChange}
                        readOnly={contentEditableFalse}
                        rows="4"
                        required
                    ></textarea>
                </div>
            )}
        </div>
    );
};

EmailCreator.propTypes = {
    accessUsersList: PropTypes.array,
    BE: PropTypes.object.isRequired,
    getListOfUsers: PropTypes.func.isRequired,
    initialEmailSubject: PropTypes.string,
    initialEmailBody: PropTypes.string,
    initialUserRecipientValue: PropTypes.array,
    showNonSearchableTagInput: PropTypes.bool,
    emailRecipientNoSearchVal: PropTypes.string,
    saveEmailComponentData: PropTypes.func.isRequired,
    emailSubjectPlaceHolder: PropTypes.string,
    maxRecipients: PropTypes.number,
    contentEditableFalse: PropTypes.bool,
    disableEmailBodyEdit: PropTypes.bool,
    searchableFieldPlaceholder: PropTypes.string,
    configLabel: PropTypes.string,
    onErrorsChange: PropTypes.func.isRequired
};

export default EmailCreator;