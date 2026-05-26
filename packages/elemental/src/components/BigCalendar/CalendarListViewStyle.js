import { fontStyle, sizeStyle, borderRadius, flexbox, centerFlexAll } from "emotion/global/mixin";
import { mt5, mb20, pb5, pb40, pt40, pd15, mb0, displayBlock, pt20, ml10, pd5, mr10 } from "emotion/global/layoutHelper";
import { white, brandColor, defaultColor, f9f, graye9, blue0076, purple  } from "emotion/global/variable";
import { css } from "@emotion/react";

export const calendarCardListView = css`
    label: calendar-card-list-view;

    ${pb5};

    margin-top: 88px;

    .calendar-card-box {
        ${pb40};
        ${pt40};
        background-color: ${white};
        border-bottom: 1px solid ${graye9};

        &:first-child {
            ${pt20};
        }


        &.calendar-past-date {
            background-color: ${f9f};
        }

        .calendar-date-wrap  {
            margin: 0 auto;

            ${mb20};
            ${sizeStyle("600px", false)};

            .day-name {
                ${flexbox()};
                ${fontStyle("20px", defaultColor, 400, false)};
                
                align-items: center;
                min-height: 25px;
                .weekday {
                    ${fontStyle("20px", defaultColor, 500, false)};
                }

                &.current-date-text {
                    .list-date{
                        ${pd5};
                        ${borderRadius("50%", "50%", "50%", "50%")};
                        ${sizeStyle("30px", "30px")}
                        ${fontStyle("17px", white, 400, false)};
                        ${centerFlexAll};

                        background-color: ${brandColor};
                    }
                }

                &:hover {
                    .add-post-on-date {
                        ${ml10};

                        display: inline-block;
                     }
                }
            }

            .add-post-on-date {
                display: none;
                i {
                    ${mt5};
                    ${fontStyle("20px", blue0076, 400, false)};
                    cursor: pointer;

                    &:before {
                        color: ${blue0076};
                    }
                }
            }
        }

        .list-view-besttime-post {
            margin: 0 auto;

            ${mb20};
            ${sizeStyle("600px", false)};
            ${flexbox()};

            .ai-best-time {
                ${mr10};
                ${mb0};
                
                &:hover {
                    border-color: ${purple};
                }
            }
        }

        .list-view-box-wrapper {
            margin: 0 auto;
            min-height: 48px;

            ${sizeStyle("600px", false)};

            .list-view-cards {
                &:not(:last-child) {
                    ${mb20};
                }
            }

            .create-post-cta {
                ${pd15};
                ${borderRadius(6,6,6,6)};
                ${fontStyle("15px", blue0076, 400, false)};
                ${sizeStyle("100%", false)};
                
                display: none;
                background-color: rgba(214, 234, 255, 0.50);
                gap:0px 10px;
                outline: none;
                border:none;
                cursor: pointer;
                

                i {
                    ${fontStyle("18px", false, false, false)};

                    &:before {
                      color: ${blue0076};

                  }  
                }
            }
        }

        &:hover {
            .create-post-cta {
                ${centerFlexAll};
             }
        }

        &.list-last-card {
            border-bottom: none;
        }
    }
`;

export const shimmerListWrapper = css`
    label: shimmer-list-wrapper;
    
    margin-top: 20px;

    .shimmer-list-view-wrapper {
        padding: 10px 61px;

        ${mb20};

        &.initialLoader{
            &:first-child {
                margin-top: 88px;
            }
        }
    }

    .circular-wrapper {
        ${sizeStyle("600px", false,)};

        margin: 0 auto;

        .bar {            
            ${sizeStyle("96px", "23px")};
            ${borderRadius(6,6,6,6)};
            ${displayBlock};
            ${mb20};
        }

        .circular-shape {
            ${sizeStyle("28px", "28px")};
            ${borderRadius("50%","50%","50%","50%")};
        }
    }

    .shimmer-card {
        ${pd15};
        ${borderRadius(6,6,6,6)};
        ${mb20};
        ${sizeStyle("600px", false,)};

        margin: 0 auto;

        border: 1px solid ${graye9};

        .shimmer-name {
            ${sizeStyle("100px", "20px")};
            ${borderRadius(6,6,6,6)};
        }

        .shimmer-heading {
            ${sizeStyle("100%", "20px")};
            ${borderRadius(6,6,6,6)};
        }

        .shimmer-content {
            ${sizeStyle("130px", "130px")};
            ${borderRadius(10,10,10,10)};
        }

        .shimmer-footer {
            ${sizeStyle("226px", "20px")};
            ${borderRadius(6,6,6,6)};
            ${mb0};
        }
    }

    .bar,
    .circular-shape,
    .shimmer-heading,
    .shimmer-name,
    .shimmer-content,
    .shimmer-footer {
        opacity: 0.5;
        background: rgba(71, 71, 71, 0.20);
        background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(71, 71, 71, 0.20) 51.56%, rgba(255, 255, 255, 0.00) 100%);
        background-repeat: no-repeat;
        border: 1px solid ${white};
        background-size: 100% 100%;
        -webkit-animation-duration: 1s;
        -webkit-animation-fill-mode: forwards;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-name: glareShimmer;
        -webkit-animation-timing-function: linear;
        margin-bottom: 17px;
    }

    @keyframes glareShimmer {
        0% {
            background-position: -468px 0;
        }

        100% {
            background-position: 468px 0;
        }
    }
`;