import ToggleComponent from './index';

export default {
  title: "Atom/Toggle",
  component: ToggleComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  }
};

const Template = (args) => <ToggleComponent {...args} />;

export const Default = Template.bind({});

export const RoundedToggle = Template.bind({});

RoundedToggle.args = {
  roundedToggle: true
}

export const GraphToggle = Template.bind({});

GraphToggle.args = {
  className: "ml-10",
  children: "Hey, hover on me.",
  offLabel: "Grid view",
  offIcon: "icon_phoenix-products-v2",
  onLabel: "List view",
  onIcon: "icon_phoenix-formatting-list",
  graphToggle: true,
};