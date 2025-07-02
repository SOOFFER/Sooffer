import { Component, OnInit } from '@angular/core';

// import {initial}from'./../../app.module';
import { Router } from '@angular/router';
import { HeaderService } from './header.service';
import { AppSettings, LanguageSettings } from '../../app.config';
import { DataSharingService } from '../common/data-sharing.service';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { SectionService } from '../section/section.service';
import { setTemplateEngine } from '@syncfusion/ej2-base';

@Component({
  selector: "headsection",
  templateUrl: './header.html',
  styleUrls:['header.component.css'],
  providers: [HeaderService, SectionService],
  //   styles: [`
  //   header, hgroup, main, menu, nav, section, summary {
  //     display: block;
  //     background-color:  #f7a523;
  //     height: 49px;
  // }
  // .banner a, img {
  //   max-width: 92%;
  //   max-height: 66px;
  // }
  // .line-icon {
  //   cursor: pointer;
  //   float: left;
  //   margin: 35px 10px;
  //   background-color: black;
  // }
  // `]
})

export class HeaderComponent implements OnInit {
  menuclass: any;
  openoverly: any;
  Menu: any = 0;
  TopHeader: any;
  browserLang: any;
  NavHeader: any;
  fronturl = AppSettings.FEURL;
  logoURL = AppSettings.LOGO_URL;
  logoWidth = AppSettings.LOGO_WIDTH;
  logoHeight = AppSettings.LOGO_HEIGHT;
  showServiceCity = AppSettings.showServiceCity;
  language = LanguageSettings.defaultSelectedLang;

  isUserLoggedIn: boolean; list: any = {};

  constructor(private headerService: HeaderService,
    private sectionService: SectionService,
    private dataSharingService: DataSharingService,
    private translate: TranslateService,
    private router: Router) {
    if (localStorage.getItem('accept-language') == null) {
      localStorage.setItem('accept-language', this.language)
    }
    this.browserLang = translate.getBrowserLang();
    this.translate.use(localStorage.getItem('accept-language'));
    console.log(translate.getLangs())
    this.dataSharingService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
      if (localStorage.getItem('Tok') == null) {
        this.Menu = 0;
      } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'driver') {
        this.Menu = 1;
      } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'company') {
        this.Menu = 2;
      } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'rider') {
        this.Menu = 3;
      } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'restaurant') {
        this.Menu = 4;
      }
    });

    if (localStorage.getItem('Tok') == null) {
      this.Menu = 0;
    } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'driver') {
      this.Menu = 1;
    } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'company') {
      this.Menu = 2;
    } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'rider') {
      this.Menu = 3;
    } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'restaurant') {
      this.Menu = 4;
    }
    // this.ngOnInit();

    this.sectionService.gethomecontent()
      .then(res => {
        this.list = res[0];
      });
  }

  MYLogout(): void {
    console.log(this.translate.currentLang);
    localStorage.removeItem('Tok');
    localStorage.removeItem('location')
    localStorage.removeItem('droplocation')
    // localStorage.clear();
    this.headerService.logout()
      .then(msg => {
        this.dataSharingService.isUserLoggedIn.next(false);
        this.router.navigate(['/']);
      });
  }


  clickMe(data) {
    console.log(data)
    window.location.reload();
    this.translate.use(data)
    localStorage.setItem('accept-language', data)
  }

  menuoption(event) {
    this.ngOnInit();
    this.openoverly = !this.openoverly;
    if (event === 1) {
      this.menuclass = 'sidbar-active';
      // this. ngOnInit();
    } else {
      this.menuclass = '';
      // this. ngOnInit();
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('Tok') == null) {
      this.Menu = 0;
      // window.location.href = this.fronturl+"/#/about";
    } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'driver') {
      this.Menu = 1;
    } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'company') {
      this.Menu = 2;
    } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'rider') {
      this.Menu = 3;
    } else if (localStorage.getItem('Tok') != null && localStorage.getItem('Type') === 'restaurant') {
      this.Menu = 4;
    }
  }


}
