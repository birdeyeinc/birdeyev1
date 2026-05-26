import CustomModalComponent from './index';

export default {
  title: "Atom/CustomModal",
  component: CustomModalComponent
};

export const CustomModal = {
  args: {
    title: "This is a title",
    subtitle: "This is a subtitle",
    needPrimaryBtn: true,
    primaryBtnLabel: "Save",
    needSecondaryBtn: true,
    primaryBtnTheme: "primary"
  }
};
