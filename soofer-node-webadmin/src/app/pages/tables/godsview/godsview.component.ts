import { Component, ViewChild, ElementRef } from '@angular/core';
import { TableService } from '../table.service';
import { AppSettings, featuresSettings } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';

const colors = [
  'red',
];
const colorIndex = 0;

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService],
  templateUrl: './godsview.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})

export class GodsViewComponent {

  vehicleary: any[] = [];
  list: any = {};
  initial: string = 'list';
  public positions: any;
  temp: string = AppSettings.BASEURL;
  zlevel: any;
  resList: any = [];
  markerv: any = {};
  tok: string;
  marker: any = {};
  phone: number;
  inputsearch: any;
  dropLocation: any;
  select: number;
  googleloc: any;
  zoom = AppSettings.MAP_ZOOM;
  location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
  setDefaultVehicle: string;
  driversCount: number = 0;
  city: string;
  showCity: boolean;
  ServiceCity: any;
  cityType: string;

  constructor(
    private commonservice: CommonService,
    private service: TableService,
    private toaster : ButtonToasterService) {
    // this.location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
    // commonservice.bSubject.subscribe(value => {
    //   AppSettings.GOOGLE_MAP_DEFAULT_LOCATION = value;
    //   this.location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
    //   this.ReloadPage();
    // });
    this.cityType = localStorage.getItem('cityType');

    if(featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType')=='superadmin' )
     this.showCity = true;
     else 
     this.showCity = false;   
     this.service.getServiceCity()
     .then(res=>{
       this.ServiceCity = res;
     })
    if(localStorage.getItem('userType')=='citywiseadmin') {
      if(localStorage.getItem('cityType')== 'Madurai' || localStorage.getItem('cityType')== 'Default' ){
        this.city = 'Madurai'
         this.location = this.city
      }
      else if(localStorage.getItem('cityType')== this.cityType ){
        this.city = this.cityType
        this.location = this.city
      }
    }
    else {
      commonservice.bSubject.subscribe(value => {
        AppSettings.GOOGLE_MAP_DEFAULT_LOCATION = value;
        this.location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
        this.ReloadPage();
      });
    }
 
    // GET MAP
    // this.pageStarts();
    // DROPDOWN
    // this.tok = localStorage.getItem('auth_app_token'); // localStorage.getItem('PTok')
    this.commonservice.getVehicleTypeData()
      .then(msg => {
        this.vehicleary = msg;
        if (featuresSettings.defaultVehicleInMap) {
          this.setDefaultVehicle = featuresSettings.defaultVehicleInMap;
          this.list.serviceTypeId = featuresSettings.defaultVehicleInMap;
        } else {
          this.setDefaultVehicle = msg[0].type;
          this.list.serviceTypeId = msg[0].type;
        }
        this.pageStarts(this.list.serviceTypeId);
      });
  }

  FilterRes(data) {
    if(data == "Madurai" || data == 'Default'){
      this.location = 'Madurai'
    }
    else if( data != 'all'){
      this.location = data 
    }
    else {
      this.location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
    }
    this.pageStarts(this.list.serviceTypeId);
  }

  pageStarts(id) {
    this.service.getGodsView(id,this.list.servicecity)
      .then(
        res => {
          this.positions = [];
          this.resList = [];
          this.driversCount = res ? res.length : 0;
          for (const item of res) {
            if (item.hasOwnProperty('coords')) {
              item.coords.reverse();
            }
            if (item.curStatus === 'free') {
              if (item.online === true) {
                item.image = 'assets/images/active.png';
              } else {
                item.image = 'assets/images/inactive.png';
              }
            } else if (item.curStatus === 'Accept') {
              item.image = 'assets/images/onpick.png';
            } else if (item.curStatus === 'onPickup') {
              item.image = 'assets/images/onpick.png';
            } else if (item.curStatus === 'Arrived') {
              item.image = 'assets/images/onpick.png';
            } else if (item.curStatus === 'Progress') {
              item.image = 'assets/images/progress.png';
            } else {
              item.image = 'assets/images/onpick.png';
            }
            this.resList.push(item);
            this.positions.push(item);
          }
        });
  }

  clicked({ target: marker }, post) {
    for (const ter of this.resList) {
      if (ter.coords === post) {
        this.marker = ter;
        this.marker.code = ter.code;
        this.marker.phone = ter.phone;
        marker.nguiMapComponent.openInfoWindow('iw', marker);
      }
    }
  }

  // If Dropdown Changed

  getAPI(data) {
    this.inputsearch = '';
    this.pageStarts(data);
  }

  goBack(): void {
    this.initial = 'list';
  }

  ReloadPage() {
    this.list = {};
    this.driversCount = 0;
    this.list.serviceTypeId = this.setDefaultVehicle;
    this.inputsearch = '';
    this.dropLocation = '';
    this.positions = [];
    this.resList = [];
    this.zlevel = '';
    this.zoom = AppSettings.MAP_ZOOM;
    this.location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
    this.pageStarts(this.setDefaultVehicle);
  }

  refVehicle() {
    this.service.RefreshVehicle()
    .then(res=>{
      this.toaster.showtoast('success',res.message)
    })
    .catch(res=>{
      this.toaster.showtoast('error',res.message)
    })
  }

  search() {
    this.service.getGodsView(this.list.serviceTypeId,this.list.servicecity)
      .then(
        res => {
          this.positions = [];
          this.resList = [];
          this.driversCount = res ? res.length : 0;
          for (const item of res) {
            if (item.phone === this.inputsearch || item.code === this.inputsearch) {
              // item.image = 'assets/images/progress.png';
              if (item.curStatus === 'free') {
                if (item.online === true) {
                  item.image = 'assets/images/active.png';
                } else {
                  item.image = 'assets/images/inactive.png';
                }
              } else if (item.curStatus === 'Accept') {
                item.image = 'assets/images/onpick.png';
              } else if (item.curStatus === 'onPickup') {
                item.image = 'assets/images/onpick.png';
              } else if (item.curStatus === 'Arrived') {
                item.image = 'assets/images/onpick.png';
              } else if (item.curStatus === 'Progress') {
                item.image = 'assets/images/progress.png';
              }
              this.location = item.coords;
              this.resList.push(item);
              const data = {
                coords: item.coords.reverse(),
                image: item.image,
                phone: item.phone
              };
              this.positions.push(data); // REMOVE reverse
            }
          }
        });
  }

  pin(color) {
    return {
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 2,
      scale: 1,
    };
  }

  listenDropLocation(event) {
    this.googleloc = this.doReturnFormattedAddress(event);
  }

  getfare() {
    // console.log("event")
    this.location = this.googleloc;
    this.zoom = AppSettings.MAP_ZOOM;
  }

  doReturnFormattedAddress(location) {
    if (
      typeof location.name !== 'undefined'
      && location.name !== ''
      && location.formatted_address.indexOf(location.name) < 0
    ) {
      const formattedAddressArray = location.formatted_address.split(', ');
      formattedAddressArray.shift();
      return location.name + ', ' + formattedAddressArray;
    } else {
      return location.formatted_address;
    }
  }

}
