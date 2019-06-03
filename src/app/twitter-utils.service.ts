import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as oauthSignature from 'oauth-signature';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class TwitterUtilsService {
  consumerKey: string;
  consumerSecret: string;
  oauthKey: string;
  oauthSecret: string;


  constructor(public http: HTTP) {
  }


  public configureUtils(cK, cS, oK, oS) {
    this.consumerKey = cK;
    this.consumerSecret = cS;
    this.oauthKey = oK;
    this.oauthSecret = oS;
  }


  public performGetRequest(url, neededParams, optionalParams?) {
    if (typeof (optionalParams) === 'undefined') {
      optionalParams = {};
    }
    if (typeof (neededParams) === 'undefined') {
      neededParams = {};
    }

    const parameters = Object.assign(optionalParams, neededParams);
    const signature = this.createTwitterSignature(
        'GET',
        url,
        parameters,
        this.consumerKey,
        this.consumerSecret,
        this.oauthKey,
        this.oauthSecret
    );
    console.log(signature);
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', signature['authorization_header']);


    const params = new HttpParams();
    for (const key in parameters) {
      params.set(key, parameters[key]);
    }
    console.log(parameters);

    this.http.setDataSerializer('json');
    // this.http.setHeader(url, 'Authorization', signature['authorization_header']);
    return this.http.get(url, parameters, {'Authorization': signature['authorization_header']});
  }


  public performPostRequest(url, neededParams, optionalParams?) {
    if (typeof (optionalParams) === 'undefined') {
      optionalParams = {};
    }

    if (typeof (neededParams) === 'undefined') {
      neededParams = {};
    }

    const parameters = Object.assign(optionalParams, neededParams);
    const signature = this.createTwitterSignature(
        'POST',
        url,
        parameters,
        this.consumerKey,
        this.consumerSecret,
        this.oauthKey,
        this.oauthSecret
    );
    if (parameters !== {}) {
      url = url + '?' + this.transformRequest(parameters);
    }

    const headers = new HttpHeaders({'Accept': 'application/json'});
    headers.append('Authorization', signature['authorization_header']);

    // let options = new HttpRequest({headers: headers});

    return this.http.post(url, parameters, headers /*options*/);
  }


  private createSignature(method, endPoint, headerParameters, bodyParameters, secretKey, tokenSecret): {} {
    const headerAndBodyParameters = Object.assign({}, headerParameters);
    const bodyParameterKeys = Object.keys(bodyParameters);
    for (let i = 0; i < bodyParameterKeys.length; i++) {
      headerAndBodyParameters[bodyParameterKeys[i]] = this.escapeSpecialCharacters(bodyParameters[bodyParameterKeys[i]]);
    }

    let signatureBaseString = method + '&' + encodeURIComponent(endPoint) + '&';
    const headerAndBodyParameterKeys = (Object.keys(headerAndBodyParameters)).sort();
    for (let i = 0; i < headerAndBodyParameterKeys.length; i++) {
      if (i === headerAndBodyParameterKeys.length - 1) {
        signatureBaseString += encodeURIComponent(
            headerAndBodyParameterKeys[i] + '=' + headerAndBodyParameters[headerAndBodyParameterKeys[i]]
        );
      } else {
        signatureBaseString += encodeURIComponent(
            headerAndBodyParameterKeys[i] + '=' + headerAndBodyParameters[headerAndBodyParameterKeys[i]] + '&'
        );
      }
    }
    /*const oauthSignatureObject = new JsSHA(signatureBaseString, 'TEXT');


    let encodedTokenSecret = '';
    if (tokenSecret) {
      encodedTokenSecret = encodeURIComponent(tokenSecret);
    }

    headerParameters.oauth_signature = encodeURIComponent(
        oauthSignatureObject.getHMAC(
            encodeURIComponent(secretKey) + '&' + encodedTokenSecret, 'TEXT', 'SHA-1', 'B64')
    );*/

    const headerParameterKeys = Object.keys(headerParameters);
    let authorizationHeader = 'OAuth ';
    for (let i = 0; i < headerParameterKeys.length; i++) {
      if (i === headerParameterKeys.length - 1) {
        authorizationHeader += headerParameterKeys[i] + '="' + headerParameters[headerParameterKeys[i]] + '"';
      } else {
        authorizationHeader += headerParameterKeys[i] + '="' + headerParameters[headerParameterKeys[i]] + '",';
      }
    }

    const signature = oauthSignature.generate(method, endPoint, headerAndBodyParameterKeys, this.consumerSecret, tokenSecret,
        {encodeSignature: false}
    );

    authorizationHeader += 'oauth_signature="' + signature + '"';

    return {
      signature_base_string: signatureBaseString,
      authorization_header: authorizationHeader,
      signature
    };
  }


  private createNonce(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


  private escapeSpecialCharacters(string) {
    let tmp = encodeURIComponent(string);
    tmp = tmp.replace(/\!/g, '%21');
    tmp = tmp.replace(/\'/g, '%27');
    tmp = tmp.replace(/\(/g, '%28');
    tmp = tmp.replace(/\)/g, '%29');
    tmp = tmp.replace(/\*/g, '%2A');

    return tmp;
  }


  private transformRequest(obj) {
    const str = [];
    for (const p in obj) {
      str.push(encodeURIComponent(p) + '=' + this.escapeSpecialCharacters(obj[p]));
    }
    console.log(str.join('&'));
    return str.join('&');
  }


  private createTwitterSignature(method, url, bodyParameters, clientId, clientSecret, oauthKey, oauthSecret) {
    const oauthObject = {
      oauth_consumer_key: clientId,
      oauth_nonce: this.createNonce(10),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_token: oauthKey,
      oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
      oauth_version: '1.0'
    };

    return this.createSignature(method, url, oauthObject, bodyParameters, clientSecret, oauthSecret);
  }
}
