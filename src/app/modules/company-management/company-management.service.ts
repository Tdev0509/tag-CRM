import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInterface } from 'src/app/shared/models/company.interface';
import { CompanyService } from 'src/app/shared/service/companies.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyManagementService {
  constructor(private companyService: CompanyService) {}

  addCompany(company: CompanyInterface): Observable<CompanyInterface> {
    return this.companyService.add(company);
  }

  getAllCompanies(): Observable<CompanyInterface[]> {
    return this.companyService.getAllCompanies();
  }

  getOneCompany(company: CompanyInterface): Observable<CompanyInterface> {
    return this.companyService.getOneCompany(company);
  }

  updateOneCompany(company: CompanyInterface): Observable<CompanyInterface> {
    return this.companyService.updateOneCompany(company);
  }

  deleteOneCompany(company: CompanyInterface) {
    return this.companyService.deleteOneCompany(company);
  }
}
