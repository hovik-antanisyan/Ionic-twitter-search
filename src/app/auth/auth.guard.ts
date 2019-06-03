import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private splashScreen: SplashScreen) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
      Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated()
        .pipe(map(
            isAuth => {
              console.log(isAuth);
              if (!isAuth) {
                this.router.navigate(['login']);
                this.splashScreen.hide();

                return false;
              }

              this.splashScreen.hide();

              return true;
            },
            err => {
              this.splashScreen.hide();

              return false;
            }
        ));
  }
}
