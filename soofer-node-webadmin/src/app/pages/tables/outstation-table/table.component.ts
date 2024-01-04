import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../table.service';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { AppSettings, inputValidation, featuresSettings, dropdown } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { Service } from '../../trippackage/trippackage.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { database } from 'firebase';
import { componentFactoryName, isNgTemplate } from '@angular/compiler';
import { truncate } from 'fs';
import { NgxSpinnerService } from 'ngx-spinner';

interface commoninter {
  value: string;
  label: string;
  _id: string;
  currency: string;
}
interface CommonInter {
  value: string;
  label: string;
  _id: string;
  currency: string;
}

@Component({
  selector: "ngx-smart-table",
  providers: [TableService, Service],
  templateUrl: "./smart-table.component.html",
  styles: [
    `
      nb-card {
        transform: translate3d(0, 0, 0);
      }
    `,
  ],
})
export class OutstationTableComponent implements OnInit, OnDestroy {
  countries: Array<commoninter>;
  states: Array<commoninter>;
  cities: Array<commoninter>;
  serviceCity: Array<CommonInter>;
  initial: string = "list";
  selectedid: string;
  selectedDocs: any;
  lengthservicecities: number;

  list: any = {};
  countryary: any[] = [];
  langary: any[] = [];
  currencyary: any[] = [];
  baseurl: string = AppSettings.BASEURL;
  myDid: any = {};
  validation = inputValidation;
  serviceCityArray: any = [];
  showCity: boolean;
  id: any;

  settings = {
    actions: {
      edit: false,
      delete: false,
      add: false,
      custom: [{name: "routeToPage", title: `<i class="nb-edit"></i>`}],
    },
    pager: {
      display: true,
      perPage: 10,
    },

    columns: {
      name: {
        title: "Package Name",
      },
      distance: {
        title: "Package Distance",
      },
      duration: {
        title: "Package Duration",
      },
      City: {
        title: "Available City",
        valuePrepareFunction: (cell, row) => {
          return row.scIds[0].name;
        },
      },
    },
  };

  dayList: any = [];

  source: ServerDataSource;
  Doc: any = {};
  li: any = {};
  selectedScID: any;
  showCurr: boolean = false;
  showservicecity = featuresSettings.isServiceAvailable;
  dropdownSettings = dropdown.dropdownSettings;
  servicecity = featuresSettings.isServiceAvailable;
  servicecities: Array<commoninter>;
  riderAccepted: boolean;

  navigationSubscription: any;
  ServiceCity: any;

  constructor(
    private _http: HttpClient,
    http: Http,
    private service: TableService,
    private CommonSvc: CommonService,
    private RiderSvc: Service,
    private router: Router,
    private spinner: NgxSpinnerService,
    private routing: ActivatedRoute,
    private toastr: ButtonToasterService
  ) {
    this.source = new ServerDataSource(this._http, {
      endPoint: AppSettings.API_ENDPOINT + "outstation",
    });
    if (
      featuresSettings.isCityWise === true &&
      featuresSettings.isServiceAvailable === true &&
      localStorage.getItem("userType") === "superadmin"
    )
      this.showCity = true;
    else this.showCity = false;
    this.service.getServiceCity().then(res => {
      this.ServiceCity = res;
    });
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.CommonSvc.generalfunFor("AvailbleserviceCity").then(res => {
      this.serviceCity = res;
      this.serviceCity = this.CommonSvc.dataforscids(this.serviceCity);
    });
    this.CommonSvc.getServiceAvailableCity().then(res => {
      this.cities = res;
      this.lengthservicecities = this.cities.length;
      this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
      this.cities = this.CommonSvc.dataforscids(this.cities);
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = "list";
      }
    });
  }

  FilterRes(data) {
    if (data === "all") {
      this.source = new ServerDataSource(this._http, {
        endPoint: AppSettings.API_ENDPOINT + "outstation",
      });
    } else {
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT + "outstation?scIds.name_like=" + data,
      });
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  onItemSelect(item: any) {
    console.log(item.name, "item");
    this.getVehicles("outstation", item.name, {fixedRate:[]});
    // this.dispCurr(item);
    // let currentCur;
    // this.serviceCity.forEach(el => {
    //   if (el._id === item._id) {
    //     currentCur = el.currency;
    //   }
    // });
    // this.list.cur = currentCur;
  }

  // onItemSelect(item: any) {
  //   this.dispCurr(item);
  //   let currentCur;
  //   this.serviceCity.forEach(el => {
  //     if (el._id === item._id) {
  //       currentCur = el.currency;
  //     }
  //   });
  //   this.list.cur = currentCur;
  // }

  onItemDeSelect(item: any) {
    this.dispCurr("");
  }

  dispCurr(data) {
    if (data.label === "Default") {
      this.showCurr = true;
    } else {
      this.showCurr = false;
      this.list.car = "";
    }
  }

  SearchDriverForCity(data): void {
    if (data.serviceCity === "undefined") {
      this.source = new ServerDataSource(this._http, {
        endPoint: AppSettings.API_ENDPOINT + "outstation",
      });
    } else {
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          "outstation?scity_like=" +
          data.servicecity,
      });
    }
  }

  ngOnInit(): void {
    this.CommonSvc.getCountries()
      .then(msg => (this.countries = msg[0]["countries"]))
      .catch(msg => {
        this.toastr.showtoast("error", msg.message);
      });
  }

  oldVehicleList = [];
  vehiclesList = [];
  newVehiclesList: any = [];

  roundTripVehicleList: any = [];
  oldroundTripVehicleList: any = [];

  listedVehiclesArray = [];

  route(event) {
    this.initial = "";
    this.list = {};
    this.list = event;
    this.newVehiclesList = [];
    this.roundTripVehicleList = [];
    // this.oldroundTripVehicleList = event.data.fixedRateForRoundTrip;
    this.oldVehicleList = event.data.fixedRate;
    this.getVehicles("outstation", event.data.scIds[0].name,event.data);

    this.SetDocsDetails(event.data);
    this.CommonSvc.doAddFormControlNgSelectClass();
  }

  getVehicles(type, data,newdata) {
    this.spinner.show();
    this.RiderSvc.getVehicleByType(type, data ? data : "Default")
      .then(res => {
        this.vehiclesList = res["datas"];
        this.toastr.showtoast("success",res.message);
        this.listedVehiclesArray = this.filterVehicles(res["datas"]);
        this.newVehiclesList = this.convertVisitingLoc(
          this.vehiclesList,
          newdata.fixedRate
        );
        // this.roundTripVehicleList = this.convertVisitingLocd(
        //   this.vehiclesList,
        //   data.fixedRateForRoundTrip
        // );
        this.spinner.hide();
        this.initial = "";
      })
      .catch(msg => {
        this.toastr.showtoast("error", msg.message);
        this.spinner.hide();
        this.initial = "";
      });
  }

  convertVisitingLoc(arrList, resArr) {
    const returnArr = arrList;
    const ar1 = arrList.length;
    const ar2 = resArr.length;
    for (let i = 0, len = ar1; i < len; i++) {
      for (let j = 0, len2 = ar2; j < len2; j++) {
        if (returnArr[i].type === resArr[j].name) {
          returnArr[i].type = resArr[j].name;
          returnArr[i].fixedRate = resArr[j].rate;
        }
      }
    }
    return returnArr;
  }
  convertVisitingLocd(arrList, resArr) {
    const returnArr = arrList;
    const ar1 = arrList.length;
    const ar2 = resArr.length;
    for (let i = 0, len = ar1; i < len; i++) {
      for (let j = 0, len2 = ar2; j < len2; j++) {
        if (returnArr[i].type === resArr[j].name) {
          returnArr[i].type = resArr[j].name;
          returnArr[i].fixedRateforRoundTrip = resArr[j].rate;
        }
      }
    }
    return returnArr;
  }

  filterVehicles(arr) {
    const res = arr.map(el => el.type);
    return res.join(", ");
  }

  checkVistingLoc(data) {
    return data
      .reduce(function(filtered, option) {
        if (option.fixedRate) {
          const someNewValue = true;
          filtered.push(someNewValue);
        } else {
          const someNewValue = false;
          filtered.push(someNewValue);
        }
        return filtered.length > 0 ? filtered : [true];
      }, [])
      .every(x => x);
  }

  checkVistingLocd(data) {
    return data
      .reduce(function(filtered, option) {
        if (option.fixedRateforRoundTrip) {
          const someNewValue = true;
          filtered.push(someNewValue);
        } else {
          const someNewValue = false;
          filtered.push(someNewValue);
        }
        return filtered.length > 0 ? filtered : [true];
      }, [])
      .every(x => x);
  }
  getVistingLocValued(data) {
    return data.reduce(function(filtered, option) {
      if (option.type) {
        const someNewValue = option.fixedRateforRoundTrip;
        const type = option.type;
        filtered.push({name: type, rate: someNewValue});
      }
      return filtered.length > 0 ? filtered : [];
    }, []);
  }

  getVistingLocValue(data) {
    return data.reduce(function(filtered, option) {
      if (option.type) {
        const someNewValue = option.fixedRate;
        const type = option.type;
        filtered.push({name: type, rate: someNewValue});
      }
      return filtered.length > 0 ? filtered : [];
    }, []);
  }

  SetDocsDetails(data: any): void {
    this.list = data;
    if (!data) {
      return;
    }
    this.selectedid = data._id;
    this.list = data;
    this.checkStatus(data.softdel);
    console.log(this.selectedDocs);
    this.list.cur = data.cur;
    this.selectedScID = data.scIds;
    if (localStorage.getItem("userType") === "citywiseadmin")
      this.list.scIds = this.CommonSvc.dataforscids(this.cities);
  }

  goBack(): void {
    this.initial = "list";
  }

  resetMypwd(id): void {
    this.myDid.riderid = id;
    this.RiderSvc.resetingPWD(this.myDid).then(res => {
      this.toastr.showtoast("success", res.message);
    });
  }

  showStateDropDown() {
    if (
      typeof this.list.countryId !== "undefined" &&
      this.list.countryId !== ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  selectedCity(option: commoninter) {
    this.list.cityname = option.label;
  }

  deSelectedCity(option: commoninter) {
    this.list.cityname = "";
    this.list.city = "";
  }

  updateRecord(inputs: any, id: any): void {
    if (!inputs) {
      return;
    }
    if (inputs.scIds.length <= 0 && this.servicecity === true) {
      this.toastr.showtoast("warn", "Enter Service Available City");
    } else {
      if (this.servicecity === false) {
        inputs.scIds = this.cities;
      }
      inputs.oldScIds = this.selectedScID;
      console.log(inputs.oldScIds);
      const promoUpdate = {
        scIds: JSON.stringify(inputs.scIds),
        oldScIds: JSON.stringify(inputs.oldScIds),
        distance: inputs.distance,
        duration: inputs.duration,
        name: inputs.name,
        _id: inputs._id,
      };
      this.RiderSvc.UpdateOutstation(promoUpdate)
        .then(res => {
          if(res.success==true)
            this.toastr.showtoast("success", res.message);
          else
          this.toastr.showtoast("error", res.message);

        })
        .catch(res => {
          this.toastr.showtoast("error", res.message);
        });
      setTimeout(() => {
        this.initial = " list";
      }, 2000);
    }
  }

  checkStatus(data) {
    if (data === "active") {
      this.riderAccepted = true;
    } else {
      this.riderAccepted = false;
    }
  }

  deleteRecord(data: any): void {
    this.RiderSvc.deleteOutstation(data._id)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast("error", res.error.message);
      });
  }

  updateVehicleRate() {
    const updateObj = {
      fixedRate: JSON.stringify(this.getVistingLocValue(this.newVehiclesList)),
      oldfixedRate: JSON.stringify(this.oldVehicleList),
      jouneyType: this.list.jouneyType,
      // oldfixedRateForRoundTrip: JSON.stringify(this.oldroundTripVehicleList),
      // fixedRateForRoundTrip: JSON.stringify(
      //   this.getVistingLocValued(this.roundTripVehicleList)
      // ),
    };
    this.RiderSvc.updateOutStationFare(this.selectedid, updateObj)
      .then(res => {
        this.toastr.showtoast("success", res.message);
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
  }
}
