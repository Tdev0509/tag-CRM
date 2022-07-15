import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagManagementService } from '../tag-management.service';
import { TagInterface } from 'src/app/shared/models/tag.interface';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { UsersService } from 'src/app/shared/service/users.service';
import { NotificationService } from 'src/app/shared/service/notification.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  loadingIndicator = true;
  rows: Array<TagInterface>;
  //Local Storage Company
  localStorageCompany: any;
  hidden = false;

  tagList = [];
  constructor(
    private tagService: TagManagementService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private _snackBarService: SnackbarService,
    private userService: UsersService,
    private notification: NotificationService
  ) {
   }
   
  ngOnInit(): void {
    this.localStorageCompany = this.getSelectedCompanyFromLocalStorage();
    //access page part
    if(!this.localStorageCompany){
      this.hidden = true;
      this.notification.showError("Please select your Company!", "")
    } else {
      this.hidden = false;
    }
    this.getAllTags();
  }
  editTag(tagID:any) {
    this.router.navigateByUrl('/tag-management/edit/' + tagID);
  }
  deleteTag(id: any) {
    if(window.confirm('Do you want to go ahead?')) {
      this.tagService.deleteTag(id).subscribe((res) => {
        this.getAllTags();
        this._snackBarService.info('Deleted a tag');
      })
    } 
  }
  getAllTags() {
    this.tagService.getAllTags().subscribe((x) => {
      this.tagList = x
      // console.log(x);
      this.rows = this.tagList.filter(tag => tag.company[0]['_id'] == this.localStorageCompany)
      this.loadingIndicator = false;
      this.cdr.detectChanges();
    });
  }
  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }
  handleAddTag() {
    this.router.navigateByUrl('/tag-management/new');
  }
}
