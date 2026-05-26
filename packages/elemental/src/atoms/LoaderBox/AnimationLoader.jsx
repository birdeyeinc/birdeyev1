import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./LoaderBox.module.scss";

const AnimationLoader = ({
    animationData,
    title,
    message,
    className = "",
    events = [],
    activeIndex = -1,
    showInlineLoader = false
}) => {
    const lottieRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!lottieRef.current || !animationData) {
            return undefined;
        }

        let isMounted = true;

        import("lottie-web").then((mod) => {
            const lottie = mod.default || mod;

            if (!isMounted || !lottieRef.current) {
                return;
            }

            animationRef.current = lottie.loadAnimation({
                container: lottieRef.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData
            });
        });

        return () => {
            isMounted = false;
            if (animationRef.current) {
                animationRef.current.destroy();
                animationRef.current = null;
            }
        };
    }, [animationData]);

    return (
        <div className={`${styles["animation-loader-container"]} ${className}`.trim()}>
            <div ref={lottieRef} className={styles["animation-loader-lottie"]} />
            <div className={styles["animation-loader-content"]}>
                <h3 className={styles["animation-loader-title"]}>{title}</h3>
                {showInlineLoader ? (
                    <div className={styles["animation-loader-event-row"]}>
                        <span className={styles["animation-loader-inline-spinner"]} />
                        {message ? <span className={styles["animation-loader-event-text"]}>{message}</span> : null}
                    </div>
                ) : message ? (
                    <div className={styles["animation-loader-event-row"]}>
                        <span className={styles["animation-loader-event-text"]}>{message}</span>
                    </div>
                ) : null}
                {events.length > 0 && activeIndex >= 0 ? (
                    <div className={styles["animation-loader-event-list"]}>
                        {events.slice(0, activeIndex + 1).map((event, idx) => {
                            const isDone = idx < activeIndex;
                            const isActive = idx === activeIndex;

                            return (
                                <div key={`${event.label}-${idx}`} className={styles["animation-loader-event-item"]}>
                                    {isDone ? (
                                        <span className={styles["animation-loader-done-icon"]}>
                                            <i className="icon_phoenix-success-fill" />
                                        </span>
                                    ) : (
                                        <span className={styles["animation-loader-event-spinner"]} />
                                    )}
                                    <span
                                        className={
                                            isDone || isActive
                                                ? styles["animation-loader-event-label"]
                                                : styles["animation-loader-event-label-muted"]
                                        }
                                    >
                                        {event.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

AnimationLoader.propTypes = {
    animationData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    title: PropTypes.string,
    message: PropTypes.string,
    className: PropTypes.string,
    events: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired
    })),
    activeIndex: PropTypes.number,
    showInlineLoader: PropTypes.bool
};

AnimationLoader.defaultProps = {
    animationData: null,
    title: "",
    message: "",
    className: "",
    events: [],
    activeIndex: -1,
    showInlineLoader: false
};

export default AnimationLoader;
