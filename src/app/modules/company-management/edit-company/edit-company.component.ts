import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyInterface } from 'src/app/shared/models/company.interface';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { CompanyManagementService } from '../company-management.service';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { UsersService } from 'src/app/shared/service/users.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit {

  companyFG: FormGroup;
  company: CompanyInterface;
  currentUser:any;
  currentUserRole: number;
  hidden = false;
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
    private fb: FormBuilder, 
    private authService: AuthService,
    private route: ActivatedRoute, 
    private companyManagementService: CompanyManagementService, 
    private notification: NotificationService,
    private userService: UsersService, 
    private router: Router) { 
      this.currentUser = this.authService.currentUserValue;
      this.currentUserRole = this.currentUser.role;
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
    this.reportingProviderHandleList = this.reportingProviderList.sort((a, b) => (a.viewValue > b.viewValue) ? 1 : -1)
    //Create update formgroup
    this.companyFG = new FormGroup({
      name: new FormControl('', Validators.required),
      adServerUrls: this.fb.array([]),
      reportingProviders: this.fb.array([]),
    })

    //Get the current company to edit
    if (this.route.snapshot.params.id) {
      this.companyManagementService.getOneCompany(this.route.snapshot.params.id).subscribe(res => {
        this.company = res;
        res['adServerUrls'].map((item) => {
          this.adServerUrls.push(this.fb.group(item));
        });
        res['reportingProviders'].map((reporting) => {
          this.reportingProviders.push(this.fb.group(reporting));
        });
        this.companyFG.setValue({
          name: res['name'],
          adServerUrls: res['adServerUrls'],
          reportingProviders: res['reportingProviders']
        });
      });
    } else {
      // this.user = this.authService.currentUserSubject.value as any;
    }
  }
  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }
  //Update one company
  //Checks to see if edits were made
  //If edits were made updates current company with new updated fields
  updateOneCompany($event: any) {
    this.companyFG.markAllAsTouched();
    if (this.companyFG.valid) {
      this.company = {...this.company, ...this.companyFG.value};
      this.companyManagementService.updateOneCompany(this.company).subscribe(x => {
        this.notification.showSuccess('Successfully updated company.', "");
      }, (err) => {
        this.notification.showError(`Error updating company: ${err.statusText}`, "");
      });
    }
  }

  deleteOneCompany() {
      this.companyManagementService.deleteOneCompany(this.company).subscribe(x => {
        this.notification.showSuccess('Successfully deleted company.', "");
        this.router.navigate(['/company-management/companies']).then(() => {
          window.location.reload();
        });
      }, (err) => {
        this.notification.showError(`Error deleting company: ${err.statusText}`, "");
      });
  }

  back() {
    this.router.navigate(['/company-management/companies']);
  }

  get adServerUrls() {
    return this.companyFG.controls['adServerUrls'] as FormArray;
  }
  get reportingProviders() {
    return this.companyFG.controls['reportingProviders'] as FormArray;
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
  removeReportingProvider(i:number) {
    this.reportingProviders.removeAt(i);
  }
}
