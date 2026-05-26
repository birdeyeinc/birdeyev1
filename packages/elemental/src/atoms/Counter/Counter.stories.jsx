import React, { useState } from "react";
import Counter from "./index";

export default {
  title: "Atom/Counter",
  component: Counter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: {
      control: "number",
      description: "Current counter value",
    },
    min: {
      control: "number",
      description: "Minimum allowed value",
    },
    max: {
      control: "number",
      description: "Maximum allowed value",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Predefined size of the counter",
    },
    disabled: {
      control: "boolean",
      description: "Disable the counter",
    },
    width: {
      control: "text",
      description: "Custom width (overrides size preset)",
    },
    height: {
      control: "text",
      description: "Custom height (overrides size preset)",
    },
  },
};

// Template for interactive stories
const Template = (args) => {
  const [count, setCount] = useState(args.value);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCount((prev) => prev - 1);
  };

  return (
    <Counter
      {...args}
      value={count}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
    />
  );
};

// Default story
export const Default = Template.bind({});
Default.args = {
  value: 0,
  size: "medium",
};

// Small size
export const Small = Template.bind({});
Small.args = {
  value: 5,
  size: "small",
};

// Medium size
export const Medium = Template.bind({});
Medium.args = {
  value: 10,
  size: "medium",
};

// Large size
export const Large = Template.bind({});
Large.args = {
  value: 15,
  size: "large",
};

// With min/max constraints
export const WithMinMax = Template.bind({});
WithMinMax.args = {
  value: 5,
  min: 0,
  max: 10,
  size: "medium",
};
WithMinMax.parameters = {
  docs: {
    description: {
      story: "Counter with minimum (0) and maximum (10) value constraints.",
    },
  },
};

// Disabled state
export const Disabled = Template.bind({});
Disabled.args = {
  value: 5,
  disabled: true,
  size: "medium",
};

// Custom dimensions
export const CustomSize = Template.bind({});
CustomSize.args = {
  value: 0,
  width: "150px",
  height: "60px",
  size: "medium",
};
CustomSize.parameters = {
  docs: {
    description: {
      story: "Counter with custom width and height dimensions.",
    },
  },
};

// Multiple counters demo
export const MultipleCounters = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(5);
  const [count3, setCount3] = useState(10);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ marginRight: "10px", fontWeight: "500" }}>Small:</label>
        <Counter
          value={count1}
          onIncrement={() => setCount1(count1 + 1)}
          onDecrement={() => setCount1(count1 - 1)}
          size="small"
          min={0}
        />
      </div>
      <div>
        <label style={{ marginRight: "10px", fontWeight: "500" }}>Medium:</label>
        <Counter
          value={count2}
          onIncrement={() => setCount2(count2 + 1)}
          onDecrement={() => setCount2(count2 - 1)}
          size="medium"
          min={0}
          max={20}
        />
      </div>
      <div>
        <label style={{ marginRight: "10px", fontWeight: "500" }}>Large:</label>
        <Counter
          value={count3}
          onIncrement={() => setCount3(count3 + 1)}
          onDecrement={() => setCount3(count3 - 1)}
          size="large"
          min={0}
        />
      </div>
    </div>
  );
};
MultipleCounters.parameters = {
  docs: {
    description: {
      story: "Multiple counter instances with different sizes and constraints.",
    },
  },
};
