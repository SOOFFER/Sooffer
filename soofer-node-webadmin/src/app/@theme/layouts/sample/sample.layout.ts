import { Component, OnDestroy } from '@angular/core';
import { delay, withLatestFrom, takeWhile } from 'rxjs/operators';
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';
import { NbAuthService, NbAuthJWTToken } from "@nebular/auth";

import { StateService } from '../../../@core/data/state.service';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

// TODO: move layouts into the framework
@Component({
  selector: 'ngx-sample-layout',
  styleUrls: ['./sample.layout.scss'],
  template: `
    <nb-layout [center]="layout.id === 'center-column'" windowMode>
      <nb-layout-header fixed>
        <ngx-header [position]="sidebar.id === 'start' ? 'normal': 'inverse'"></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar"
                   tag="menu-sidebar"
                   responsive
                   [end]="sidebar.id === 'end'">
        <nb-sidebar-header *ngIf="currentTheme !== 'corporate'">
          <a href="#" class="btn btn-hero-success main-btn">
            <i class="nb-person"></i> <span>{{type}}</span>
          </a>
        </nb-sidebar-header>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
        <ngx-spinner
        bdColor = "rgba(51, 51, 51, 0.8)"
        size = "large"
        color = "#fff" 
        type = "ball-spin-clockwise">
        </ngx-spinner>
        
      </nb-layout-column>

      <nb-layout-column start class="small" *ngIf="layout.id === 'two-column' || layout.id === 'three-column'">
        <nb-menu [items]="subMenu"></nb-menu>
        <ngx-spinner
        bdColor = "rgba(51, 51, 51, 0.8)"
        size = "large"
        color = "#fff" 
        type = "ball-spin-clockwise">
        </ngx-spinner>
        
      </nb-layout-column>

      <nb-layout-column class="small" *ngIf="layout.id === 'three-column'">
        <nb-menu [items]="subMenu"></nb-menu>
        <ngx-spinner
        bdColor = "rgba(51, 51, 51, 0.8)"
        size = "large"
        color = "#fff" 
        type = "ball-spin-clockwise">
        </ngx-spinner>
        
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>

      <nb-sidebar class="settings-sidebar"
                   tag="settings-sidebar"
                   state="collapsed"
                   fixed
                   [end]="sidebar.id !== 'end'">
        <ngx-theme-settings></ngx-theme-settings>
      </nb-sidebar>
     

    </nb-layout>
  `,
})
export class SampleLayoutComponent implements OnDestroy {

  subMenu: NbMenuItem[] = [
    {
      title: 'PAGE LEVEL MENU',
      group: true,
    },
    {
      title: 'Buttons',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/buttons',
    },
    {
      title: 'Grid',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/grid',
    },
    {
      title: 'Icons',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/icons',
    },
    {
      title: 'Modals',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/modals',
    },
    {
      title: 'Typography',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/typography',
    },
    {
      title: 'Animated Searches',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/search-fields',
    },
    {
      title: 'Tabs',
      icon: 'ion ion-android-radio-button-off',
      link: '/pages/ui-features/tabs',
    },
  ];
  layout: any = {};
  sidebar: any = {};

  private alive = true;

  currentTheme: string;
  type: any;
  user: any;
  messagingService: any;
  message: any;

  constructor(protected stateService: StateService,
    protected menuService: NbMenuService,
    protected themeService: NbThemeService,
    protected bpService: NbMediaBreakpointsService,
    protected sidebarService: NbSidebarService,
    private router: Router,
    private authService: NbAuthService,
    private spinner: NgxSpinnerService) {
      this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
          console.log('Dashboard==>',this.user); // here we receive a payload from the token and assigne it to our `user` variable
          //localStorage.setItem('auth_app_token', token.getValue());
          localStorage.setItem("userId", this.user.id);
          localStorage.setItem("userEmail", this.user.email);
          localStorage.setItem("userType", this.user.type);
          localStorage.setItem("cityType", this.user.city);
          this.messagingService.requestPermission(this.user.id);
          this.messagingService.receiveMessage();
          this.message = this.messagingService.currentMessage;
        }
      });
      this.type= localStorage.getItem('userType')
      console.log('sample layout ==>',this.type)
    this.stateService.onLayoutState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((layout: string) => this.layout = layout);

    this.stateService.onSidebarState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((sidebar: string) => {
        this.sidebar = sidebar;
      });

    const isBp = this.bpService.getByName('is');
    this.menuService.onItemSelect()
      .pipe(
        takeWhile(() => this.alive),
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20),
      )
      .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {

        if (bpTo.width <= isBp.width) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });

    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    router.events.subscribe((event: RouterEvent) => {
      this.navIndicator(event)
      // console.log("change")
    })
  }


  navIndicator(event): void {
    if (event instanceof NavigationStart) {
      this.spinner.show()
    }
    if (event instanceof NavigationEnd) {
      this.spinner.hide()
    }
    if (event instanceof NavigationCancel) {
      this.spinner.hide()
    }
    if (event instanceof NavigationError) {
      this.spinner.hide()
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
