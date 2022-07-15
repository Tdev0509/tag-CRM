import { UserInterface } from './../../../shared/models/user.interface';
import { TagInterface } from './../../../shared/models/tag.interface';
import { AuthUserInterface } from 'src/app/shared/models/auth-user.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsersService } from '../../../shared/service/users.service'
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/shared/service/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns = ["fullname", "email", "companyname", "stat", "action"];
  users = new MatTableDataSource<UserInterface>();

  private subscritions: Subscription[] = [];

  //Local Storage Company
  localStorageCompany: any;
  hidden = false;
  companyUser = false;
  originalData: any[];

  constructor(
    private usersServie: UsersService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService,
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
      this.usersServie.getPublisherAll().subscribe(data => {
        // console.log(data);
        this.originalData = data;
        if(this.localStorageCompany) {
          this.users.data = data.filter(userData => userData.companies.includes(this.localStorageCompany));
        } else {
          this.users.data = data.filter(userData => userData.companies.length == 0);
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
    this.router.navigateByUrl('/user-management/new-publisher');
  }
  deletePublisher(id: any) {
    if(window.confirm('Do you want to go ahead?')) {
      this.usersServie.deleteUser(id).subscribe((res) => {
        this.usersServie.getPublisherAll().subscribe(data => {
          // console.log(data);
          if (this.companyUser) {
            this.users.data = data;
          } else {
            if(this.localStorageCompany) {
              this.users.data = data.filter(userData => userData.companies.includes(this.localStorageCompany));
            } else {
              this.users.data = data.filter(userData => userData.companies.length == 0);
            }
          }
          
          this.cdr.detectChanges();
        })
        this.notification.showWarning('Deleted a User', "");
      })
    } 
  }
  onChangePublisher(event) {
    this.companyUser = event.checked;
    if (this.companyUser) {
      this.users.data = this.originalData;
    } else {
      if(this.localStorageCompany) {
        this.users.data = this.originalData.filter(userData => userData.companies.includes(this.localStorageCompany));
      } else {
        this.users.data = this.originalData;
      }
    }
    
  }
}
