import React from "react";
import { map, isEmpty, forEach } from "lodash";
// Round icons colored
// import RoundFacebook from "assets/images/social/circle-colored-icons/facebook.svg"
// import RoundTwitter from "assets/images/social/updated-social-icons/UpdatedTwitterIcon.svg";
// import RoundInstagram from "assets/images/social/circle-colored-icons/instagram.svg";
// import RoundLinkedin from "assets/images/social/circle-colored-icons/linkedin.svg";
// import RoundGoogle from "assets/images/social/circle-colored-icons/google.svg";
// import RoundYoutube from "assets/images/social/circle-colored-icons/youtubeActive.svg";
// import RoundApple from "assets/images/social/circle-colored-icons/apple.svg";
// import RoundTiktok from "assets/images/social/updated-social-icons/UpdatedTiktokIcon.svg";

// import FacebookUpdateIcon from "assets/images/social/Facebook.svg";
// import TwitterUpdateIcon from "assets/images/social/Twitter.svg";
// import InstagramUpdateIcon from "assets/images/social/Instagram.svg";
// import LinkedinUpdateIcon from "assets/images/social/Linkedin.svg";
// import GoogleUpdateIcon from "assets/images/social/Google.svg";
// import YoutubeUpdateIcon from "assets/images/social/youtubeActive.svg";
// import AppleUpdateIcon from "assets/images/social/apple-show-icon.svg";
// import TiktokUpdateIcon from "assets/images/social/updated-social-icons/UpdatedTiktokIcon.svg";

// //Gray Scale Icons
// import grayScaleFacebook from "assets/images/social/gray-scale-icons/gray-facebook.svg";
// import grayScaleTwitter from "assets/images/social/gray-scale-icons/gray-twitter.svg";
// import grayScaleInstagram from "assets/images/social/gray-scale-icons/gray-instagram.svg";
// import grayScaleLinkedin from "assets/images/social/gray-scale-icons/gray-linkedin.svg";
// import grayScaleGoogle from "assets/images/social/gray-scale-icons/gray-google.svg";
// import grayScaleYoutube from "assets/images/social/gray-scale-icons/youtubeActive.svg";
// import grayScaleApple from "assets/images/social/gray-scale-icons/gray-apple.svg";
// import grayScaleTiktok from "assets/images/social/updated-social-icons/UpdatedTiktokIcon.svg";

export const formatToCustomToken = (val, showOption = false, tokenMenuType) => {
    let customToken = [];
    val.map((token) => {
        customToken.push(
            {
                value: `[${token.fieldName}]`,
                label: token.fieldName,
                id: token.id,
                type: token.listType || "customer",
                tokenType: token?.tokenType?.toLowerCase() || "",
                optionJSX: showOption && getValueJsx(token, tokenMenuType),
                ...(token?.locationCustomField && {locationCustomField: true})
            }
        );
    });
    return customToken;
};

const getValueJsx = (val, tokenMenuType) => {
    const getExampleJsx = (value) => {
        switch (value) {
            case "date": return "E.g. 03/12/2020";
            case "number": return "E.g. 211063";
            case "yesno": return "E.g. Yes";
            case "currency": return "E.g. $1235";
            case "text": return "E.g. text";
            case "json": return "E.g. Information list";
            case "list_text": return "E.g. text1, text2";
            default: return "E.g. ---";
        }
    };
    // This event trigger when we want to show sample value in token example
    const getSampleValue = (value) => {
        return "E.g. " + value;
    };

    return (
        <div className="token-option">
            <p className="display-flex display-flex-start">
                {val.fieldName && <strong>{val.fieldName}</strong>}
                {val.secure && tokenMenuType === "FAQ" && <span className="icon_phoenix-lock-fill ml-5 fz-12" />}
            </p>
            {val.type && <span>{getExampleJsx(val.type)}</span>}
            {val.sampleValue && <span>{getSampleValue(val.exType)}</span>}
        </div>);
};

export const getSocialIconWithImg = (channel, returnOnlyIconSrc, type) => {
    let icon;
    return icon;
    // switch (channel?.toUpperCase()) {
    //     case CHANNELS_CONSTANTS.SOCIAL_TYPE_TWITTER:
    //         icon = type == "round" ? RoundTwitter : type == "grayscale" ? grayScaleTwitter : TwitterUpdateIcon;

    //         break;
    //     case CHANNELS_CONSTANTS.SOCIAL_TYPE_FACEBOOK:
    //         icon =  type == "round" ? RoundFacebook : type == "grayscale" ? grayScaleFacebook : FacebookUpdateIcon;
    //         break;
    //     case CHANNELS_CONSTANTS.SOCIAL_TYPE_GOOGLE:
    //         icon =  type == "round" ? RoundGoogle : type == "grayscale" ? grayScaleGoogle : GoogleUpdateIcon;
    //         break;
    //     case CHANNELS_CONSTANTS.SOCIAL_TYPE_LINKEDIN:
    //         icon =  type == "round" ? RoundLinkedin : type == "grayscale" ? grayScaleLinkedin : LinkedinUpdateIcon;
    //         break;
    //     case CHANNELS_CONSTANTS.SOCIAL_TYPE_YOUTUBE:
    //         icon =  type == "round" ? RoundYoutube : type == "grayscale" ? grayScaleYoutube : YoutubeUpdateIcon;
    //         break;
    //     case CHANNELS_CONSTANTS.SOCIAL_TYPE_INSTAGRAM:
    //         icon =  type == "round" ? RoundInstagram : type == "grayscale" ? grayScaleInstagram : InstagramUpdateIcon;
    //         break;
    //     case CHANNELS_CONSTANTS.SOCIAL_TYPE_GMB:
    //         icon =  type == "round" ? RoundGoogle : type == "grayscale" ? grayScaleGoogle : GoogleUpdateIcon;
    //         break;
    //     case CHANNELS_CONSTANTS.SOCIAL_TYPE_APPLE:
    //         icon =  type == "round" ? RoundApple : type == "grayscale" ? grayScaleApple : AppleUpdateIcon;
    //         break;
    //     case CHANNELS_CONSTANTS.SOCIAL_TYPE_X: 
    //         icon = XIcon;
    //         break;
    //     case CHANNELS_CONSTANTS.SOCIAL_TYPE_TIKTOK:
    //         icon =  type == "round" ? RoundTiktok : type == "grayscale" ? grayScaleTiktok : TiktokUpdateIcon;
    //         break;
    //     default:
    //         icon = null;
    //         break;
    }

//     return returnOnlyIconSrc ? icon : <img draggable="false" alt={channel} src={icon} />;
// };

/*************** Social ***********/
export const characterLimitMetaData = {
    facebook: 5000,
    google: 1500,
    twitter: 280,
    instagram: 2200,
    linkedin: 3000,
    youtube: 5000,
    apple_connect: 58 //eslint-disable-line
};

export const CHANNELS_CONSTANTS = {
    SOCIAL_TYPE_FACEBOOK: "FACEBOOK",
    SOCIAL_TYPE_TWITTER: "TWITTER",
    SOCIAL_TYPE_LINKEDIN: "LINKEDIN",
    SOCIAL_TYPE_YOUTUBE: "YOUTUBE",
    SOCIAL_TYPE_GOOGLE: "GOOGLE",
    SOCIAL_TYPE_INSTAGRAM: "INSTAGRAM",
    SOCIAL_TYPE_GMB: "GMB",
    SOCIAL_TYPE_APPLE: "APPLE_CONNECT",
    SOCIAL_TYPE_X: "X",
    SOCIAL_TYPE_TIKTOK: "TIKTOK",
}

export const validateUrlRegex = (value, globally = false) => {    
    if (globally) {
        /* eslint-disable-next-line */
        const isURLs = value?.match(/(http(s)?:([\/]{2}))?(www\.)?((?!.*?\.\.)[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b)([:]{1}[0-9]{1,})?([-a-zA-Z0-9@%_\+.~#?&=]*)?([:]{1}[0-9]{1,})?((?!.*?\.\.)[-a-zA-Z0-9.?%&_+~#=:*|@\/]*)/g);
        return isURLs && isURLs.length;
    }
    /* eslint-disable-next-line */
    return /^(http(s)?:([\/]{2}))?(www\.)?((?!.*?\.\.)[-a-zA-Z0-9@%._\+~#=]{1,256}\.[a-z]{2,6}\b)([:]{1}[0-9]{1,})?([-a-zA-Z0-9@%_\+.~#?&=]*)?([:]{1}[0-9]{1,})?((?!.*?\.\.)[-a-zA-Z0-9.?%&_+~#=:*|@\/]*)$/g.test(value);
};

export const highlightMentions = (textAreaId, showHighlight, nameObj,selectedChannel,isRestore,updateMentionName, showMentionPopover, setCurrentDiv, fromHighlightMentionBox, masterPostList = [], useThisInnerHtml = null, mentionsData) => {
    if (selectedChannel === "google" || selectedChannel === "gmb" || selectedChannel === "youtube" || selectedChannel === "apple_connect") return;

    let entirestring = useThisInnerHtml ? formatToPlainText(useThisInnerHtml) : formatToPlainText(isRestore ? document.getElementById("content-editable-div").childNodes[0].innerHTML : document.getElementById(textAreaId).innerHTML, true);

    const mentionRegex = /(?:^|\s)@[^[\s]+/g;
    let checkForMentionInInitailContent = [];
    // Use case: In Edit flow
    // Save mentions as text and replace them with actual mentions; in that case, all @ symbol words gets highlighted in orange.
    // other @ symbols should appeared as normal text
    const isEditFlow = window.location.search.includes("action=edit");
    if (entirestring.match(mentionRegex) && selectedChannel !== "master" && !isEditFlow) {
        const words = entirestring.match(mentionRegex)?.map( item => item.replace("\n","").replace(" ",""));
        const masterPostMentions = masterPostList[0].postText.match(mentionRegex)?.map( item => item.replace("\n","").replace(" ",""));

        forEach(words, (word) => {
            if (masterPostList[0]?.postText?.split(" ")?.includes(word?.split(" ")?.[1]) || masterPostList[0]?.postText?.split(" ")?.includes(word?.split(" ")?.[0])) {
                checkForMentionInInitailContent.push(word?.split(" ")?.[1] === undefined ? word?.split(" ")?.[0] : word?.split(" ")?.[1]);
            } else if (masterPostMentions?.includes(word)) {
                checkForMentionInInitailContent.push(word);
            }
        });
    }

    let finalString = "";
    if (!isEmpty(checkForMentionInInitailContent)) {
        let textAreaWords = entirestring.split(" ");
        let modifiedTextAreaWords = [];
    
        forEach(textAreaWords, word => {
            if (word.includes("\n")) {
                modifiedTextAreaWords.push(...word.split(/(\n+)/).filter(Boolean));
            } else {
                modifiedTextAreaWords.push(word);
            }
    
            return word;
        });
    
        let mapMentionWithIndex = {};
    
        forEach(modifiedTextAreaWords , (item,i) => {
            if (( item.charAt(item.length - 1) === "]" && i > 0 && textAreaWords[i - 1] === "[") || (item.charAt(item.length - 1) === "]" && item.charAt(0) === "[" )) {
                mapMentionWithIndex[i] = item;
            }
        });
    
        const regExp = /@[A-Za-z0-9_]+/g;
        let mentionsCount = 0;
        let finalModifiedWords = map(modifiedTextAreaWords, (word,i) => {
            let finalWord = word;
            if (word.match(regExp) && showHighlight && word.charAt(0) !== "[" && checkForMentionInInitailContent.includes(word)) {
                let newWord = "";
                //handling for /n in highlighted text
                if (word.charAt(0) === "@") {
                    newWord = word;
                } else {
                    newWord = "@" + word?.match(/@(\w+)/)?.[1];
                }
                finalWord = `<div class="${mentionsCount} mention-text" contenteditable='false'>${newWord}</div>`;
            } else if ((word.match(regExp) && showHighlight && word.charAt(0) === "[") || (word.charAt(word.length - 1) === "]" && i > 0 && textAreaWords[i - 1] === "[")) {
                mentionsCount++;
                finalWord = `<div class="token-cont"><token class=token contenteditable='false'><img  class="mention-icon" src="${getSocialIconWithImg(selectedChannel, true)}"/>@${mapMentionWithIndex[i] ? mapMentionWithIndex[i].replaceAll(`[`,"").replaceAll(`]`,"").replaceAll(`@`,"") : nameObj?.mentionUserName}</token></div>`;
            } 
    
            return finalWord;
        });
    
        finalModifiedWords = finalModifiedWords.filter((item) => item !== "[");
    
        const pattern = /^\n+$/;
        forEach(finalModifiedWords, (item) => {
            if (pattern.test(item)) {
                finalString += item;
            } else {
                finalString += item + " ";
            }
        });
    } else {
        finalString = entirestring;
    }

    const editableDiv = isRestore ? document.getElementById("content-editable-div").childNodes[0] : document.getElementById(textAreaId);
    if (!isEmpty(mentionsData)) {
        let count = 0;

        let divArr = (formatToHtml(finalString)).split(/<div/g);
        divArr = divArr.filter(item => item.indexOf(`='false'>@`) > -1);
        let finalModifiedString = "";
        divArr.forEach((item,) => {
            let finalitem = item; let d;
            if (item.includes("@") && !item.includes("mention-text")) {
                d = "<div" + item;
                if (!isEmpty(d)) {
                    let obj = mentionsData[count];
                    if (!isEmpty(obj)) {
                        let ab = d.split(`='false'>@`);
                        finalitem = `<div class="token-cont"><token class=token contenteditable="false">` + `<img  class="mention-icon" src="${getSocialIconWithImg(obj.channel, true)}"/>@` + ab[1] + `&nbsp;`;
                    }
                }
                count++;
            }
            let currentInnerHtml = finalString;
            finalModifiedString = (finalModifiedString || formatToHtml(currentInnerHtml)).replaceAll(d, finalitem);
        });

        editableDiv.innerHTML = isEmpty(divArr) ? formatToHtml(finalString) : finalModifiedString;
    } else {
        editableDiv.innerHTML = formatToHtml(finalString);
    }

    forEach([...document.querySelectorAll(".mention-text")], (div) => {
        div.addEventListener("click", (e) => {
            if (e?.target?.classList?.contains?.("mention-text")) {
                onClickOfHighlightMention(e,updateMentionName, showMentionPopover, setCurrentDiv, fromHighlightMentionBox);
            }
        });
    });
};

export const onClickOfHighlightMention = (e,updateMentionName, showMentionPopover, setCurrentDiv, fromHighlightMentionBox) => {
    
    updateMentionName(e.currentTarget.innerHTML);
    setCurrentDiv(e.currentTarget);
    showMentionPopover();
    fromHighlightMentionBox();
    setTimeout(() => {
        document.querySelector(".right-side-sub-preview")?.click();
    }, 400);
};

export const moveCursorToEnd = (contentEditableDiv) => {                
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(contentEditableDiv);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
};

export const filterLink = (link) => {
    return link.replaceAll("\n", " \n ").replaceAll("<br />", " <br /> ").replaceAll("<br/>", " <br/> ");
};

export const checkLinkEndsWithComma = (link) => {
    const isLinkContains = validateUrlRegex(link, true);
    const isSingleOccurence = link.split(",").length <= 2;
    const isEndsWithComma = isLinkContains && isSingleOccurence ? link.endsWith(",") : false;
    return { isEndsWithComma };
};
const removeExtraDivs = function (text) {
    return text.replace(/<div><div class=\"token-cont\"><token?[^>]+>([^<]+)<\/token><\/div>&nbsp;<br><\/div>/ig, "\n[$1] ");
};

const divReplaceCheck = function (text) {
    const regex = /<div?[^>]+>([^<]*)<\/div>/ig;

    if (regex.test(text)) {
        text = text.replace(regex, "\n$1");
        return divReplaceCheck(text);
    }

    return text;
};


const insertLockIconForSecureToken = (tokenName, secureTokensList) => {
    if (secureTokensList && secureTokensList.includes(tokenName)) {
        return `[${tokenName}<i class="icon_phoenix-lock-fill ml-3 fz-10"></i>]`;
    }
    return "[" + tokenName + "]";
};


export const formatToHtml = function (text, token, tokenClsParam, secureTokensList, isBulletPoints = null, isSocial=false) {
    const tokenCls = tokenClsParam || "token";

    if (text && typeof text === 'string') {
        let finalHtml = text
        if(isBulletPoints){
            finalHtml = finalHtml.replace(/\n•/g, "</li> <li>").replace(/•/g,"<li>").replace(/\n/g, "<br/>");
        }
            finalHtml = finalHtml.replace(/\r/g, "").replace(/\n/g, "<br/>").replace(/<div\s?\/?><br\s?\/?><\/div>/g, "<br/>").replace(/<div class=\"token-cont\"><\/div>/ig, "").replace(/<div class=\"token-cont\"><token?[^>]+>([^<]+)<\/token><\/div>/ig, "<div class=\"token-cont\"><token class=\""+tokenCls+"\" contenteditable='false'>$1</token></div>");
        if(token){
            return finalHtml;
        }
        finalHtml = finalHtml.replace(/\[(.*?)\]/ig, function($1) { return insertLockIconForSecureToken($1.slice(1,-1), secureTokensList)})
            .replace(/\[(.*?)\]/ig, "<div class=\"token-cont\"><token class=\""+tokenCls+"\" contenteditable='false'>$1</token></div>");
        if(isBulletPoints && finalHtml !== text){
            finalHtml = finalHtml + "</li>"
        }
        return finalHtml.trim();
    } else if (text && typeof text === 'object') {
        const isStringsArray = arr => arr.every(i => typeof i === "string");
        let finalHtml = '';
        each(text, (item) => {
            switch(true){
                case !!((item['label'] && !item['value'])): {
                    //If only LABEL is present
                    finalHtml += `<b> ${item['label']}: </b> </br></br> `;
                    break;
                }
                case !!(!item['label'] && item['value'] && typeof item['value'] === 'string'): {
                    //If only VALUE is present in STRING format
                    const value = splitterReturnString(item['value']);
                    finalHtml += `${value} </br></br> `;
                    break;
                }
                case !!(item['label'] && item['value']): {
                    //If both LABEL & VALUE is present
                    if(typeof item['value'] === 'string'){
                        //If VALUE contains STRING
                        const value = splitterReturnString(item['value']);
                        finalHtml += `<b> ${item['label']}: </b> ${value} </br></br> `;
                    } else if(typeof item['value'] === 'object' && isStringsArray(item['value'])){
                        //If VALUE contains ARRAY of STRINGS
                        finalHtml += `<b> ${item['label']}: </b> </br> `;
                        finalHtml += formatToHtml([{value: item['value']}]);
                    } else if(typeof item['value'] === 'object'){
                        //If VALUE contains nested OBJECT
                        item['label'] && (finalHtml += `<b> ${item['label']}: </b> </br> `);
                        finalHtml += formatToHtml(item['value']);
                    }
                    break;
                }
                case !!(!item['label'] && item['value'] && typeof item['value'] === 'object' && isStringsArray(item['value'])): {
                    //If only VALUE is present & contains ARRAY of STRINGS
                    let list = '';
                    each(item['value'], (listItem) => {
                        list += ` <li> ${listItem} </li> `;
                    });
                    finalHtml += ` <ul> ${list} </ul></br> `;
                    break;
                }
            }
        })
        return finalHtml;
    }

    return "";
};
export const formatToPlainText = function (html, disableNewLine = false) {
    if (html) {
        let finalText = removeExtraDivs(html);

        finalText = finalText.replace(/&nbsp;/g, " ")
            .replace(/<div\s?\/?><br\s?\/?><\/div>/g, "\n")
            .replace(/<i class=\"icon_phoenix-lock-fill ml-3 fz-10\"><\/i>/ig, "")
            .replaceAll(/<i class=\"icon_phoenix-facebook-dark active\"><\/i>/ig, "")
            .replaceAll(/<i class=\"icon-linkedin active\"><\/i>/ig, "")
            .replaceAll(/<i class=\"icon-instagram active\"><\/i>/ig, "")
            .replaceAll(/<i class=\"icon_phoenix-youtube-full active\"><\/i>/ig, "")
            .replaceAll(/<i class=\"icon-twitter active\"><\/i>/ig,"")
            .replaceAll(/<i class=\"icon_phoenix-cross active\"><\/i>/ig,"")
            .replace(/<div class=\"token-cont\"><token?[^>]+>([^<]+)<\/token><\/div>/ig, "[$1]")
            .replace(/<div><div class="token-cont"><br><\/div><\/div>/ig, "\n")
            .replace(/<br\s?\/?>/g, "\n")
            .replace(/&amp;/g, "&").replace(/<div class=\"token-cont\"><\/div>/ig, "")
            .replace(/<div class=\"token-cont\">([/\s]+)<token?[^>]+>([^<]+)<\/token><\/div>/ig, "$1[$2]")
            .replaceAll(/<div class="[0-9]* mention-text"[^>]*>([^<]+)<\/div>/g,(match, innerText) => innerText)

        finalText = finalText.replace(/<span?[^>]+>([^<]+)<\/span>/g, "$1")
            .replace(/<div class=\"token-cont\"><token?[^>]+>([^<]+)<\/token>([^<]+)<\/div>/ig, "[$1]$2");

        finalText = divReplaceCheck(finalText);
        
        return finalText;
    }

    return "";
};

export const numberWithCommas = (a) => {
    if (a) {
        return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return a;
};

export const getSingularPluralText = function (size, text) {
    let newText = "";

    if (text) {
        newText = text === "City" ? (size > 1 ? "Cities" : text) : (size > 1 || size == 0 ? text + "s" : text);
    }
    return newText;
};

export const moveTextAreaCursorAtEnd = (elementId) => {
    const element = document.getElementById(elementId);
    const selectedText = window.getSelection();
    const selectedRange = document.createRange();
    if (element && element.childNodes?.length) {
        const lastElement = element.childNodes.length;
        selectedRange.setStart(element.childNodes[lastElement - 1], element.childNodes[lastElement - 1].length);
        selectedRange.collapse(true);
        selectedText.removeAllRanges();
        selectedText.addRange(selectedRange);
        element.scrollBy(0, element.scrollHeight); //scroll at last
    }
}

export const filterOutSecureTokens = (tokensList) => {
    const secureTokens = tokensList.filter((token) => token.secure && token.fieldName);
    return secureTokens.map(t => t.fieldName);
};

export const compareWithBusinessType = (business, businessType, typeToCompare) => {
    if (!business || !businessType || !typeToCompare) {
        return false;
    }
    
    // Check if business type matches any of the types to compare
    if (typeToCompare.reseller && businessType === "Reseller") {
        return true;
    }
    
    return false;
};

// returnOnlyIconSrc: using this key in case we only need src of icon