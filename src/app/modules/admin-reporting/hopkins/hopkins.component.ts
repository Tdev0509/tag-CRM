import { Component, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-hopkins',
  templateUrl: './hopkins.component.html',
  styleUrls: ['./hopkins.component.scss'],
})
export class HopkinsComponent implements OnInit {
  //Chart setup variables
  chartDom;
  myChart;
  option;
  rows = [
    {
      name: 'Greg',
      tag: 'XML Hopkins',
      totalSearches: '759123',
      monetizedSearches: '431231',
      revenue: '19623',
      clicks: 50351,
    },
  ];
  columns = [{ prop: 'name' }, { name: 'Gender' }];
  expanded: any = {};
  @ViewChild('expandableTable') table: any;

  constructor() {}

  ngOnInit(): void {
    let revenueByDayArray = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * (8000 - 4000) + 4000)
    );
    let searchesPerDay = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * (100000 - 40000) + 40000)
    );
    this.setChartOptions(
      10000,
      100000,
      [
        'Nov 1, Nov 2, Nov 3, Nov 4',
        'Nov 5',
        'Nov 5',
        'Nov 6',
        'Nov 7',
        'Nov 8',
        'Nov 9',
        'Nov 10',
        'Nov 11',
        'Nov 12',
        'Nov 13',
        'Nov 14',
        'Nov 15',
        'Nov 16',
        'Nov 17',
        'Nov 18',
        'Nov 19',
        'Nov 20',
      ],
      revenueByDayArray,
      searchesPerDay
    );
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  public updateReportingFiltering(range) {
    // this.range = range;
    // this.getAllPerionStats(
    //   'manic_perion',
    //   this.range.startDate,
    //   this.range.endDate
    // );
    console.log('Report');
  }

  setChartOptions(
    maxRevenue,
    maxSearches,
    daysArray,
    revenueByDayArray,
    searchesPerDay
  ) {
    this.chartDom = document.getElementById('main')!;
    this.myChart = echarts.init(this.chartDom);

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
          data: daysArray,
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
        },
      ],
      series: [
        {
          name: 'Revenue',
          type: 'bar',
          data: revenueByDayArray,
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
}
