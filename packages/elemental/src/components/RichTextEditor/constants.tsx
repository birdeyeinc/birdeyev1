import React from "react";
import textLeft from "assets/images/text-left.svg";
import textCenter from "assets/images/text-center.svg";
import textRight from "assets/images/text-right.svg";
import textJustify from "assets/images/text-justify.svg";

export const TEXT_ALIGN_OPTIONS = [
    { enable: true, selectionVal: "left", value: "left", label: <img src={textLeft} alt="Align Left" /> },
    { enable: true, selectionVal: "center", value: "center", label: <img src={textCenter} alt="Align Center" /> },
    { enable: true, selectionVal: "right", value: "right", label: <img src={textRight} alt="Align Right" /> },
    { enable: true, selectionVal: "justify", value: "justify", label: <img src={textJustify} alt="Align Justify" /> }
] as const;

export const TEXT_HEADING_OPTIONS = [
    { enabled: true, selectionVal: "body", value: "body", label: "Body", size: "16px" },
    { enable: true, selectionVal: 1, value: 1, label: "Heading 1", size: "32px" },
    { enable: true, selectionVal: 2, value: 2, label: "Heading 2", size: "24px" },
    { enable: true, selectionVal: 3, value: 3, label: "Heading 3", size: "20px" },
    { enable: true, selectionVal: 4, value: 4, label: "Heading 4", size: "18px" },
    { enable: true, selectionVal: 5, value: 5, label: "Heading 5", size: "16px" },
    { enable: true, selectionVal: 6, value: 6, label: "Heading 6", size: "14px" },
] as const;

export const FONT_FAMILY_OPTIONS = [
    { label: "Arial", value: "Arial, Helvetica, sans-serif", optionJSX: <span style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>Arial</span> },
    { label: "Arial Black", value: "Arial Black, Gadget, sans-serif", optionJSX: <span style={{ fontFamily: "Arial Black, Gadget, sans-serif" }}>Arial Black</span> },
    { label: "Brush Script MT", value: "Brush Script MT, sans-serif", optionJSX: <span style={{ fontFamily: "Brush Script MT, sans-serif" }}>Brush Script MT</span> },
    { label: "Century Gothic", value: "Century Gothic, sans-serif", optionJSX: <span style={{ fontFamily: "Century Gothic, sans-serif" }}>Century Gothic</span> },
    { label: "Comic Sans MS", value: "Comic Sans MS, cursive, sans-serif", optionJSX: <span style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>Comic Sans MS</span> },
    { label: "Courier", value: "Courier, monospace", optionJSX: <span style={{ fontFamily: "Courier, monospace" }}>Courier</span> },
    { label: "Courier New", value: "Courier New, Courier, monospace", optionJSX: <span style={{ fontFamily: "Courier New, Courier, monospace" }}>Courier New</span> },
    { label: "Geneva", value: "Geneva, sans-serif", optionJSX: <span style={{ fontFamily: "Geneva, sans-serif" }}>Geneva</span> },
    { label: "Georgia", value: "Georgia, serif", optionJSX: <span style={{ fontFamily: "Georgia, serif" }}>Georgia</span> },
    { label: "Helvetica", value: "Helvetica, sans-serif", optionJSX: <span style={{ fontFamily: "Helvetica, sans-serif" }}>Helvetica</span> },
    { label: "Impact", value: "Impact, Charcoal, sans-serif", optionJSX: <span style={{ fontFamily: "Impact, Charcoal, sans-serif" }}>Impact</span> },
    { label: "Lucida", value: "Lucida, sans-serif", optionJSX: <span style={{ fontFamily: "Lucida, sans-serif" }}>Lucida</span> },
    { label: "Lucida Grande", value: "Lucida Grande, sans-serif", optionJSX: <span style={{ fontFamily: "Lucida Grande, sans-serif" }}>Lucida Grande</span> },
    { label: "Lucida Sans", value: "Lucida Sans, sans-serif", optionJSX: <span style={{ fontFamily: "Lucida Sans, sans-serif" }}>Lucida Sans</span> },
    { label: "MS Serif", value: "MS Serif, serif", optionJSX: <span style={{ fontFamily: "MS Serif, serif" }}>MS Serif</span> },
    { label: "New York", value: "New York, serif", optionJSX: <span style={{ fontFamily: "New York, serif" }}>New York</span> },
    { label: "Palatino", value: "Palatino, serif", optionJSX: <span style={{ fontFamily: "Palatino, serif" }}>Palatino</span> },
    { label: "Palatino Linotype", value: "Palatino Linotype, serif", optionJSX: <span style={{ fontFamily: "Palatino Linotype, serif" }}>Palatino Linotype</span> },
    { label: "Inter", value: "Inter, sans-serif", optionJSX: <span style={{ fontFamily: "Inter, sans-serif" }}>Inter</span> },
    { label: "Tahoma", value: "Tahoma, Geneva, sans-serif", optionJSX: <span style={{ fontFamily: "Tahoma, Geneva, sans-serif" }}>Tahoma</span> },
    { label: "Times New Roman", value: "Times New Roman, Times, serif", optionJSX: <span style={{ fontFamily: "Times New Roman, Times, serif" }}>Times New Roman</span> },
    { label: "Trebuchet MS", value: "Trebuchet MS, Helvetica, sans-serif", optionJSX: <span style={{ fontFamily: "Trebuchet MS, Helvetica, sans-serif" }}>Trebuchet MS</span> },
    { label: "Verdana", value: "Verdana, Geneva, sans-serif", optionJSX: <span style={{ fontFamily: "Verdana, Geneva, sans-serif" }}>Verdana</span> }
] as const;

export const FONT_SIZE_OPTIONS = [
    { label: "8", value: "8px" },
    { label: "10", value: "10px" },
    { label: "12", value: "12px" },
    { label: "14", value: "14px" },
    { label: "16", value: "16px" },
    { label: "18", value: "18px" },
    { label: "20", value: "20px" },
    { label: "22", value: "22px" },
    { label: "24", value: "24px" },
    { label: "26", value: "26px" },
    { label: "28", value: "28px" },
    { label: "30", value: "30px" },
    { label: "32", value: "32px" },
    { label: "34", value: "34px" },
    { label: "36", value: "36px" },
    { label: "38", value: "38px" },
    { label: "40", value: "40px" },
    { label: "42", value: "42px" },
    { label: "44", value: "44px" },
    { label: "46", value: "46px" },
    { label: "48", value: "48px" },
    { label: "50", value: "50px" },
    { label: "52", value: "52px" },
    { label: "54", value: "54px" },
    { label: "56", value: "56px" },
    { label: "58", value: "58px" },
    { label: "60", value: "60px" },
    { label: "62", value: "62px" },
    { label: "64", value: "64px" },
    { label: "66", value: "66px" },
    { label: "68", value: "68px" },
    { label: "70", value: "70px" },
    { label: "72", value: "72px" },
    { label: "74", value: "74px" },
    { label: "76", value: "76px" },
    { label: "78", value: "78px" },
    { label: "80", value: "80px" },
    { label: "82", value: "82px" },
    { label: "84", value: "84px" },
    { label: "86", value: "86px" },
    { label: "88", value: "88px" },
    { label: "90", value: "90px" },
    { label: "92", value: "92px" },
    { label: "94", value: "94px" },
    { label: "96", value: "96px" },
] as const;

export const LETTER_SPACING_OPTIONS = [
    { label: "Normal", value: "normal" },
    { label: "0.5px", value: "0.5px" },
    { label: "1px", value: "1px" },
    { label: "1.5px", value: "1.5px" },
    { label: "2px", value: "2px" },
    { label: "2.5px", value: "2.5px" },
    { label: "3px", value: "3px" },
    { label: "4px", value: "4px" },
    { label: "5px", value: "5px" },
] as const;

export const LINE_HEIGHT_OPTIONS = [
    { label: "1", value: "1" },
    { label: "1.1", value: "1.1" },
    { label: "1.15", value: "1.15" },
    { label: "1.25", value: "1.25" },
    { label: "1.4", value: "1.4" },
    { label: "1.5", value: "1.5" },
    { label: "1.6", value: "1.6" },
    { label: "2", value: "2" },
    { label: "2.5", value: "2.5" },
    { label: "3", value: "3" },
] as const;