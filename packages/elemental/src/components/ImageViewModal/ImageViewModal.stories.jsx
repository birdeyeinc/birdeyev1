import React from "react";
import Component from ".";
import Button from "atoms/Button";

export default {
    title: "Component/ImageViewModal",
    component: Component,
    tags: ["autodocs"],
};

const Template = (args) => <Component {...args} />;

export const Default = () => {
    const [showModal, setShowModal] = React.useState(false);
    const toggleModal = () => {
        setShowModal(!showModal);
    }
    const componentProps = {
        showModal,
        closeModal: toggleModal,
        extraProps: {
            lazyLoad: true,
            arrows: true,
            infinite: false,
        },
        showAttachedFiles: true,
        images: [
            "https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273391/1744115418382.png",
            "https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273513/de0dd46b8a824571b7cd42f9040bf25f.png",
            "https://d1py4eyp5hehj0.cloudfront.net/upload/1263763/1746066273570/1741078874717.jpeg",
        ],
        attachedFileTypes: null,
        newCurrentSlide: 1,
        updateCurrentSlide: () => { },
        showSlideInfo: true,
        showDownload: true,
        downloadToLocal: false,
        showOnTop: true,
        startingPosition: 0,
        imagesCaption: ["Demo 1", "Demo 2", "Demo 3"],
        customDownloadCallback: () => { },
        isInboxAttachment: false,
        showCustomJSXIndexAfter: 0,
        customJSX: null
    };
    console.log({ showModal })
    return (
        <>
            <Button type="primary" label="Show Gallery" onClick={toggleModal} />
            <Component {...componentProps} />

        </>
    );
}
