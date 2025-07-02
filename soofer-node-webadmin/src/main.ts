/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppSettings } from './app/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

if (AppSettings.production) {
  enableProdMode();
  // if(window){
  //   window.console.log=function(){};
  // }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

document.getElementById('title').innerHTML = AppSettings.APPNAME

// const http = new XMLHttpRequest()
// http.open("GET", AppSettings.API_ENDPOINT + 'seosettings')
// http.send()
// http.onload = () => console.log(http.responseText)
// console.log(1)
// var el = document.createElement('title')
// el.innerHTML = "Rebustar"
// el.firstChild
// var key = AppSettings.GoogleMapKey
// document.getElementById('test').setAttribute('src', `https://maps.google.com/maps/api/js?sensor=false&key=${key}&libraries=visualization,places,drawing&language=en-US`);
//document.getElementById("test").src ="https://maps.google.com/maps/api/js?sensor=false&key=AIzaSyBMIRPoXJpMsWxPLiXP4XYYuh-1D9nylX8&libraries=visualization,places,drawing&language=en-US";
