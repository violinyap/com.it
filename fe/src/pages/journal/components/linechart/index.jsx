import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
import { useSelector } from 'react-redux';

const MultiLineChart = ({data}) => {
  

  const config = {
    data,
    xField: 'date',
    yField: 'score',
    seriesField: 'type',
    yAxis: {
      label: {
        formatter: (v) => v,
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    // @TODO 后续会换一种动画方式
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };

  return <Line {...config} />;
};

export default MultiLineChart;