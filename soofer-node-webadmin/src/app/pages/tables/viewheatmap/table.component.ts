import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TableService } from '../table.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { CommonService } from '../../common/common.service';
import { ViewChild, OnInit } from '@angular/core';
import { HeatmapLayer } from '@ngui/map';
import { AppSettings, featuresSettings } from '../../../app.config';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, ButtonToasterService, CommonService, DatePipe],
  templateUrl: './smart-table.component.html',
  styles: [`nb-card {
    transform: translate3d(0, 0, 0);
   }
  `],
})

export class HeatMapTableComponent implements OnInit, OnDestroy {

  title: string = 'Heatmap';
  @ViewChild(HeatmapLayer) heatmapLayer: HeatmapLayer;
  heatmap: google.maps.visualization.HeatmapLayer;
  map: google.maps.Map;
  points = [];
  latlngarr = [];
  zoom = AppSettings.MAP_ZOOM;
  list: any;
  dateObj: any;
  location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
  source: ServerDataSource;
  requestDrvCount: number = 0;
  user: any;
  city: string;
  cityType: string;
  showCity: boolean;
  ServiceCity: any;
  City: any;

  constructor(private _http: HttpClient,
    private service: TableService,
    private datePipe: DatePipe,
    private authService: NbAuthService,
    private toastr: ButtonToasterService,
    private CommonSvc: CommonService) {
     this.cityType = localStorage.getItem('cityType')
     console.log(this.cityType)
   if(localStorage.getItem('userType')=='citywiseadmin') {
      if(localStorage.getItem('cityType')== 'Madurai' || localStorage.getItem('cityType')== 'Default' ){
        this.city = 'Madurai'
         this.location = this.city
      }
      else if(localStorage.getItem('cityType')== this.cityType){
        this.city = this.cityType
        this.location = this.city
      }
    }
    else {
      CommonSvc.bSubject.subscribe(value => {
        AppSettings.GOOGLE_MAP_DEFAULT_LOCATION = value;
        this.location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
        this.refresh();
      });
    }

    if(featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') =='superadmin')
    this.showCity = true;
    else 
    this.showCity = false;

    this.service.getServiceCity()
    .then(res =>{
      this.ServiceCity = res;
    })

    this.dateObj = {};
    this.list = {};
    // const fromDate = new Date(Date.now());
    // const month = fromDate.getMonth(),
    //   year = fromDate.getFullYear();
    // const FirstDay = new Date(year, month, 1);
    // const LastDay = new Date(year, month + 1, 0);
    // this.list.fromDate = FirstDay;
    // this.list.toDate = LastDay;
    // console.log(this.list.toDate);
  }

  FilterRes(data) {
    this.City = data
     if(data == 'Madurai' || data == 'Default') 
      this.location = 'Madurai'
      else if( data != 'all')
        this.location = this.City 
      else 
        this.location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
       
     this.show()   
  }

  filterRes() {
    if (this.dateObj['fromDate'] === undefined || this.dateObj['toDate'] === undefined) {
      this.toastr.showtoast('warn', 'Select Both From Date and To Date');
    } else {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.filteredResult(fromDate, toDate);
    }
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
  }

  show() {
    this.CommonSvc.getLatLng(this.list.servicecity)
      .then(res => {
        this.points = [];
        for (const item of res) {
          if (item.lat && item.lat[1] !== undefined) {
            const randomLat = item.lat[1];
            const randomLng = item.lat[0];
            const latlng = new google.maps.LatLng(randomLat, randomLng);
            this.points.push(latlng);
          }
        }
        this.requestDrvCount = this.points.length;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  filteredResult(fromDate, toDate) {
    this.CommonSvc.getLatLngWithLimits(fromDate, toDate)
      .then(res => {
        this.points = [];
        for (const item of res) {
          if (item.lat && item.lat[1] !== undefined) {
            const randomLat = item.lat[1];
            const randomLng = item.lat[0];
            const latlng = new google.maps.LatLng(randomLat, randomLng);
            this.points.push(latlng);
          }
        }
        this.requestDrvCount = this.points.length;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  ngOnInit() {
    this.show();
  }

  ngOnDestroy() {
    this.points = [];
    this.latlngarr = [];
  }

  refresh() {
    this.requestDrvCount = 0;
    this.dateObj = {};
    this.list = {};
    this.show();
  }

}
