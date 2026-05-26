import React, { useState } from "react";
import TooltipComponent from "./";
import { Select as SelectComponent, SelectItem } from "atoms/Select";

export default {
  title: "Atom/Tooltip",
  component: TooltipComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  }
};

const Template = (args) => <TooltipComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  theme: "primary",
  children: "Hey, hover on me.",
  text: "See, this is our tooltip.",
};

const VariantTemplate = () => (
  <div style={{ display: "flex", gap: "60px" }}>
    <TooltipComponent
      theme="primary"
      text="See, this is our tooltip."
      children="Default Tooltip"
    />
    <TooltipComponent
      theme="red"
      text="See, this is our tooltip."
      children="Red Tooltip"
    />
    <TooltipComponent
      theme="white"
      text="See, this is our tooltip."
      children="White Tooltip"
    />
  </div>
);

export const ThemeVariants = VariantTemplate.bind({});

export const PositionVariants = () => {
  const [position, setPosition] = useState("bottom");
  const list = [
    "right",
    "left",
    "top",
    "bottom",
    "top-right",
    "bottom-right",
    "bottom-left",
    "bottom-left-pre",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
      <div style={{ margin: "0px auto" }}>
        <TooltipComponent
          theme="primary"
          text="See, this is our tooltip."
          children="Hover here.."
          position={position}
        />
      </div>
      <div style={{ width: "250px" }}>
        <SelectComponent
          onChange={(event, item) => {
            console.log({ item });
            setPosition(item);
          }}
          placeHolder="Select Tooltip Position"
        >
          {list.map((item) => (
            <SelectItem value={item}>{item}</SelectItem>
          ))}
        </SelectComponent>
      </div>
    </div>
  );
};

export const CustomTooltip = () => {
  return (
    <TooltipComponent
      size="medium"
      text={
        <div>
          <p>
            Hello i am P tag with icon{" "}
            <i className="icon_phoenix-star-filled" />
          </p>
        </div>
      }
    >
      Hover me!!!
    </TooltipComponent>
  );
};
