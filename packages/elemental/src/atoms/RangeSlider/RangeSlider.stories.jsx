import RangeSliderComponent from "./index";

export default {
    title: "Atom/RangeSlider",
    component: RangeSliderComponent,
    tags: ["autodocs"]
};

export const Default = {
    args: {
        sliderLabel: 'Range Slider',
        currentValue: 40,
        minValue: 0,
        maxValue: 100,
        step: 10,
        defaultLineColor: '#E5E5E5',
        activeLineColor: '#34D1BF',
        showInputBox: true,
        markers: [{name: 'Default', value: 70}],
        name: 'range-slider',
        inputBoxLabel: '%'
    }
};