import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { LayoutService } from '../../../../core';
import { PerionService } from 'src/app/shared/service/admin-stats/perion.service';
import { UsersService } from 'src/app/shared/service/users.service'
import { LyonService } from 'src/app/shared/service/admin-stats/lyon.service';
import { RubiService } from 'src/app/shared/service/admin-stats/rubi.service';
import { TagManagementService } from 'src/app/modules/tag-management/tag-management.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
})
export class Dashboard1Component implements AfterViewInit {

  perionChartData: any;
  selectedCompany: any;
  allLyonChart: any;
  allPerionChart: any;
  allRubiChart: any;
  tagList: any = [];
  lyonChartData: any;
  rubiChartData: any;
  ChartData: any;
  allDaysList: any = [];

  constructor(
    private perionService: PerionService,
    private userService: UsersService,
    private cdr: ChangeDetectorRef,
    private lyonService: LyonService,
    private rubiService: RubiService,
    private tagService: TagManagementService,
  ) {
    this.selectedCompany = this.getSelectedCompanyFromLocalStorage();
  }

  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }

  async ngAfterViewInit() {
    this.allDaysList = this.getCurrentMontDateList();
    this.tagList = await this.getCompanyTags(this.selectedCompany);
    this.perionChartData = await this.getPerionChart(this.selectedCompany);
    
    this.lyonChartData = await this.getLyonChart(this.selectedCompany);
    this.rubiChartData = await this.getRubiChart(this.selectedCompany);
    this.ChartData = this.perionChartData.concat(this.lyonChartData).concat(this.rubiChartData);

    this.cdr.markForCheck();
  }

  getPerionChart(company: string) {
    return this.perionService
      .getAllDashboardStats(company)
      .toPromise()
      .then((response) => {
        this.allPerionChart = response[0];
        var chartPerionMetric = [];
        var chartAllPerionStat = this.allPerionChart.currentStat;
        var chartAllBeforePerionStat = this.allPerionChart.beforeStat;
        // for (var tagL of this.tagList) {
        //   var chartAllPerionStat = [];
        //   var chartAllBeforePerionStat = [];
        //   if(tagL.tag.advertiser == 'perion') {
        //     for(var tagSub of tagL.tag.subids) {
        //       if(tagSub['filterTag'] =="Contains") {   
        //         chartAllPerionStat = chartAllPerionStat.concat(this.allPerionChart.currentStat.filter(stat => stat.subid.includes(tagSub['subid'])))
        //         chartAllBeforePerionStat = chartAllBeforePerionStat.concat(this.allPerionChart.beforeStat.filter(stat => stat.subid.includes(tagSub['subid'])))
        //       } else if (tagSub['filterTag'] =="StartsWith") {
        //         chartAllPerionStat = chartAllPerionStat.concat(this.allPerionChart.currentStat.filter(stat => stat.subid.startsWith(tagSub['subid'])))
        //         chartAllBeforePerionStat = chartAllBeforePerionStat.concat(this.allPerionChart.beforeStat.filter(stat => stat.subid.startsWith(tagSub['subid'])))
        //       } else if (tagSub['filterTag'] =="EndsWith") {
        //         chartAllPerionStat = chartAllPerionStat.concat(this.allPerionChart.currentStat.filter(stat => stat.subid.endsWith(tagSub['subid'])))
        //         chartAllBeforePerionStat = chartAllBeforePerionStat.concat(this.allPerionChart.beforeStat.filter(stat => stat.subid.endsWith(tagSub['subid'])))
        //       } else if (tagSub['filterTag'] =="ExactValue") {
        //         chartAllPerionStat = chartAllPerionStat.concat(this.allPerionChart.currentStat.filter(stat => stat.subid == tagSub['subid'] ))
        //         chartAllBeforePerionStat = chartAllBeforePerionStat.concat(this.allPerionChart.beforeStat.filter(stat => stat.subid == tagSub['subid'] ))
        //       }
        //     }
            
        //   }
        // }
        //duplicated remove
        // let filter_data = chartAllPerionStat.filter((obj, pos, arr) => {
        //   return arr
        //     .map(mapObj => mapObj._id)
        //     .indexOf(obj._id) == pos;
        // });
        chartAllPerionStat = chartAllPerionStat.slice().sort((a, b) => a.date - b.date);
        chartAllBeforePerionStat = chartAllBeforePerionStat.slice().sort((a, b) => a.date - b.date);
        // var helperChart = {};
        // chartAllPerionStat.map(f =>{
        //   f.revenue = parseFloat(f.revenue);
        // })
        // var resultChart = chartAllPerionStat.reduce(function(r, o) {
        //   var key = o.date;
        //   if(!helperChart[key]) {
        //     helperChart[key] = Object.assign({}, o); // create a copy of o
        //     r.push(helperChart[key]);
        //   } else {
        //     helperChart[key].bing_searches_initial += parseInt(o.bing_searches_initial);
        //     if(o.revenue) {
        //       helperChart[key].revenue += o.revenue;
        //     }
        //   } 
        //   return r;
        // }, []);

        //duplicated remove Before Month Data
        // let filter_before_data = chartAllBeforePerionStat.filter((obj, pos, arr) => {
        //   return arr
        //     .map(mapObj => mapObj._id)
        //     .indexOf(obj._id) == pos;
        // });
        // var helperBeforeChart = {};
        // chartAllBeforePerionStat.map(f =>{
        //   f.revenue = parseFloat(f.revenue);
        // })
        // var resultBeforeChart = chartAllBeforePerionStat.reduce(function(r, o) {
        //   var key = o.date;
        //   if(!helperBeforeChart[key]) {
        //     helperBeforeChart[key] = Object.assign({}, o); // create a copy of o
        //     r.push(helperBeforeChart[key]);
        //   } else {
        //     helperBeforeChart[key].bing_searches_initial += parseInt(o.bing_searches_initial);
        //     if(o.revenue) {
        //       helperBeforeChart[key].revenue += o.revenue;
        //     }
        //   } 
        //   return r;
        // }, []);

        var revenuePerDayVal = [];
        var datesOfRevenueVal = [];
        var revenuePerDayBeforeVal = [];
        var datesOfRevenueBeforeVal = [];
        var chartPerionDataValue = {};
        var revenueCurrentSum = 0;
        var revenueBeforeSum = 0;
        
        for(var dayData of this.allDaysList) {
          var checkExistDay = chartAllPerionStat.filter((result) => result.date == dayData);
          if(checkExistDay.length == 0) {
            revenuePerDayVal.push(0);
            datesOfRevenueVal.push(dayData);
          } else {
            for(var resVal of checkExistDay) {
              revenueCurrentSum += resVal.revenue;
              revenuePerDayVal.push(resVal.revenue);
              datesOfRevenueVal.push(resVal.date);
            }
          }
        }
        
        for(var resBeforeVal of chartAllBeforePerionStat) {
          revenueBeforeSum += resBeforeVal.revenue;
          revenuePerDayBeforeVal.push(resBeforeVal.revenue);
          datesOfRevenueBeforeVal.push(resBeforeVal.date);
        }
        chartPerionDataValue['revenuePerDay'] = revenuePerDayVal;
        chartPerionDataValue['datesOfRevenue'] = datesOfRevenueVal;
        chartPerionDataValue['revenueBeforePerDay'] = revenuePerDayBeforeVal;
        chartPerionDataValue['datesOfRevenueBefore'] = datesOfRevenueBeforeVal;
        chartPerionDataValue['revenueCurrentSum'] = Number.parseFloat(revenueCurrentSum.toFixed(2));
        chartPerionDataValue['revenueBeforeSum'] = Number.parseFloat(revenueBeforeSum.toFixed(2));
        chartPerionDataValue['statType'] = "Perion";
        chartPerionMetric.push(chartPerionDataValue)
        return chartPerionMetric;
      })
      .catch((error) => {
        return error; 
      });
  }
  getLyonChart(company: string) {
    return this.lyonService.getAllDashboardStats().toPromise().then((response) => {
      this.allLyonChart = response[0];
      // console.log("=======dddd======", this.allLyonChart)
      var chartLyonMetric = [];
      var chartAllLyonStat = this.allLyonChart.currentStat;
      var chartAllBeforeLyonStat = this.allLyonChart.beforeStat;
      // for (var tagL of this.tagList) {
      //   if(tagL.tag.advertiser == 'lyons') {
      //     for(var tagSub of tagL.tag.subids) {
          
      //       if(tagSub['filterTag'] =="Contains") {   
      //         chartAllLyonStat = chartAllLyonStat.concat(this.allLyonChart.currentStat.filter(stat => stat.subid.includes(tagSub['subid'])))
      //         chartAllBeforeLyonStat = chartAllBeforeLyonStat.concat(this.allLyonChart.beforeStat.filter(stat => stat.subid.includes(tagSub['subid'])))
      //       } else if (tagSub['filterTag'] =="StartsWith") {
      //         chartAllLyonStat = chartAllLyonStat.concat(this.allLyonChart.currentStat.filter(stat => stat.subid.startsWith(tagSub['subid'])))
      //         chartAllBeforeLyonStat = chartAllBeforeLyonStat.concat(this.allLyonChart.beforeStat.filter(stat => stat.subid.startsWith(tagSub['subid'])))
      //       } else if (tagSub['filterTag'] =="EndsWith") {
      //         chartAllLyonStat = chartAllLyonStat.concat(this.allLyonChart.currentStat.filter(stat => stat.subid.endsWith(tagSub['subid'])))
      //         chartAllBeforeLyonStat = chartAllBeforeLyonStat.concat(this.allLyonChart.beforeStat.filter(stat => stat.subid.endsWith(tagSub['subid'])))
      //       } else if (tagSub['filterTag'] =="ExactValue") {
      //         chartAllLyonStat = chartAllLyonStat.concat(this.allLyonChart.currentStat.filter(stat => stat.subid == tagSub['subid'] ))
      //         chartAllBeforeLyonStat = chartAllBeforeLyonStat.concat(this.allLyonChart.beforeStat.filter(stat => stat.subid == tagSub['subid'] ))
      //       }
      //     }
          
      //   }
      // }
      // //duplicated remove
      // let filter_data = chartAllLyonStat.filter((obj, pos, arr) => {
      //   return arr
      //     .map(mapObj => mapObj._id)
      //     .indexOf(obj._id) == pos;
      // });
      chartAllLyonStat = chartAllLyonStat.slice().sort((a, b) => a.date - b.date);
      chartAllBeforeLyonStat = chartAllBeforeLyonStat.slice().sort((a, b) => a.date - b.date);
      // var helperChart = {};
      // var resultChart = chartAllLyonStat.reduce(function(r, o) {
      //   var key = o.rptDate;
      //   if(!helperChart[key]) {
      //     helperChart[key] = Object.assign({}, o); // create a copy of o
      //     r.push(helperChart[key]);
      //   } else {
      //     helperChart[key].searches += parseInt(o.searches);
      //     if(o.revenue) {
      //       helperChart[key].revenue += o.revenue;
      //     }
      //   } 
      //   return r;
      // }, []);

      //duplicated remove Before Month Data
      // let filter_before_data = chartAllBeforeLyonStat.filter((obj, pos, arr) => {
      //   return arr
      //     .map(mapObj => mapObj._id)
      //     .indexOf(obj._id) == pos;
      // });
      // var helperBeforeChart = {};
      // var resultBeforeChart = chartAllBeforeLyonStat.reduce(function(r, o) {
      //   var key = o.rptDate;
      //   if(!helperBeforeChart[key]) {
      //     helperBeforeChart[key] = Object.assign({}, o); // create a copy of o
      //     r.push(helperBeforeChart[key]);
      //   } else {
      //     helperBeforeChart[key].searches += parseInt(o.searches);
      //     if(o.revenue) {
      //       helperBeforeChart[key].revenue += o.revenue;
      //     }
      //   } 
      //   return r;
      // }, []);

      var revenuePerDayVal = [];
      var datesOfRevenueVal = [];
      var revenuePerDayBeforeVal = [];
      var datesOfRevenueBeforeVal = [];
      var chartLyonDataValue = {};
      var revenueCurrentSum = 0;
      var revenueBeforeSum = 0;
      for(var dayData of this.allDaysList) {
        var checkExistDay = chartAllLyonStat.filter((result) => result.rptDate == dayData);
        if(checkExistDay.length == 0) {
          revenuePerDayVal.push(0);
          datesOfRevenueVal.push(dayData);
        } else {
          for(var resVal of checkExistDay) {
            revenueCurrentSum += resVal.revenue;
            revenuePerDayVal.push(resVal.revenue);
            datesOfRevenueVal.push(resVal.rptDate);
          }
        }
      }
      for(var resBeforeVal of chartAllBeforeLyonStat) {
        revenueBeforeSum += resBeforeVal.revenue;
        revenuePerDayBeforeVal.push(resBeforeVal.revenue);
        datesOfRevenueBeforeVal.push(resBeforeVal.rptDate);
      }
      chartLyonDataValue['revenuePerDay'] = revenuePerDayVal;
      chartLyonDataValue['datesOfRevenue'] = datesOfRevenueVal;
      chartLyonDataValue['revenueBeforePerDay'] = revenuePerDayBeforeVal;
      chartLyonDataValue['datesOfRevenueBefore'] = datesOfRevenueBeforeVal;
      chartLyonDataValue['revenueCurrentSum'] = Number.parseFloat(revenueCurrentSum.toFixed(2));
      chartLyonDataValue['revenueBeforeSum'] = Number.parseFloat(revenueBeforeSum.toFixed(2));
      chartLyonDataValue['statType'] = "Lyons";
      chartLyonMetric.push(chartLyonDataValue)
      return chartLyonMetric;
    })
    .catch((error) => {
      return error;
    });
  }

  getRubiChart(company: string) {
    return this.rubiService.getAllDashboardStats().toPromise().then((response) => {
      this.allRubiChart = response[0];
      var chartRubiMetric = [];
      var chartAllRubiStat = this.allRubiChart.currentStat;
      var chartAllBeforeRubiStat = this.allRubiChart.beforeStat;
      chartAllRubiStat = chartAllRubiStat.slice().sort((a, b) => a.date - b.date);
      chartAllBeforeRubiStat = chartAllBeforeRubiStat.slice().sort((a, b) => a.date - b.date);
      var revenuePerDayVal = [];
      var datesOfRevenueVal = [];
      var revenuePerDayBeforeVal = [];
      var datesOfRevenueBeforeVal = [];
      var chartRubiDataValue = {};
      var revenueCurrentSum = 0;
      var revenueBeforeSum = 0;
      for(var dayData of this.allDaysList) {
        var checkExistDay = chartAllRubiStat.filter((result) => result.date == dayData);
        if(checkExistDay.length == 0) {
          revenuePerDayVal.push(0);
          datesOfRevenueVal.push(dayData);
        } else {
          for(var resVal of checkExistDay) {
            revenueCurrentSum += resVal.revenue;
            revenuePerDayVal.push(resVal.revenue);
            datesOfRevenueVal.push(resVal.date);
          }
        }
      }
      for(var resBeforeVal of chartAllBeforeRubiStat) {
        revenueBeforeSum += resBeforeVal.revenue;
        revenuePerDayBeforeVal.push(resBeforeVal.revenue);
        datesOfRevenueBeforeVal.push(resBeforeVal.date);
      }
      chartRubiDataValue['revenuePerDay'] = revenuePerDayVal;
      chartRubiDataValue['datesOfRevenue'] = datesOfRevenueVal;
      chartRubiDataValue['revenueBeforePerDay'] = revenuePerDayBeforeVal;
      chartRubiDataValue['datesOfRevenueBefore'] = datesOfRevenueBeforeVal;
      chartRubiDataValue['revenueCurrentSum'] = Number.parseFloat(revenueCurrentSum.toFixed(2));
      chartRubiDataValue['revenueBeforeSum'] = Number.parseFloat(revenueBeforeSum.toFixed(2));
      chartRubiDataValue['statType'] = "Rubi";
      chartRubiMetric.push(chartRubiDataValue)
      return chartRubiMetric;
    })
    .catch((error) => {
      return error;
    });
  }

  getProviderChart(company: string) {
    
  }

  //get Tags with selected company
  getCompanyTags(selectedCompany) {
    var companyId;
    if (selectedCompany) {
      companyId = selectedCompany.split("/")[1];
    } else {
      companyId = null;
    }
    return this.tagService.getCompanyTags(companyId).toPromise().then((response) => {  
      return response;
    })
    .catch((error) => {
      return error;
    })
  }
  getCurrentMontDateList() {
    const lastThirtyDays = [...new Array(30)].map((i, idx) => moment().utc().startOf("day").subtract(idx, "days").toDate().getTime()).reverse();
    return lastThirtyDays;
  }

}
