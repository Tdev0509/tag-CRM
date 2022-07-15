import { Component, OnInit } from '@angular/core';

export interface CompanyInterface {
  query: string;
  ip: string;
}

@Component({
  selector: 'app-view-queries',
  templateUrl: './view-queries.component.html',
  styleUrls: ['./view-queries.component.scss'],
})
export class ViewQueriesComponent implements OnInit {
  rows: Array<CompanyInterface>;

  constructor() {}

  ngOnInit(): void {
    this.rows = [
      { query: 'buy+car', ip: '192.109.2.1' },
      { query: 'facebook', ip: '192.109.2.1' },
      { query: 'who goes there', ip: '192.109.2.1' },
      { query: 'asdasdasdasd', ip: '192.109.2.1' },
      { query: 'what is 9+7', ip: '192.109.2.1' },
      { query: 'what is the meaning of life', ip: '192.109.2.1' },
      { query: 'coffee cups', ip: '192.109.2.1' },
      { query: '34 inch ultrawide monitor', ip: '192.109.2.1' },
      { query: 'best desks of 2021', ip: '192.109.2.1' },
      { query: 'keyboard', ip: '192.109.2.1' },
      { query: 'instagram', ip: '192.109.2.1' },
      { query: 'fastest marathon', ip: '192.109.2.1' },
      { query: 'who is the first presidnets', ip: '192.109.2.1' },
      { query: 'power strip', ip: '192.109.2.1' },
      { query: 'asdiqhwdo', ip: '192.109.2.1' },
      { query: 'extra keys', ip: '192.109.2.1' },
      { query: 'sanctuary safe', ip: '192.109.2.1' },
      { query: 'facebook', ip: '192.109.2.1' },
      { query: 'what time is it in dubai', ip: '192.109.2.1' },
      { query: 'brands that are 2021', ip: '192.109.2.1' },
      { query: 'where is th', ip: '192.109.2.1' },
      { query: 'download skype', ip: '192.109.2.1' },
      { query: 'best bug for curing', ip: '192.109.2.1' },
      { query: 'best way to go to the mall', ip: '192.109.2.1' },
      { query: 'plants for sale', ip: '192.109.2.1' },
      { query: 'the best park for running', ip: '192.109.2.1' },
      { query: 'new macbook pro', ip: '192.109.2.1' },
      { query: 'uPhone 9', ip: '192.109.2.1' },
      { query: 'instagram', ip: '192.109.2.1' },
      { query: 'fb', ip: '192.109.2.1' },
      { query: 'fans fora sale', ip: '192.109.2.1' },
      { query: 'download instagraem', ip: '192.109.2.1' },
    ];
  }
}
