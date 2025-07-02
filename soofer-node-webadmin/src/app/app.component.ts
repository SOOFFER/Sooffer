/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthGuard } from './auth-guard.service';
import { Router } from '@angular/router';
import { LanguageSettings, AppSettings } from "./app.config";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  idleState = 'Not started.';
  timedOut: boolean;
  lastPing: Date;

  constructor(private analytics: AnalyticsService, public translate: TranslateService, private authG: AuthGuard,
    private idle: Idle, private keepalive: Keepalive, private _router: Router) {

    translate.addLangs(LanguageSettings.languages);
    translate.setDefaultLang(LanguageSettings.defaultSelectedLang);
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);
    // sets a timeout period of 5 shjugfyufgyugfyugtuyygufguyeconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(200000);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      localStorage.clear();
      this._router.navigate(['auth/logout']);
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');
    // sets the ping interval to 15 seconds
    keepalive.interval(15);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.reset();
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
  onTimeOut() {

  }
  ngOnDestroy() {

  }
}
