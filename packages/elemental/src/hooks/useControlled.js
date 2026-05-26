import { useCallback, useRef, useState } from "react";

export default function useControlled(controlled, defaultProp) {
    const { current: isControlled } = useRef(controlled !== undefined);
    const [valueState, setValue] = useState(defaultProp);
    const value = isControlled ? controlled : valueState;


    const setValueIfUncontrolled = useCallback((valueOrFn) => {
        if (!isControlled) {
            setValue(valueOrFn);
        }
    }, []);

    return [value, setValueIfUncontrolled];
}