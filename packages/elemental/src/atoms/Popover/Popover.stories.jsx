import React from 'react';
import PopoverComponent from './index';
import Tooltip from 'atoms/Tooltip';

export default {
    title: 'Atom/Popover',
    component: PopoverComponent,
}

export const Popover = {
  args: {
    float:"right",
        style: ({
          fontSize: "21px",
          position: "relative",
          top: -1,
          color: '#123',
        }),
        // onMouseOver:{showSelfStarterCallout ? onMouseOverHandler : null},
        // onClick:{showSelfStarterCallout ? onMouseOverHandler : null}
        // onMouseClick:{menuQuestionClicked}
        // showOnClick:{showQuestionOnClick}
        enableClick: true,
        // toggleShownMenu:{toggleShownMenu}
        custom:(
          <Tooltip
            tooltipClass="inner"
            hideOnScroll
            text={"Help"}
            position="bottom"
            disableOnTablets
          >
            <span
              className="header-icon common-icon"
              // onClick={menuQuestionClicked}
            >
              "Hello"
            </span>
          </Tooltip>
        ),
        className:"support-block",
        size:"medium"
},
    argTypes: {
        float: {
            description: 'Determines the position of the popover relative to the trigger element (left, right).',
            control: { type: 'select', options: ['left', 'right'] },
            defaultValue: 'left',
        },
        custom: {
            description: 'Custom element or node to be used as the popover content.',
            control: 'object',
        },
        showOnClick: {
            description: 'Whether the popover should show on click.',
            control: 'boolean',
        },
        fixed: {
            description: 'Whether the popover should be fixed.',
            control: 'boolean',
        },
        size: {
            description: 'Size of the popover (small, medium, large, m-large, x-large, xx-large).',
            control: { type: 'select', options: ['small', 'medium', 'large', 'm-large', 'x-large', 'xx-large'] },
        },
        showBtnIcon: {
            description: 'Whether to show a button icon in the popover.',
            control: 'boolean',
        },
        includeBoxShadow: {
            description: 'Whether the popover includes a box shadow.',
            control: 'boolean',
        }
    },
};
