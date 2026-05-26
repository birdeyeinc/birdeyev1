import { useEffect, useRef } from "react";
import Grid from "@highcharts/grid-lite/es-modules/masters/grid-lite.src.js";
import "@highcharts/grid-lite/css/grid-lite.css";
export default function GridComponent(props) {
    const { config } = props;
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current) {
            Grid.grid(containerRef.current, config);
        }
    }, [config]);
    return <div ref={containerRef} />;
}
