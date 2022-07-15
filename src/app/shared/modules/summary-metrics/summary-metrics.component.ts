import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-metrics',
  templateUrl: './summary-metrics.component.html',
  styleUrls: ['./summary-metrics.component.scss'],
})
export class SummaryMetricsComponent implements OnInit {
  @Input() summaryMetricsData: any;
  constructor() {
  }

  ngOnInit(): void {
    
    this.summaryMetricsData = this.getSummaryData(this.summaryMetricsData)
  }
  getSummaryData(summaryMetricsData: any) {
		// our logic to group the posts by category
		if (!summaryMetricsData) return;
		
		var result = summaryMetricsData;

		return result;
	}
}
