import { UserInterface } from './../models/user.interface';
import { PermissionInterface } from './../models/permission.interface';
import { AuthUserInterface } from 'src/app/shared/models/auth-user.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { environment } from '../../../environments/environment';

const API_USERS_URL = `${environment.apiUrl}/users/`;

const LOCALIZATION_LOCAL_STORAGE_KEY = 'company';

/**
 * Service class for the club model, contains CRUD methods and operates with http requests
 *
 */

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getPublisherAll(): Observable<UserInterface[]> {
    console.log('API URL:', API_USERS_URL);
    return this.http.get<UserInterface[]>(API_USERS_URL + 'get_publishers');
  }

  getSuperAdminAll(): Observable<UserInterface[]> {
    console.log('API URL:', API_USERS_URL);
    return this.http.get<UserInterface[]>(API_USERS_URL + 'get_superadmins');
  }

  getAdminAll(): Observable<UserInterface[]> {
    console.log('API URL:', API_USERS_URL);
    return this.http.get<UserInterface[]>(API_USERS_URL + 'get_admins');
  }

  getAdvertiserAll(): Observable<UserInterface[]> {
    console.log('API URL:', API_USERS_URL);
    return this.http.get<UserInterface[]>(API_USERS_URL + 'get_advertisers');
  }

  resetPassword(userId: number, password: string): Observable<any> {
    return this.http.post(`${API_USERS_URL}update_password/${userId}`, {
      password,
    });
  }

  updateUser(user: UserInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>(
      API_USERS_URL + `get_user/${user._key}`,
      user
    );
  }

  addUser(user:UserInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>(API_USERS_URL + "new-user",user);
  }
  deleteUser(userKey: string) {
    return this.http.delete(API_USERS_URL + `/${userKey}`);
  }

  getUser(userId: string): Observable<UserInterface> {
    return this.http.get<UserInterface>(
      `${API_USERS_URL}get_user` + `/${userId}`
    );
  }

  getUserWithCompanies(userId: string): Observable<UserInterface> {
    return this.http.get<UserInterface>(
      `${API_USERS_URL}get_user_with_companies` + `/${userId}`
    );
  }

  // verifySelectedUserCompany(key: string) {
  //   return this.http.get<UserInterface>(
  //     `${API_USERS_URL}get_user_with_companies` + `/${userId}`
  //   );
  // }

  /**
   * Set Company
   */
  setCompany(company) {
    if (company) {
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, company);
    }
  }

  /**
   * Returns selected company
   */
  getSelectedCompanyFromLocalStorage(): any {
    return localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY);
  }

  updateOnePermission(permission: PermissionInterface): Observable<PermissionInterface> {
    return this.http.post<PermissionInterface>(
      API_USERS_URL + `update/${permission._key}`,
      permission
    );
  }
  getOnePermission(permission: PermissionInterface): Observable<PermissionInterface> {
    return this.http.get<PermissionInterface>(
      API_USERS_URL + `get_permission/${permission}`
    );
  }
}
