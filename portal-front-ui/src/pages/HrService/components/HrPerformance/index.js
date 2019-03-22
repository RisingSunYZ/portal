/**
 * 绩效图标组件
 */
// import ReactEcharts from 'echarts-for-react';
import React, {Component} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
// import {constructor} from "../../../../components/AvatarList/AvatarItem";
// import {ChartCard} from '../../components/Charts';
export default class HrPerformanceChart extends Component {

  componentDidMount=()=>{
    // 图表显示容器
    const el = document.getElementById("main");
    // 图表初始化
    const myChart = echarts.init(el);

    setInterval(()=>{
      // 图表配置项
      const option = {
        color: ['#1890FF'],
        title:{},

        xAxis:{
          axisTick: { show: false },
          axisLine: { show: false },
          data:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        },
        yAxis:{
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine:{ show: false },
          gridIndex:0,
          min:0,
          max:1000,
          interval:250,
        },
        series:[{
          name:'总分',
          type:'bar',
          data:[500,950,500,800,600,505,400,900,300,450,650,300],
          barWidth: 26,
          // itemStyle: {
          //   normal: {
          //     label: {
          //       show: true,
          //       position: 'top',
          //       textStyle: {
          //         color: 'black',
          //         fontSize: 16,
          //       },
          //     },
          //   },
          // },
        }],
        legend:{
          show:true,
          data:[{
            name:'总分',
            icon:'circle',
          }],
        },
      }
      // 进行图表配置
      myChart.setOption(option);
    },1000);
  }

  render () {
    return(
      <div>
        <div id="main" style={{height:437}}> </div>
      </div>
    );
  }
}

