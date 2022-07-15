import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserModel } from 'src/app/modules/auth/_models/user.model';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { CompanyInterface } from 'src/app/shared/models/company.interface';
import { CompanyService } from 'src/app/shared/service/companies.service';
import { UsersService } from 'src/app/shared/service/users.service';

@Component({
  selector: 'app-company-selector',
  templateUrl: './company-selector.component.html',
  styleUrls: ['./company-selector.component.scss'],
})
export class CompanySelectorComponent implements OnInit {
  //User Companies
  userCompanies: Array<CompanyInterface>;

  //Selected Company
  selectedCompany: CompanyInterface;

  //Local Storage Company
  localStorageCompany: any;
  
  constructor(
    private router: Router,
    private auth: AuthService,
    private companyService: CompanyService,
    private userService: UsersService,
    private changeDetectorRefs: ChangeDetectorRef,
  ) {
    this.localStorageCompany = this.getSelectedCompanyFromLocalStorage()
    const currentUserInfo = this.auth.currentUserValue;
    this.companyService.getUserCompanies(currentUserInfo.companies).subscribe(companyResult => {
      this.userCompanies = companyResult;
      //Gets the company saved to local storage
      //Checks to see if the user is part of at least one company
      if (this.userCompanies.length > 0) {
        //If company was stored in local storage, checks to ensure the user has this company stored on their profile in the database. Otherwise, returns null.
        if (this.localStorageCompany) {
          var checkStorageCompany = this.userCompanies.filter(userCom => userCom._id == this.localStorageCompany);
          if (checkStorageCompany.length > 0) {
            this.selectedCompany = checkStorageCompany[0]
            this.setCompanyToLocalStorage(checkStorageCompany[0]._id);
          } else {
            localStorage.removeItem('company')
            this.selectedCompany = null;
          }
          
        }
        //User did not have a company saved to local storage
        else {
          localStorage.removeItem('company');
          this.selectedCompany = null;
        }
       
      }
      this.changeDetectorRefs.detectChanges();
    })
  }

  ngOnInit() {
    this.setSelectedCompany();
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        this.setSelectedCompany();
      });
  }

  //On button click/select sets company to local storage then refreshes
  setCompanyWithRefresh(companyId) {
    if (companyId) {
      this.setCompanyToLocalStorage(companyId);
      window.location.reload();
    } else {
      localStorage.removeItem('company')
      window.location.reload();
    }   
  }

  //Sets Selected Company to Local Storage then refresh
  setCompanyToLocalStorage(companyId) {
    if(this.userCompanies) {
      this.userCompanies.forEach((selectedCompany: CompanyInterface) => {
        if (selectedCompany._id === companyId) {
          selectedCompany.active = true;
          this.selectedCompany = selectedCompany;
        } else {
          selectedCompany.active = false;
        }
      });
    }
    
    this.userService.setCompany(companyId);
  }

  setSelectedCompany(): any {
    this.setCompanyToLocalStorage(this.getSelectedCompanyFromLocalStorage());
  }
  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }

  //Gets User Companies
  getUserCompanies(companies) {
    this.companyService.getUserCompanies(companies).toPromise();
  }
}
