import ButtonComponent from './index';

export default {
  title: "Atom/Button",
  component: ButtonComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    isAeroDesign: {
      control: 'boolean',
      description: 'Enable Design System styling',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
};

const Template = (args) => <ButtonComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  theme: "primary",
  label: "Button"
};

export const WithisAeroDesign = Template.bind({});
WithisAeroDesign.args = {
  theme: "secondary",
  label: "DS Button",
  isAeroDesign: true
};

export const themeVariants = ()=>{
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <ButtonComponent theme="primary" label="Primary" />
      <ButtonComponent theme="secondary" label="Secondary" />
      <ButtonComponent theme="link" label="link" />
      <ButtonComponent theme="super" label="super" />
      <ButtonComponent theme="danger" label="danger" />
      <ButtonComponent theme="danger-primary" label="danger-primary" />
      <ButtonComponent theme="noBorder" label="noBorder" />
      <ButtonComponent theme="errorlink" label="errorlink" />
      <ButtonComponent theme="secondary-link" label="secondary-link" />
    </div>
  );
}

export const themeVariantsWithisAeroDesign = ()=>{
  return (
    <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
      <div style={{ marginBottom: "10px", fontWeight: "500" }}>With isAeroDesign Flag:</div>
      <div style={{ display: "flex", gap: "10px" }}>
        <ButtonComponent theme="primary" label="Primary" isAeroDesign={true} />
        <ButtonComponent theme="secondary" label="Secondary" isAeroDesign={true} />
        <ButtonComponent theme="link" label="link" isAeroDesign={true} />
        <ButtonComponent theme="super" label="super" isAeroDesign={true} />
        <ButtonComponent theme="danger" label="danger" isAeroDesign={true} />
      </div>
    </div>
  );
}

export const withCount = Template.bind({})
withCount.args = {
  theme: "primary",
  label: "Button",
  showCount: 8 
}

export const withCountAndisAeroDesign = Template.bind({})
withCountAndisAeroDesign.args = {
  theme: "secondary",
  label: "DS Button",
  showCount: 5,
  isAeroDesign: true
}

export const fileType = Template.bind({});
fileType.args = {
  theme: "primary",
  label: "Select File",
  type: "file",
  onChange: (data)=>{alert(("fileName: "+data.currentTarget.files[0].name))}
}