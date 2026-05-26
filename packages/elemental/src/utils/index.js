import { map, isEmpty, attempt } from "lodash";
import { DAYS, MONTHS } from "./constants";
import moment from "moment";

export const createRippleEffect = (e, onClick, args) => {
    const currentTarget = e.currentTarget;
    const X = e.clientX - currentTarget.getBoundingClientRect().left;
    const Y = e.clientY - currentTarget.getBoundingClientRect().top;
    const rippleDiv = document.createElement("div");
    rippleDiv.classList.add("ripple");
    rippleDiv.setAttribute("style", "top:" + Y + "px; left:" + X + "px;");
    rippleDiv.style.background = "#dde3e6";
    currentTarget.appendChild(rippleDiv);
    setTimeout(function () {
        currentTarget.removeChild(rippleDiv);
    }, 900);
    typeof onClick === "function" && onClick(args ? args : e);
};

export const lowercaseFirstLetter = (string) => {
    return string?.charAt(0)?.toLowerCase() + string?.slice(1);
};

export const isTabletDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    return isTablet;
};


export const getNameInitials = (name, characters) => {
    if (name) {
        const initials = map(name.split(" "), (val) => (val[0])).join("");
        return characters ? initials.substr(0, characters) : initials;
    }
};

export const getImageURL = (data) => {
    const { businessImageCdnBase, businessNumber, url } = data;

    if (/(http(s?)):\/\//gi.test(url) || /^:\/\/([0-9A-Za-z-\\.@:%_+~#=])/.test(url)) {
        return url;
    }

    return url ? businessImageCdnBase + businessNumber + "/" + url : undefined;
};

export const capitalizeCase = (str) => {

    return str && str.toLowerCase().split(" ").map(x => {
        if (x.toLowerCase().indexOf("www.") == 0) return x;
        return x ? (`${x[0].toUpperCase()}${x.slice(1)}`) : x;
    }).join(" ");
};


export const intlListFormat = (list, prefix, isDisjunction) => {
    const formatableList = list && map(list, (o) => {
        return o.indexOf(prefix) > -1 ? o.replace(prefix, "") : o;
    });

    if (Intl.ListFormat) {
        const formatter = new Intl.ListFormat("en", { style: "long", type: isDisjunction ? "disjunction" : "conjunction" });
        const retStr = formatter.format(formatableList);

        if (retStr.indexOf("star") > -1 || retStr.indexOf("no rating") > -1) {
            return `${prefix} ${retStr.indexOf("is") == 0 ? retStr.replace("is", "") : retStr}`;
        } else {
            return retStr;
        }
    } else {
        const retStr = formatableList && map(formatableList, (o, i) => {
            let item = o;
            if (formatableList.length > 1) {
                if (i == (formatableList.length - 1)) {
                    item = ` ${isDisjunction ? "or" : "and"} ${item}`;
                }
            }
            return item;
        }).join(", ").replace(/,([^,]*)$/, "$1");
        return `${retStr.indexOf("is") == 0 ? retStr.replace("is", "") : retStr}`;
    }
};

export const toCapitalize = (string) => {
    return string.replace(/\b\w/, match => match.toUpperCase());
};


export const msieversion = () => {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent) || navigator.userAgent.indexOf("Trident/") > -1) {
        return true;
    } else {
        return false;
    }
};


export const hasScriptTag  = (text) => {
    const openingScriptRegex = /<script\b[^<]*>/gi;
    const closingScriptRegex = /<\/script>/gi;

    const hasOpeningTags = openingScriptRegex.test(text);
    const hasClosingTags = closingScriptRegex.test(text);

    return hasOpeningTags || hasClosingTags;
};

export const isEmailAddress = (mail) => {
    const pattern = /^[a-zA-Z0-9._-]{1}[a-zA-Z0-9._'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (pattern.test(mail)) {
        return (true);
    }
    return (false);
};

export const getShowPageCounts = () => {
    const counts = [25, 50, 75, 100];

    return map(counts, function (count) {
        return {
            label: `Show ${count}`,
            value: count,
            noTitle: true
        };
    });
};

export const capitalizeFirstLetter = (string) => {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
};

export const fillTenthPlace = (str) => {
    return `${(str + "").length == 1 ? "0" : ""}${str}`;
};

export const getDifferenceInDays = (now, then) => {
    // Calculated days difference based on absolute date (excludes time of the day)
    const thenAbsDate = new Date(`${MONTHS[then.getMonth()]} ${fillTenthPlace(then.getDate())} ${then.getFullYear()}`).getTime();
    const nowAbsDate = new Date(`${MONTHS[now.getMonth()]} ${fillTenthPlace(now.getDate())} ${now.getFullYear()}`).getTime();

    const diffTime = Math.abs(nowAbsDate - thenAbsDate);
    const diffInDays = diffTime / (1000 * 60 * 60 * 24);
    return diffInDays;
};

export const getTimeDetails = (timestamp) => {
    const then = new Date(timestamp);
    const now = new Date();
    const day = DAYS[then.getDay()];
    const mmm = MONTHS[then.getMonth()];
    const dd = then.getDate(); //fillTenthPlace(then.getDate());
    const yyyy = then.getFullYear();
    const hours = then.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    const mm = fillTenthPlace(then.getMinutes());
    let hh = hours % 12;
    hh = hh ? hh : 12;
    hh = fillTenthPlace(hh);
    const diffInYears = parseInt(now.getFullYear()) - parseInt(yyyy);
    const diffInDays = getDifferenceInDays(now, then);

    const today = diffInDays == 0;
    const yesterday = diffInDays == 1;

    const moment = {
        diffInDays,
        diffInYears,
        dayOfWeek: day,
        day: today ? `Today` : yesterday ? "Yesterday" : day,
        date: `${mmm} ${dd}${diffInYears > 0 ? `, ${yyyy}` : ""}`,
        year: yyyy,
        time: `${hh}:${mm} ${ampm}`
    };

    let timeElapsed = moment.date;
    if (today) {
        timeElapsed = moment.time;
    } else if (yesterday) {
        timeElapsed = moment.day;
    } else if (diffInDays > 0 && diffInDays < 7) {
        timeElapsed = moment.dayOfWeek;
    }

    moment.timeElapsed = timeElapsed;

    return moment;
};

export const getEncodedStyleClass = (classStr = "", styleObj) => {
    if (!styleObj || !classStr || typeof classStr !== "string") return "";
    return classStr
        .split(" ")
        .map((singleClass) => {
            if (!singleClass) return "";
            if (!styleObj[singleClass]) return "";
            return styleObj[singleClass];
        })
        .filter(Boolean)
        .join(" ");
};
export const getEncodedStyleForeignClass = (classStr = "", styleObj) => {
    if (!styleObj || !classStr || typeof classStr !== "string") return "";
    return classStr
        .split(" ")
        .map((singleClass) => {
            if (!singleClass) return "";
            if (!styleObj[singleClass]) return singleClass;
            return styleObj[singleClass];
        })
        .filter(Boolean)
        .join(" ");
}

export const numberWithCommas = (a) => {
    if (a) {
        return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return a;
};
export const addBirdeyeHostString = (key, value) => {
    let tempValue = value
    if (key === 'recurlyAccount') {
        if (tempValue?.includes('dev')) {
            tempValue = tempValue.replace('dev', 'dev-birdeye')
        } else if (tempValue?.includes('inc')) {
            tempValue = tempValue.replace('inc', 'birdeyeinc')
        }
    } else if (key === 'javaApiRoot') {
        if (tempValue === "http://dev-paid-messenger-api-1.internal:8080/resources/v1/") {
            return tempValue;
        }
        else if (tempValue?.includes('.com')) {
            tempValue = tempValue.replace('.com', '.birdeye.com')
        } else if (tempValue?.includes('internal')) {
            tempValue = tempValue.replace('internal', 'birdeye.internal')
        }
    } else if (tempValue?.includes('.com')) {
        tempValue = tempValue.replace('.com', '.birdeye.com')
    }

    return tempValue
}
export const downloadFile = function (downloadUrl, aws) {
    if (!downloadUrl) {
        return;
    }

    if (aws && downloadUrl.indexOf("s3") != -1) {
        window.location.assign("/nodeApi/fileOperation/download?s3url=" + downloadUrl + (aws ? ("&aws=" + aws) : ""));
    } else if (downloadUrl.indexOf("twilio") > -1 || (downloadUrl.indexOf("http://") === 0 || downloadUrl.indexOf("https://") === 0)) {
        window.open(downloadUrl, "_blank");
    }
};
export const downloadImageFromUrl = async (url, fromPicturesQue) => {
    // facebook urls gives cors error but when we open same url in tab, the url changes automatically and no cors issue is seen
    if (url && url.includes("fbcdn.net")) {
        const splitFbVideoUrl = url.split("/v/");
        const newUrl = url.replace(splitFbVideoUrl[0], "https://video.xx.fbcdn.net");
        url = newUrl;
    }
    if (fromPicturesQue) {
        const picturesQueUrl = addBirdeyeHostString("picturesqueRepoHost", window.BE.env.picturesqueRepoHost);
        url = `${picturesQueUrl}/fileOperation/getImageFromS3url?imgpath=${url}`;
    }

    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const arr = url.split("/");
        const fileName = arr[arr.length - 1].split("?")[0];
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = fileName;
        a.href = blobUrl;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (e) {
        console.log("downloadImageFromUrl", e);
        downloadFile(url);
    }
};
export const getValidVideoExtensions = ({ attachment = false }) => {
    if (attachment)
        return /.mp4|.MP4|.mov|.MOV|.3gp|.3gpp|.webm|.WEBM/g;
    else
        return /\.(mp4|MP4|mov|MOV|3gp)$/;
};

export const isCalendarLongCards = (event) => {
    const site = event?.postingSites?.[0];
    const appleConnect = site == "apple_connect";
    return appleConnect;
}

export const convertToEpochTime = (date, utc) => {
    if (date) {
        if (utc) {
            return moment.utc(date).valueOf();
        } else {
            return moment(date).valueOf();
        }
    }
    return date;
};
export const getFormattedDate = (date, format) => {
    let formattedDate;
    switch (format) {
        case "UK":
            formattedDate = moment(date).format("MMM DD, YYYY");
    }
    return formattedDate;
};
export const convertFromEpochTime = (epochDate, format) => {
    if (epochDate) {
        return moment.utc(epochDate).format(format);
    }
    return epochDate;
};
export const getSelectOptions = (arr, options, suffix = "", extraKey = null, removeToStrInValue) => {
    const { labelKey = "", valueKey = "", optionalLabelKey = "", labelPrefix = "", subLabelkey = "" } = options || {};

    return map(arr, (item) => {
        let label = "";
        let subLabel = "";
        let value = "";
        let type = null;
        if (options) {
            label = item[labelKey];
            if (subLabelkey) {
                subLabel = item[subLabelkey];
            }            
            value = removeToStrInValue ? item[valueKey] : item[valueKey].toString();            
            if (!label && labelKey == "businessAlias") {
                label = item["businessName"];
            }
            if (!label) {
                label = item[optionalLabelKey];
            }
            if (extraKey) {
                type = item[extraKey];
            } 
        } else {
            label = item;
            value = item.toString();
        }

        label = labelPrefix + label && suffix ? pluralizeString(label) : label;
        // label = (label === "City" && suffix) ? (labelPrefix + "Cities") : (labelPrefix + label + suffix);

        const result = subLabelkey ? { label, value, subLabel } : { label, value, businessKey: item?.businessNumber };
        if (type) {
            result.type = type;
        }
        return result;
    });
};
export const pluralizeString = (string) => {
    const plural = {
        "(quiz)$"               : "$1zes",
        "^(ox)$"                : "$1en",
        "([m|l])ouse$"          : "$1ice",
        "(matr|vert|ind)ix|ex$" : "$1ices",
        "(x|ch|ss|sh)$"         : "$1es",
        "([^aeiouy]|qu)y$"      : "$1ies",
        "(hive)$"               : "$1s",
        "(?:([^f])fe|([lr])f)$" : "$1$2ves",
        "(shea|lea|loa|thie)f$" : "$1ves",
        "sis$"                  : "ses",
        "([ti])um$"             : "$1a",
        "(tomat|potat|ech|her|vet)o$": "$1oes",
        "(bu)s$"                : "$1ses",
        "(alias)$"              : "$1es",
        "(octop)us$"            : "$1i",
        "(ax|test)is$"          : "$1es",
        "(us)$"                 : "$1es",
        "([^s]+)$"              : "$1s"
    };
    // check for matches using regular expressions
    for (const regx in plural) {
        const pattern = new RegExp(regx, "i");
        if (pattern.test(string)) return string.replace(pattern, plural[regx]);
    }
    return string;
}
export const getSimplifiedCount = (count, addMaxLimit = true) => {
    const toFixed = (n, fixed) => ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed);
    return count > 999 ? ((count > 99000 && addMaxLimit) ? "99K+" : `${toFixed(Math.abs((count / 1000)), 1)}K`) : count;
};
export const checkForNoDataAvailable = (value) => {
    return isEmpty(value) && !value && value !== 0 && value !== 0.0;
};
export const getTextWidth = (text, fontSize, fontFamily, fontWeight) => {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set the font property to include font size, font weight, and font family
    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    // Measure the text width
    const metrics = context.measureText(text);
    return metrics.width; // Returns the width in pixels
};

export const isWindows = () => {
    return navigator.userAgent.indexOf("Win") != -1;
};

export const parseLodash = (str) => {
    return attempt(JSON.parse.bind(null, str));
};

export const getSessionStorage = (item, obKey) => {
    try {
        if (window?.sessionStorage) {
            if (window?.sessionStorage?.[item]) {
                if (obKey) {
                    return parseLodash(window?.sessionStorage?.[item])?.[obKey];
                } else {
                    return parseLodash(window?.sessionStorage?.[item]);
                }
            } else {
                return null;
            }
        } else {
            window.log("Session Storage Not Supported");
            return null;
        }
    } catch (e) {
        window.log(e);
    }
};

export const capitalizeAllLetters = (str) => {
    let splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(" "); 
};