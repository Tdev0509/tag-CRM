import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChartDataInterface } from 'src/app/shared/models/chartData.interface';
import { LyonService } from 'src/app/shared/service/admin-stats/lyon.service';
import { UsersService } from '../../../shared/service/users.service'
import { TagManagementService } from 'src/app/modules/tag-management/tag-management.service';

@Component({
  selector: 'app-lyons',
  templateUrl: './lyons.component.html',
  styleUrls: ['./lyons.component.scss']
})
export class LyonsComponent implements AfterViewInit {
  range = {
    startDate: '',
    endDate: '',
  };
  summary = {
    revenue: 0,
    profit: 0,
  };

  columns = [{ prop: 'name' }, { name: 'Gender' }];
  expanded: any = {};

  tagList: any = [];
  //Sends chartData to ReportingRevenueChartComponent
  chartData: ChartDataInterface;

  //Sends summaryMetrics to SummaryMetricsComponent
  summaryMetricsData: any;
  currentMonthData: any;
  beforeMonthData: any;
  twoBeforeMonthData: any;
  rows: any[];
  selectedCompany: any;
  allstat: any;
  allChart: any;
  filteredLyonStat: any[] = [];
  @ViewChild('expandableTable') table: any;

  constructor(
    private lyonService: LyonService,
    private cdr: ChangeDetectorRef,
    private userService: UsersService,
    private tagService: TagManagementService,
  ) {
    this.selectedCompany = this.getSelectedCompanyFromLocalStorage();
   }
    
  async ngAfterViewInit() {
    this.tagList = await this.getCompanyTags(this.selectedCompany);
    
    this.rows = [];
    this.rows = await this.getAllLyonStats(
      this.range.startDate,
      this.range.endDate
    );
    
    this.chartData = await this.getChartMetrics(
      this.selectedCompany,
      this.range.startDate,
      this.range.endDate
    );
    this.summaryMetricsData =await this.getSummaryMetrics(this.selectedCompany);
    this.refreshTable();
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
    this.lyonService.testingRoute().subscribe((response) => {
      console.log(response);
    }),
      (err) => {
        console.log(err);
      };
  }

  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
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
  //get Stat all
  getAllLyonStats(startDate, endDate) {
    return this.lyonService.getAllStats(startDate, endDate).toPromise().then((response) => {    
      this.allstat = response;
      this.allstat.map(function(resStat) {
        resStat.publisher = "No Publisher"
        resStat.tagname = "No Tag"
      });
      // var allLyonStat = [];
      for (var tagL of this.tagList) {
        if(tagL.tag.advertiser == "lyons") {
          for (var tagSub of tagL.tag.subids) {
            if(tagSub.filterTag =="Contains") {
              
              this.allstat.map(stat => {
                if (stat.subid.includes(tagSub.subid)) {
                  stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                  stat.tagname = tagL.tag.name
                }
              })
              
            } else if (tagSub.filterTag =="StartsWith") {
              this.allstat.map(stat => {
                if (stat.subid.startsWith(tagSub.subid)) {
                  stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                  stat.tagname = tagL.tag.name
                }
              })
              
            } else if (tagSub.filterTag =="EndsWith") {
              this.allstat.map(stat => {
                if (stat.subid.endsWith(tagSub.subid)) {
                  stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                  stat.tagname = tagL.tag.name
                }
              }) 
              
            } else if (tagSub.filterTag =="ExactValue") {
              this.allstat.map(stat => {
                if (stat.subid == tagSub.subid) {
                  stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                  stat.tagname = tagL.tag.name
                }
              })
              
            } 
          }
        }
        
      }
      
      //duplicated remove
      let filtered_data = this.allstat.filter((obj, pos, arr) => {
        return arr
          .map(mapObj => mapObj._id)
          .indexOf(obj._id) == pos;
      });
      var helper = {};
      filtered_data.map(f =>{
        f.revenue = parseFloat(f.revenue);
        f.ctr = parseFloat(f.ctr);
        f.biddedCtr = parseFloat(f.biddedCTR);
        f.split = parseFloat(f.split);
      });
      //Calculate the sums and group data (while tracking count)
      var resultAll = filtered_data.reduce(function(prev, current) {
        var key = (current.rptDate).toString() + '-' + current.subid;
        if(!helper[key]) {
          helper[key] = Object.assign({}, current); // create a copy of o
          helper[key].count = 1;
          prev.push(helper[key]);
        } else {
          helper[key].clicks += parseInt(current.clicks);
          helper[key].searches += parseInt(current.searches);
          if(current.biddedCtr) {
            helper[key].biddedCtr += current.biddedCtr;
          }
          if(current.ctr) {
            helper[key].ctr += current.ctr;
          }
          if(current.revenue) {
            helper[key].revenue += current.revenue;
          }
          
          helper[key].biddedSearches += parseInt(current.biddedSearches);
          helper[key].count += 1;
          helper[key].split += parseInt(current.split);
          // helper[key].split_num = 70;
        }
        return prev;
      }, []);
      
      resultAll.map((item) => {
        item.split = item.split/item.count
      })
      return resultAll;
    })
    .catch((error) => {
      return error;
    });
    
  }

  updateAllLyonStats(company, startDate, endDate) {
    this.lyonService
      .updateAllLyonStats(company, startDate, endDate)
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
    this.rows = await this.getAllLyonStats(
      this.range.startDate,
      this.range.endDate
    );
    this.chartData = await this.getChartMetrics(
      this.selectedCompany,
      this.range.startDate,
      this.range.endDate
    );
    this.summaryMetricsData = await this.getSummaryMetrics(this.selectedCompany);
    this.refreshTable();
  }

  refreshTable() {
    this.cdr.markForCheck();
  }

  getSummaryMetrics(company) {
    return this.lyonService.getSummaryMetrics(company).toPromise().then((response) => {    
      this.currentMonthData = response[0].summaryMetrics;
      this.beforeMonthData = response[0].lastMonthStat;  
      this.twoBeforeMonthData = response[0].twoLastMonthStat;  
      var dayInCurrentMonth = response[0].dayInCurrentMonth;
      var dayInBeforeMonth = response[0].dayInBeforeMonth;
      var dayInTwoBeforeMonth = response[0].dayInTwoBeforeMonth;
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
            
      //     } else if (tagSub.filterTag =="EndsWith") {
      //       summaryCurrentStat = summaryCurrentStat.concat(this.currentMonthData.filter(stat => stat.subid.endsWith(tagSub.subid)))
      //     } else if (tagSub.filterTag =="ExactValue") {
      //       summaryCurrentStat = summaryCurrentStat.concat(this.currentMonthData.filter(stat => stat.subid == tagSub.subid ))
      //     }
      //   }
      // }
      
      // //duplicated remove
      // let filter_data = summaryCurrentStat.filter((obj, pos, arr) => {
      //   return arr
      //     .map(mapObj => mapObj._id)
      //     .indexOf(obj._id) == pos;
      // });
      
      var helperSummary = {};
      this.currentMonthData.map(f =>{
        f.revenue = parseFloat(f.revenue);
        // f.ctr = parseFloat(f.ctr);
        // f.biddedCtr = parseFloat(f.biddedCTR);
      })
      
      var resultSummary = this.currentMonthData.reduce(function(r, o) {
        var key = o.rptDate;
        if(!helperSummary[key]) {
          helperSummary[key] = Object.assign({}, o); // create a copy of o
          r.push(helperSummary[key]);
        } else {
          helperSummary[key].searches += parseInt(o.searches);
          if(o.revenue) {
            helperSummary[key].revenue += o.revenue;
          }
        } 
        return r;
      }, []);
      
      var monthRevenue = 0;
      var monthProfit = 0;
      var monthRevenuePace = 0;
      var profitPace = 0;
      for(var sumData of resultSummary) {
        monthRevenue += sumData.revenue;
        monthProfit += sumData.revenue *(100 - sumData.split) * 0.01;
        monthRevenuePace += (sumData.revenue/resultSummary.length) * dayInCurrentMonth;
        profitPace += (sumData.revenue *(100 - sumData.split) * 0.01/resultSummary.length)*dayInCurrentMonth;
      }

      //before month data get part
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
      
      var helperBeforeSummary = {};
      this.beforeMonthData.map(f =>{
        f.revenue = parseFloat(f.revenue);
        // f.ctr = parseFloat(f.ctr);
        // f.biddedCtr = parseFloat(f.biddedCTR);
      })
      
      var resultBeforeSummary = this.beforeMonthData.reduce(function(r, o) {
        var key = o.rptDate;
        if(!helperBeforeSummary[key]) {
          helperBeforeSummary[key] = Object.assign({}, o); // create a copy of o
          r.push(helperBeforeSummary[key]);
        } else {
          helperBeforeSummary[key].searches += parseInt(o.searches);
          if(o.revenue) {
            helperBeforeSummary[key].revenue += o.revenue;
          }
        } 
        return r;
      }, []);
      var monthBeforeRevenue = 0;
      var monthBeforeProfit = 0;
      var monthBeforeRevenuePace = 0;
      var profitBeforePace = 0;
      for(var sumBeforeData of resultBeforeSummary) {
        monthBeforeRevenue += sumBeforeData.revenue;
        monthBeforeProfit += sumBeforeData.revenue *(100 - sumBeforeData.split) * 0.01;
        monthBeforeRevenuePace += (sumBeforeData.revenue/resultBeforeSummary.length) * dayInBeforeMonth;
        profitBeforePace += (sumBeforeData.revenue *(100 - sumBeforeData.split) * 0.01/resultBeforeSummary.length)*dayInBeforeMonth;
      }

      //tow before month data get part
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
      
      var helperTwoBeforeSummary = {};
      this.twoBeforeMonthData.map(f =>{
        f.revenue = parseFloat(f.revenue);
        // f.ctr = parseFloat(f.ctr);
        // f.biddedCtr = parseFloat(f.biddedCTR);
      })
      
      var resultTwoBeforeSummary = this.twoBeforeMonthData.reduce(function(r, o) {
        var key = o.rptDate;
        if(!helperTwoBeforeSummary[key]) {
          helperTwoBeforeSummary[key] = Object.assign({}, o); // create a copy of o
          r.push(helperTwoBeforeSummary[key]);
        } else {
          helperTwoBeforeSummary[key].searches += parseInt(o.searches);
          if(o.revenue) {
            helperTwoBeforeSummary[key].revenue += o.revenue;
          }
        } 
        return r;
      }, []);
      var monthTwoBeforeRevenue = 0;
      var monthTwoBeforeProfit = 0;
      var monthTwoBeforeRevenuePace = 0;
      var profitTwoBeforePace = 0;
      for(var sumTwoBeforeData of resultTwoBeforeSummary) {
        monthTwoBeforeRevenue += sumTwoBeforeData.revenue;
        monthTwoBeforeProfit += sumTwoBeforeData.revenue *(100 - sumTwoBeforeData.split) * 0.01;
        monthTwoBeforeRevenuePace += (sumTwoBeforeData.revenue/resultTwoBeforeSummary.length) * dayInTwoBeforeMonth;
        profitTwoBeforePace += (sumTwoBeforeData.revenue *(100 - sumTwoBeforeData.split) * 0.01/resultTwoBeforeSummary.length)*dayInTwoBeforeMonth;
      }
      var currentPercentPace = 0;
      var lastPercentPace = 0;
      if (profitBeforePace != 0) {
        currentPercentPace = ((profitPace - profitBeforePace) / profitBeforePace) * 100
      }
      if (profitTwoBeforePace != 0) {
        lastPercentPace = ((profitBeforePace - profitTwoBeforePace) / profitTwoBeforePace) * 100
      }
      var summaryFinalData = [];
      summaryFinalData.push({
        summaryMetrics: [{
          revenue: monthRevenue,
          revenuePace: monthRevenuePace,
          profit: monthProfit,
          profitPace: profitPace,
          percentPace: currentPercentPace
        }],
        lastMonthStat: [{
          revenue: monthBeforeRevenue,
          revenuePace: monthBeforeRevenuePace,
          profit: monthBeforeProfit,
          profitPace: profitBeforePace,
          percentPace: lastPercentPace
        }]
      });
      var allSummary = {};
      allSummary['summary'] = summaryFinalData;
      return allSummary;
        // this.combineSummaryMetrics(response);
      })
      .catch((error) => {
        return error;
      })
  }

  getChartMetrics(company, startDate, endDate) {
    return this.lyonService.getAllStats(startDate, endDate).toPromise().then((response) => {  
      var sortResponse = response.slice().sort((a, b) => a.rptDate - b.rptDate)  
      this.allChart = sortResponse;
      
      // var chartAllLyonStat = [];
      // for (var tagL of this.tagList) {
      //   for (var tagSub of tagL.tag.subids) {
      //     if(tagSub.filterTag =="Contains") {
            
      //       chartAllLyonStat = chartAllLyonStat.concat(this.allChart.filter(stat => stat.subid.includes(tagSub.subid)))
      //       chartAllLyonStat.map(stat => {
      //         stat.publisher = tagL.user ? tagL.user[0].fullname : ""
      //         stat.tagname = tagL.tag.name
      //       })
      //     } else if (tagSub.filterTag =="StartsWith") {
      //       chartAllLyonStat = chartAllLyonStat.concat(this.allChart.filter(stat => stat.subid.startsWith(tagSub.subid)))
      //       chartAllLyonStat.map(stat => {
      //         stat.publisher = tagL.user ? tagL.user[0].fullname : ""
      //         stat.tagname = tagL.tag.name
      //       })
      //     } else if (tagSub.filterTag =="EndsWith") {
      //       chartAllLyonStat = chartAllLyonStat.concat(this.allChart.filter(stat => stat.subid.endsWith(tagSub.subid)))
      //       chartAllLyonStat.map(stat => {
      //         stat.publisher = tagL.user ? tagL.user[0].fullname : ""
      //         stat.tagname = tagL.tag.name
      //       })
      //     } else if (tagSub.filterTag =="ExactValue") {
      //       chartAllLyonStat = chartAllLyonStat.concat(this.allChart.filter(stat => stat.subid == tagSub.subid ))
      //       chartAllLyonStat.map(stat => {
      //         stat.publisher = tagL.user ? tagL.user[0].fullname : ""
      //         stat.tagname = tagL.tag.name
      //       })
      //     }
      //   }
      // }
      
      //duplicated remove
      // let filter_data = chartAllLyonStat.filter((obj, pos, arr) => {
      //   return arr
      //     .map(mapObj => mapObj._id)
      //     .indexOf(obj._id) == pos;
      // });
      var helperChart = {};
      this.allChart.map(f =>{
        f.revenue = parseFloat(f.revenue);
        f.ctr = parseFloat(f.ctr);
        f.biddedCtr = parseFloat(f.biddedCTR);
      })
      
      var resultChart = this.allChart.reduce(function(r, o) {
        var key = (o.rptDate).toString();
        if(!helperChart[key]) {
          helperChart[key] = Object.assign({}, o); // create a copy of o
          r.push(helperChart[key]);
        } else {
          helperChart[key].searches += parseInt(o.searches);
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
        datesOfRevenueVal.push(resVal.rptDate);
        searchesPerDayVal.push(resVal.searches);
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
      this.summary.revenue += element.revenue;
      this.summary.profit += element.revenue * ((100 - element.split) * 0.01);
    });
  }

  createChartData(stats) {}
  

}
