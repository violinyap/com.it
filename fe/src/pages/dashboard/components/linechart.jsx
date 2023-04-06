import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line, G2 } from '@ant-design/plots';

import { each, findIndex } from '@antv/util';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/material';

const LineChart = ({data, width, height, xField, yField}) => {
    
  const {
    wstart,
    wend
  } = useSelector((state) => state.profile.data);
  const {
    extra,
  } = useSelector((state) => state.dash.commitData);


  const brandRed = '#FF6B6B';
  const brandColor = '#B0FF4D';

  const { InteractionAction, registerInteraction, registerAction } = G2;
  const [showModal, setShowModal] = useState(false);
  G2.registerShape('point', 'point-work', {
    draw(cfg, container) {
      const point = {
        x: cfg.x,
        y: cfg.y,
      };
      const group = container.addGroup();
      group.addShape('circle', {
        name: 'outer-point',
        attrs: {
          x: point.x,
          y: point.y,
          fill: cfg.color || brandColor,
          opacity: 0.5,
          r: 9,
        },
      });
      group.addShape('circle', {
        name: 'inner-point',
        attrs: {
          x: point.x,
          y: point.y,
          fill: cfg.color || brandColor,
          opacity: 1,
          r: 7,
        },
      });
      return group;
    },
  });

  G2.registerShape('point', 'point-out', {
    draw(cfg, container) {
      const point = {
        x: cfg.x,
        y: cfg.y,
      };
      const group = container.addGroup();
      group.addShape('circle', {
        name: 'outer-point',
        attrs: {
          x: point.x,
          y: point.y,
          fill: cfg.color || brandRed,
          opacity: 0.5,
          r: 10,
        },
      });
      group.addShape('circle', {
        name: 'inner-point',
        attrs: {
          x: point.x,
          y: point.y,
          fill: cfg.color || brandRed,
          opacity: 1,
          r: 4,
        },
      });
      return group;
    },
  });

  class CustomMarkerAction extends InteractionAction {
    active() {
      const view = this.getView();
      const evt = this.context.event;

      if (evt.data) {
        // items: 数组对象，当前 tooltip 显示的每条内容
        const { items } = evt.data;
        const pointGeometries = view.geometries.filter((geom) => geom.type === 'point');
        each(pointGeometries, (pointGeometry) => {
          each(pointGeometry.elements, (pointElement, idx) => {
            const active = findIndex(items, (item) => item.data === pointElement.data) !== -1;
            const [point0, point1] = pointElement.shape.getChildren();

            if (active) {
              // outer-circle
              point0.animate(
                {
                  r: 10,
                  opacity: 0.2,
                },
                {
                  duration: 1800,
                  easing: 'easeLinear',
                  repeat: true,
                },
              ); // inner-circle

              point1.animate(
                {
                  r: 6,
                  opacity: 0.4,
                },
                {
                  duration: 800,
                  easing: 'easeLinear',
                  repeat: true,
                },
              );
            } else {
              this.resetElementState(pointElement);
            }
          });
        });
      }
    }

    reset() {
      const view = this.getView();
      const points = view.geometries.filter((geom) => geom.type === 'point');
      each(points, (point) => {
        each(point.elements, (pointElement) => {
          this.resetElementState(pointElement);
        });
      });
    }

    resetElementState(element) {
      const [point0, point1] = element.shape.getChildren();
      point0.stopAnimate();
      point1.stopAnimate();
      const { r, opacity } = point0.get('attrs');
      point0.attr({
        r,
        opacity,
      });
      const { r: r1, opacity: opacity1 } = point1.get('attrs');
      point1.attr({
        r: r1,
        opacity: opacity1,
      });
    }

    getView() {
      return this.context.view;
    }
  }

  registerAction('custom-marker-action', CustomMarkerAction);
  registerInteraction('custom-marker-interaction', {
    start: [
      {
        trigger: 'tooltip:show',
        action: 'custom-marker-action:active',
      },
    ],
    end: [
      {
        trigger: 'tooltip:hide',
        action: 'custom-marker-action:reset',
      },
    ],
  });
  const config = {
    data,
    xField: xField,
    yField: yField,
    tooltip: {
      showMarkers: false,
    },
    padding: 'auto',
    label: undefined,
    point: {
      size: {},
      shape: (item)=>{
        if (
          Number(wstart.substring(0,2)) <= Number(item.time) 
          && Number(wend.substring(0,2)) >= Number(item.time)
          ) {
          return 'point-work';
        }
        return 'point-out';
      },
      style: {}
    },
    lineStyle: {
      stroke: brandColor,
      lineWidth: 2
    },
    interactions: [
      {
        type: 'custom-marker-interaction',
      },
    ],
  };
  return (<> 
  <Line autoFit={true} {...config} style={{height, width, color:'white'}} /> 
    <Stack direction="row" alignItems={"center"} gap={2} style={{marginTop: 10}}>
    <div style={{width: 15, height: 15, backgroundColor: brandColor}}></div> Workday ({extra?.intime})
      <div style={{width: 15, height: 15, backgroundColor: brandRed}}></div>Not workday ({extra?.outtime})
  </Stack>
  </>);
};

export default LineChart;