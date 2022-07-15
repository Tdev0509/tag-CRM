import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-imgage-advantage',
  templateUrl: './imgage-advantage.component.html',
  styleUrls: ['./imgage-advantage.component.scss'],
})
export class ImgageAdvantageComponent implements OnInit {
  rows = [
    {
      name: 'Greg',
      tag: 'YHS Organic',
      totalSearches: '536412',
      monetizedSearches: '501235',
      revenue: '52623',
      clicks: 50351,
      followOn: '13%',
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
}
