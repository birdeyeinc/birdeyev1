import React from 'react';
import ChromePickerInput from '.';

export default {
    title: 'Component/ChromePickerInput',
    component: ChromePickerInput,
};

export const Default = () => {
    const [color, setColor] = React.useState('#ffffff');
    const onChange = (color) => {
        setColor(color.hex);
    };
    const onRequestApply = () => {
        console.log("Apply clicked");
    };
    const onRequestCancel = () => {
        console.log("Cancel clicked");
    };
    return (
        <ChromePickerInput
            color={color}
            label="Select Color"
            disabled={false}
            onChangeComplete={onChange}
            onRequestApply={onRequestApply}
            onRequestCancel={onRequestCancel}
            showColorInput={false}
            showColorList={true}
            customClassName="custom-class"
            customWidgetClass="custom-widget-class"
            showActionButtons={true}
        />
    )
}