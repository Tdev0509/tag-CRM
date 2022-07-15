import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsersService } from '../../../shared/service/users.service'
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { UserInterface } from './../../../shared/models/user.interface';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { NotificationService } from 'src/app/shared/service/notification.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  displayedColumns = ["fullname", "email", "companyname", "stat", "action"];
  admins = new MatTableDataSource<UserInterface>();
  hidden = false;
  //Local Storage Company
  localStorageCompany: any;
  companyUser = false;
  originalData: any[];

  private subscritions: Subscription[] = [];
  constructor(
    private usersServie: UsersService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService,
    private _snackBarService: SnackbarService,
    private notification: NotificationService
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
      this.usersServie.getAdminAll().subscribe(data => {
        // console.log(data);
        this.originalData = data;
        if(this.localStorageCompany) {
          this.admins.data = data.filter(userData => userData.companies.includes(this.localStorageCompany));
        } else {
          this.admins.data = data.filter(userData => userData.companies.length == 0);
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
    this.router.navigateByUrl('/user-management/new-admin');
  }
  deleteAdmin(id: any) {
    if(window.confirm('Do you want to go ahead?')) {
      this.usersServie.deleteUser(id).subscribe((res) => {
        this.usersServie.getAdminAll().subscribe(data => {
          // console.log(data);
          if (this.companyUser) {
            this.admins.data = data;
          }  else {
            if(this.localStorageCompany) {
              this.admins.data = data.filter(userData => userData.companies.includes(this.localStorageCompany));
            } else {
              this.admins.data = data.filter(userData => userData.companies.length == 0);
            }
          }
          
          this.cdr.detectChanges();
        })
        this._snackBarService.info('Deleted a User');
      })
    } 
  }
  onChangeAdmin(event) {
    this.companyUser = event.checked;
    if (this.companyUser) {
      this.admins.data = this.originalData;
    } else {
      if(this.localStorageCompany) {
        this.admins.data = this.originalData.filter(userData => userData.companies.includes(this.localStorageCompany));
      } else {
        this.admins.data = this.originalData;
      }
    }
    
  }
}
