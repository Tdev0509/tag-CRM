import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { UserManagementService } from '../user-management.service';
import { UserInterface } from 'src/app/shared/models/user.interface';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/_services/auth.service';
import { ConfirmPasswordValidator } from 'src/app/modules/auth/registration/confirm-password.validator';
import { UsersService } from 'src/app/shared/service/users.service';
import { NotificationService } from 'src/app/shared/service/notification.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  userProfileFG: FormGroup;
  //All User Data
  user: UserInterface;
  companySelected: any;
  hidden = false;

  constructor(
    private userManagementService: UserManagementService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private sS: SnackbarService,
    private fb: FormBuilder,
    private userService: UsersService,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.companySelected = this.getSelectedCompanyFromLocalStorage();
    //access page part
    if(!this.companySelected){
      this.hidden = true;
      this.notification.showError("Please select your Company!", "")
    } else {
      this.hidden = false;
    }
    this.userProfileFG = this.fb.group(
      {
        fullname: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        cPassword: new FormControl('', Validators.required),
        role: new FormControl(''),
        companies: new FormControl(''),
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }
  newUserProfile($event: any): void {
    this.userProfileFG.patchValue({
      role: 3,
      companies: [this.companySelected]
    })
    this.user = { ...this.user, ...this.userProfileFG.value }
    if (this.userProfileFG.valid) {
      if (this.companySelected) {
        this.user = { ...this.user, ...this.userProfileFG.value };
        this.userManagementService.addNewUser(this.user).subscribe((x) => {
          if(x['status']) {
            var userName = x['data']
            this.sS.info(`New Publisher ${userName} profile created`);
            this.userProfileFG.reset();
            this.formGroupDirective.resetForm();
          } else {
            this.sS.info(`${x['data']}`);
          }
        });
      } else {
        this.sS.error('No Company, You can not create User!.');
      }
      
    }
  }
  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }
}
