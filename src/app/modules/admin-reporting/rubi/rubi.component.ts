import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import { UsersService } from '../../../shared/service/users.service';
import { ChartDataInterface } from 'src/app/shared/models/chartData.interface';
import { RubiService } from 'src/app/shared/service/admin-stats/rubi.service';
import { TagManagementService } from 'src/app/modules/tag-management/tag-management.service';

@Component({
  selector: 'app-rubi',
  templateUrl: './rubi.component.html',
  styleUrls: ['./rubi.component.scss']
})
export class RubiComponent implements AfterViewInit {
  range = {
    startDate: '',
    endDate: '',
  };
  loadingIndicator = true;
  rows: any[];
  selectedCompany: any;
  @ViewChild('expandableTable') table: any;
  chartData: ChartDataInterface;
  summary = {
    revenue: 0,
    profit: 0,
  };

  expanded: any = {};
  allStats: any[];
  summaryMetrics: any;
  tagList: any = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UsersService,
    private rubiService: RubiService,
    private tagService: TagManagementService,
  ) { 
    this.selectedCompany = this.getSelectedCompanyStored();
  }

  async ngAfterViewInit() {
    this.tagList = await this.getCompanyTags(this.selectedCompany);
    this.rows = [];
    this.rows = await this.getAllRubiStats(
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
  public async updateReportingFiltering(range) {
    this.range = range;
    this.rows = await this.getAllRubiStats(
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
  getSelectedCompanyStored() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  refreshTable() {
    this.cdr.markForCheck();
  }
  getAllRubiStats(company, startDate, endDate) {
    return this.rubiService.getAllRubiStats(company, startDate, endDate).toPromise().then((response) => {
      console.log('getAllRubiStats() response:', response);
      this.loadingIndicator = false;
      this.allStats = response.stats;
      this.allStats.map(function(resStat) {
        resStat.publisher = "No Publisher"
        resStat.tagname = "No Tag" 
      });
      for (var tagL of this.tagList) {
        if(tagL.tag.advertiser == "rubi") {
          for (var tagSub of tagL.tag.subids) {
            if(tagSub.filterTag =="Contains") {
            
              this.allStats.map(stat => {
                if (stat.subid.includes(tagSub.subid)) {
                  stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                  stat.tagname = tagL.tag.name
                }
              })
              
            } else if (tagSub.filterTag =="StartsWith") {
              this.allStats.map(stat => {
                if (stat.subid.startsWith(tagSub.subid)) {
                  stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                  stat.tagname = tagL.tag.name
                }
              })
              
            } else if (tagSub.filterTag =="EndsWith") {
              this.allStats.map(stat => {
                if (stat.subid.endsWith(tagSub.subid)) {
                  stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                  stat.tagname = tagL.tag.name
                }
              }) 
              
            } else if (tagSub.filterTag =="ExactValue") {
              this.allStats.map(stat => {
                if (stat.subid == tagSub.subid) {
                  stat.publisher = tagL.user.length ? tagL.user[0].fullname : "No Publisher"
                  stat.tagname = tagL.tag.name
                }
              })
              
            } 
          }
        }
      }
      return this.allStats;
    })
  }
  getChartMetrics(company, startDate, endDate) {
    return this.rubiService
      .getChartMetrics(company, startDate, endDate)
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  }
  getSummaryMetrics(company) {
    return this.rubiService.getSummaryMetrics(company).toPromise().then((response) => {
      console.log('Got summary metrics');
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
}
