import Button from "atoms/Button";
import React, { useEffect, useState } from "react";

const Test = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Hello");
    }, [])

    return (
        <>
        <Button onClick={() => setCount(prevCount => prevCount + 1)}>Increment</Button>
        <span>Count: {count}</span>
        </>
    )
};

export default Test;

