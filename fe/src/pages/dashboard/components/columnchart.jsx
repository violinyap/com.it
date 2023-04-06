import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/system';

const ColumnChart = ({data, width, height, xField, yField}) => {
  
  const {
    wdays = [],
  } = useSelector((state) => state.profile.data);
  const {
    extra,
  } = useSelector((state) => state.dash.commitData);

  const brandRed = '#FF6B6B';
  const brandColor = '#B0FF4D';
  const config = {
    data,
    xField,
    yField,
    seriesField: '',
    color: ({day}) => {
      if (wdays?.includes(day)) {
        return brandColor;
      }
      return brandRed;

    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return (<>
  <Column {...config}  style={{height, width}}/>
  <Stack direction="row" alignItems={"center"} gap={2} style={{marginTop: 10}}>
    <div style={{width: 15, height: 15, backgroundColor: brandColor}}></div> Workday ({extra?.indays})
    <div style={{width: 15, height: 15, backgroundColor: brandRed}}></div>Not workday ({extra?.outdays})
  </Stack>
  </>);
};

export default ColumnChart;