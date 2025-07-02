import { Component } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
import { MENU_ITEMS_CITYWISE } from './pages-menu-citywise';
import { MENU_ITEMS_BILLING } from './pages-menu-billing';
import { MENU_ITEMS_DISPATCHER } from './pages-menu-dispatcher';
import { MENU_ITEMS_PROVIDER } from './pages-menu-provider';
import { featuresSettings, AppSettings } from '../app.config';
import { NbAccessChecker } from '@nebular/security';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { AdminService } from './admin/admin.service';
import { CommonService } from './common/common.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  providers: [AdminService, CommonService],
  template: `
      <ngx-sample-layout>
      <nb-menu [items]="menu" autoCollapse="false"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})

// <nb-menu  *nbIsGranted="['citymenu', 'menu']"  [items]="cityadmin" autoCollapse="true"></nb-menu>
// <nb-menu  *nbIsGranted="['superadminmenu', 'menu']"  [items]="menu" autoCollapse="true"></nb-menu>

export class PagesComponent {

  // menu = MENU_ITEMS;
  user: any;
  menu: any = [];

  splarrtwo = [];
  pagesArray = [];

  showCompanies: boolean = featuresSettings.isMultipleCompaniesAvailable;
  // showCompanies = false;

  showSCID: boolean = featuresSettings.isServiceAvailable;
  showHail: boolean = featuresSettings.showHailTrips;
  showDelivery: boolean = featuresSettings.showDeliveryTrips;

  constructor(public accessChecker: NbAccessChecker,
    private authService: NbAuthService,
    private commonservice: CommonService,
    private dataServcie: AdminService) {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
          const data: any = {};
          data.group = this.user.type;
          this.dataServcie.getMenus(data)
            .then(async res => {
              if (res.data.menus) {
                for (let j = 0; j < res.data.menus.length; j++) {
                  for (let i = 0; i < MENU_ITEMS.length; i++) {
                    if (MENU_ITEMS[i].title === res.data.menus[j])
                      this.pagesArray.push(MENU_ITEMS[i]);
                  }
                }
                this.menu = await this.showMenus(this.pagesArray);
              } else {
                this.menu = await this.showMenus(MENU_ITEMS);
              }
            })
            .catch(async err => {
              this.menu = await this.showMenus(MENU_ITEMS);
            });
        }
      });
    this.findMe();
  }

  findMe() {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     const loc = position.coords.latitude + ', ' + position.coords.longitude;
    //     this.commonservice.bSubject.next(loc);
    //     AppSettings.GOOGLE_MAP_DEFAULT_LOCATION = loc;
    //   });
    // } else {
    //   console.log('Geolocation is not supported by this browser.');
    // }
  }

  async showMenus(data) {
    if (!this.showCompanies && this.showSCID) {
      data.forEach((val, index) => {
        this.splarrtwo.push(val);
        if (val.permission === 'checked') {
          const indextwo = this.splarrtwo.map(function (e) { return e.permission; }).indexOf('checked');
          this.splarrtwo.splice(indextwo, 1);
        }
        this.menu = this.removeCompany(this.splarrtwo);
      });
    } else if (this.showCompanies && !this.showSCID) {
      data.forEach((val, index) => {
        this.splarrtwo.push(val);
        if (val.permission === 'removeServiceCity') {
          const indextwo = this.splarrtwo.map(function (e) { return e.permission; }).indexOf('removeServiceCity');
          const indexthree = this.splarrtwo[indextwo].children.map(function (e) { return e.permission; }).indexOf('removeServiceCity');
          if (indexthree > -1) {
            this.splarrtwo[indextwo].children.splice(indexthree, 1);
          }
        }
        this.menu = this.splarrtwo;
      });
    } else if (!this.showCompanies && !this.showSCID) {
      data.forEach((val, index) => {
        this.splarrtwo.push(val);
        if (val.permission === 'checked') {
          const indextwo = this.splarrtwo.map(function (e) { return e.permission; }).indexOf('checked');
          this.splarrtwo.splice(indextwo, 1);
        }
        if (val.permission === 'removeServiceCity') {
          const indextwo = this.splarrtwo.map(function (e) { return e.permission; }).indexOf('removeServiceCity');
          const indexthree = this.splarrtwo[indextwo].children.map(function (e) { return e.permission; }).indexOf('removeServiceCity');
          if (indexthree > -1) {
            this.splarrtwo[indextwo].children.splice(indexthree, 1);
          }
        }
        this.menu = this.removeCompany(this.splarrtwo);
      });
    }
    const hail = this.removeHail(this.menu);
    return this.removeDeliveryTrips(hail);
  }

  removeCompany(data) {
    let parentIndex;
    let childIndex;
    data.forEach((val) => {
      if (val.permission === 'removeCompany') {
        parentIndex = data.map(function (e) { return e.permission; }).indexOf('removeCompany');
        childIndex = data[parentIndex].children.map(function (e) { return e.permission; }).indexOf('removeCompany');
        if (childIndex > -1) {
          data[parentIndex].children.splice(childIndex, 1);
        }
      }
    });
    return data;
  }

  removeHail(data) {
    if (!this.showHail) {
      let parentIndex;
      let childIndex;
      data.forEach((val) => {
        if (val.permission === 'removehail') {
          parentIndex = data.map(function (e) { return e.permission; }).indexOf('removehail');
          childIndex = data[parentIndex].children.map(function (e) { return e.permission; }).indexOf('removehail');
          if (childIndex > -1) {
            data[parentIndex].children.splice(childIndex, 1);
          }
        }
      });
      return data;
    } else return data;
  }

  removeDeliveryTrips(data) {
    if (!this.showDelivery) {
      let parentIndex;
      let childIndex;
      data.forEach((val) => {
        if (val.permission === 'removehail') {
          parentIndex = data.map(function (e) { return e.permission; }).indexOf('removehail');
          childIndex = data[parentIndex].children.map(function (e) { return e.permission; }).indexOf('removeDelivery');
          if (childIndex > -1) {
            data[parentIndex].children.splice(childIndex, 1);
          }
        }

        if (val.permission === 'removeDelivery') {
          parentIndex = data.map(function (e) { return e.permission; }).indexOf('removeDelivery');
          childIndex = data[parentIndex].children.map(function (e) { return e.permission; }).indexOf('removeDelivery');
          if (childIndex > -1) {
            data[parentIndex].children.splice(childIndex, 1);
          }
        }

      });
      return data;
    } else return data;
  }
}

