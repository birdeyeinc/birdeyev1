import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const VideoPlayer = (props) => {
    const {
        videoSrc,
        isInboxAttachment,
        id,
        autoPlay
    } = props;
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (autoPlay && videoRef.current) {
            // Play the video automatically if the autoplay prop is true
            videoRef.current.play().catch((error) => {
                console.log("Autoplay was prevented:", error);
            });
        }

        if (videoElement && isInboxAttachment) {
            // Disable picture-in-picture mode
            videoElement.setAttribute("disablepictureinpicture", "true");
        }
    }, [videoSrc]);
    if (videoSrc) {
        return (
            <video id={id} ref={videoRef} controls>
                <source src={videoSrc} type="video/mp4" />
            </video>
        );
    } else {
        return null;
    }
};

VideoPlayer.propTypes = {
    videoSrc: PropTypes.string,
    isInboxAttachment: PropTypes.bool,
    id: PropTypes.string,
    autoPlay: PropTypes.bool
};

export default VideoPlayer;
