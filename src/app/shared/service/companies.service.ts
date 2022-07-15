import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInterface } from '../models/company.interface';
import { environment } from '../../../environments/environment';

const API_COMPANY_URL = `${environment.apiUrl}/companies`;
const LOCALIZATION_LOCAL_STORAGE_KEY = "company"
@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  add(company: CompanyInterface): Observable<CompanyInterface> {
    return this.http.post<CompanyInterface>(API_COMPANY_URL, company);
  }

  getOneCompany(company: CompanyInterface): Observable<CompanyInterface> {
    return this.http.get<CompanyInterface>(
      API_COMPANY_URL + `/get_company/${company}`
    );
  }

  getUserCompanies(companies): Observable<CompanyInterface[]> {
    let params = new HttpParams();
    params = params.append('companies', JSON.stringify(companies));
    return this.http.get<CompanyInterface[]>(
      API_COMPANY_URL + `/get_many_companies`,
      { params: params }
    );
  }

  getAllCompanies(): Observable<CompanyInterface[]> {
    return this.http.get<CompanyInterface[]>(API_COMPANY_URL + '/all');
  }

  updateOneCompany(company: CompanyInterface): Observable<CompanyInterface> {
    return this.http.post<CompanyInterface>(
      API_COMPANY_URL + `/update/${company._key}`,
      company
    );
  }

  deleteOneCompany(company: CompanyInterface): Observable<CompanyInterface> {
    localStorage.removeItem(LOCALIZATION_LOCAL_STORAGE_KEY);
    return this.http.post<CompanyInterface>(
      API_COMPANY_URL + `/delete/${company._key}`,
      company
    );
  }
}
