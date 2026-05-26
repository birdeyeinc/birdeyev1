import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { L4MenuComponent } from "components/RailNav/SecondSideRailNav/view";

interface IL4MenuWrapper {
    onTabClick?: (href: string) => void;
    changeURL?: (href: string) => void;
    overflowRenderer?: (items: any[], clickTab: (href: string) => void) => React.ReactNode;
}
const L4MenuWrapper = (props:IL4MenuWrapper) => {
    const { onTabClick, overflowRenderer } = props;
    const [target, setTarget] = useState(null);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const el = document.getElementById("l4-menu-wrapper");
            if (el) {
                setTarget(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    return (
        target && ReactDOM.createPortal(
            <L4MenuComponent
                onTabClick={onTabClick}
                changeURL={props?.changeURL}
                overflowRenderer={overflowRenderer}
            />,
            target
        )
    );
};

export default L4MenuWrapper;