
import React, { useEffect, useState } from 'react';
import styles from "./RangeSlider.module.scss";

interface RangeSliderProps {
    sliderLabel?: string,
    currentValue?: number,
    minValue?: number,
    maxValue?: number,
    step?: number,
    defaultLineColor?: string,
    activeLineColor?: string,
    showInputBox?: boolean,
    markers?: Array<{name: string, value: number}>,
    sliderChangeCallback?: Function,
    isError?: boolean,
    name: string,
    inputBoxLabel?: string
}

const RangeSlider: React.FC<RangeSliderProps> = ({
    sliderLabel='', currentValue=0, minValue=0, maxValue=100, step=1, defaultLineColor='#e5e5e5',
    // ToDo: will import color codes when variable.js is available
    activeLineColor='#34D1BF', showInputBox=true, markers=[{name: 'Default', value: 40}],
    sliderChangeCallback, isError=false, name, inputBoxLabel=''
}) => {
    const [sliderValue, setSliderValue] = useState(currentValue.toString());

    useEffect(() => {
        setSliderValue(currentValue.toString())
    }, [currentValue.toString()]);

    const handleSliderValueChange = (e:any, triggerCallbackOnChange: boolean) => {
        let inputValue = e.target.value || '0';

        // Remove any non-numeric characters
        inputValue = inputValue.replace(/[^0-9]/g, '');

        // Restrict the value to between 0 and 100
        if (inputValue > 100) {
            inputValue = '100';
        } else if (inputValue.startsWith('0') && inputValue.length > 1) {
            inputValue = inputValue.replace(/^0+/, ''); // Remove leading zeros
        }

        setSliderValue(inputValue || '0');
        triggerCallbackOnChange && sliderChangeCallback && sliderChangeCallback(name, Number(inputValue || '0'));
    };

    const handleKeyDown = (e:any) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            let numericValue = parseInt(sliderValue || '0', 10);

            if (e.key === 'ArrowUp' && numericValue < 100) {
                numericValue++;
            } else if (e.key === 'ArrowDown' && numericValue > 0) {
                numericValue--;
            }

            setSliderValue(numericValue.toString());
            sliderChangeCallback && sliderChangeCallback(name, Number(numericValue || '0'));
        }
    };

    return (
        <div className={`${styles["range-slider-container"]}`}>
            <span className={`${styles["range-slider-heading"]}`}>{sliderLabel}</span>
            <div className={`${styles["range-slider-wrapper"]}`}>
                <div className={`${styles["range-slider"]}`}>
                    <input type="range" min={minValue} max={maxValue} step={step} value={sliderValue}
                        onChange={(event) => handleSliderValueChange(event, false)}
                        onMouseUp={() => sliderChangeCallback && sliderChangeCallback(name, Number(sliderValue || '0'))}
                        onKeyDown={handleKeyDown}
                        style={{
                                '--trans': `${(Number(sliderValue) - 50)}%`
                            } as React.CSSProperties}
                    />
                    <div className={`${styles["range-line"]}`} style={{ backgroundColor: defaultLineColor}}>
                        <div className={`${styles["active-line"]}`} style={{ backgroundColor: activeLineColor, left: `-${100-((Number(sliderValue)/maxValue)*100)}%`}}></div>
                    </div>
                        {markers.map(checkpoint => {
                            return <label className={`${styles["checkpoint-label"]} ${checkpoint?.value >= 98 || checkpoint?.value <= 3 ? styles[`value-${checkpoint?.value}`] : ''}`}  style={{left: `calc(${(checkpoint.value/maxValue)*100}% - 20px)`}}>{checkpoint.name}</label>
                        })}
                </div>
                {
                   showInputBox ? <div className={`${styles["range-input"]}`}>
                        <input
                            id="numberInput"
                            type="text"
                            value={sliderValue}
                            onChange={(event) => handleSliderValueChange(event, true)}
                            onKeyDown={handleKeyDown}
                            placeholder="0"
                            autoComplete="new-password"
                            // ToDo: will import color codes when variable.js is available
                            style={{borderColor: isError ? '#f3382b' : '#e5e5e5'}}
                        /> <label>{inputBoxLabel}</label>
                    </div> : ''
                }
            </div>
        </div>
    )
}

export default RangeSlider;