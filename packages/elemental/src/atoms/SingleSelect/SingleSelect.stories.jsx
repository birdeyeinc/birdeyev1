import SingleSelectComponent from './index';

export default {
  title: "Atom/SingleSelect",
  component: SingleSelectComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

const list = [
  {
    label: "Option 1",
    value: "option1"
  },
  {
    label: "Option 2",
    value: "option2"
  },
  {
    label: "Option 3",
    value: "option3"
  },
  {
    label: "Option 4",
    value: "option4"
  },
  {
    label: "Option 5",
    value: "option5"
  }
]

export const SingleSelect = {
  args: {
    name: "userReseller",
    options: list,
    selected: list[0],
    className: "phoenix-dropdown",
    onChange: () => {},
    displayLabel: "Business",
    customCTAJSX: <div>Add custom field</div>,
    isAeroDesign: true
  }
};