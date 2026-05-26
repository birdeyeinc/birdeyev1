import React, { useState } from "react";
import SortableList from ".";

export default {
  title: "Atom/SortableList",
  component: SortableList,
  tags: ["autodocs"],
};

export const Default = () => {
  // list items
  const [list, setList] = useState([
    { id: "1", content: "First Item" },
    { id: "2", content: "Second Item" },
    { id: "3", content: "Third Item" },
    { id: "4", content: "Fourth Item" },
    { id: "5", content: "Fifth Item" },
  ]);

  const [activeItem, setActiveItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  // when user start draging
  function onDragStart(e) {
    const index = Number(e.currentTarget.dataset.itemIndex);
    setActiveItem(index);
  }

  // when item drop
  function onDrop(e) {
    e.preventDefault();
    const targetIndex = Number(e.currentTarget.dataset.itemIndex);

    if (activeItem === null || activeItem === targetIndex) return;

    const newList = [...list];
    const [draggedItem] = newList.splice(activeItem, 1);
    newList.splice(targetIndex, 0, draggedItem);

    setList(newList);
    setActiveItem(null);
    setDragOverItem(null);
  }

  // when drop is over
  function onDragOver(e) {
    e.preventDefault();
  }

  // when item is entering into dragZone
  function onDragEnter(e) {
    const index = Number(e.currentTarget.dataset.itemIndex);
    setDragOverItem(index);
  }

  // when item leaves dragZone
  function onDragLeave() {
    setDragOverItem(null);
  }

  return (
      <div>
        <h1>Sortable List </h1>
        <p className="mt-10">Note: For each list item, there is a corresponding <strong>SortableList</strong>, and the following is an example of a group of SortableList components.</p>
        <div style={{ margin: "30px 0px" }}>
          {list.map((item, index) => (
            <SortableList
              key={item.id}
              itemIndex={index}
              onDragStart={onDragStart}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              className={`
                    ${dragOverItem === index ? "disabled-text" : ""}
                  `}
            >
              <p
                style={{
                  margin: "10px 0px",
                  padding: "10px",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                }}
              >
                {item.content}
              </p>
            </SortableList>
          ))}
        </div>
      </div>
  );
};

Default.args={}