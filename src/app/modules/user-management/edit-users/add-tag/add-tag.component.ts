import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { TagManagementService } from '../../../tag-management/tag-management.service';
import { UserInterface } from 'src/app/shared/models/user.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  //Variable for loading indicator
  loadingIndicator = true;

  //Variable for current user
  user: UserInterface;

  userTags: string[];

  allTags: any;

  constructor(
    private tagManagementService: TagManagementService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddTagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    //Sets current user to data input variable
    this.user = this.data;

    //Sets userTags to user's current tags
    this.userTags = this.user.tagsId;

    //Gets ALL companies available
    this.getAllTags();
  }

  getAllTags() {
    this.tagManagementService.getAllTags().subscribe((response) => {
      console.log(response);
      this.loadingIndicator = false;
      this.allTags = response;
      this.cdr.detectChanges();
    });
  }
  handleSubmit(): void {
    this.user.tagsId = [...this.userTags]
    this.dialogRef.close({ user: this.user });
  }

  /**
   * close()
   * * Closes the dialog and does not make any changes.
   *
   */
   close() {
    this.dialogRef.close();
  }

}
