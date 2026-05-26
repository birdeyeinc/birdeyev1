import React, { useState } from 'react';
import Slick from '.';

export default {
    title: 'Atom/Slick',
    component: Slick,
    tags: ["autodocs"]
};



export const Default = () => {
    const images = [
        "https://images.unsplash.com/photo-1712097243043-7458dbcaed71?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1712229102477-f0d8a1b2dbd7?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1555353540-64580b51c258?q=80&w=2778&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1570294646112-27ce4f174e38?ixlib=rb-4.0.3"
    ]
    const imagesCaption = [
        "Lights",
        "Nature",
        "Mountains",
        "Forest"
    ]
    const [newCurrentSlide, setNewCurrentSlide] = useState(1);
    return (
        <Slick
            closeModal={() => console.log('close modal invoked')}
            extraProps={{
                lazyLoad: true,
                arrows: true,
                infinite: true
            }}
            showAttachedFiles
            attachedFiles={images}
            attachedFileTypes={null}
            newCurrentSlide={newCurrentSlide}
            updateCurrentSlide={setNewCurrentSlide}
            showSlideInfo
            showDownload={false}
            downloadToLocal={false}
            showOnTop
            startingPosition={1}
            imagesCaption={imagesCaption}
            customDownloadCallback={(callbackData) => console.log(callbackData)}
            isInboxAttachment={false}
            hideCustomJSX={false}
            showCustomJSXIndexAfter={0}
            customJSX={null}
            autoPlay={true}
            parentStyleClassName="storybook-slick"
        />
    )
}