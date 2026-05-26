import FormInput from ".";

export default {
  title: "Atom/FormInput",
  component: FormInput,
  tags: ["autodocs"],
};

const Template = (args) => <FormInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: "firstname",
  name: "firstName",
  value: "Birdeye",
};

export const Disable = Template.bind({});
Disable.args = {
  id: "firstname",
  name: "firstName",
  value: "Birdeye",
  disabled: true,
};

export const Checkbox = (args) => (
  <div className="alert-checkbox">
    <FormInput
      id="email"
      name="Email Id"
      className="checkBox"
      value={1}
      type="checkbox"
      checked={true}
      {...args}
    />
    <label htmlFor={`email`}>Email me when a verify request is completed</label>
  </div>
);