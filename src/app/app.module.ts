import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { TwitterUtilsService } from './twitter-utils.service';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TwitterConnect,
    NativeStorage,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    AuthGuard,
    AuthService,
    TwitterUtilsService,
    HTTP
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
