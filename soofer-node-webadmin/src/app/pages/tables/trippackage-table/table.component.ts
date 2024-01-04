import {Component, OnInit, OnDestroy} from "@angular/core";
import {ServerDataSource} from "ng2-smart-table";
import {TableService} from "../table.service";
import {HttpClient} from "@angular/common/http";
import {Http} from "@angular/http";
import {
  AppSettings,
  inputValidation,
  featuresSettings,
  dropdown,
} from "../../../app.config";
import {CommonService} from "../../common/common.service";
import {Service} from "../../trippackage/trippackage.service";
import {ButtonToasterService} from "../../buttontoaster/buttontoaster.service";
import {Router, NavigationEnd, ActivatedRoute} from "@angular/router";
import {database} from "firebase";
import {Service as tripService} from "../../trippackage/trippackage.service";
import {NgxSpinnerService} from "ngx-spinner";
import {filter} from "rxjs/operators";

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
export class TripPackageTableComponent implements OnInit, OnDestroy {
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
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{name: "routeToAPage", title: `<i class="nb-edit"></i>`}],
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
      // scIds: {
      //   title: 'Available City',
      // },
    },
  };
  dayList: any = [];

  source: ServerDataSource;
  Doc: any = {};
  // dropdownSettings = {
  //   singleSelection: true,
  //   idField: '_id',
  //   textField: 'label',
  //   itemsShowLimit: 10,
  //   allowSearchFilter: true
  // };
  selectedScID: any;
  showCurr: boolean = false;
  showservicecity = featuresSettings.isServiceAvailable;
  dropdownSettings = dropdown.dropdownSettings;
  servicecity = featuresSettings.isServiceAvailable;
  servicecites: Array<commoninter>;
  riderAccepted: boolean;
  li: any = {};
  navigationSubscription: any;
  ServiceCity: string;
  oldVehicleList = [];

  constructor(
    private _http: HttpClient,
    http: Http,
    private service: TableService,
    private CommonSvc: CommonService,
    private RiderSvc: Service,
    private router: Router,
    private spinner: NgxSpinnerService,
    private tripservice: tripService,
    private routing: ActivatedRoute,
    private toastr: ButtonToasterService
  ) {
    this.source = new ServerDataSource(this._http, {
      endPoint: AppSettings.API_ENDPOINT + "rental",
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
      //  console.log(res)
      this.cities = res;
      this.lengthservicecities = this.cities.length;
      this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
      this.cities = this.CommonSvc.dataforscids(this.cities);
      // console.log(this.cities)
    });

    // this.service.getServiceCity()
    //   .then(res => {
    //     this.serviceCityArray = res;
    //   });

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = 'list';
      }
    });
    // this.routing.params.subscribe(params=>{
    //    if(params['_id']){
    //      this.RiderSvc.GetRiderId()
    //      .then(msg=>{

    //        msg.forEach(record=>{
    //          if(record._id==params['_id']){
    //            this.initial="";
    //          //  this.SetDocsDetails(record);
    //           //  this.startAt = new Date();
    //          }
    //        })
    //      });
    //    }
    //  })
  }

  FilterRes(data) {
    if (data === "all")
      this.source = new ServerDataSource(this._http, {
        endPoint: AppSettings.API_ENDPOINT + "rental",
      });
    else
      this.source = new ServerDataSource(this._http, {
        endPoint: AppSettings.API_ENDPOINT + "rental?scIds.name_like=" + data,
      });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
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
      this.list.cur = "";
    }
  }

  SerachDriverForCity(data): void {
    console.log(data);
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity === "undefined")
      this.source = new ServerDataSource(this._http, {
        endPoint: AppSettings.API_ENDPOINT + "rental",
      });
    else
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT + "rental?scity_like=" + data.servicecity,
      });
  }

  ngOnInit(): void {
    this.CommonSvc.getCountries()
      .then(msg => (this.countries = msg[0]["countries"]))
      .catch(msg => {
        this.toastr.showtoast("error", msg.message);
      });
  }

  // ngOnInit(): void {
  //   //console.log(window.location.hostname);
  //   // this.CommonSvc.getCurrency()
  //   //   .then(msg => this.currencyary = msg[0]['datas']);
  //   this.CommonSvc.getCountries()
  //     .then(msg => this.countries = msg[0]['countries'])
  //     .catch(msg => {
  //       this.toastr.showtoast('error', msg.message);
  //     });
  //   // this.CommonSvc.getLangs()
  //   //   .then(msg => {
  //   //     this.langary = msg[0]['datas'];
  //   //   });
  //   this.CommonSvc.getServiceAvailableCity()
  //     .then(res => {
  //       this.servicecites = res;
  //     });
  // }

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

  route(event) {
    this.newVehiclesList = [];
    this.SetDocsDetails(event.data);
    this.oldVehicleList = event.data.fixedRate;
    this.getVehicles("rental", event.data.scIds[0].name, event.data);
    this.CommonSvc.doAddFormControlNgSelectClass();
  }

  vehiclesList = [];
  newVehiclesList: any = [];
  listedVehiclesArray = [];

  getVehicles(type, data, newData) {
    this.spinner.show();
    this.tripservice
      .getVehicleByType(type, data ? data : "Default")
      .then(res => {
        this.spinner.hide();
        this.initial = "";
        this.vehiclesList = res["datas"];

        console.log("data ", res["datas"]);
        this.listedVehiclesArray = this.filterVehicles(res["datas"]);
        this.newVehiclesList = this.convertVisitingLoc(
          this.vehiclesList,
          newData.fixedRate
        );
        this.toastr.showtoast("success", res.message);
      })
      .catch(msg => {
        console.log(msg);
        this.toastr.showtoast("error", msg.message);
        this.spinner.hide();
        this.initial = "";
      });
  }
  onItemSelect(item: any) {
    console.log(item.name, "item");
    this.getVehicles("rental", item.name, {fixedRate: []});
    // this.dispCurr(item);
    // let currentCur;
    // this.serviceCity.forEach(el => {
    //   if (el._id === item._id) {
    //     currentCur = el.currency;
    //   }
    // });
    // this.list.cur = currentCur;
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

  SetDocsDetails(data: any): void {
    if (!data) {
      return;
    }
    this.selectedid = data._id;
    this.list = data;
    this.checkStatus(data.softdel);
    if (localStorage.getItem("userType") === "citywiseadmin") {
      this.list.scIds = this.CommonSvc.dataforscids(this.cities);
    }
    this.selectedScID = data.scIds;
    //this.populateState(this.selectedDocs.cnty);
    //this.populateCity(this.selectedDocs.state);
    this.list.cur = data.cur;
    // const servicecity = [];
    // // console.log(data)
    // const val = {
    //   scId: data.scIds,
    //   name: data.scity
    // };
    // servicecity.push(val);
    // this.selectedScID = servicecity;
    // data.scIds = this.CommonSvc.ReconvertionScid( data.scIds);
  }

  // populateState(state) {
  //   this.CommonSvc.GetState(state)
  //     .then(msg => {
  //       this.states = msg[0]['states'];
  //     });
  // }

  // populateCity(state) {
  //   this.CommonSvc.GetCity(state)
  //     .then(msg => {
  //       this.cities = msg[0]['cities'];
  //     });
  // }

  goBack(): void {
    this.initial = "list";
  }

  resetMyPwd(id): void {
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
  // selectedCountry(option: commoninter) {
  //   console.log(option.label);
  //   this.selectedDocs.state = '';
  //   this.selectedDocs.city = '';
  //   this.list.getCountry = option.label;
  //   // this.getStateofSelectedCountry(option.value);
  //   this.showStateDropDown();
  //   this.CommonSvc.doAddFormControlNgSelectClass();
  //   this.getStateofSelectedCountry(option.value);
  // }

  // deSelectedCountry(option: commoninter) {
  //   this.list.cntyname = '';
  //   this.list.city = '';
  //   this.list.state = '';
  //   this.list.cnty = '';
  // }

  // selectedState(option: commoninter) {
  //   this.list.statename = option.label;
  //   this.list.city = '';
  //   this.getCityofSelectedState(option.value);
  // }

  // deSelectedState(option: commoninter) {
  //   this.list.statename = '';
  //   this.list.city = '';
  //   this.list.state = '';
  // }

  selectedCity(option: commoninter) {
    this.list.cityname = option.label;
  }

  deSelectedCity(option: commoninter) {
    this.list.cityname = "";
    this.list.city = "";
  }

  // getStateofSelectedCountry(id) {
  //   this.CommonSvc.GetStateofSelectedCountry(id)
  //     .then(response => {
  //       try {
  //         this.states = response[0]['states'];
  //       } catch (e) {
  //         this.toastr.showtoast('error', e.toString());
  //       }
  //     }).catch(response => {
  //       let errorMessage = 'Something went wrong.';
  //       errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
  //       this.toastr.showtoast('error', errorMessage.toString());
  //     });
  // }

  // getCityofSelectedState(id) {
  //   this.CommonSvc.GetCity(id)
  //     .then(response => {
  //       try {
  //         this.cities = response[0]['cities'];
  //       } catch (e) {
  //         this.toastr.showtoast('error', e.toString());
  //       }
  //     }).catch(response => {
  //       let errorMessage = 'Something went wrong.';
  //       errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
  //       this.toastr.showtoast('error', errorMessage.toString());
  //     });
  // }

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
      // console.log(inputs.oldScIds);
      const promoUpdate = {
        scIds: JSON.stringify(inputs.scIds),
        oldScIds: JSON.stringify(inputs.oldScIds),
        distance: inputs.distance,
        duration: inputs.duration,
        name: inputs.name,
        _id: inputs._id,
      };
      this.RiderSvc.UpdateData(promoUpdate)
        .then(res => {
          this.toastr.showtoast("success", res.message);
        })
        .catch(res => {
          this.toastr.showtoast("error", res.message);
        });
      setTimeout(() => {
        this.initial = "list";
      }, 2000);
    }
  }

  updateVehicleRate() {
    const updateObj = {
      fixedRate: JSON.stringify(this.getVistingLocValue(this.newVehiclesList)),
      oldfixedRate: JSON.stringify(this.oldVehicleList),
    };
    this.RiderSvc.updateRentalFare(this.selectedid, updateObj)
      .then(res => {
        this.toastr.showtoast("success", res.message);
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
  }

  checkStatus(data) {
    if (data === "active") {
      this.riderAccepted = true;
    } else this.riderAccepted = false;
  }

  deleteRecord(data: any): void {
    this.RiderSvc.deleteData(data._id)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast("error", res.error.message);
      });
  }
}
