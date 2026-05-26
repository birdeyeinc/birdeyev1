import React from 'react';
import PropTypes from "prop-types";

const SortableList = ({
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnter,
  children,
  itemIndex,
  className = '',
  onDragLeave,
  draggable = true,
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', itemIndex.toString());
    onDragStart(e);
  };

  return (
    <div
      data-item-index={itemIndex}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      onDragEnter={onDragEnter}
      className={`flex items-center gap-3 p-4 bg-white border rounded-lg ${className} el-sortable-list-container`}
    >
      {children}
    </div>
  );
};

SortableList.propTypes = {
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  onDragEnter: PropTypes.func,
  children: PropTypes.node,
  itemIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className : PropTypes.string,
  onDragLeave: PropTypes.func,
  draggable: PropTypes.bool,
};

export default SortableList;