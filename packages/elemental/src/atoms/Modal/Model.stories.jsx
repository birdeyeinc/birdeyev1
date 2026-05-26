import React from "react";
import ModalComponent from "./index";

export default {
  title: "Atom/Modal",
  component: ModalComponent,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => <ModalComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  dialogOptions: {
    shouldCloseOnOverlayClick: true,
    isOpen: true,
    title: "",
    showCloseIcon: true,
    onCloseModal: () => {
      alert("close modal logic triggered :D");
    },
  },
  children: <p>Content Here!!!!</p>,
};
