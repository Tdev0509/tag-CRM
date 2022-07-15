import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PermissionInterface } from 'src/app/shared/models/permission.interface';
import { UserManagementService } from '../../user-management.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  @Input() data: any;
  permission: PermissionInterface
  permissionFG: FormGroup;
  allChecked = false;
  isIndeterminate = false;
  notifications = false;
  protectedMedia = false;
  googleMaterial = false;
  dashboard = false;
  eCommerce = false;
  liveTraffic = false;
  ngBootstrap =  false;
  layoutBuilder = false;
  userManage = false;
  companyManage = false;
  tagManage = false;
  reportManage = false;
  i = 0;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private snackService: SnackbarService,
    private userManagementService: UserManagementService,
  ) { }

  ngOnInit(): void {
    //Get the current company to edit
    if (this.data['id']) {
      this.userManagementService.getOnePermission(this.data['id']).subscribe(x => {
        this.permission = x;
        this.permissionFG.patchValue(x);
        if (x['companyManage'] == true && x['eCommerce'] == true && x['dashboard'] == true && x['googleMaterial'] == true && x['layoutBuilder'] == true && x['liveTraffic'] == true && x['ngBootstrap'] == true && x['notifications'] == true && x['protectedMedia'] == true && x['reportManage'] == true && x['tagManage'] == true && x['userManage'] == true) {
          this.allChecked = true;
          this.isIndeterminate = false;
        } else {
          this.allChecked = false;
          this.isIndeterminate = false;
        }
      });
    } else {}
    this.permissionFG = this.fb.group({
      dashboard: new FormControl('', Validators.required),
      notifications: new FormControl('', Validators.required),
      layoutBuilder: new FormControl('', Validators.required),
      protectedMedia: new FormControl('', Validators.required),
      googleMaterial: new FormControl('', Validators.required),
      eCommerce: new FormControl('', Validators.required),
      liveTraffic: new FormControl('', Validators.required),
      ngBootstrap: new FormControl('', Validators.required),
      companyManage: new FormControl('', Validators.required),
      userManage: new FormControl('', Validators.required),
      reportManage: new FormControl('', Validators.required),
      tagManage: new FormControl('', Validators.required),
    })
  }
  onIndeterminateChange(val: boolean) {
    console.log('isIndeterminate: ' + val);
  }
  onChange(ob: MatCheckboxChange) {
    console.log("checked: " + ob.checked);
  }
  onChkChange(ob: MatCheckboxChange) {
    if(ob.checked) {
      this.userManage = true;
      this.companyManage = true;
      this.tagManage = true;
      this.reportManage = true;
      this.notifications = true;
      this.protectedMedia = true;
      this.googleMaterial = true;
      this.dashboard = true;
      this.eCommerce = true;
      this.liveTraffic = true;
      this.ngBootstrap =  true;
      this.layoutBuilder = true;
      this.i = 12;
    } else {
      this.userManage = false;
      this.companyManage = false;
      this.tagManage = false;
      this.reportManage = false; 
      this.notifications = false;
      this.protectedMedia = false;
      this.googleMaterial = false;
      this.dashboard = false;
      this.eCommerce = false;
      this.liveTraffic = false;
      this.ngBootstrap =  false;
      this.layoutBuilder = false;    
    }
 }
 onChildChkChange(ob: MatCheckboxChange) {
    if(ob.checked) {
      this.i++;
    } else {
      this.i--;
    }
    if(this.i==12) {
      this.allChecked = true;
      this.isIndeterminate = false;
    } else if (this.i >= 1 || this.i <= 11) {
      this.isIndeterminate = true;
      this.allChecked = false;
    } else {
      this.isIndeterminate = false;
      this.allChecked = false;
    }
  }
  
  handleSubmit() {
    this.permissionFG.markAllAsTouched();
    if (this.permissionFG.valid) {     
      this.permission = {...this.permission, ...this.permissionFG.value};
      this.userManagementService.updateOnePermission(this.permission).subscribe(x => {
        this.snackService.info('Successfully updated permission.');
        this.activeModal.close(x);
      }, (err) => {
        this.snackService.info(`Error updating permission: ${err.statusText}`);
      });
    }
  }
}
