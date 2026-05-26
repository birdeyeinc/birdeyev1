import React, { useRef } from "react";
import ActionBoxComponent from "./index";

export default {
  title: "Atom/ActionBox",
  component: ActionBoxComponent,
  tags: ["autodocs"],
  argTypes: {
    actionConfig: { control: "object" },
    actionClickCb: { action: "clicked" },
    ActionLabel: { control: "text" },
    disabled: { control: "boolean" },
    customSelectionJsx: { control: "object" },
    customClass: { control: "text" },
    tabOnTopData: { control: "object" },
    openOnPgLoad: { control: "boolean" },
    customClassName: { control: "text" },
    removeWrapperStyling: { control: "boolean" },
    popOverSize: { control: "text" },
    popOverDirection: { control: "text" },
    actionBoxOpenCustomClass: { control: "text" },
    headerOnTop: { control: "object" },
    isBlueActionBox: { control: "boolean" },
    openBasedOnWindowHeight: { control: "boolean" },
    scrollActionBoxIntoView: { control: "boolean" },
    customHeaderClassName: { control: "text" },
    from: { control: "text" },
    toggleQuickSend: { action: "toggled" },
    selectedVal: {
      control: { type: "select", options: ["option1", "option2"] },
    }, // Update options as needed
    noLabel: { control: "boolean" },
    appointmentPopOverDirection: { control: "boolean" },
    hideTT: { control: "boolean" },
    scrollActionBoxBehaviour: { control: "text" },
    overrideDefault: { control: "boolean" },
    customFunOnClickOutSide: {action: "customFunOnClickOutSide"},
    customFunOnClickActionBox: {action: "customFunOnClickActionBox"},
    customDropdownIcon: {control: "text"},
    selectedChild: {control: "text"},
  },
};

const Template = (args) => <ActionBoxComponent {...args} />;

const getActionConfig = () => {
      const option1 = {
      value: "option1",
      label: "Option 1",
      callBack: () => {
        return alert("Option 1");
      },
      enable: true,
      selectionVal:"option1",
      subTypes:["Sub Type 1", "Sub Type 2 ", "Sub Type 3"],
    },
    option2 = {
      value: "option2",
      label: "Option 2",
      selectionVal:"option2",
      callBack: () => {
        return alert("Option 2");
      },
      enable: true,
    };
  const options = [option1, option2];
  return {
    categories: [
      {
        title: "",
        options,
      },
    ],
  };
};

export const Default = Template.bind({});
Default.args = {
  actionConfig: getActionConfig(),
};

export const NoLabel = Template.bind({});
NoLabel.args = {
  actionConfig: getActionConfig(),
  noLabel: true,
  customDropdownIcon: " icon_phoenix-cheveron_open",
  customHeaderClassName: "pd-10"
};

export const ChildOptions = Template.bind({});
ChildOptions.args = {
  actionConfig: getActionConfig(),
  selectedVal: "option1",
  selectedChild: "Sub Type 1",
};

export const ContainerAwarePopover = () => {
  const containerRef = useRef();
  const actionConfig = {
    categories: [
      {
        title: "Actions",
        options: [
          { label: "Edit", enable: true },
          { label: "Delete", enable: true },
          { label: "Archive", enable: true },
        ],
      },
    ],
  };
  return (
    <div
      ref={containerRef}
      style={{
        height: 200,
        overflow: "auto",
        border: "1px solid #ccc",
        padding: 24,
        margin: 40,
        position: "relative",
      }}
    >
      <div style={{ height: 120 }} />
      <ActionBoxComponent
        actionConfig={actionConfig}
        openBasedOnWindowHeight={true}
        containerRef={containerRef}
        ActionLabel="Container Aware"
        popOverDirection="left"
      />
      <div style={{ height: 250 }} />
    </div>
  );
};
