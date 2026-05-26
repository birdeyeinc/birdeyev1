import { useState, useEffect, useRef } from "react";

export default function useClickOutside(initialIsVisible, customRef) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  // * Added customRef due to grid item already receives ref form GridLayout component
  const ref = customRef || useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
