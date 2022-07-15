import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-daily-traffic',
  templateUrl: './daily-traffic.component.html',
  styleUrls: ['./daily-traffic.component.scss'],
})
export class DailyTrafficComponent implements OnInit {
  rows = [
    {
      date: '11-21-2021',
      name: 'Monetizus',
      totalSearches: '106321',
      allowedSearches: '102365',
      ip: '2.3',
    },
    {
      date: '11-21-2021',
      name: 'Monetizus',
      totalSearches: '106321',
      allowedSearches: '102365',
      ip: '2.3',
    },
    {
      date: '11-21-2021',
      name: 'Monetizus',
      totalSearches: '106321',
      allowedSearches: '102365',
      ip: '2.3',
    },
  ];
  columns = [{ prop: 'name' }, { name: 'Gender' }];
  expanded: any = {};
  @ViewChild('expandableTable') table: any;

  constructor() {}

  ngOnInit(): void {}

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
  }
}
