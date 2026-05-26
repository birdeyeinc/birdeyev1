import AccordionComponent from './index';

export default {
  title: "Atom/Accordion",
  component: AccordionComponent,
  tags: ["autodocs"]
};

export const Accordion = {
  args: {
    items: [
        {
            title: 'Accordion Item #1',
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
            ),
            icon: 'icon_phoenix-checklist'
          },
          {
            title: 'Accordion Item #2',
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
            ),
            icon: 'icon_phoenix-checklist'
          }
      ],
      isDefaultOpen: true
  }
};