import React, { useRef } from 'react';
import SideDrawer from '.';

export default {
    title: 'Atom/SideDrawer',
    component: SideDrawer,
    tags: ["autodocs"]
};

const Template = (args) => <SideDrawer {...args} />;


export const Default = ()=>{
    const sideDrawerRef = useRef();

    return (
        <>
            <button onClick={()=>{sideDrawerRef?.current?.toggleDrawerComp()}}>Toggle</button>
            <SideDrawer ref={sideDrawerRef}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px"}}>
                    <div><h3 style={{fontSize:"24px"}}>Title..</h3></div>
                    <div className="back-btn pull-left"><i className="icon_phoenix-close" onClick={()=>{sideDrawerRef?.current?.toggleDrawerComp()}} /></div>
                </div>
            </SideDrawer>
        </>
    )
}