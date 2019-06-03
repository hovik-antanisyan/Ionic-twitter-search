import { Component, OnInit } from '@angular/core';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
      private tw: TwitterConnect,
      public loadingController: LoadingController,
      private nativeStorage: NativeStorage,
      private router: Router,
  ) {
  }

  ngOnInit() {
  }

  async onTwitterLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await this.presentLoading(loading);
    this.tw.login()
        .then(res => {
          this.tw.showUser()
              .then(user => {
                console.log(user);
                loading.dismiss();
              }, err => {
                console.log(err);
                const profileImage = err.profile_image_url_https.replace('_normal', '');
                this.nativeStorage.setItem('twitter_user', {
                  name: err.name,
                  userName: err.screen_name,
                  followers: err.followers_count,
                  picture: profileImage
                })
                    .then(() => {
                      this.router.navigate(['home']);
                      loading.dismiss();
                    }, (error) => {
                      console.log(error);
                      loading.dismiss();
                    });
              });
        }, err => {
          console.log(err);
          loading.dismiss();
        });
  }

  async presentLoading(loading) {
    return await loading.present();
  }
}
