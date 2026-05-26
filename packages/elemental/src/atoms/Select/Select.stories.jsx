import React, { useState } from "react";
import { Select as SelectComponent, SelectItem } from ".";
import Chip from "atoms/Chip";

export default {
  title: "Atom/Select",
  component: SelectComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => {
  return (
    <div style={{ width: "400px" }}>
      <SelectComponent {...{ ...args }}>
        <SelectItem value="item1">Item 1</SelectItem>
        <SelectItem value="item2">Item 2</SelectItem>
        <SelectItem value="item3">Item 3</SelectItem>
      </SelectComponent>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};

const ControlledTemplate = (args) => {
  const [value, setValue] = useState([]);
  const onChange = (event, newValue) => {
    setValue(newValue);
  };
  const onClose = ()=>{
    console.log("Closed")
  }
  return (
    <div style={{ width: "400px" }}>
      <SelectComponent {...{ ...args, value, onChange, onClose }}>
        <SelectItem value="item1">Item 1</SelectItem>
        <SelectItem value="item2">Item 2</SelectItem>
        <SelectItem value="item3">Item 3</SelectItem>
      </SelectComponent>
    </div>
  );
};

export const Multiple = ControlledTemplate.bind({});
Multiple.args = {
  multiple: true,
  defaultOpen: true
};

const CustomizedTemplate = (args) => {
  const [value, setValue] = useState([]);
  const onChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div style={{ width: "400px" }}>
      <SelectComponent {...{ ...args, value, onChange }}>
        <SelectItem value="item1">
          <div style={{ backgroundColor: "lightblue" }}>Item 1</div>
        </SelectItem>
        <SelectItem value="item2">
          <div style={{ backgroundColor: "lightblue" }}>Item 2</div>
        </SelectItem>
        <SelectItem value="item3">
          <div style={{ backgroundColor: "lightblue" }}>Item 3</div>
        </SelectItem>
        <SelectItem value="item4">
          <div style={{ backgroundColor: "lightblue" }}>Item 4</div>
        </SelectItem>
        <SelectItem value="item5">
          <div style={{ backgroundColor: "lightblue" }}>Item 5</div>
        </SelectItem>
        <SelectItem value="item6">
          <div style={{ backgroundColor: "lightblue" }}>Item 6</div>
        </SelectItem>
      </SelectComponent>
    </div>
  );
};

export const CustomizedDisplayValueAndRenderItem = CustomizedTemplate.bind({});
CustomizedDisplayValueAndRenderItem.args = {
  multiple: true,
  renderValue: (selectedValues) => {
    if (selectedValues.length == 0) return "Select";
    return (
      <div style={{ display: "flex", gap: "5px" }}>
        {selectedValues.map((item) => (
          <Chip label={item} key={item} />
        ))}
      </div>
    );
  },
};
