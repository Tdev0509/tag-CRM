import { Component,Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-template-name',
  templateUrl: './template-name.component.html',
  styleUrls: ['./template-name.component.scss']
})

export class TemplateNameComponent implements OnInit {
  templateNameFormControl: any;
  constructor(
    public dialogRef: MatDialogRef<TemplateNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.templateNameFormControl = new FormControl('', [
      Validators.required,   
      ]);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  store() {
    this.templateNameFormControl.markAllAsTouched();
    if(this.templateNameFormControl.valid) {
      this.dialogRef.close({ templateName: this.data.templateName });
    }
  }

}
