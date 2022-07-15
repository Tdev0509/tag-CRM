import { Component, OnInit,Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LayoutService, DynamicAsideMenuService } from '../../../../_metronic/core';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { CompanyManagementService } from 'src/app/modules/company-management/company-management.service';
import { UsersService } from 'src/app/shared/service/users.service';

@Component({
  selector: 'app-aside-dynamic',
  templateUrl: './aside-dynamic.component.html',
  styleUrls: ['./aside-dynamic.component.scss']
})
export class AsideDynamicComponent implements OnInit, OnDestroy {
  menuConfig: any;
  subscriptions: Subscription[] = [];

  disableAsideSelfDisplay: boolean;
  headerLogo: string;
  brandSkin: string;
  ulCSSClasses: string;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  brandClasses: string;
  asideMenuScroll = 1;
  asideSelfMinimizeToggle = false;
  companySelected: any;
  reportingProviderList = []

  currentUrl: string;
  currentUser: any;
  @Input() companyList: any;
  constructor(
    private authService: AuthService,
    private companyService: CompanyManagementService,
    private layout: LayoutService,
    private router: Router,
    private menu: DynamicAsideMenuService,
    private userService: UsersService,
    private cdr: ChangeDetectorRef) { 
      this.currentUser = this.authService.currentUserValue;
      this.companySelected = this.getSelectedCompanyFromLocalStorage();
    }

  ngOnInit(): void {
    this.reportingProviderList = this.getCompanyList(this.companyList)
    // load view settings
    this.disableAsideSelfDisplay =
      this.layout.getProp('aside.self.display') === false;
    this.brandSkin = this.layout.getProp('brand.self.theme');
    this.headerLogo = this.getLogo();
    this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
    this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
    this.brandClasses = this.layout.getProp('brand');
    this.asideSelfMinimizeToggle = this.layout.getProp(
      'aside.self.minimize.toggle'
    );
    this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
    // router subscription
    this.currentUrl = this.router.url.split(/[?#]/)[0];
    const routerSubscr = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(routerSubscr);

    // menu load
    const menuSubscr = this.menu.menuConfig$.subscribe(res => {
      this.menuConfig = res;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(menuSubscr);
  }

  private getLogo() {
    if (this.brandSkin === 'light') {
      return './assets/media/logos/logo-dark.png';
    } else {
      return './assets/media/logos/logo-light.png';
    }
  }
  showMenuItem(item) {
    
    if (item.permissionName) {
      var permission = this.currentUser['permission'][0];
      return permission[item.permissionName];
    }
    return false;
  }
  showSubMenuItem(item) {
    if(item.page.includes("reporting")) {
      var itemPath = item.page.split("/")[2];

      if(this.reportingProviderList.includes(itemPath)) {
        return true;
      } else {
        if((itemPath == "manual-stat-update" || itemPath == "manual-split-update") && this.currentUser.role == 1) {
          return true;
        } else if (item.page.includes("publisher-reporting") && this.currentUser.role == 3) {
          return true;
        }
        return false;
      }
      
    } else {
      return true;
    }
    
  }

  isMenuItemActive(path) {
    if (!this.currentUrl || !path) {
      return false;
    }

    if (this.currentUrl === path) {
      return true;
    }

    if (this.currentUrl.indexOf(path) > -1) {
      return true;
    }

    return false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  //get Report Providers in Current Company
  getReportingProviderList() {
    if(this.companySelected) {
      this.companyService.getOneCompany(this.companySelected.split('/')[1]).subscribe(res => {
        console.log(res.reportingProviders)
        res.reportingProviders.map(report=> {
          this.reportingProviderList.push(report.reportingProvider)
        });
      });

      if (this.reportingProviderList.length > 0) return;
      let result = this.reportingProviderList;

      return result;
    } else {
      return this.reportingProviderList;
    }
  }
  //Gets the Selected Company from Local Storage
  getSelectedCompanyFromLocalStorage() {
    return this.userService.getSelectedCompanyFromLocalStorage();
  }
  getCompanyList(companyList) {
    if(!companyList) return;
    let result = companyList;
    return result
  }
}
