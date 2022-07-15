import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UsersService } from '../../../shared/service/users.service'
import { ChartDataInterface } from 'src/app/shared/models/chartData.interface';
import { PerionService } from 'src/app/shared/service/admin-stats/perion.service';
import { TagManagementService } from 'src/app/modules/tag-management/tag-management.service';

@Component({
  selector: 'app-perion',
  templateUrl: './perion.component.html',
  styleUrls: ['./perion.component.scss'],
})
export class PerionComponent implements AfterViewInit {
  range = {
    startDate: '',
    endDate: '',
  };
  loadingIndicator = true;
  company = {
    name: 'Manic Traffic',
    login: {
      username: 'kevin@manictraffic.com',
      password: 'kauf2552',
    },
    statsUpdateURL:
      'https://services.hub.codefuel.com/analytics/reports?channelQueryType=all_channels&columnQueryData=%7B%22ids%22:%5B%22date%22,%22product%22,%22channel%22,%22country%22,%22searches%22,%22ad_clicks%22,%22publisher_cpc%22,%22monetized_ctr%22,%22revenue%22,%22searches_monetized%22%5D%7D&columnQueryType=specific_columns&endDate=1600991999000&geoQueryType=all&limit=10000&productQueryType=all_product&startDate=1600905600000&walletQueryType=all_wallets',
  };

  summary = {
    revenue: 0,
    profit: 0,
  };

  columns = [{ prop: 'name' }, { name: 'Gender' }];
  expanded: any = {};
  allStat: any[];
  allChartStat: any[];
  //Sends chartData to ReportingRevenueChartComponent
  chartData: ChartDataInterface;

  //Sends summaryMetrics to SummaryMetricsComponent
  summaryMetrics: any;
  tagList: any = [];
  rows: any[];
  selectedCompany: any;
  summaryMetricsData: any;
  currentMonthData: any;
  beforeMonthData: any;
  twoBeforeMonthData: any;

  @ViewChild('expandableTable') table: any;

  constructor(
    private perionService: PerionService,
    private cdr: ChangeDetectorRef,
    private userService: UsersService,
    private tagService: TagManagementService,
  ) {
    this.selectedCompany = this.getSelectedCompanyFromLocalStorage();
  }

  async ngAfterViewInit() {   
    this.tagList = await this.getCompanyTags(this.selectedCompany);

    this.rows = [];
    this.rows = await this.getAllPerionStats(
      this.selectedCompany,
      this.range.startDate,
      this.range.endDate
    );
    this.chartData = await this.getChartMetrics(
      this.selectedCompany,
      this.range.startDate,
      this.range.endDate
    );
    this.summaryMetrics = await this.getSummaryMetrics(this.selectedCompany);
    this.refreshTable();
  }

  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  async routeTester() {
    console.log('Testing Route');
    this.perionService.testingRoute().subscribe((response) => {
      console.log(response);
    }),
      (err) => {
        console.log(err);
      };
  }

  updateAllPerionStats(company, startDate, endDate) {
    this.perionService
      .updateAllPerionStats(company, startDate, endDate)
      .subscribe((response) => {
        console.log(response);
      }),
      (err) => {
        console.log(err);
      };
  }

  public async updateReportingFiltering(range) {
    // console.log('Update report filtering....');
    this.range = range;
    this.rows = await this.getAllPerionStats(
      this.selectedCompany,
      this.range.startDate,
      this.range.endDate
    );
    this.chartData = await this.getChartMetrics(
      this.selectedCompany,
      this.range.startDate,
      this.range.endDate
    );
    this.summaryMetrics = await this.getSummaryMetrics(this.selectedCompany);
    this.refreshTable();
  }

  getAllPerionStats(company, startDate, endDate) {
    return this.perionService
      .getAllPerionStats(company, startDate, endDate)
      .toPromise()
      .then((response) => {
        console.log('getAllPerionStats() response:');
        this.loadingIndicator = false;
        // console.log(response.stats);
        this.allStat = response.stats;
        this.allStat.map(function(resStat) {
          resStat.publisher = "No Publisher"
          resStat.tagname = "No Tag" 
        });
        
        for (var tagL of this.tagList) {
          if(tagL.tag.advertiser == "perion") {
            for (var tagSub of tagL.tag.subids) {
              if(tagSub.filterTag =="Contains") {
              
                this.allStat.map(stat => {
                  if (stat.subid.includes(tagSub.subid)) {
                    stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                    stat.tagname = tagL.tag.name
                  }
                })
                
              } else if (tagSub.filterTag =="StartsWith") {
                this.allStat.map(stat => {
                  if (stat.subid.startsWith(tagSub.subid)) {
                    stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                    stat.tagname = tagL.tag.name
                  }
                })
                
              } else if (tagSub.filterTag =="EndsWith") {
                this.allStat.map(stat => {
                  if (stat.subid.endsWith(tagSub.subid)) {
                    stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                    stat.tagname = tagL.tag.name
                  }
                }) 
                
              } else if (tagSub.filterTag =="ExactValue") {
                this.allStat.map(stat => {
                  if (stat.subid == tagSub.subid) {
                    stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                    stat.tagname = tagL.tag.name
                  }
                })
                
              } 
            }
          }
        }
        // var helper = new Set();
        
        // //duplicated remove
        // let filtered_data = this.allStat.filter((perionStat) => {
        //   const key = JSON.stringify([perionStat.date, perionStat.subid]);
        //   return !helper.has(key) && helper.add(key);
        // });
        // console.log("=========", filtered_data.length)
        //return filtered_data.slice().sort((a, b) => b.date - a.date);
        return this.allStat;
      })
      .catch((error) => {
        return error;
      });
  }

  refreshTable() {
    this.cdr.markForCheck();
  }

  getSummaryMetrics(company) {
    return this.perionService.getSummaryMetrics(company).toPromise().then((response) => {
      console.log('Got summary metrics');
      // console.log("===============", response)
      // this.currentMonthData = response.summary[0].summaryMetrics;
      // this.beforeMonthData = response.summary[0].lastMonthStat;  
      // this.twoBeforeMonthData = response.summary[0].twoLastMonthStat;  
      // var dayInCurrentMonth = response.summary[0].dayInCurrentMonth;
      // var dayInBeforeMonth = response.summary[0].dayInBeforeMonth;
      // var dayInTwoBeforeMonth = response.summary[0].dayInTwoBeforeMonth;
      // var summaryCurrentStat = [];
      //current data get part
      // for (var tagL of this.tagList) {
      //   for (var tagSub of tagL.tag.subids) {
      //     if(tagSub.filterTag =="Contains") {
            
      //       summaryCurrentStat = summaryCurrentStat.concat(this.currentMonthData.filter(stat => stat.subid.includes(tagSub.subid)))
      //       summaryCurrentStat.map(stat => {
      //         stat.publisher = tagL.user ? tagL.user[0].fullname : ""
      //         stat.tagname = tagL.tag.name
      //       })
      //     } else if (tagSub.filterTag =="StartsWith") {
      //       summaryCurrentStat = summaryCurrentStat.concat(this.currentMonthData.filter(stat => stat.subid.startsWith(tagSub.subid)))
      //       summaryCurrentStat.map(stat => {
      //         stat.publisher = tagL.user ? tagL.user[0].fullname : ""
      //         stat.tagname = tagL.tag.name
      //       })
            
      //     } else if (tagSub.filterTag =="EndsWith") {
      //       summaryCurrentStat = summaryCurrentStat.concat(this.currentMonthData.filter(stat => stat.subid.endsWith(tagSub.subid)))
      //       summaryCurrentStat.map(stat => {
      //         stat.publisher = tagL.user ? tagL.user[0].fullname : ""
      //         stat.tagname = tagL.tag.name
      //       })
      //     } else if (tagSub.filterTag =="ExactValue") {
      //       summaryCurrentStat = summaryCurrentStat.concat(this.currentMonthData.filter(stat => stat.subid == tagSub.subid ))
      //       summaryCurrentStat.map(stat => {
      //         stat.publisher = tagL.user ? tagL.user[0].fullname : ""
      //         stat.tagname = tagL.tag.name
      //       })
      //     }
      //   }
      // }
      // // //duplicated remove
      // let filter_data = summaryCurrentStat.filter((obj, pos, arr) => {
      //   return arr
      //     .map(mapObj => mapObj._id)
      //     .indexOf(obj._id) == pos;
      // });
      
      // var helperSummary = {};
      // filter_data.map(f =>{
      //   f.revenue = parseFloat(f.revenue);
      //   f.ctr = parseFloat(f.ctr);
      //   f.biddedCtr = parseFloat(f.biddedCTR);
      // })
      
      // var resultSummary = filter_data.reduce(function(r, o) {
      //   var key = o.rptDate;
      //   if(!helperSummary[key]) {
      //     helperSummary[key] = Object.assign({}, o); // create a copy of o
      //     r.push(helperSummary[key]);
      //   } else {
      //     helperSummary[key].searches += parseInt(o.searches);
      //     if(o.revenue) {
      //       helperSummary[key].revenue += o.revenue;
      //     }
      //   } 
      //   return r;
      // }, []);
      // var monthRevenue = 0;
      // var monthProfit = 0;
      // var monthRevenuePace = 0;
      // var profitPace = 0;
      // for(var sumData of resultSummary) {
      //   monthRevenue += sumData.revenue;
      //   monthProfit += sumData.revenue *(100 - sumData.split) * 0.01;
      //   monthRevenuePace += (monthRevenue/resultSummary.length) * dayInCurrentMonth;
      //   profitPace += (monthProfit/resultSummary.length)*dayInCurrentMonth;
      // }

      // //before month data get part
      // var summaryBeforeStat = [];
      // for (var tagL of this.tagList) {
      //   for (var tagSub of tagL.tag.subids) {
      //     if(tagSub.filterTag =="Contains") {
            
      //       summaryBeforeStat = summaryBeforeStat.concat(this.beforeMonthData.filter(stat => stat.subid.includes(tagSub.subid)))
      //       summaryBeforeStat.map(stat => {
      //         stat.publisher = tagL.user ? tagL.user[0].fullname : ""
      //         stat.tagname = tagL.tag.name
      //       })
      //     } else if (tagSub.filterTag =="StartsWith") {
      //       summaryBeforeStat = summaryBeforeStat.concat(this.beforeMonthData.filter(stat => stat.subid.startsWith(tagSub.subid)))
            
      //     } else if (tagSub.filterTag =="EndsWith") {
      //       summaryBeforeStat = summaryBeforeStat.concat(this.beforeMonthData.filter(stat => stat.subid.endsWith(tagSub.subid)))
      //     } else if (tagSub.filterTag =="ExactValue") {
      //       summaryBeforeStat = summaryBeforeStat.concat(this.beforeMonthData.filter(stat => stat.subid == tagSub.subid ))
      //     }
      //   }
      // }
      
      // // //duplicated remove
      // let filt_data = summaryBeforeStat.filter((obj, pos, arr) => {
      //   return arr
      //     .map(mapObj => mapObj._id)
      //     .indexOf(obj._id) == pos;
      // });
      
      // var helperBeforeSummary = {};
      // filt_data.map(f =>{
      //   f.revenue = parseFloat(f.revenue);
      //   f.ctr = parseFloat(f.ctr);
      //   f.biddedCtr = parseFloat(f.biddedCTR);
      // })
      
      // var resultBeforeSummary = filt_data.reduce(function(r, o) {
      //   var key = o.rptDate;
      //   if(!helperBeforeSummary[key]) {
      //     helperBeforeSummary[key] = Object.assign({}, o); // create a copy of o
      //     r.push(helperBeforeSummary[key]);
      //   } else {
      //     helperBeforeSummary[key].searches += parseInt(o.searches);
      //     if(o.revenue) {
      //       helperBeforeSummary[key].revenue += o.revenue;
      //     }
      //   } 
      //   return r;
      // }, []);
      // var monthBeforeRevenue = 0;
      // var monthBeforeProfit = 0;
      // var monthBeforeRevenuePace = 0;
      // var profitBeforePace = 0;
      // for(var sumBeforeData of resultBeforeSummary) {
      //   monthBeforeRevenue += sumBeforeData.revenue;
      //   monthBeforeProfit += sumBeforeData.revenue *(100 - sumBeforeData.split) * 0.01;
      //   monthBeforeRevenuePace += (monthBeforeRevenue/resultBeforeSummary.length) * dayInBeforeMonth;
      //   profitBeforePace += (monthBeforeProfit/resultBeforeSummary.length)*dayInBeforeMonth;
      // }

      // //tow before month data get part
      // var summaryTwoBeforeStat = [];
      // for (var tagL of this.tagList) {
      //   for (var tagSub of tagL.tag.subids) {
      //     if(tagSub.filterTag =="Contains") {
            
      //       summaryTwoBeforeStat = summaryTwoBeforeStat.concat(this.twoBeforeMonthData.filter(stat => stat.subid.includes(tagSub.subid)))
      //       summaryTwoBeforeStat.map(stat => {
      //         stat.publisher = tagL.user ? tagL.user[0].fullname : ""
      //         stat.tagname = tagL.tag.name
      //       })
      //     } else if (tagSub.filterTag =="StartsWith") {
      //       summaryTwoBeforeStat = summaryTwoBeforeStat.concat(this.twoBeforeMonthData.filter(stat => stat.subid.startsWith(tagSub.subid)))
            
      //     } else if (tagSub.filterTag =="EndsWith") {
      //       summaryTwoBeforeStat = summaryTwoBeforeStat.concat(this.twoBeforeMonthData.filter(stat => stat.subid.endsWith(tagSub.subid)))
      //     } else if (tagSub.filterTag =="ExactValue") {
      //       summaryTwoBeforeStat = summaryTwoBeforeStat.concat(this.twoBeforeMonthData.filter(stat => stat.subid == tagSub.subid ))
      //     }
      //   }
      // }
      
      // // //duplicated remove
      // let filter_two_data = summaryTwoBeforeStat.filter((obj, pos, arr) => {
      //   return arr
      //     .map(mapObj => mapObj._id)
      //     .indexOf(obj._id) == pos;
      // });
      
      // var helperTwoBeforeSummary = {};
      // filter_two_data.map(f =>{
      //   f.revenue = parseFloat(f.revenue);
      //   f.ctr = parseFloat(f.ctr);
      //   f.biddedCtr = parseFloat(f.biddedCTR);
      // })
      
      // var resultTwoBeforeSummary = filter_two_data.reduce(function(r, o) {
      //   var key = o.rptDate;
      //   if(!helperTwoBeforeSummary[key]) {
      //     helperTwoBeforeSummary[key] = Object.assign({}, o); // create a copy of o
      //     r.push(helperTwoBeforeSummary[key]);
      //   } else {
      //     helperTwoBeforeSummary[key].searches += parseInt(o.searches);
      //     if(o.revenue) {
      //       helperTwoBeforeSummary[key].revenue += o.revenue;
      //     }
      //   } 
      //   return r;
      // }, []);
      // var monthTwoBeforeRevenue = 0;
      // var monthTwoBeforeProfit = 0;
      // var monthTwoBeforeRevenuePace = 0;
      // var profitTwoBeforePace = 0;
      // for(var sumTwoBeforeData of resultTwoBeforeSummary) {
      //   monthTwoBeforeRevenue += sumTwoBeforeData.revenue;
      //   monthTwoBeforeProfit += sumTwoBeforeData.revenue *(100 - sumTwoBeforeData.split) * 0.01;
      //   monthTwoBeforeRevenuePace += (monthTwoBeforeRevenue/resultTwoBeforeSummary.length) * dayInTwoBeforeMonth;
      //   profitTwoBeforePace += (monthTwoBeforeProfit/resultTwoBeforeSummary.length)*dayInTwoBeforeMonth;
      // }
      // var currentPercentPace = 0;
      // var lastPercentPace = 0;
      // if (profitBeforePace != 0) {
      //   currentPercentPace = ((profitPace - profitBeforePace) / profitBeforePace) * 100
      // }
      // if (profitTwoBeforePace != 0) {
      //   lastPercentPace = ((profitBeforePace - profitTwoBeforePace) / profitTwoBeforePace) * 100
      // }
      // var summaryFinalData = [];
      // summaryFinalData.push({
      //   summaryMetrics: [{
      //     revenue: monthRevenue,
      //     revenuePace: monthRevenuePace,
      //     profit: monthProfit,
      //     profitPace: profitPace,
      //     percentPace: currentPercentPace
      //   }],
      //   lastMonthStat: [{
      //     revenue: monthBeforeRevenue,
      //     revenuePace: monthBeforeRevenuePace,
      //     profit: monthBeforeProfit,
      //     profitPace: profitBeforePace,
      //     percentPace: lastPercentPace
      //   }]
      // });
      var allSummary = {};
      var currentPercentPace = 0;
      var lastPercentPace = 0;
      if(response.summary[0].lastMonthStat[0].profitPace != 0) {
        currentPercentPace = (response.summary[0].summaryMetrics[0].profitPace - response.summary[0].lastMonthStat[0].profitPace) / (response.summary[0].lastMonthStat[0].profitPace) * 100;
      }
      if(response.summary[0].twoLastMonthStat[0].profitPace != 0) {
        lastPercentPace = (response.summary[0].lastMonthStat[0].profitPace - response.summary[0].twoLastMonthStat[0].profitPace) / (response.summary[0].twoLastMonthStat[0].profitPace) * 100;
      }
      
      response.summary[0].summaryMetrics[0].percentPace = currentPercentPace;
      response.summary[0].lastMonthStat[0].percentPace = lastPercentPace;
      allSummary['summary'] = response.summary;
      return allSummary;
    })
    .catch((error) => {
      return error;
    })
  }

  getChartMetrics(company, startDate, endDate) {
    return this.perionService
      .getAllPerionStats(company, startDate, endDate)
      .toPromise()
      .then((response) => {
        // console.log('getAllPerionStats() response:');
        this.allChartStat = response.stats;
        // var allChartPerionStat = [];
        
        // for (var tagL of this.tagList) {
        //   if(tagL.tag.advertiser == "perion") {
        //     for (var tagSub of tagL.tag.subids) {
        //       if(tagSub.filterTag =="Contains") {
              
        //         allChartPerionStat = allChartPerionStat.concat(this.allChartStat.filter(stat => stat.subid.includes(tagSub.subid)))
        //         allChartPerionStat.map(stat => {
        //           stat.publisher = tagL.user ? tagL.user[0].fullname : ""
        //           stat.tagname = tagL.tag.name
        //         })
        //       } else if (tagSub.filterTag =="StartsWith") {
        //         allChartPerionStat = allChartPerionStat.concat(this.allChartStat.filter(stat => stat.subid.startsWith(tagSub.subid)))
        //         allChartPerionStat.map(stat => {
        //           stat.publisher = tagL.user ? tagL.user[0].fullname : ""
        //           stat.tagname = tagL.tag.name
        //         })
        //       } else if (tagSub.filterTag =="EndsWith") {
        //         allChartPerionStat = allChartPerionStat.concat(this.allChartStat.filter(stat => stat.subid.endsWith(tagSub.subid)))
        //         allChartPerionStat.map(stat => {
        //           stat.publisher = tagL.user ? tagL.user[0].fullname : ""
        //           stat.tagname = tagL.tag.name
        //         })
        //       } else if (tagSub.filterTag =="ExactValue") {
        //         allChartPerionStat = allChartPerionStat.concat(this.allChartStat.filter(stat => stat.subid == tagSub.subid ))
        //         allChartPerionStat.map(stat => {
        //           stat.publisher = tagL.user ? tagL.user[0].fullname : ""
        //           stat.tagname = tagL.tag.name
        //         })
        //       }
        //     }
        //   }
        // }
        // var helper = new Set();
        //duplicated remove
        // let filtered_data = this.allChartStat.filter((perionStat) => {
        //   const key = JSON.stringify([perionStat.date, perionStat.subid]);
        //   return !helper.has(key) && helper.add(key);
        // });
        this.allChartStat = this.allChartStat.slice().sort((a, b) => a.date - b.date);
        var helperChart = {};
        var resultChart = this.allChartStat.reduce(function(r, o) {
          var key = o.date;
          if(!helperChart[key]) {
            helperChart[key] = Object.assign({}, o); // create a copy of o
            r.push(helperChart[key]);
          } else {
            helperChart[key].impressions += parseInt(o.impressions);
            if(o.revenue) {
              helperChart[key].revenue += o.revenue;
            }
          } 
          return r;
        }, []);
        var revenuePerDayVal = [];
        var datesOfRevenueVal = [];
        var searchesPerDayVal = [];
        var chartDataValue = {};
        for(var resVal of resultChart) {
          revenuePerDayVal.push(resVal.revenue);
          datesOfRevenueVal.push(resVal.date);
          searchesPerDayVal.push(resVal.impressions);
        }
        chartDataValue['revenuePerDay'] = revenuePerDayVal;
        chartDataValue['datesOfRevenue'] = datesOfRevenueVal;
        chartDataValue['searchesPerDay'] = searchesPerDayVal;
        return chartDataValue;
      })
      .catch((error) => {
        return error;
      });
  }

  combineSummaryMetrics(metrics) {
    metrics.summary.keys.forEach((element) => {
      console.log(element.revenue);
      this.summary.revenue += element.revenue;
      this.summary.profit += element.revenue * ((100 - element.split) * 0.01);
    });
  }

  //get Tags with selected company
  getCompanyTags(selectedCompany) {
    var companyId = selectedCompany.split("/")[1];
    return this.tagService.getCompanyTags(companyId).toPromise().then((response) => {  
      return response;
    })
    .catch((error) => {
      return error;
    })
  }

  createChartData(stats) {}
}
