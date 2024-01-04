import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import { AppSettings } from '../../../app.config';
import { UserService } from '../../../@core/data/users.service';
import { DashboardService } from '../dashboard.service';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-contacts-r',
  styleUrls: ['./contacts.component.scss'],
  templateUrl: './contacts.component.html',
})
export class ContactRComponent implements OnInit, OnDestroy {

  contacts: any[];
  recent: any[];
  breakpoint: NbMediaBreakpoint;
  breakpoints: any;
  themeSubscription: any;
  temp: string = AppSettings.BASEURL;
  constructor(private dashboardService: DashboardService,
    private router: Router,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService) {

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeSubscription = this.themeService.onMediaQueryChange()
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  ngOnInit() {
    this.dashboardService.recentUsers()
      .then((users: any) => {
        this.contacts = users[0];
        this.recent = users[1];
      });
  }

  RouteToDrivers(path: String): void {
    this.router.navigate([
      'pages/tables/driver-table',
      { _id: path }
    ]);
  }
  RouteToRider(path: String): void {
    this.router.navigate([
      'pages/tables/rider-table',
      { _id: path }
    ]);
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
  // RouteToDrivers(path:String):void{
  //   this.router.navigate([
  //     'pages/tables/driver-table',
  //     {_id:path}
  //   ])
  // // }
  // RouteToRider(path:String):void{
  //   this.router.navigate([
  //     'pages/tables/rider-table',
  //       {_id:path}
  //   ])
  // }
}
