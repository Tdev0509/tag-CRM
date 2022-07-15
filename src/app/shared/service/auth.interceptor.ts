import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../modules/auth/_services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private get accessToken(): string {
      let auth = localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`);
      if(!auth) return;
      let authJson = JSON.parse(auth);
      if (!authJson) return;
      return authJson.accessToken;
    }

    constructor(
    ) {
      
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if(this.accessToken && 
        !req.url.endsWith('/login')) {
        const authReq = req.clone({
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.accessToken
          })
        });
        return next.handle(authReq);
      }else {
        return next.handle(req);
      }
      
    }
}