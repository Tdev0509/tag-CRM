import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../company-management.service';
import { CompanyInterface } from 'src/app/shared/models/company.interface';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/shared/service/users.service';
import { NotificationService } from 'src/app/shared/service/notification.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
  loadingIndicator = true;
  rows: Array<CompanyInterface>;
  hidden = false;
  //Local Storage Company
  localStorageCompany: any;

  constructor(
    private companyService: CompanyManagementService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private userService: UsersService, 
    private notification: NotificationService,
  ) {
    this.getAllCompanies();
  }

  getAllCompanies() {
    this.localStorageCompany = this.getSelectedCompanyFromLocalStorage();
    //access page part
    if(!this.localStorageCompany){
      this.hidden = true;
      this.notification.showError("Please select your Company!", "")
    } else {
      this.hidden = false;
    }
    this.companyService.getAllCompanies().subscribe((x) => {
      this.rows = x;
      console.log(this.rows);
      this.loadingIndicator = false;
      this.cdr.detectChanges();
    });
  }

  editCompany(companyID) {
    this.router.navigateByUrl('/company-management/edit/' + companyID);
  }

  ngOnInit(): void {
    // console.log(companies)
  }
  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }
}
