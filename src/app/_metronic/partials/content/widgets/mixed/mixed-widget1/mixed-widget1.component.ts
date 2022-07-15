import { Component, OnInit, Input } from '@angular/core';
import { LayoutService } from '../../../../../core';
import * as moment from 'moment';

@Component({
  selector: 'app-mixed-widget1',
  templateUrl: './mixed-widget1.component.html',
})
export class MixedWidget1Component implements OnInit {
  chartOptions: any = {};
  chartSubOptions: any = [];
  chartSeries: any = [];
  fontFamily = '';
  colorsGrayGray500 = '';
  colorsGrayGray200 = '';
  colorsGrayGray300 = '';
  colorsThemeBaseDanger = '';
  @Input() public ChartData: any;
  perionCurrentSum = 0;
  perionBeforeSum = 0;

  allDaysList: any = [];

  constructor(
    private layout: LayoutService,
  ) {
    
    this.fontFamily = this.layout.getProp('js.fontFamily');
    this.colorsGrayGray500 = this.layout.getProp('js.colors.gray.gray500');
    this.colorsGrayGray200 = this.layout.getProp('js.colors.gray.gray200');
    this.colorsGrayGray300 = this.layout.getProp('js.colors.gray.gray300');
    this.colorsThemeBaseDanger = this.layout.getProp(
      'js.colors.theme.base.danger'
    );
  }

  ngOnInit(): void {
    this.allDaysList = this.getCurrentMontDateList();
    this.ChartData = this.getChartData(this.ChartData);
    for (var chart of this.ChartData) {
      this.chartSeries.push({
        name: chart.statType,
        data: chart.revenuePerDay
      })
    }
    this.chartOptions = this.getChartOptions(this.chartSeries);
    for (var subChart of this.ChartData) {
      this.chartSubOptions.push(this.getSubChartOptions(subChart));
    }
  }
  getCurrentMontDateList() {
    const lastThirtyDays = [...new Array(30)].map((i, idx) => moment().utc().startOf("day").subtract(idx, "days").format("MM-DD")).reverse();
    return lastThirtyDays;
  }
  getChartOptions(chartSeries: any) {
    const strokeColor = '#D13647';
    return {
      series: chartSeries,
      chart: {
        height: 200,
        type: 'area',
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: false,
        },
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 5,
          left: 0,  
          blur: 3,
          //color: strokeColor,
          opacity: 0.4,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      // fill: {
      //   type: 'solid',
      //   opacity: 0,
      // },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        //colors: [strokeColor],
      },
      xaxis: {
        categories: this.allDaysList,
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
        labels: {
          show: true,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily,
          },
        },
        crosshairs: {
          show: true,
          position: 'front',
          stroke: {
            color: this.colorsGrayGray300,
            width: 1,
            dashArray: 3,
          },
        },
      },
      yaxis: {
        min: 0,
        max: 10000,
        labels: {
          show: true,
          style: {
            //colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily,
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: this.fontFamily,
        },
        y: {
          // tslint:disable-next-line
          formatter: function (val) {
            return '$' + Number.parseFloat(val).toFixed(2)
          },
        },
        marker: {
          show: true,
        },
      },
      //colors: ['transparent'],
      markers: {
        // colors: this.colorsThemeBaseDanger,
        // strokeColor: [strokeColor],
        strokeWidth: 2,
      },
    };
  }

  getSubChartOptions(subChart) {
    return {
      series: [
        {
          name: "current month",
          data: subChart.revenuePerDay
        },
        {
          name: "before month",
          data: subChart.revenueBeforePerDay
        }
      ],
      chart: {
        height: 250,
        type: "area",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: true,
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: subChart.datesOfRevenue,
        labels: {
          format: 'MM-dd'
        },
        axisTicks: {
          show: true,
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return '$' + Number.parseFloat(val).toFixed(0)
          }
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$' + Number.parseFloat(val).toFixed(2)
          }
        }
      },
      statType: subChart.statType,
      revenueBeforeSum: subChart.revenueBeforeSum,
      revenueCurrentSum: subChart.revenueCurrentSum,
    };
  }

  getChartData(perionChartData: any) {
		// our logic to group the posts by category
		if (!perionChartData) return;
		
		var result = perionChartData;

		return result;
	}
}
