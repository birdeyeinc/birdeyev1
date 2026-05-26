import React from 'react';
import {DynamicAccordion as DAComponent} from '../index';

export default {
  title: "Atom/Accordion",
  component: DAComponent,
};

export const DynamicAccordion = {
  args: {
    items: [
      {
        title: 'Accordion Item #1',
        subTitle: 'Accordion Subtitle',
        content: (
          <div>
            <strong>Thiss is the first item's accordion body.</strong> It is
            hidden by default, but shown when the title is clicked. It will also
            be hidden if the title is clicked again or when another item is
            clicked. You can pass HTML tags in the content such as{' '}
            <u>underline tag</u>, <i>italic</i>, or even another list like this:
            <ul>
              <li>Bread</li>
              <li>Eggs</li>
              <li>Milk</li>
            </ul>
          </div>
        )
      },
      {
        title: 'Accordion Item #2',
        subTitle: 'Accordion Subtitle',
        content: (
          <div>
            <strong>This is the second item's accordion body.</strong> It is
            hidden by default, but shown when the title is clicked. It will also
            be hidden if the title is clicked again or when another item is
            clicked. You can pass HTML tags in the content such as{' '}
            <u>underline tag</u>, <i>italic</i>, or even another list like this:
            <ul>
              <li>Bread</li>
              <li>Eggs</li>
              <li>Milk</li>
            </ul>
          </div>
        )
      }
    ],
    isDefaultOpen: false,
    openMultipleAccordion: false,
    defaultOpenIndex: [1]
  }
};
