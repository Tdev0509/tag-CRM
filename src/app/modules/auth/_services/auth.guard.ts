import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { of, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private _router: Router,
    private route: ActivatedRoute,
  ) {}

  canActivateInternal(data: any, state: RouterStateSnapshot): Observable<boolean> {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // logged in so return true
      if (data.permission && !currentUser['permission'][0][data.permission]) {
        this._router.navigate([this.selectBestRoute()]);
        return of(false);
      } 
      if (data.permission && (state.url.split('/')[2] == "manual-split-update" || state.url.split('/')[2] == "manual-stat-update") && currentUser.role != 1) {
        this._router.navigate([this.selectBestRoute()]);
        return of(false);
      }

      if (data.permission && state.url.split('/')[2] == "publisher-reporting" && currentUser.role != 3) {
        this._router.navigate([this.selectBestRoute()]);
        return of(false);
      }
      return of(true);
    }
    

    // not logged in so redirect to login page with the return url
    this._router.navigate([this.selectBestRoute()]);
    return of(false);
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivateInternal(route.data, state);
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
  selectBestRoute(): string {
    if (!this.authService.currentUserValue) {
      this.authService.logout();
      return '/auth/login';
    }
    return '/dashboard';
  }
  
}
