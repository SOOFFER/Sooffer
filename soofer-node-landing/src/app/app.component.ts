import { Component } from '@angular/core';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from "@ngx-translate/core";
import { LanguageSettings } from "./app.config";

@Component({
  selector: 'app-root',
  templateUrl: './index/main.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string
  ) {
    translate.addLangs(LanguageSettings.languages);
    translate.setDefaultLang(LanguageSettings.defaultSelectedLang);
    if (localStorage.getItem('accept-language') == null || !localStorage.getItem('accept-language')) {
    localStorage.setItem('accept-language', LanguageSettings.defaultSelectedLang)
    }
  }

  onActivate(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      const scrollToTop = window.setInterval(() => {
        const pos = window.pageYOffset;
        if (pos > 0) {
          window.scrollTo(0, pos - 200); // how far to scroll on each step
        } else {
          window.clearInterval(scrollToTop);
        }
      }, 16);
    }
  }

}
