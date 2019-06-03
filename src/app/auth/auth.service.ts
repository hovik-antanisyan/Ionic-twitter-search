import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import { UserModel } from './user.model';
import { from, Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private nativeStorage: NativeStorage,
              private twitter: TwitterConnect) {
  }

  isAuthenticated(): Observable<boolean> {
    return from(this.nativeStorage.getItem('twitter_user')
        .then(data => {
          return !!data.userName;
        }, err => {
          return false;
        }));
  }

  async logout() {
    await this.nativeStorage.remove('twitter_user');
    await this.twitter.logout();
  }

  user(): Promise<UserModel | null> {
    return this.nativeStorage.getItem('twitter_user')
        .then(data => {
          return {
            name: data.name,
            userName: data.userName,
            picture: data.picture,
            followers: data.followers
          };
        }, error => {
          console.log(error);

          return null;
        });
  }
}
