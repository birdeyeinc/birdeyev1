import React from "react";
import Steppers from ".";
import { STEPPER_STATUS_CONSTANTS } from "./Steppers.constants";

export default {
  title: "Atom/Steppers",
  component: Steppers,
  tags: ["autodocs"],
};

const Template = (args) => <Steppers {...args} />;

export const Default = Template.bind({});
Default.args = {
  steps: [
    { stepHeading: "Step 1", content: () => <p>Content for Step 1</p> },
    { stepHeading: "Step 2", content: () => <p>Content for Step 2</p> },
    { stepHeading: "Step 3", content: () => <p>Content for Step 3</p> },
  ],
  initialStep: 0,
};

export const WithCustomCTA = Template.bind({});
WithCustomCTA.args = {
  steps: [
    {
      stepHeading: "Step 1",
      content: () => <p>Custom CTA Step 1 Content</p>,
      cta: {
        next: { label: "Proceed", onClick: () => alert("Next clicked!") },
        prev: { label: "Go Back", onClick: () => alert("Previous clicked!") },
        cancel: { label: "Cancel", onClick: () => alert("Cancel clicked!") },
      },
    },
    {
      stepHeading: "Step 2",
      content: () => <p>Custom CTA Step 2 Content</p>,
    },
  ],
  initialStep: 0,
};

export const VerticalWizardNav = Template.bind({});
VerticalWizardNav.args = {
  variant: "vertical",
  steps: [
    {
      stepHeading: "Business details",
      selected: true,
      icon: <span>1</span>,
      onClick: () => undefined,
    },
    {
      stepHeading: "A very long wizard step label that needs a tooltip",
      icon: <span>2</span>,
      aiMarker: true,
      onClick: () => undefined,
    },
    {
      stepHeading: "Review and publish",
      isCompleted: true,
      icon: <span className="navIcon icon_phoenix-important-fill" />,
      onClick: () => undefined,
    },
    {
      stepHeading: "Required after completion",
      isMandatory: true,
      icon: <span>4</span>,
    },
  ],
};
