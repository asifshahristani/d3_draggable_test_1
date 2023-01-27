import React, { useState } from "react";
import DraggableBlocks from "./components/DraggableBlocks";
import SVGArea from "./components/SVGArea";

import "./index.css";

const App = () => {
  const [draggedData, setDragData] = useState(null);
  return (
    <div className="App">
      <DraggableBlocks setDragData={(dragData) => setDragData(dragData)} />
      <SVGArea draggedData={draggedData} />
    </div>
  );
};

export default App;
