import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { UserModel } from './auth/user.model';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private router: Router,
      private st: NativeStorage,
      private authService: AuthService
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {
    this.authService.isAuthenticated()
        .subscribe(isAuth => this.isAuthenticated = isAuth);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleDefault();
    });
  }

  get user(): Promise<UserModel | null> {
    return this.authService.user();
  }

  onLogout() {
    this.authService.logout()
        .then(
            res => {
              this.router.navigate(['login']);
            },
            err => console.log(err));
  }
}
