import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagManagementService } from '../tag-management.service';
import { TemplateInterface } from 'src/app/shared/models/template.interface';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { UsersService } from 'src/app/shared/service/users.service';
import { NotificationService } from 'src/app/shared/service/notification.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  loadingIndicator = true;
  rows: Array<TemplateInterface>;
  //Local Storage Company
  localStorageCompany: any;
  hidden = false;
  templateList = [];
  constructor(
    private tagService: TagManagementService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private _snackBarService: SnackbarService,
    private userService: UsersService,
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
    this.getAllTemplates();
  }
  editTemplate(templateID:any) {
    //this.router.navigateByUrl('/tag-management/edit/' + tagID);
  }
  deleteTemplate(id: any) {
    if(window.confirm('Do you want to go ahead?')) {
      this.tagService.deleteTemplate(id).subscribe((res) => {
        this.getAllTemplates();
        this._snackBarService.info('Deleted a Template');
      })
    } 
  }
  getAllTemplates() {
    this.tagService.getAllTemplates().subscribe((x) => {
      this.templateList = x
      console.log(x);
      this.rows = this.templateList.filter(template => template.company[0]['_id'] == this.localStorageCompany)
      this.loadingIndicator = false;
      this.cdr.detectChanges();
    });
  }
  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }

}
