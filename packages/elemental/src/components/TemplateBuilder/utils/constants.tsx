import React from "react";
import facebookImage from "assets/images/social/facebook-image.svg";
import instagramImage from "assets/images/social/instagram-image.svg";
import googleImage from "assets/images/social/google-image.svg";
import linkedinImage from "assets/images/social/linkedin-image.svg";
import youtubeImage from "assets/images/social/youtube-image.svg";
import twitterImage from "assets/images/social/twitter-image.svg";
import whatsappImage from "assets/images/social/whatsapp-image.svg";
import telegramImage from "assets/images/social/telegram-image.svg";
import discordImage from "assets/images/social/discord-image.svg";
import tiktokImage from "assets/images/social/tiktok-image.svg";
import websiteImage from "assets/images/social/website-image.svg";
import emailImage from "assets/images/social/email-image.svg";
import { TraitProperties } from "grapesjs";
import { extractLinkFromBackgroundProperty } from ".";

export const DEFAULT_TOOLBAR_OPTIONS = [
    {
        type: "undo",
        icon: "icon_phoenix-undo",
        action: "undo",
        value: "core:undo",
        label: "Undo",
    },
    {
        type: "redo",
        icon: "icon_phoenix-redo",
        action: "redo",
        value: "core:redo",
        label: "Redo",
    },
    // {
    //     type: "preview",
    //     icon: "icon_phoenix-eye",
    //     action: "preview",
    //     value: "preview",
    //     label: "Preview",
    // },
] as const;

export const DEVICE_COMMAND = {
    DESKTOP: "Desktop",
    MOBILE: "mobile-415"
} as const;

export const DEFAULT_TOOLBAR_DEVICES = [
    {
        type: "desktop",
        icon: "icon_phoenix-desktop-new",
        value: DEVICE_COMMAND.DESKTOP,
        action: "desktop"
    },
    {
        type: "mobile",
        icon: "icon_phoenix-mobile-new",
        value: DEVICE_COMMAND.MOBILE,
        action: "mobile"
    }
] as const;

export const DEFAULT_PROTECTED_CSS = `.w-50 {
                width: 50px !important;
                height: 50px !important;
                vertical-align: middle !important;
                display: inline-block !important;
            };
            img {
                outline: none !important;
            }
            .ProseMirror:focus {
                outline: none;
            }
            .ProseMirror-focused {
                outline: none;
            }
            ::-webkit-scrollbar {
                width: 0px;
                background: transparent; /* optional, makes scrollbar invisible */
            }
            body {
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE/Edge */
            }
            body::-webkit-scrollbar {
                display: none; /* Chrome, Safari */
            }
            
            .section-component-cell:empty, [class^="column-cell-"]:empty {
                height: 100px;
                background: #F5F5F5;
                border: 1px dashed #999;
            }
            
            .section-component-cell:empty::before, [class^="column-cell-"]:empty::before {
                content: "Drop content here";
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                font-size: 12px;
                height: 100%;
                width: 100%;
                text-align: center;
                overflow: hidden;
            }
`;

export type ToolbarOptionType = (typeof DEFAULT_TOOLBAR_OPTIONS)[number]["value"];
export type ToolbarDeviceType = (typeof DEFAULT_TOOLBAR_DEVICES)[number]["value"];

export const getDividerStyleOptions = () => {
    const optionStyle = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        gap: "12px",
        width: "100%"
    };

    const options = [
        {
            id: "solid",
            label: "Solid",
            value: "solid",
            optionJSX: (
                <div
                    style={optionStyle}
                >
                    <p>Solid</p>
                    <div style={{ borderBottom: "4px solid black", width: "100%" }} />
                </div>
            )
        },
        {
            id: "dashed",
            label: "Dashed",
            value: "dashed",
            optionJSX: (
                <div
                    style={optionStyle}
                >
                    <p>Dashed</p>
                    <div style={{ borderBottom: "4px dashed black", width: "100%" }} />
                </div>
            )
        },
        {
            id: "dotted",
            label: "Dotted",
            value: "dotted",
            optionJSX: (
                <div
                    style={optionStyle}
                >
                    <p>Dotted</p>
                    <div style={{ borderBottom: "4px dotted black", width: "100%" }} />
                </div>
            )
        }
    ];

    return options;
};

export const FILTERED_TRAITS = ["id", "title", "required"] as const;

export const TRAIT_SIZE_OPTIONS = [
    { id: "fill", value: "fill", label: "Original" },
    { id: "cover", value: "cover", label: "Cover" },
    { id: "contain", value: "contain", label: "Contain" }
];

export const BACKGROUND_SIZE_OPTIONS = [
    { id: "auto", value: "auto", label: "Original" },
    { id: "cover", value: "cover", label: "Cover" },
    { id: "contain", value: "contain", label: "Contain" }
];

export const BACKGROUND_REPEAT_OPTIONS = [
    { id: "repeat", value: "repeat", label: "Repeat" },
    { id: "no-repeat", value: "no-repeat", label: "No repeat" },
]

export const BACKGROUND_POSITION_OPTIONS = [
    { id: "left", value: "left", label: "Left" },
    { id: "center", value: "center", label: "Center" },
    { id: "right", value: "right", label: "Right" },
];

export const SOCIAL_LINK_OPTIONS = [
    {
        label: "Facebook",
        value: "facebook",
        defaultValue: "https://www.facebook.com/",
        icon: facebookImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/Facebook.svg",
        href: "https://www.facebook.com/"
    },
    {
        label: "Instagram",
        value: "instagram",
        defaultValue: "https://www.instagram.com/",
        icon: instagramImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/Instagram.svg",
        href: "https://www.instagram.com/"
    },
    {
        label: "Google",
        value: "google",
        defaultValue: "https://www.google.com/",
        icon: googleImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/google.svg",
        href: "https://www.google.com/"
    },
    {
        label: "LinkedIn",
        value: "linkedin",
        defaultValue: "https://www.linkedin.com/",
        icon: linkedinImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/Linkedin.svg",
        href: "https://www.linkedin.com/"
    },
    {
        label: "YouTube",
        value: "youtube",
        defaultValue: "https://www.youtube.com/",
        icon: youtubeImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/Youtube.svg",
        href: "https://www.youtube.com/"
    },
    {
        label: "X (Twitter)",
        value: "twitter",
        defaultValue: "https://www.twitter.com/",
        icon: twitterImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/tender.svg",
        href: "https://www.twitter.com/"
    },
    {
        label: "WhatsApp",
        value: "whatsapp",
        defaultValue: "https://www.whatsapp.com/",
        icon: whatsappImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/whatsapp.svg",
        href: "https://www.whatsapp.com/"
    },
    {
        label: "Telegram",
        value: "telegram",
        defaultValue: "https://www.telegram.org/",
        icon: telegramImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/telegram.svg",
        href: "https://www.telegram.org/"
    },
    {
        label: "Discord",
        value: "discord",
        defaultValue: "https://www.discord.com/",
        icon: discordImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/discord.svg",
        href: "https://www.discord.com/"
    },
    {
        label: "TikTok",
        value: "tiktok",
        defaultValue: "https://www.tiktok.com/",
        icon: tiktokImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/tiktok.svg",
        href: "https://www.tiktok.com/"
    },
    {
        label: "Website",
        value: "website",
        defaultValue: "https://www.yourwebsite.com/",
        icon: websiteImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/website.svg",
        href: "https://www.yourwebsite.com/"
    },
    {
        label: "Email",
        value: "email",
        defaultValue: "example@example.com",
        icon: emailImage,
        image: "https://d3cnqzq0ivprch.cloudfront.net/prod/css/images/email/email.svg",
        href: "example@example.com"
    }
] as const;

export type SocialLinkOption = typeof SOCIAL_LINK_OPTIONS[number];
export type SocialLinkValue = SocialLinkOption["value"];

export const BACKGROUND_IMAGE_TRAITS: (string | Partial<TraitProperties>)[] = [
    {
        label: "Background image",
        name: "bgimage",
        changeProp: true,
        type: "image",
        setValue: ({ component, value, emitUpdate }) => {
            component.addStyle({ "background": value ? `url(${value})`: null });
            component.addStyle({ "background-image": value });
            const isComponentCell = component?.tagName === "td";
            if (isComponentCell) {
                component.addAttributes({ "background": value });
            }
            component.set("bgimage", value);
            emitUpdate();
        },
        getValue: ({ component }) => {
            const background = component?.getStyle()?.["background"];
            const backgroundImage = component?.getStyle()?.["background-image"];
            const url = backgroundImage ? backgroundImage : extractLinkFromBackgroundProperty(background as any);
            return url || "";
        }
    },
    {
        type: "tabs",
        name: "size",
        label: "Background size",
        changeProp: true,
        value: "contain",
        options: BACKGROUND_SIZE_OPTIONS,
        setValue: ({ component, value, emitUpdate }) => {
            const image = component
            if (!image) return;
            image?.addStyle({ "background-size": value });
            emitUpdate();
        },
        getValue: ({ component }) => {
            const image = component
            return image?.getStyle()?.["background-size"] || "cover";
        }
    },
    {
        type: "tabs",
        name: "repeat",
        label: "Background repeat",
        changeProp: true,
        value: "repeat",
        options: BACKGROUND_REPEAT_OPTIONS,
        setValue: ({ component, value, emitUpdate }) => {
            const image = component
            if (!image) return;
            image?.addStyle({ "background-repeat": value });
            emitUpdate();
        },
        getValue: ({ component }) => {
            const image = component
            return image?.getStyle()?.["background-repeat"] || "repeat";
        }
    },
    {
        type: "tabs",
        name: "Position",
        label: "Background position",
        changeProp: true,
        value: "left",
        options: BACKGROUND_POSITION_OPTIONS,
        setValue: ({ component, value, emitUpdate }) => {
            const image = component
            if (!image) return;
            image?.addStyle({ "background-position": value });
            emitUpdate();
        },
        getValue: ({ component }) => {
            const image = component
            return image?.getStyle()?.["background-position"] || "left";
        }
    },
];

export const DEFAULT_EDITOR_CONFIG = {
    protectedCss: DEFAULT_PROTECTED_CSS,
    height: "100%",
    width: "100%",
    richTextEditor: {
        custom: true,
    },
    assetManager: {
        embedAsBase64: false
    },
    selectorManager: {
        componentFirst: true // This ensures that the component's id is prioritized for styles
    },
    panels: { defaults: [] }, // This hides the top toolbar
};

export const fontFamilyOptions = [
    {
        "id": "Arial, Helvetica, sans-serif",
        "label": "Arial",
        "value": "Arial, Helvetica, sans-serif",
        "optionJSX": <span style={{fontFamily: "Arial, Helvetica, sans-serif"}}>Arial</span>
    },
    {
        "id": "Arial Black, Gadget, sans-serif",
        "label": "Arial Black",
        "value": "Arial Black, Gadget, sans-serif",
        "optionJSX": <span style={{fontFamily: "Arial Black, Gadget, sans-serif"}}>Arial Black</span>
    },
    {
        "id": "Brush Script MT, sans-serif",
        "label": "Brush Script MT",
        "value": "Brush Script MT, sans-serif",
        "optionJSX": <span style={{fontFamily: "Brush Script MT, sans-serif"}}>Brush Script MT</span>
    },
    {
        "id": "Century Gothic, sans-serif",
        "label": "Century Gothic",
        "value": "Century Gothic, sans-serif",
        "optionJSX": <span style={{fontFamily: "Century Gothic, sans-serif"}}>Century Gothic</span>
    },
    {
        "id": "Comic Sans MS, cursive, sans-serif",
        "label": "Comic Sans MS",
        "value": "Comic Sans MS, cursive, sans-serif",
        "optionJSX": <span style={{fontFamily: "Comic Sans MS, cursive, sans-serif"}}>Comic Sans MS</span>
    },
    {
        "id": "Courier, monospace",
        "label": "Courier",
        "value": "Courier, monospace",
        "optionJSX": <span style={{fontFamily: "Courier, monospace"}}>Courier</span>
    },
    {
        "id": "Courier New, Courier, monospace",
        "label": "Courier New",
        "value": "Courier New, Courier, monospace",
        "optionJSX": <span style={{fontFamily: "Courier New, Courier, monospace"}}>Courier New</span>
    },
    {
        "id": "Geneva, sans-serif",
        "label": "Geneva",
        "value": "Geneva, sans-serif",
        "optionJSX": <span style={{fontFamily: "Geneva, sans-serif"}}>Geneva</span>
    },
    {
        "id": "Georgia, serif",
        "label": "Georgia",
        "value": "Georgia, serif",
        "optionJSX": <span style={{fontFamily: "Georgia, serif"}}>Georgia</span>
    },
    {
        "id": "Helvetica, sans-serif",
        "label": "Helvetica",
        "value": "Helvetica, sans-serif",
        "optionJSX": <span style={{fontFamily: "Helvetica, sans-serif"}}>Helvetica</span>
    },
    {
        "id": "Impact, Charcoal, sans-serif",
        "label": "Impact",
        "value": "Impact, Charcoal, sans-serif",
        "optionJSX": <span style={{fontFamily: "Impact, Charcoal, sans-serif"}}>Impact</span>
    },
    {
        "id": "Lucida, sans-serif",
        "label": "Lucida",
        "value": "Lucida, sans-serif",
        "optionJSX": <span style={{fontFamily: "Lucida, sans-serif"}}>Lucida</span>
    },
    {
        "id": "Lucida Grande, sans-serif",
        "label": "Lucida Grande",
        "value": "Lucida Grande, sans-serif",
        "optionJSX": <span style={{fontFamily: "Lucida Grande, sans-serif"}}>Lucida Grande</span>
    },
    {
        "id": "Lucida Sans, sans-serif",
        "label": "Lucida Sans",
        "value": "Lucida Sans, sans-serif",
        "optionJSX": <span style={{fontFamily: "Lucida Sans, sans-serif"}}>Lucida Sans</span>
    },
    {
        "id": "MS Serif, serif",
        "label": "MS Serif",
        "value": "MS Serif, serif",
        "optionJSX": <span style={{fontFamily: "MS Serif, serif"}}>MS Serif</span>
    },
    {
        "id": "New York, serif",
        "label": "New York",
        "value": "New York, serif",
        "optionJSX": <span style={{fontFamily: "New York, serif"}}>New York</span>
    },
    {
        "id": "Palatino, serif",
        "label": "Palatino",
        "value": "Palatino, serif",
        "optionJSX": <span style={{fontFamily: "Palatino, serif"}}>Palatino</span>
    },
    {
        "id": "Palatino Linotype, serif",
        "label": "Palatino Linotype",
        "value": "Palatino Linotype, serif",
        "optionJSX": <span style={{fontFamily: "Palatino Linotype, serif"}}>Palatino Linotype</span>
    },
    {
        "id": "Inter, sans-serif",
        "label": "Inter",
        "value": "Inter, sans-serif",
        "optionJSX": <span style={{fontFamily: "Inter, sans-serif"}}>Inter</span>
    },
    {
        "id": "Tahoma, Geneva, sans-serif",
        "label": "Tahoma",
        "value": "Tahoma, Geneva, sans-serif",
        "optionJSX": <span style={{fontFamily: "Tahoma, Geneva, sans-serif"}}>Tahoma</span>
    },
    {
        "id": "Times New Roman, Times, serif",
        "label": "Times New Roman",
        "value": "Times New Roman, Times, serif",
        "optionJSX": <span style={{fontFamily: "Times New Roman, Times, serif"}}>Times New Roman</span>
    },
    {
        "id": "Trebuchet MS, Helvetica, sans-serif",
        "label": "Trebuchet MS",
        "value": "Trebuchet MS, Helvetica, sans-serif",
        "optionJSX": <span style={{fontFamily: "Trebuchet MS, Helvetica, sans-serif"}}>Trebuchet MS</span>
    },
    {
        "id": "Verdana, Geneva, sans-serif",
        "label": "Verdana",
        "value": "Verdana, Geneva, sans-serif",
        "optionJSX": <span style={{fontFamily: "Verdana, Geneva, sans-serif"}}>Verdana</span>
    }
];

export function getSortedFontFamilyOptions() {
    return [...fontFamilyOptions].sort((a, b) => a.label.localeCompare(b.label));
};

export const FONT_FAMILY_OPTIONS = getSortedFontFamilyOptions();


export const FONT_SIZE_OPTIONS = [
    { label: "4px", value: "4px" },
    { label: "8px", value: "8px" },
    { label: "12px", value: "12px" },
    { label: "16px", value: "16px" },
    { label: "20px", value: "20px" },
    { label: "24px", value: "24px" },
    { label: "28px", value: "28px" },
    { label: "32px", value: "32px" }
] as const;