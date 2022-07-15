import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from 'src/app/shared/service/helper.service';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { UserManagementService } from '../../user-management.service';

@Component({
  selector: 'app-user-password-reset',
  templateUrl: './user-password-reset.component.html',
  styleUrls: ['./user-password-reset.component.scss']
})
export class UserPasswordResetComponent implements OnInit {
  passwordFG: FormGroup;
  @Input() data: any;

  constructor(
    public activeModal: NgbActiveModal,
    private userManagementService: UserManagementService,
    private fb: FormBuilder,
    private sS: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.passwordFG = this.fb.group({
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required)
    }, { validator: HelperService.passwordConfirming })
  }

  handleSubmit(): void {
    this.passwordFG.markAllAsTouched();
    if (this.passwordFG.valid) {
      var password = this.passwordFG.value.password;
      var id = this.data.id;
      this.userManagementService.resetPassword(id, password).subscribe(x => {
        this.sS.info('password has been reset');
        this.activeModal.close();
      });
    }
  }

}
