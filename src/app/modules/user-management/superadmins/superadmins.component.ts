import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsersService } from '../../../shared/service/users.service'
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { UserInterface } from './../../../shared/models/user.interface';
import { NotificationService } from 'src/app/shared/service/notification.service';

@Component({
  selector: 'app-superadmins',
  templateUrl: './superadmins.component.html',
  styleUrls: ['./superadmins.component.scss']
})
export class SuperadminsComponent implements OnInit {
  displayedColumns = ["fullname", "email", "companyname", "stat", "action"];
  superadmins = new MatTableDataSource<UserInterface>();
  companyUser = false;
  //Local Storage Company
  localStorageCompany: any;
  hidden = false;
  originalData: any[];
  private subscritions: Subscription[] = [];
  constructor(
    private userService: UsersService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.localStorageCompany = this.getSelectedCompanyFromLocalStorage();
    //access page part
    if(!this.localStorageCompany){
      this.hidden = true;
      this.notification.showError("Please select your Company!", "")
    } else {
      this.hidden = false;
    }
    this.subscritions.push(
      this.userService.getSuperAdminAll().subscribe(data => {
        this.originalData = data;
        if(this.localStorageCompany) {
          this.superadmins.data = data.filter(userData => userData.companies.includes(this.localStorageCompany));
        } else {
          this.superadmins.data = data;
        }
        this.cdr.detectChanges();
      })
    );
  } 
  handleEditClick(userId: string): void {
    this.router.navigateByUrl('/user-management/edit/' + userId);
  }
  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }
  handleAddProfile() {
    this.router.navigateByUrl('/user-management/new-super-admin');
  }
  onChangeSuperAdmin(event) {
    this.companyUser = event.checked;
    if (this.companyUser) {
      this.superadmins.data = this.originalData;
    } else {
      if(this.localStorageCompany) {
        this.superadmins.data = this.originalData.filter(userData => userData.companies.includes(this.localStorageCompany));
      } else {
        this.superadmins.data = this.originalData;
      }
    }
    
  }
}
