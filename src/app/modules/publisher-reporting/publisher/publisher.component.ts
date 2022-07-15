import { Component, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagInterface } from 'src/app/shared/models/tag.interface';
import { TagManagementService } from '../../tag-management/tag-management.service';
import { UsersService } from '../../../shared/service/users.service'
import { ChartDataInterface } from 'src/app/shared/models/chartData.interface';
import { PerionService } from 'src/app/shared/service/admin-stats/perion.service';
import { LyonService } from 'src/app/shared/service/admin-stats/lyon.service';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})
export class PublisherComponent implements AfterViewInit  {
  @ViewChild('expandableTable') table: any;
  loadingIndicator = true;
  tagRows: TagInterface;
  //Sends chartData to ReportingRevenueChartComponent
  chartData: ChartDataInterface;
  selectedCompany: any;
  selectedAdvertiser: any;
  allChart: any;
  range = {
    startDate: '',
    endDate: '',
  };
  statData: any[];
  allLyonStatData: any;
  allPerionStatData: any;

  constructor(
    private route: ActivatedRoute,
    private tagManagementService: TagManagementService,
    private cdr: ChangeDetectorRef,
    private userService: UsersService,
    private perionService: PerionService,
    private lyonService: LyonService,
  ) {
    this.selectedCompany = this.getSelectedCompanyFromLocalStorage();
  }
  
  async ngAfterViewInit(){
    this.route.params.subscribe(async routeParams => {
      //console.log("routeParams===>", routeParams)
      this.statData = [];
      this.tagRows = await this.getTagInformation(routeParams.tagId);
      this.selectedAdvertiser = this.tagRows.advertiser;
      this.selectedCompany = this.tagRows.company;
     
      if(this.selectedAdvertiser == "lyons") {
        this.chartData = await this.getLyonChartMetrics(
          this.selectedCompany,
          this.range.startDate,
          this.range.endDate
        );
        this.statData = await this.getAllLyonStats(this.range.startDate,this.range.endDate, this.tagRows)
        
      } else if (this.selectedAdvertiser == "perion") {
        this.chartData = await this.getPerionChartMetrics(
          this.selectedCompany,
          this.range.startDate,
          this.range.endDate
        );
        this.statData = await this.getAllPerionStats(this.range.startDate,this.range.endDate, this.tagRows)
      }
      this.refreshTable();
    });
    
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

  getTagInformation(id: any) {
    return this.tagManagementService.getOneTag(id).toPromise().then((response) => {
      return response;
    }).catch((error) => {
      return error;
    })
  }

  public async updateReportingFiltering(range) {
    // console.log('Update report filtering....');
    this.range = range;
    if(this.selectedAdvertiser == "lyons") {
      this.chartData = await this.getLyonChartMetrics(
        this.selectedCompany,
        this.range.startDate,
        this.range.endDate
      );
      this.statData = await this.getAllLyonStats(this.range.startDate,this.range.endDate, this.tagRows)
    } else if (this.selectedAdvertiser == "perion") {
      this.chartData = await this.getPerionChartMetrics(
        this.selectedCompany,
        this.range.startDate,
        this.range.endDate
      );
      this.statData = await this.getAllPerionStats(this.range.startDate,this.range.endDate, this.tagRows)
    }
    
    this.refreshTable();
  }

  getLyonChartMetrics(company, startDate, endDate) {
    return this.lyonService.getAllStats(startDate, endDate).toPromise().then((response) => {
      this.allChart = response;
      var chartAllLyonStat = [];
      for(var tagSub of this.tagRows.subids) {
        if(tagSub['filterTag'] =="Contains") {    
          chartAllLyonStat = chartAllLyonStat.concat(this.allChart.filter(stat => stat.subid.includes(tagSub['subid'])))
        } else if (tagSub['filterTag'] =="StartsWith") {
          chartAllLyonStat = chartAllLyonStat.concat(this.allChart.filter(stat => stat.subid.startsWith(tagSub['subid'])))
        } else if (tagSub['filterTag'] =="EndsWith") {
          chartAllLyonStat = chartAllLyonStat.concat(this.allChart.filter(stat => stat.subid.endsWith(tagSub['subid'])))
        } else if (tagSub['filterTag'] =="ExactValue") {
          chartAllLyonStat = chartAllLyonStat.concat(this.allChart.filter(stat => stat.subid == tagSub['subid'] ))
        }
      }

      //duplicated remove
      let filter_data = chartAllLyonStat.filter((obj, pos, arr) => {
        return arr
          .map(mapObj => mapObj._id)
          .indexOf(obj._id) == pos;
      });
      var helperChart = {};
      filter_data.map(f =>{
        f.revenue = parseFloat(f.revenue);
        f.ctr = parseFloat(f.ctr);
        f.biddedCtr = parseFloat(f.biddedCTR);
      })
      var resultChart = filter_data.reduce(function(r, o) {
        var key = o.rptDate;
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
  refreshTable() {
    this.cdr.markForCheck();
  }

  getPerionChartMetrics(company, startDate, endDate) {
    return this.perionService
      .getChartMetrics(company, startDate, endDate)
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  getAllPerionStats(startDate, endDate, tag) {
    return this.perionService.getPerTagPerionStats(this.selectedCompany, startDate, endDate).toPromise().then((response) => {
      this.allPerionStatData = response;
      var allPerionStat = [];
      for (var tagSub of tag.subids) {
        if(tagSub.filterTag =="Contains") {
          allPerionStat = allPerionStat.concat(this.allPerionStatData.filter(stat => stat.subid.includes(tagSub.subid)))
          allPerionStat.map(stat => {
            stat.publisher = tag.publisher ? tag.publisher[0].fullname : "No Publisher"
            stat.tagname = tag.name
          })
        } else if (tagSub.filterTag =="StartsWith") {
          allPerionStat = allPerionStat.concat(this.allPerionStatData.filter(stat => stat.subid.startsWith(tagSub.subid)))
          allPerionStat.map(stat => {
            stat.publisher = tag.publisher ? tag.publisher[0].fullname : "No Publisher"
            stat.tagname = tag.name
          })
        } else if (tagSub.filterTag =="EndsWith") {
          allPerionStat = allPerionStat.concat(this.allPerionStatData.filter(stat => stat.subid.endsWith(tagSub.subid)))
          allPerionStat.map(stat => {
            stat.publisher = tag.publisher ? tag.publisher[0].fullname : "No Publisher"
            stat.tagname = tag.name
          })
        } else if (tagSub.filterTag =="ExactValue") {
          allPerionStat = allPerionStat.concat(this.allPerionStatData.filter(stat => stat.subid == tagSub.subid ))
          allPerionStat.map(stat => {
            stat.publisher = tag.publisher ? tag.publisher[0].fullname : "No Publisher"
            stat.tagname = tag.name
          })
        }
      }
      //duplicated remove
      let filtered_data = allPerionStat.filter((obj, pos, arr) => {
        return arr
          .map(mapObj => mapObj._id)
          .indexOf(obj._id) == pos;
      });
      var helper = {};
      filtered_data.map(f =>{
        f.revenue = parseFloat(f.revenue);
        f.rptDate = f.date;
      });
      var resultAll = filtered_data.reduce(function(prev, current) {
        var key = (current.date).toString() + '-' + current.subid;
        if(!helper[key]) {
          helper[key] = Object.assign({}, current); // create a copy of o
          prev.push(helper[key]);
        } else {
          helper[key].clicks += parseInt(current.clicks);
          if(current.revenue) {
            helper[key].revenue += current.revenue;
          }
          
          helper[key].split += parseInt(current.split);
        }
  
        return prev;
      }, []);
      return resultAll.slice().sort((a, b) => b.date - a.date);
    })
    .catch((error) => {
      return error;
    });
  }
  getAllLyonStats(startDate, endDate, tag) {
    return this.lyonService.getAllStats(startDate, endDate).toPromise().then((response) => {    
      this.allLyonStatData = response;
      var allLyonStat = [];
      for (var tagSub of tag.subids) {
        if(tagSub.filterTag =="Contains") {
          allLyonStat = allLyonStat.concat(this.allLyonStatData.filter(stat => stat.subid.includes(tagSub.subid)))
          allLyonStat.map(stat => {
            stat.publisher = tag.publisher ? tag.publisher[0].fullname : ""
            stat.tagname = tag.name
          })
        } else if (tagSub.filterTag =="StartsWith") {
          allLyonStat = allLyonStat.concat(this.allLyonStatData.filter(stat => stat.subid.startsWith(tagSub.subid)))
          allLyonStat.map(stat => {
            stat.publisher = tag.publisher ? tag.publisher[0].fullname : ""
            stat.tagname = tag.name
          })
        } else if (tagSub.filterTag =="EndsWith") {
          allLyonStat = allLyonStat.concat(this.allLyonStatData.filter(stat => stat.subid.endsWith(tagSub.subid)))
          allLyonStat.map(stat => {
            stat.publisher = tag.publisher ? tag.publisher[0].fullname : ""
            stat.tagname = tag.name
          })
        } else if (tagSub.filterTag =="ExactValue") {
          allLyonStat = allLyonStat.concat(this.allLyonStatData.filter(stat => stat.subid == tagSub.subid ))
          allLyonStat.map(stat => {
            stat.publisher = tag.publisher ? tag.publisher[0].fullname : ""
            stat.tagname = tag.name
          })
        }
      }
      
      //duplicated remove
      let filtered_data = allLyonStat.filter((obj, pos, arr) => {
        return arr
          .map(mapObj => mapObj._id)
          .indexOf(obj._id) == pos;
      });
      var helper = {};
      filtered_data.map(f =>{
        f.revenue = parseFloat(f.revenue);
        f.ctr = parseFloat(f.ctr);
        f.biddedCtr = parseFloat(f.biddedCTR);
      })
      
      var resultAll = filtered_data.reduce(function(prev, current) {
        var key = (current.rptDate).toString() + '-' + current.subid;
        if(!helper[key]) {
          helper[key] = Object.assign({}, current); // create a copy of o
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
          helper[key].split += parseInt(current.split);
        }
  
        return prev;
      }, []);
      
      return resultAll.slice().sort((a, b) => b.rptDate - a.rptDate);
    })
    .catch((error) => {
      return error;
    });
  }
}
