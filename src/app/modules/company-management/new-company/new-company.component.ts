import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, FormGroupDirective } from '@angular/forms';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { CompanyManagementService } from '../company-management.service';
import { UsersService } from 'src/app/shared/service/users.service';

@Component({
  selector: 'app-new-company',
  templateUrl: './new-company.component.html',
  styleUrls: ['./new-company.component.scss']
})
export class NewCompanyComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  companyFG: FormGroup;
  hidden = false;

  intialServerUrl = { adServerUrl: ['', Validators.required] } 
  intialReportProvider = { 
    reportingProvider: ['', Validators.required],
    email: [''],
    password: [''],
    apiUrl: [''],
    apiKey: [''],
  } 
  reportingProviderList = [
    { value : "apptitude", viewValue: "Apptitude"},
    { value : "bing-direct", viewValue: "Bing Direct"},
    { value : "hopkins", viewValue: "Hopkins"},
    { value : "lyons", viewValue: "Lyons"},
    { value : "media-net", viewValue: "Media.net"},
    { value : "perion", viewValue: "Perion"},
    { value : "rubi", viewValue: "Rubi"},
    { value : "verizon-direct", viewValue: "Verizon Direct"},
  ]
  reportingProviderHandleList = []
  //Local Storage Company
  localStorageCompany: any;

  constructor(
    private companyManagementService: CompanyManagementService,
    private notification: NotificationService,
    private fb: FormBuilder, 
    private userService: UsersService,
  ) { 
    this.localStorageCompany = this.getSelectedCompanyFromLocalStorage();
  }

  ngOnInit(): void {
    //access page part
    if(!this.localStorageCompany){
      this.hidden = true;
      this.notification.showError("Please select your Company!", "")
    } else {
      this.hidden = false;
    }
    this.companyFG = new FormGroup({
      name: new FormControl('', Validators.required),
      adServerUrls: this.fb.array([]),
      reportingProviders: this.fb.array([]),
    });
    this.adServerUrls.push(this.fb.group(this.intialServerUrl));
    this.reportingProviders.push(this.fb.group(this.intialReportProvider));
    this.reportingProviderHandleList = this.reportingProviderList.sort((a, b) => (a.viewValue > b.viewValue) ? 1 : -1)
  }

  save(): void {
    this.companyFG.markAllAsTouched();
    if (this.companyFG.valid) {
      this.companyManagementService.addCompany(this.companyFG.value).subscribe(x => {
        this.notification.showSuccess('Successfully added a new company.', "");
        this.companyFG.reset();
        this.formGroupDirective.resetForm();
      }, (err) => {
        this.notification.showError(err.error, "");
      });
    }
  }
  get reportingProviders() {
    return this.companyFG.controls['reportingProviders'] as FormArray;
  }
  get adServerUrls() {
    return this.companyFG.controls['adServerUrls'] as FormArray;
  }
  newAdServerUrls(): FormGroup {
    return this.fb.group({
      adServerUrl: ['', Validators.required],
    })
  }
  addAdServerUrl(event) {
    this.adServerUrls.push(this.newAdServerUrls());
  }
  removeAdServerUrl(i:number) {
    this.adServerUrls.removeAt(i);
  }
  removeReportingProvider(i:number) {
    this.reportingProviders.removeAt(i);
  }
  newReporingProvider(): FormGroup {
    return this.fb.group({
      reportingProvider: ['', Validators.required],
      email: [''],
      password: [''],
      apiUrl: [''],
      apiKey: [''],
    })
  }
  handleReportingProvider() {
    this.reportingProviders.push(this.newReporingProvider());
  }
  handleChangeProvider(event:any) {
  }
  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }
}
