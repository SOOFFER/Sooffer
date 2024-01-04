import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { ChangeDetectionStrategy, OnInit, ViewEncapsulation } from '@angular/core';

import { CompactType, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterPush, GridType } from 'angular-gridster2';
import { Router } from '@angular/router';


interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy, OnInit {
  Riders: string = '0';
  Drivers: string = '0';
  Companies: string = '0';
  Vehicles: string = '0';
  Trips: string = '0';
  Commission: string = '0';
  Earned: string = '0';
  Payment: string = '0';

  totalTrips: string = '0';
  ongoing: string = '0';
  canceled: string = '0';
  completed: string = '0';

  active: any = 0;
  ractive: any = 0;
  avg: number = 0;
  acount: any = [];
  rcount: any = [];
  sum: any = 0;
  temp: number;

  private alive = true;

  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
  } = {
      default: this.commonStatusCardsSet,
      cosmic: this.commonStatusCardsSet,
      corporate: [
        {
          ...this.lightCard,
          type: 'warning',
        },
        {
          ...this.rollerShadesCard,
          type: 'primary',
        },
        {
          ...this.wirelessAudioCard,
          type: 'danger',
        },
        {
          ...this.coffeeMakerCard,
          type: 'secondary',
        },
      ],
    };
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  itemToPush: GridsterItemComponent;

  ngOnInit() {


    this.dataService.dashboardPanel1()
      .then(msg => {
        this.Riders = msg.RiderCnt;
        this.Drivers = msg.DriverCnt;
        this.Companies = msg.CmpCnt;
        this.Vehicles = msg.VehicleCnt;
      }
      );
    this.dataService.totaltripdetails()
      .then(msg => {
        this.Trips = msg.docs ? msg.docs.totalTrips : 0;
        this.Commission = msg.docs ? msg.docs.totalTripCommision : 0;
        this.Payment = msg.docs ? msg.docs.totalTripPayment : 0;
        this.Earned = msg.docs ? msg.docs.totalDriverEarned : 0;
      });


    this.dataService.activeUsers()
      .then((users: any) => {
        if (users[0].length === 2) {
          this.active = users[0];
          this.sum = this.active[0].count + this.active[1].count;
          this.avg = (this.active[0].count / this.sum) * 100;
        } else {
          this.active = users[0];
          this.sum = this.active[0].count + 0;
          this.avg = (this.active[0].count / this.sum) * 100;
        }
        this.acount = [Math.round(this.avg), this.sum];
        if (users[1].length === 2) {
          this.ractive = users[1];
          this.sum = this.ractive[0].count + this.ractive[1].count;
          this.avg = (this.ractive[0].count / this.sum) * 100;
        } else {
          this.ractive = users[1];
          this.sum = this.ractive[0].count + 0;
          this.avg = (this.ractive[0].count / this.sum) * 100;
        }
        this.rcount = [this.avg, this.sum];
      });


    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      pushItems: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard = [
      { cols: 3, rows: 1, y: 0, x: 0, initCallback: this.initItem.bind(this) },
      { cols: 2, rows: 2, y: 0, x: 2 },
      { cols: 1, rows: 1, y: 0, x: 4 },
      { cols: 3, rows: 2, y: 1, x: 4 },
      { cols: 1, rows: 3, y: 4, x: 5 },
      { cols: 1, rows: 1, y: 2, x: 1 },
      { cols: 2, rows: 2, y: 5, x: 5 },
      { cols: 2, rows: 2, y: 3, x: 2 },
      { cols: 2, rows: 1, y: 2, x: 2 },
      { cols: 1, rows: 1, y: 3, x: 4 },
      { cols: 1, rows: 1, y: 0, x: 6 }
    ];
  }

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }
  removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }
  addItem() {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
  }
  initItem(item: GridsterItem, itemComponent: GridsterItemComponent) {
    this.itemToPush = itemComponent;
  }
  pushItem() {
    const push = new GridsterPush(this.itemToPush); // init the service
    this.itemToPush.$item.rows += 4; // move/resize your item
    if (push.pushItems(push.fromNorth)) { // push items from a direction
      push.checkPushBack(); // check for items can restore to original position
      push.setPushedItems(); // save the items pushed
      this.itemToPush.setSize();
      this.itemToPush.checkItemChanges(this.itemToPush.$item, this.itemToPush.item);
    } else {
      this.itemToPush.$item.rows -= 4;
      push.restoreItems(); // restore to initial state the pushed items
    }
    push.destroy(); // destroy push instance
    // similar for GridsterPushResize and GridsterSwap
  }
  constructor(private Http: HttpClient, private themeService: NbThemeService,
    private router: Router,
    private dataService: DashboardService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });

    // this.Http.get("https://jsonplaceholder.typicode.com/todos").subscribe(function(result){
    //     console.log(result);
    // });

  }
  routeToOtherTable(path: string) {
    console.log(path);
    this.router.navigate([
      'pages/tables/' + path,
    ]);
  }


  routeTrips(path: string) {
    this.router.navigate([
      'pages/tripdetails/' + path,
    ]);
  }

  routePayment() {
    this.router.navigate([
      '/pages/tables/payment/driver'
    ]);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
