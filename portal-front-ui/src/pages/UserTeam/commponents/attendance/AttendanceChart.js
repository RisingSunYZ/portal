import React, { Component } from 'react';
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util} from "bizcharts";

export default class AttendanceChart extends Component {

  pointClick = (ev) => {
    console.log(ev)
  };

  render() {

    const data = [
      {
        month: "1月",
        sales: 56
      },
      {
        month: "2月",
        sales: 52
      },
      {
        month: "3月",
        sales: 61
      },
      {
        month: "4月",
        sales: 145
      },
      {
        month: "5月",
        sales: 48
      },
      {
        month: "6月",
        sales: 38
      },
      {
        month: "7月",
        sales: 38
      },
      {
        month: "8月",
        sales: 38
      },
      {
        month: "9月",
          sales: 38
      },
      {
        month: "10月",
        sales: 38
      },
      {
        month: "11月",
        sales: 38
      },
      {
        month: "12月",
        sales: 38
      },
    ];
    const cols = {
      sales: {
        tickInterval: 20
      }
    };

    return (
      <div>
        <Chart height={600} data={data} scale={cols} forceFit onPlotClick={this.pointClick}>
          <Axis name="month" />
          <Axis name="sales" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="interval" position="month*sales" />
        </Chart>
      </div>
    );
  }

}

