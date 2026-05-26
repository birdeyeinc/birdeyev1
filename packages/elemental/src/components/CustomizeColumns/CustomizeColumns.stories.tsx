import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import CustomizeColumns from "./index";

export default {
  title: "Component/CustomizeColumns",
  component: CustomizeColumns,
} as Meta;

type Column = { name: string; order: number; visible: boolean; isDefault?: boolean };

const makeCopy = (cols: Column[]) => JSON.parse(JSON.stringify(cols));

const Template: Story<any> = (args) => {
  const [cols, setCols] = useState<Column[]>(makeCopy(args.columns));

  return (
    <CustomizeColumns
      {...args}
      columns={cols}
      onChange={(updated: Column[]) => {
        setCols(updated);
        action("onChange")(updated);
      }}
      onSave={(ordered: Column[]) => {
        // emulate saving in parent
        setCols(ordered);
        action("onSave")(ordered);
      }}
      onBack={(e: Event) => action("onBack")(e)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  title: "Customize Columns",
  showSearch: true,
  showDragHandle: true,
  columns: [
    { name: "id", order: 1, visible: true, isDefault: true },
    { name: "firstName", order: 2, visible: true },
    { name: "lastName", order: 3, visible: true },
    { name: "email", order: 4, visible: false },
    { name: "createdAt", order: 5, visible: false },
  ],
};

export const NoSearch = Template.bind({});
NoSearch.args = {
  ...Default.args,
  showSearch: false,
};

export const AllVisible = Template.bind({});
AllVisible.args = {
  ...Default.args,
  columns: Default.args.columns.map((c: Column) => ({ ...c, visible: true })),
};

export const NoDrag = Template.bind({});
NoDrag.args = {
  ...Default.args,
  showDragHandle: false,
};

export const LargeList = Template.bind({});
LargeList.args = {
  ...Default.args,
  showSearch: true,
  title: "Customize table view",
  searchPlaceholder: "Search columns...",
  subtitle: "Select the columns to show and order them by priority",
  columns: Array.from({ length: 20 }).map((_, i) => ({
    name: `col${i + 1}`,
    order: i + 1,
    visible: i % 3 === 0,
  })),
};

export const ScrollableLarge = Template.bind({});
ScrollableLarge.args = {
  ...LargeList.args,
  title: "Customize Columns",
  // set height > 748px to trigger scrolling behavior
  width: "600px",
  height: "820px",
  columns: Array.from({ length: 40 }).map((_, i) => ({
    name: `col${i + 1}`,
    order: i + 1,
    visible: i % 2 === 0,
  })),
};

export const WithDefaults = Template.bind({});
WithDefaults.args = {
  ...Default.args,
  title: "Customize Columns",
  showSearch: true,
  columns: [
    { name: "id", order: 1, visible: false, isDefault: true },
    { name: "username", order: 2, visible: true , isDefault: true },
    { name: "email", order: 3, visible: false, isDefault: true },
    { name: "phone", order: 4, visible: true , isDefault: false },
    { name: "createdAt", order: 5, visible: false, isDefault: false },
    { name: "updatedAt", order: 6, visible: false, isDefault: false },
    { name: "deletedAt", order: 7, visible: false, isDefault: false },
  ],
};
