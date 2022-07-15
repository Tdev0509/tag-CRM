import { ChangeDetectorRef, Inject } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from 'src/app/shared/service/companies.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserInterface } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
})
export class AddCompanyComponent implements OnInit {
  //Variable for loading indicator
  loadingIndicator = true;

  //Variable for current user
  user: UserInterface;

  //Variable for current companies saved on user account
  userCompanies: string[];

  //Variable for ALL Companies avaiablable
  allCompanies: any;

  constructor(
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    //Sets current user to data input variable
    this.user = this.data;

    //Sets userCompanies to user's current companies
    this.userCompanies = this.user.companies;

    //Gets ALL companies available
    this.getAllCompanies();
  }

  /**
   * getAllCompanies()
   * * Gets all companies available from companyService method.
   * * @param NONE
   */
  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe((response) => {
      console.log(response);
      this.loadingIndicator = false;
      this.allCompanies = response;
      this.cdr.detectChanges();
    });
  }

  /**
   * save()
   * * Saves added or removed companies to the user's profile
   * TODO: TBD
   * @param NONE
   */
  save() {
    this.user.companies = [...this.userCompanies];
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
