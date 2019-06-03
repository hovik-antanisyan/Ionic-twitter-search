import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TwitterUtilsService } from '../twitter-utils.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  twCredentials = environment.twitter;
  searchText: string;
  timer: any;

  constructor(
      public loadingController: LoadingController,
      private twitterUtils: TwitterUtilsService
  ) {
  }

  async ngOnInit() {
    this.twitterUtils.configureUtils(
        this.twCredentials.consumerKey,
        this.twCredentials.consumerSecret,
        this.twCredentials.token,
        this.twCredentials.tokenSecret
    );
  }

  async onSearch() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // const loading = await this.loadingController.create({
    //   message: 'Please wait...'
    // });
    // await this.presentLoading(loading);

    this.timer = setTimeout(() => {
      this.twitterUtils.performGetRequest(
          'https://api.twitter.com/1.1/search/tweets.json',
          {
            q: this.searchText,
            count: '5'
          }
      ).then((res) => {
        console.log(res);
      }, err => {
        console.log(err);
      });
    }, 300);
  }

  async presentLoading(loading) {
    return await loading.present();
  }


}
