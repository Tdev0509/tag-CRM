import { ActivatedRoute } from '@angular/router';
import { TagInterface } from './../../../shared/models/tag.interface';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/_services/auth.service';
import { UserManagementService } from '../user-management.service';
import { UserInterface } from 'src/app/shared/models/user.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserPasswordResetComponent } from './user-password-reset/user-password-reset.component';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { AddTagComponent } from './add-tag/add-tag.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyInterface } from 'src/app/shared/models/company.interface';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompanyService } from 'src/app/shared/service/companies.service';
import { TagsService } from 'src/app/shared/service/tags.service';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss'],
})
export class EditUsersComponent implements OnInit {
  userProfileFG: FormGroup;
  rows: Array<CompanyInterface>;

  //All User Data
  user: UserInterface;

  //All User Data
  userCompanies: Array<CompanyInterface>;

  userTags: any;

  constructor(
    private userManagementService: UserManagementService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private sS: SnackbarService,
    private modalService: NgbModal,
    private companyService: CompanyService,
    private tagService: TagsService,
    private snackBarService: SnackbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userProfileFG = new FormGroup({
      fullname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', Validators.required),
    });

    if (this.route.snapshot.params.id) {
      this.getUserData(this.route.snapshot.params.id);
      // await this.getUserCompanies(this.user.companies);
    } else {
      this.user = this.authService.currentUserSubject.value as any;
    }
  }

  /**
   * getUserData(id)
   * @param id: User _key value
   */
  async getUserData(id: string) {
    //Pulls the specific USER from the database.
    this.user = await this.userManagementService.getUser(id).toPromise();
    //If user has companies on their account
    if (this.user.companies.length) {
      this.userCompanies = await this.companyService
        .getUserCompanies(this.user.companies)
        .toPromise();
    }
    
    if (this.user.tagsId) {
      this.userTags = await this.tagService
        .getUserTags(this.user.tagsId)
        .toPromise();
    }

    //Patches value into FormGroup
    this.userProfileFG.patchValue(this.user);
  }

  updateUserProfile($event: any): void {
    if (this.userProfileFG.valid) {
      this.user = { ...this.user, ...this.userProfileFG.value };
      this.userManagementService.updateUser(this.user).subscribe((x) => {
        this.sS.info('user profile updated');
      });
    }
  }

  openPasswordResetDialog() {
    const modalRef = this.modalService.open(UserPasswordResetComponent, {
      size: 'md',
    });
    modalRef.componentInstance.data = {
      id: this.user._key,
    };
    modalRef.result.then((c) => {});
  }

  openAddTagDialog() {
    let tagdialog = this.dialog
      .open(AddTagComponent, {
        height: 'auto',
        width: '600px',
        data: this.user,
      })
      .afterClosed()
      .subscribe((response) => {
        //If user hits save
        if (response) {
          // console.log(response);
          //New variable readability -- all user data
          this.user = response.user;
          //Updates current user with new company selection.
          this.userManagementService.updateUser(this.user).subscribe((x) => {
            //
            this.getUserData(this.user._key);
            this.snackBarService.info(
              `Updated  ${this.user.fullname}'s tags.`
            );
          });
        }
      });
  }

  //Add/Edit Companies to a user profile
  openAddCompanyDialog() {
    console.log(this.user);
    let dialogRef = this.dialog
      .open(AddCompanyComponent, {
        height: 'auto',
        width: '600px',
        data: this.user,
      })
      .afterClosed()
      .subscribe((response) => {
        //If user hits save
        if (response) {
          console.log(response);
          //New variable readability -- all user data
          this.user = response.user;

          //Updates current user with new company selection.
          this.userManagementService.updateUser(this.user).subscribe((x) => {
            //
            this.getUserData(this.user._key);
            this.snackBarService.info(
              `Updated  ${this.user.fullname}'s companies.`
            );
          });
        }
      });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });

    // console.log(this.user);
    // const initialState = { data: this.user };
    // const modalRef = this.modalService.open(AddCompanyComponent, {
    //   size: 'md',
    // });
    // modalRef.componentInstance.companies = [...this.user.companies];

    // modalRef.result.then((res) => {
    //   //If a result is passed back, update the user profile with new companies.
    //   if (res) {
    //     this.user.companies = [...res];
    //     this.userManagementService.updateUser(this.user).subscribe((x) => {
    //       this.getUserData(this.user._key);
    //       this.snackBarService.info(
    //         `Updated  ${this.user.fullname}'s companies.`
    //       );
    //     });
    //   }
    // });
  }

  // isEnabled(tagKey: string): boolean {
  //   if (this.user && Array.isArray(this.user.tags)) {
  //     return !!this.user.tags.filter(x => !!x).find(x => x._key === tagKey);
  //   } else {
  //     return false;
  //   }
  // }

  // handleTagClick(tagKey: string): void {
  //   this.user.tags = this.user.tags || [];
  //   let tag = this.user.tags.filter(x => !!x).find(x => x._key === tagKey);
  //   if (tag) {
  //     this.user.tags.splice(this.user.tags.indexOf(tag), 1);
  //   } else {
  //     this.user.tags.push(tag);
  //   }
  //   this.userManagementService.updateUser(this.user).subscribe();
  // }
}
