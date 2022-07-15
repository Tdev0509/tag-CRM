import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import * as moment from 'moment';
import { ChartDataInterface } from '../../models/chartData.interface';

@Component({
  selector: 'app-reporting-revenue-chart',
  templateUrl: './reporting-revenue-chart.component.html',
  styleUrls: ['./reporting-revenue-chart.component.scss'],
})
export class ReportingRevenueChartComponent implements OnInit {
  //Chart Data
  //summary = { datesOfRevenue[]. revenuePerDay[], searchesPerDay[] }
  @Input() public chartData: ChartDataInterface;
  //Chart setup variables
  chartDom;
  myChart;
  option;

  constructor() {}

  ngOnInit(): void {
    this.setChartOptions(5, 5, [0], [0], [0]);
    this.chartData = this.getChartData(this.chartData);
    this.setChartOptions(
      30000,
      300000,
      this.chartData.datesOfRevenue,
      this.chartData.revenuePerDay,
      this.chartData.searchesPerDay
    );
  }

  ngOnChanges() {
    console.log('ngOnChanges', this.chartData);
    if (this.chartData) {
      console.log('Chart Data Exists');
      console.log(this.chartData);
      this.chartData.datesOfRevenue = this.convertTimeStampArryToDate(
        this.chartData.datesOfRevenue
      );
      this.setChartOptions(
        30000,
        300000,
        this.chartData.datesOfRevenue,
        this.chartData.revenuePerDay,
        this.chartData.searchesPerDay
      );
    }
  }

  setChartOptions(
    maxRevenue,
    maxSearches,
    datesOfRevenue,
    revenueByDayArray,
    searchesPerDay
  ) {
    this.chartDom = document.getElementById('main')!;
    this.myChart = echarts.init(this.chartDom);
    const colors = ['#5470C6', '#91CC75'];
    this.option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        data: ['Revenue', 'Searches'],
      },
      xAxis: [
        {
          type: 'category',
          data: datesOfRevenue,
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Revenue',
          min: 0,
          max: maxRevenue,
          interval: 25000,
          axisLabel: {
            formatter: '${value}',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[0]
            }
          },
        },
        {
          type: 'value',
          name: 'Searches',
          min: 0,
          max: maxSearches,
          interval: 100000,
          axisLabel: {
            formatter: '{value}',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1]
            }
          },
        },
      ],
      series: [
        {
          name: 'Revenue',
          type: 'bar',
          data: revenueByDayArray.map((item) => parseFloat(item).toFixed(2)),
        },
        {
          name: 'Searches',
          type: 'line',
          yAxisIndex: 1,
          data: searchesPerDay,
        },
      ],
    };
    this.option && this.myChart.setOption(this.option);
  }

  convertTimeStampArryToDate(arr) {
    let newArray = [];
    for (let i = 0; i < arr.length; i++) {
      newArray.push(moment(arr[i]).format('MM-DD-YYYY'));
    }
    return newArray;
  }

  getChartData(chartData: ChartDataInterface) {
		// our logic to group the posts by category
		if (!chartData) return;
		
		var result = chartData;

		return result;
	}
}
