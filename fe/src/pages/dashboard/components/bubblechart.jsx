import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import '../style.scss';
import { Stack } from "@mui/material";
import { useSelector } from "react-redux";
import _ from "lodash";

interface BubbleChartProps {
  data: { title: string; numCommits: number }[];
  width: number;
  height: number;
}

const BubbleChart = ({ data, width, height, tfield, vfield }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState();
  const [fileData, setFileData] = useState();
  const chartRef = useRef(null);

  const {
    commits,
  } = useSelector((state) => state.dash);


  const handleHover = (d) => {
    setShowModal(true);
    setModalData(d.target.__data__);
    console.log('handleHover',d)
    setFileData(commits
      .filter((com) => 
      _.findIndex(com.files, 
        (file) => (file.filename === d.target.__data__?.file)
        ) !== -1))
  }
   
  const handleExit = () => {
    setShowModal(false);
    setModalData();
    setFileData();
  }
  useEffect(() => {
    if (chartRef.current) {
      const svg = d3.select(chartRef.current);

      const padding = 20;
      const maxRadius = Math.min(width, height) / 5;
      const radiusScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[vfield])])
        .range([0, maxRadius]);

      const getOdd = (num) => num % 2 === 1 ? num*-1 : num;
      const simulation = d3.forceSimulation(data)
        .force("collide", d3.forceCollide().radius((d) => radiusScale(d[vfield]) + padding).strength(0.8))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX().x((d) => d.index*100))
        .force("y", d3.forceY().y((d) => getOdd(d.index)*20+100));
      const circles = svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", (d) => radiusScale(d[vfield]))
        .attr("fill", (d) => `url('#myGradient${d.index+1}')`)
        .on("mouseover", (d) => handleHover(d))
        .style("cursor", "default"); // disable dragging

      const labels = svg.selectAll("text")
        .data(data)
        .join("text")
        .text((d) => d[tfield])
        .attr("text-anchor", "middle")
        .attr("font-size", "14px");

      simulation.on("tick", () => {
        circles
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);

        labels
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y + 2); // adjust label position to be inside circle
      });
    }
  }, [chartRef, data, width, height]);

  console.log('fileData', fileData)
  return (
    <div style={{position: 'relative'}}>
<svg ref={chartRef} width={width} height={height}>
    <defs>
    <radialGradient id="myGradient1">
      <stop offset="10%" stopColor="white" />
      <stop offset="95%" stopColor="#77CBFF" />
    </radialGradient>
    <radialGradient id="myGradient2">
      <stop offset="10%" stopColor="white" />
      <stop offset="95%" stopColor="#236847" />
    </radialGradient>
    <radialGradient id="myGradient3">
      <stop offset="10%" stopColor="white" />
      <stop offset="95%" stopColor="#B0FF4D" />
    </radialGradient>
    <radialGradient id="myGradient4">
      <stop offset="10%" stopColor="white" />
      <stop offset="95%" stopColor="#193341" />
    </radialGradient>
    <radialGradient id="myGradient5">
      <stop offset="10%" stopColor="white" />
      <stop offset="95%" stopColor="rgba(127, 183, 190, 0.6)" />
    </radialGradient>
  </defs>
  </svg>

{showModal && fileData.length && (
  <Stack gap={1} className="feat-modal" style={{top: modalData.y, left: modalData.x}}>
    <Stack direction={"row"} justifyContent="space-between" alignItems={"flex-start"}>
      <div>
        <p className="feat-modal-msg neon">{modalData.file}</p>
        <p className="feat-modal-desc">{modalData.commits} {modalData.commits > 1 ? 'commits' : 'commit'}</p>
      </div>
      <button className="button-none" onClick={()=>{handleExit()}}>x</button>
    </Stack>
    <Stack gap={1} style={{overflowY: 'scroll'}}>
    {fileData.map((com, idx) => {
      const timeFormatted = new Date(com.date).toLocaleString('en-US', { day: 'numeric', month: 'short',hour: 'numeric', minute: 'numeric', hour12: true })
      return (
      <div>
        <p className="feat-modal-msg">{idx+1}. {com.message}</p>
        <p className="feat-modal-desc">{timeFormatted} | {com.files?.length} files | +{com.add} -{com.del}</p>
      </div>
    )})}

    </Stack>

  </Stack>

)}
  </div>);
};

export default BubbleChart;
