export const getValueJsx = (val, tokenMenuType) => {
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
        <div className="el-ss-token-option">
            <p className="display-flex display-flex-start">
                {val.fieldName && <strong>{val.fieldName}</strong>}
                {val.secure && tokenMenuType === "FAQ" && <span className="icon_phoenix-lock-fill ml-5 fz-12" />}
            </p>
            {val.type && <span>{getExampleJsx(val.type)}</span>}
            {val.sampleValue && <span>{getSampleValue(val.exType)}</span>}
        </div>);
};

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