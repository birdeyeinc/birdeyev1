export const getTitle = (props) => {
    const { title, Label } = props;
    return title || (typeof Label === "string" ? Label : null);
}
export const getColorWithVariant = ({ active, isValidEmail, isApprovalTab, variantType, color }) => {
    let derviedVariant = variantType, derviedColorType = color;
    if(active) {
        derviedVariant = "tonal";
        derviedColorType = "blue";
    }
    else if(!isValidEmail && isApprovalTab) {
        derviedVariant = "tonal";
        derviedColorType = "yellow";
    }
    return {
        variant: derviedVariant,
        colorType: derviedColorType
    }
}
export const getSize = ({size, isPDFLitePage}) => {
    let derviedSize = size;
    if(isPDFLitePage) {
        derviedSize = "pdf-small";
    }
    return derviedSize;
}