import React from "react";
import OverflowList from "./index";

export default {
    title: "Atom/OverflowList",
    component: OverflowList,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    }
};

export const Default = (props) => {
    return (
        <div style={{width: "500px"}}>
            <OverflowList
             {...props}
            />
        </div>
    );
}

Default.args = {
    items: [
        { id: 1, label: "Item 1" },
        { id: 2, label: "Item 2" },
        { id: 3, label: "Item 3" },
        { id: 4, label: "Item 4" },
        { id: 5, label: "Item 5" },
        { id: 6, label: "Item 6" },
        { id: 7, label: "Item 7" },
        { id: 8, label: "Item 8" },
        { id: 9, label: "Item 9" },
        { id: 10, label: "Item 10" }
    ],
    collapseFrom: 'end',
    minVisibleItems: 1,
    tagName: "ul",
    className: "overflow-list-example",
    alwaysRenderOverflow: false,
    overflowRenderer: (overflowItems) => (
        <div style={{ padding: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px',width: "100px", textAlign: "center" }}>
            <p>+{overflowItems.length} more</p>
        </div>
    ),
    itemRenderer: (item) => <li style={{ padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginRight: "5px", textAlign: "center" }}>{item.label}</li>,
    onVisibleItemsRender: (visibleItems) => {
        console.log("Visible items rendered:", visibleItems);
    }
}