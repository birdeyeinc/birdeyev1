import React, { useState, forwardRef, useImperativeHandle, ReactNode, useRef, Ref } from "react";

interface SideDrawerProps {
    children?: ReactNode;
    containerClassName?: string;
}

export interface SideDrawerHandle {
    toggleDrawerComp: () => void;
    setOpenComp: (open: boolean) => void;
}

const SideDrawer = forwardRef<SideDrawerHandle | any | null, SideDrawerProps>((props, ref: Ref<SideDrawerHandle> | any | null) => {
    const { children, containerClassName = "" } = props;
    const [open, toggleDrawer] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        toggleDrawerComp: (): void => {
            toggleDrawer(!open);
        },
        setOpenComp: (open: boolean): void => {
            toggleDrawer(open);
        },
    }));

    return (
        <div 
            ref={divRef} 
            id="side-drawer-section" 
            className={`el-sidedrawer side-drawer-overlay ${open ? "open-drawer" : "hide-drawer"} ${containerClassName}`}
        >
            <div className={`side-drawer ${open ? "scrollable-drawer remove-transform" : ""}`}>
                {open && children}
            </div>
        </div>
    );
});

SideDrawer.displayName = "SideDrawer";

export default SideDrawer as React.ForwardRefExoticComponent<SideDrawerProps & React.RefAttributes<SideDrawerHandle | any>>;
