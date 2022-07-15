import { UserInterface } from './../../shared/models/user.interface';
import { PermissionInterface } from './../../shared/models/permission.interface';
import { AuthUserInterface } from 'src/app/shared/models/auth-user.interface';
import { TagsService } from './../../shared/service/tags.service';
import { TagInterface } from './../../shared/models/tag.interface';
import { UsersService } from 'src/app/shared/service/users.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(
    private usersService: UsersService,
    private tagsService: TagsService
  ) { }

  resetPassword(userId: number, password: string): Observable<void> {
    return this.usersService.resetPassword(userId, password);
  }

  getAllTags(): Observable<TagInterface[]> {
    return this.tagsService.getAll();
  }

  addTag(tag: TagInterface): Observable<TagInterface> {
    return this.tagsService.add(tag);
  }

  addNewUser(user: UserInterface): Observable<UserInterface> {
    return this.usersService.addUser(user);
  }

  updateUser(user: UserInterface): Observable<UserInterface> {
    return this.usersService.updateUser(user);
  }

  getUser(userId: string): Observable<UserInterface> {
    return this.usersService.getUser(userId);
  }

  updateOnePermission(permission: PermissionInterface): Observable<PermissionInterface> {
    return this.usersService.updateOnePermission(permission);
  }
  getOnePermission(permission: PermissionInterface): Observable<PermissionInterface> {
    return this.usersService.getOnePermission(permission);
  }
}
