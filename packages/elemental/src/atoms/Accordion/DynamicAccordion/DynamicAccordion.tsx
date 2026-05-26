import React, { ReactNode, useState } from 'react';
import './DynamicAccordion.scss';

interface DynamicAccordionProps {
    items: Array<{
        title: ReactNode,
        subTitle?: ReactNode,
        accordionIcon?: {
            position: 'left' | 'right',
            icon?: string
        },
        arrowIcon?: {
            position: 'left' | 'right',
            icon?: string
        }
        content: ReactNode,
        accordionChangeCallback?: Function
    }>,
    isDefaultOpen?: boolean,
    openMultipleAccordion?: boolean,
    defaultOpenIndex?: number[],
    onAccordionClosed?: (isClosed: boolean) => void
}

const DynamicAccordion: React.FC<DynamicAccordionProps> = ({
    items, isDefaultOpen = false, openMultipleAccordion = false, defaultOpenIndex,onAccordionClosed
}) => {
    const [accordionState, setAccordionState] = useState(setInitialAccordionState());

    function setInitialAccordionState() {
        const obj: { [key: number]: boolean } = {};
        items.forEach((_, idx) => {
            if (defaultOpenIndex && defaultOpenIndex?.length > 0) {
                obj[idx] = defaultOpenIndex?.includes(idx);
            } else {
                obj[idx] = !!isDefaultOpen;
            }
        });
        return obj;
    }



    const handleTitleClick = (index: number) => {
        if (openMultipleAccordion) {
            setAccordionState(prev => ({
                ...prev,
                [index]: !prev[index],
            }));
        } else {
            const newAccordionState: { [key: number]: boolean } = {};
            items.forEach((_, idx) => {
                newAccordionState[idx] = idx === index ? !accordionState[idx] : false;
            });
            setAccordionState(newAccordionState);
        }
    
        items[index].accordionChangeCallback?.();
        if (onAccordionClosed) {
            onAccordionClosed(accordionState[index]);
        }
    };


    return (
        <ul className='dynamic-accordion-container'>
            {!!items.length &&
                items.map((item, idx) => {
                    const { title, subTitle, accordionIcon, content } = item;
                    return (
                        <li className={accordionState[idx] ? 'open' : ''} key={idx}>
                            <div className='accordion-header display-flex-start'>
                                <div className='header-arrow-icon' onClick={() => handleTitleClick(idx)}>
                                    <i className='accordionIcon icon_phoenix-down-arrow' />
                                </div>
                                {!!accordionIcon?.icon && <div className='accordionIcon'>{accordionIcon?.icon}</div>}
                                <div className='header-content'>
                                    <h2 onClick={() => handleTitleClick(idx)}>{title}</h2>
                                    <span>{!!subTitle && <div className='subTitle'>{subTitle}</div>}</span>
                                </div>
                            </div>
                            <div className='accordion-body'>
                                <div className='accordion-body-content'>{content}</div>
                            </div>
                        </li>
                    );
                })}
        </ul>
    );
};

export default DynamicAccordion;