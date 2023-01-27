import React from "react";
import Draggable from "./Draggable";

const blocks = [
  { name: "A", color: "#B9F3FC" },
  { name: "B", color: "#AEE2FF" },
  { name: "C", color: "#E3F6FF" },
  { name: "D", color: "#F2DEBA" },
  { name: "E", color: "#FFC6D3" },
];

const DraggableBlocks = ({ setDragData }) => {
  const onDragStart = (dragData) => {
    setDragData(dragData);
  };

  const onDragEnd = () => {};

  return (
    <div className="dragging-blocks">
      {blocks.map((b) => (
        <Draggable
          key={b.name}
          dragObject={b}
          onDragStart={(dragData) => onDragStart(dragData)}
          onDragEnd={() => onDragEnd()}
        >
          <div className="block" style={{ backgroundColor: b.color }}>
            {b.name}
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default DraggableBlocks;
