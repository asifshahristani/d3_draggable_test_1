import React, { useEffect, useState, useRef, useCallback } from "react";
import * as d3 from "d3";

// const nodes = [];

/**
 * Convert DOM coordinates to SVG coordinates based on SVG offset and zoom level
 */
const convertCoordinatesDOMtoSVG = (svg, x, y) => {
  const pt = svg.node().createSVGPoint();

  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(svg.node().getScreenCTM().inverse());
};

const blocks = [
  { id: 1, name: "A", color: "#B9F3FC", x: 10, y: 10 },
  { id: 2, name: "B", color: "#AEE2FF", x: 10, y: 20 },
  { id: 3, name: "C", color: "#E3F6FF", x: 15, y: 30 },
  { id: 4, name: "D", color: "#F2DEBA", x: 20, y: 40 },
  { id: 5, name: "E", color: "#FFC6D3", x: 25, y: 50 },
];

const SVGArea = ({ draggedData }) => {
  const [nodes, setNodes] = useState(blocks);
  // const [nodeToDrag, setNodeToDrag] = useState(null);

  const canvas = useRef();

  // eslint-disable-next-line no-unused-vars
  const updateNodePosition = useCallback(
    function (svg, id) {
      svg.on("mousemove", function (e) {
        // console.log(id);
        if (id) {
          const newNodes = [...nodes];
          const index = newNodes.findIndex((n) => +n.id === +id);
          if (index !== -1) {
            const point = d3.pointer(e);
            setNodes((preNodes) => {
              const newNodes = [...preNodes];
              const newNode = { ...newNodes[index] };
              newNode.x = point[0] - 36;
              newNode.y = point[1] - 36;
              newNodes[index] = newNode;
              return newNodes;
            });
            // SVGDrawer.draw(newNodes);
          }
        }
      });
    },
    [nodes]
  );

  function dragstarted() {
    d3.select(this).raise();
    // g.attr("cursor", "grabbing");
  }

  function dragged(event, d) {
    d3.select(this)
      .attr("cx", (d.x = event.x))
      .attr("cy", (d.y = event.y));
  }

  function dragended() {
    // g.attr("cursor", "grab");
  }

  useEffect(() => {
    const svg = d3.select(canvas.current);

    // const g = svg.select("#shapes");
    const g = svg.append("g").attr("cursor", "grab");

    g.selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cx", ({ x }) => x)
      .attr("cy", ({ y }) => y)
      .attr("r", 20)
      .attr("fill", (d, i) => d.color)
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    const handleZoom = (e) => g.attr("transform", e.transform);

    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", handleZoom);

    svg.call(zoom);

    // d3.select("svg")
    //   .selectAll(".node")
    //   .on("mousedown", function (e) {
    //     e.stopPropagation();
    //     updateNodePosition(svg, this.id);
    //   })
    //   .on("mouseup", (e) => {
    //     e.stopPropagation();
    //     fixMousePosition(svg);
    //   });

    // svg.on("mouseup", (e) => {
    //   fixMousePosition(svg);
    // });
  }, [nodes]);

  // eslint-disable-next-line no-unused-vars
  function fixMousePosition(svg) {
    svg.on("mousemove", null);
    // setNodeToDrag(null);
  }

  const onDragOver = (e) => {
    e.preventDefault();
    d3.select("svg").classed("drag-over", true);
  };

  const onDragLeave = () => {
    d3.select("svg").classed("drag-over", false);
  };

  const onDrop = (e) => {
    e.stopPropagation();
    d3.select("svg").classed("drag-over", false);

    // Get the correct coordinates for this node
    const { x, y } = convertCoordinatesDOMtoSVG(
      d3.select("svg"),
      e.clientX - draggedData.offset[0],
      e.clientY - draggedData.offset[1]
    );

    // Add the node to the list of nodes.
    setNodes((pre) => [
      ...pre,
      {
        id: nodes.length + 1,
        name: draggedData.dragObject.name,
        color: draggedData.dragObject.color,
        x,
        y,
      },
    ]);

    // Redraw the nodes
    // SVGDrawer.draw(nodes);

    return false;
  };

  // eslint-disable-next-line no-unused-vars
  function handleOnMouseOver(e, isBuilding) {
    e.stopPropagation();

    // if (isBuilding && e.target.classList[2]) {
    //   return onMapDataChange({
    //     id: "school" + e.target.classList[1],
    //     buildingID: e.target.classList[2],
    //   });
    // }

    // onMapDataChange({
    //   id: "school" + e.target.classList[1],
    //   buildingID: "",
    // });
  }

  return (
    <div
      className="svgContainer"
      onDrop={(e) => onDrop(e)}
      onDragLeave={(e) => onDragLeave(e)}
      onDragOver={(e) => onDragOver(e)}
      style={{ border: "5px solid blue" }}
    >
      <svg ref={canvas}>
        {/* <circle cx={100} cy={100} r={50} fill="#5f5f5f"></circle> */}
      </svg>
    </div>
  );
};

export default SVGArea;
