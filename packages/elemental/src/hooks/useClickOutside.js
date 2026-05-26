import { useState, useEffect, useRef } from "react";

export default function useClickOutside(initialIsVisible, customRef, handleCallback) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    // Use useRef unconditionally
    const ref = useRef(null);

    // If customRef is provided, use it to update the ref
    useEffect(() => {
        if (customRef) {
            ref.current = customRef.current;
        }
    }, [customRef]);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
            handleCallback && handleCallback(event)
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, handleCallback ? undefined : [] );

    return { ref, isComponentVisible, setIsComponentVisible };
}
