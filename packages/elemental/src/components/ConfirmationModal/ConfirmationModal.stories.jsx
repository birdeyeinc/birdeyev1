import ConfirmationModalComponent from "./index";

export default {
  title: "Component/ConfirmationModal",
  component: ConfirmationModalComponent,
};

const Template = (args) => <ConfirmationModalComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: "Exit without replying?",
  description:
    "Are you sure you want to exit? Replies will not be posted for the selected reviews.",
  confirmButtonLabel: "Exit",
  customWidth: 450,
  show: true,
};

export const standard = Template.bind({});

standard.args = {
  type: "standard",
  title: "Exit without replying?",
  description:
    "Are you sure you want to exit? Replies will not be posted for the selected reviews.",
  confirmButtonLabel: "Exit",
  customWidth: 450,
  show: true,
};
