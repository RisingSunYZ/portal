import React, { Component } from 'react';
import {G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from "bizcharts";

const data = [
  {
    year: "黛玉",
    value: 5
  },
  {
    year: "探春",
    value: 4
  },
  {
    year: "湘云",
    value: 3.5
  },
  {
    year: "宝钗",
    value: 5
  },
  {
    year: "惜春",
    value: 4.9
  },
  {
    year: "李纨",
    value: 8
  },
  {
    year: "元春",
    value: 7
  },
  {
    year: "熙凤",
    value: 9
  },
  {
    year: "迎春",
    value: 6
  },
  {
    year: "妙玉",
    value: 10
  },
  {
    year: "袭人",
    value: 9
  },
  {
    year: "可卿",
    value: 13
  }
];
const cols = {
  value: {
    min: 0
  },
  year: {
    range: [0, 1]
  }
};

export default class AttendanceLineChart extends Component {
  render() {
    return (
      <div>
        <Chart height={400} data={data} scale={cols} forceFit>
          <Axis name="year" />
          <Axis name="value" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="year*value" size={2} />
          <Geom
            type="point"
            position="year*value"
            size={4}
            shape={"circle"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
      </div>
    );
  }
}
