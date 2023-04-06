import _ from "lodash";
import { ResponsiveBar, Bar } from '@nivo/bar'

import './style.scss'

const GraphCard = (props: { title: string, value: string, subtext?: string, graphData?: any }) => {
  const { title, value, subtext, graphData } = props;

  console.log('graphdata', graphData && _.map(Object.entries(graphData), ([key, val]) => ({
    name: key,
    count: val
  })))
  return (
    <div className="graph">
      <p className="graph-title">{title}</p>
      <h2 className="graph-value">{value}</h2>
      <div className="graph-chart-wrapper">
        {/* <ResponsiveBar data={graphData && _.map(Object.entries(graphData), ([key, val]) => ({
          name: key,
          count: val
        }))} keys={graphData && Object.keys(graphData)} indexBy="name" /> */}

        <Bar
          // {...commonProps}
          height={200}
          width={300}
          data={graphData && _.map(Object.entries(graphData), ([key, val]) => ({
            name: key,
            count: val
          }))}
          keys={["count"]}
          indexBy="name"
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'date',
            legendPosition: 'middle',
            legendOffset: 32
          }}

          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 0,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 8,
              itemHeight: 10,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          ariaLabel="Nivo bar chart demo"
        />
      </div>
    </div>
  );
};

export default GraphCard;
