import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from 'src/app/shared/service/companies.service';
import { CompanyInterface } from '../../../../shared/models/company.interface';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  @Input() public companies;
  rows: Array<CompanyInterface>;
  loadingIndicator = true;
  selections: string[];

  constructor(
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
  ) {
  }

  ngOnInit(): void {
    console.log(this.companies)
    this.selections = this.companies;
    this.getAllCompanies();
  }

  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe(res => {
      this.rows = res
      this.loadingIndicator = false
      this.cdr.detectChanges()
      console.log(this.rows)
   })
  }

  save() {
    console.log(this.companies)
    this.activeModal.close(this.companies);
  }
}
