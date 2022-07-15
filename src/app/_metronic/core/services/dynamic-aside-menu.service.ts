import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicAsideMenuConfig } from '../../configs/dynamic-aside-menu.config';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { UserInterface } from 'src/app/shared/models/user.interface';
import { TagsService } from 'src/app/shared/service/tags.service';

const emptyMenuConfig = {
  items: []
};

@Injectable({
  providedIn: 'root'
})
export class DynamicAsideMenuService {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  menuConfig$: Observable<any>;
  currentUser: UserInterface;
  tagList: any = [];
  constructor(
    private authService: AuthService,
    private tagService: TagsService,
  ) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.currentUser = this.authService.currentUserValue;
    this.loadMenu();
  }

  // Here you able to load your menu from server/data-base/localStorage
  // Default => from DynamicAsideMenuConfig
  private loadMenu() {
    this.setMenu(DynamicAsideMenuConfig);
  }

  private async setMenu(menuConfig: { items: any; }) {
    this.tagList = await this.tagService.getUserTags(this.currentUser.tagsId).toPromise();
    let submenuList = [];
    this.tagList.map(tag => {
      submenuList.push({
        title: `${tag.name}`, 
        page: `/publisher-reporting/${tag._key}`
      })
    })
    var publisherMenu = {
      title: 'Publisher Reporting',
      root: true,
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Shopping/Box1.svg',
      page: '/publisher-reporting',
      bullet: 'dot',
      permissionName: "publiserReportingManage",
    }
    publisherMenu['submenu'] = submenuList;
    menuConfig.items.push(
      //Publisher REPORTING
      { section: 'Publisher Reporting' })
    menuConfig.items.push(publisherMenu);

    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
}
