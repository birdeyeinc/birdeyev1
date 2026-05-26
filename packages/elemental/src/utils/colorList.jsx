import React from "react";

/**
 * ColorList — Returns an array of color option objects for use
 * in filter dropdowns (e.g. Pexels / Pixabay color pickers).
 *
 * Each option has { value, label, type?, optionJSX? }.
 * Pure utility – no Redux, no side effects.
 */
export function ColorList() {
    const colorList = [
        { value: "Any Color", label: "Any color" },
        { value: "grayscale", label: "GrayScale" },
        { value: "red", label: "Red", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "red" }} />
            </div>) },
        { value: "orange", label: "Orange", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "orange" }} />
            </div>) },
        { value: "yellow", label: "Yellow", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "yellow" }} />
            </div>) },
        { value: "green", label: "Green", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "green" }} />
            </div>) },
        { value: "turquoise", label: "Turquoise", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "turquoise" }} />
            </div>) },
        { value: "blue", label: "Blue", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "blue" }} />
            </div>) },
        { value: "violet", label: "Violet", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "violet" }} />
            </div>) },
        { value: "pink", label: "Pink", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "pink" }} />
            </div>) },
        { value: "#white", label: "White", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "white" }} />
            </div>) },
        { value: "gray", label: "Gray", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "gray" }} />
            </div>) },
        { value: "black", label: "Black", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "black" }} />
            </div>) },
        { value: "brown", label: "Brown", type: "TONE", optionJSX:
            (<div className="color-option">
                <div className="color-option-box" style={{ backgroundColor: "brown" }} />
            </div>) }
    ];
    return colorList;
}
