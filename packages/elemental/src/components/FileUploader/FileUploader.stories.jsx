import Button from "atoms/Button";
import FileUploader from ".";

export default {
    title: "Component/FileUploader",
    component: FileUploader,
    tags: ["autodocs"]
};

const Template = (args) => <FileUploader {...args} />;

export const Default = Template.bind({});

Default.args = {
    preview: "off",
    acceptFileTypes: ".jpg,.jpeg,.png",
    onChange: (file) => {
        console.log("File uploaded", file);
    },
    onError: (e) => {
        console.log("Error uploading file", e);
    }
}

export const WithCustomElement = Template.bind({});

const getCustomSelectDropZone = () => {
    return (<div>
        <Button theme={"secondary"} label={"Upload image"} />
        <p>or drag & drop here</p>
    </div>);
};
WithCustomElement.args = {
    ...Default.args,
    customselect: true,
    customSelectElement: getCustomSelectDropZone()

}

export const WithImagePreview = Template.bind({});

WithImagePreview.args = {
    ...Default.args,
    preview: "on",
    customClassName: "default-image-preview"
}