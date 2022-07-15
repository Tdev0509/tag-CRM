import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

interface preSetDateRanges {
  value: string;
  viewValue: string;
}

interface PreSetDateRange {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-reporting-filtering',
  templateUrl: './reporting-filtering.component.html',
  styleUrls: ['./reporting-filtering.component.scss'],
})
export class ReportingFilteringComponent implements OnInit {
  @Output() onDatesPicked = new EventEmitter<PreSetDateRange>();

  range: FormGroup;

  preSetDateRanges: preSetDateRanges[];

  selectedRange: PreSetDateRange;

  preSelectValue: String;

  preSelectDates: any;

  constructor() {}

  ngOnInit(): void {
    //Get the all PRESELECT ranges
    this.preSetDateRanges = this.getDateRanges();

    //Create a form group for the date picker
    this.range = new FormGroup({
      startDate: new FormControl(),
      endDate: new FormControl(),
    });

    //Selected range of date picker
    this.selectedRange = {
      startDate: '',
      endDate: '',
    };

    //Starting value of mat select
    this.preSelectValue = 'last7days';

    //Gets the true start and end date values in date format
    this.preSelectDates = this.getPreSetDateRange(this.preSelectValue);

    //Manually updates the mat date picker with new start and end dates
    this.updateDatePickerRange(
      this.preSelectDates.startDate,
      this.preSelectDates.endDate
    );

    //Emits the selected date rane to component
    this.emitSelectedRange();
  }

  //Grabbing the mat selector options
  private getDateRanges() {
    return [
      { value: 'today', viewValue: 'Today' },
      { value: 'yesterday', viewValue: 'Yesterday' },
      { value: 'last7days', viewValue: 'Last 7 Days' },
      { value: 'last30days', viewValue: 'Last 30 Days' },
      { value: 'monthToDate', viewValue: 'Month to Date' },
      { value: 'lastMonth', viewValue: 'Last Month' },
      { value: 'custom', viewValue: 'Custom' },
    ];
  }

  //Convert mat selector options and return actual dates
  private getPreSetDateRange(selection) {
    let dateFormat = 'MM-DD-YYYY';
    switch (selection) {
      case 'today':
        return {
          startDate: moment().utc().startOf('day').format(dateFormat),
          endDate: moment().utc().endOf('day').format(dateFormat),
        };
      case 'yesterday':
        return {
          startDate: moment()
            .subtract(1, 'days')
            .utc()
            .startOf('day')
            .format(dateFormat),
          endDate: moment()
            .subtract(1, 'days')
            .utc()
            .endOf('day')
            .format(dateFormat),
        };
      case 'last7days':
        return {
          startDate: moment()
            .subtract(7, 'days')
            .utc()
            .startOf('day')
            .format(dateFormat),
          endDate: moment().utc().endOf('day').format(dateFormat),
        };
      case 'last30days':
        return {
          startDate: moment()
            .subtract(30, 'days')
            .utc()
            .startOf('day')
            .format(dateFormat),
          endDate: moment().utc().endOf('day').format(dateFormat),
        };
      case 'monthToDate':
        return {
          startDate: moment()
            .startOf('month')
            .utc()
            .startOf('day')
            .format(dateFormat),
          endDate: moment().utc().endOf('day').format(dateFormat),
        };
      case 'lastMonth':
        return {
          startDate: moment()
            .subtract(1, 'months')
            .startOf('month')
            .utc()
            .startOf('day')
            .format(dateFormat),
          endDate: moment()
            .utc()
            .subtract(1, 'months')
            .endOf('month')
            .format(dateFormat),
        };
    }
  }

  //Monitors mat selector, if changed (and not custom). updates the actual date picker
  onPreSetRangeSelectChange(selection) {
    if (selection.value !== 'custom') {
      this.preSelectValue = selection.value;
      this.preSelectDates = this.getPreSetDateRange(this.preSelectValue);

      //Updates the date picker range manually
      this.updateDatePickerRange(
        this.preSelectDates.startDate,
        this.preSelectDates.endDate
      );

      //Emit the value
      this.emitSelectedRange();
    }
  }

  //Updates the date picker range manually
  //Params startDate and endDate
  updateDatePickerRange(startDate, endDate) {
    this.range.patchValue({
      startDate: moment(startDate, 'MM-DD-YYYY').toDate(),
      endDate: moment(endDate, 'MM-DD-YYYY').toDate(),
    });
  }

  //Detects when datepicker change is updated
  public changeDatePicker(): void {
    if (this.range.valid) {
      this.selectedRange.startDate = this.range.value.startDate;
      this.selectedRange.endDate = this.range.value.endDate;

      this.preSelectValue = 'custom';

      //Sends range form to parent component
      this.emitSelectedRange();
    }
  }

  //Emits the selectedRange startDate and endDate to parent
  public emitSelectedRange(): void {
    //Checks to see if the selection was valid and emits to parent component, if invalid, does nothing
    if (this.range.valid) {
      this.selectedRange.startDate = this.range.value.startDate;
      this.selectedRange.endDate = this.range.value.endDate;

      let emittingRange = this.selectedRange;

      //Puts the range back into readable format MM-DD-YYYY for API calls
      emittingRange.startDate = moment(this.selectedRange.startDate)
        //.utc()
        .startOf('day')
        .format('MM-DD-YYYY');
      emittingRange.endDate = moment(this.selectedRange.endDate)
        //.utc()
        .endOf('day')
        .format('MM-DD-YYYY');

      //Sends range form to parent component
      this.onDatesPicked.emit(emittingRange);
    }
  }
}
