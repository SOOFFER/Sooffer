import {Component, OnInit, ViewChild, ɵConsole} from "@angular/core";
import {CommonService} from "../../../../common/common.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ButtonToasterService} from "../../../../buttontoaster/buttontoaster.service";
import {TableService} from "../../../table.service";
import {AppSettings} from "../../../../../app.config";
import {DrawingManager} from "@ngui/map";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";
import {ServerDataSource} from "ng2-smart-table";

@Component({
  selector: "addzone",
  templateUrl: "./viewzone.component.html",
  styleUrls: ["./table.scss"],
})
export class ViewZoneComponent implements OnInit {
  userId: any;
  list: any = {};
  submitButton: boolean = false;
  selectedOverlay: any;
  @ViewChild(DrawingManager) drawingManager: DrawingManager;

  objForMap: any;
  Arr: any;
  cityAray: any = [];
  zoom = AppSettings.MAP_ZOOM;
  location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
  positions;
  pageNo: number = 0;
  paths = [];
  zonePath = [];
  pathss;
  toshow: boolean = true;
  stateName;
  place = {
    display: true,
    lat: null,
    lng: null,
  };
  as: any[];
  zoneadd: any = {};
  serviceCity: string;
  settings = {
    actions: {
      edit: false,
      delete: false,
      add: false,
      custom: [
        {name: "routeToEdit", title: `<i class="nb-edit"></i>`},
        {name: "routeToDelete", title: `<i class="nb-trash"></i>`},
      ],
    },

    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      //or something
      name: {
        title: "Name ",
      },
      // price: {
      //   title: "Price"
      // },
      serviceCity: {
        title: "Service city",
        valuePrepareFunction: (cell, row) => {
          if (row.serviceCity.length != 0) {
            return row.serviceCity[0].city;
          }
        },
      },

      // softdel: {
      //   title: "Status",
      //   valuePrepareFunction: softdel => {
      //     if (softdel == "active") return "Active";
      //     else return "InActive";
      //   }
      // }
    },
  };
  source: ServerDataSource;
  vehiclesList: any = [];
  listedVehiclesArray: any = [];
  newVehiclesList: any = [];
  serviceCityName: any;
  geo_list: any = [];
  constructor(
    private _http: HttpClient,
    private commonservice: CommonService,
    private modalService: NgbModal,
    private tableservice: TableService,
    private spinnerLoad: NgxSpinnerService,
    private toastr: ButtonToasterService
  ) {
    this.userId = parseInt(localStorage.getItem("userId"));
  }

  addZone(data, veh_list) {
  //  console.log("data",data);
    // console.log("geolist", this.addedZones);
    var dataToPass = {
      fixedPrice: veh_list,
      name: data.name,
      geometry: this.geo_list,
      servicecityId: data.servicecityId,
      _id: data._id,
    };
    console.log(dataToPass);
    // data.latlngArray = this.as;

    this.tableservice
      .updateZoneToCity(dataToPass)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
        this.deleteSelectedOverlay();
        this.zoneadd = {};
        this.submitButton = false;
      })
      .catch((response) => {
        this.toastr.showtoast("error", response.message);
      });
  }
  ngOnInit() {
    this.getAllCites();
  }
  getVehicles(type, data, newData) {
    this.commonservice
      .getDailyVehciles(data)
      .then((res) => {
        this.vehiclesList = res["datas"];

        console.log("data ", res["datas"]);
        this.listedVehiclesArray = this.filterVehicles(res["datas"]);
        this.newVehiclesList = this.convertVisitingLoc(
          this.vehiclesList,
          newData.fixedPrice
        );
        this.toastr.showtoast("success", res.message);
      })
      .catch((msg) => {
        console.log(msg);
        this.toastr.showtoast("error", msg.message);
      });
  }
  filterVehicles(arr) {
    const res = arr.map((el) => el.type);
    return res.join(", ");
  }
  checkVistingLoc(data) {
    return data
      .reduce(function (filtered, option) {
        if (option.fixedRate) {
          const someNewValue = true;
          filtered.push(someNewValue);
        } else {
          const someNewValue = false;
          filtered.push(someNewValue);
        }
        return filtered.length > 0 ? filtered : [true];
      }, [])
      .every((x) => x);
  }

  convertVisitingLoc(arrList, resArr) {
    console.log(arrList, resArr);
    const returnArr = arrList;
    const ar1 = arrList.length;
    const ar2 = resArr.length;
    for (let i = 0, len = ar1; i < len; i++) {
      for (let j = 0, len2 = ar2; j < len2; j++) {
        if (returnArr[i].type === resArr[j].type) {
          // console.log("Coming")
          returnArr[i].type = resArr[j].type;
          returnArr[i].fixedRate = resArr[j].fixedRate;
        }
      }
    }
    // console.log(returnArr, "returnArr");
    return returnArr;
  }
  goBack() {
    // this.getAllCites();
    this.list.cityId = this.serviceCityName;
    this.pageNo = 0;
  }

  route(event) {
    // console.log(event);
    if (event.action == "routeToDelete") {
      this.deleteZoneSet(event.data._id);
    } else {
      this.pageNo = 1;
      this.list = event.data;
      this.paths = [];
      if (event.data.serviceCity[0].cityBoundaryPolygon != null) {
        if (event.data.serviceCity[0].cityBoundaryPolygon.length > 0) {
          event.data.serviceCity[0].cityBoundaryPolygon.forEach(
            (element, index) => {
              const latlng = {lat: element[1], lng: element[0]};
              this.paths.push(latlng);
            }
          );
        }
      }
      if (event.data.geometry != null) {
        if (event.data.geometry.length > 0) {
          this.geo_list = event.data.geometry;
          this.getZones(this.geo_list);
        }
      }
      this.getVehicles("daily", event.data.serviceCity[0].city, event.data);
    }
  }
  addedZones: any = [];
  getZones(data) {
    this.addedZones = [];
    const zone = [];
    const count = data ? data.length : 0;
    if (count > 0) {
      data.forEach((el) => {
        const c = this.returnLatLngForZones(el);
        zone.push({latlngs: c});
      });
      this.addedZones = zone;
    } else {
      this.addedZones = [];
    }
    console.log(this.addedZones, "     this.addedZones ");
  }
  returnLatLngForZones(data) {
    const latlngsArray = [];
    data.forEach((element, index) => {
      const latlng = {lat: element[1], lng: element[0]};
      latlngsArray.push(latlng);
    });
    return latlngsArray;
  }

  getWindow(data) {
    // console.log(data);
    // console.log(data.latLng.lat());
    // console.log(data.latLng.lng());
  }
  getAPI(data) {
    this.cityAray.forEach((element) => {
      if (element.city === data) {
        this.serviceCity = element._id;
        this.serviceCityName = element.city;
      }
    });
    this.source = new ServerDataSource(this._http, {
      endPoint: AppSettings.API_ENDPOINT + "zone/" + this.serviceCity,
    });
  }

  setPoints(event) {
    this.as = [];
    let t: any = {};
    t = event.latLngs.j[0].j;
    for (const ty of t) {
      let tr = [];
      tr = [parseFloat(ty.lng().toString()), parseFloat(ty.lat().toString())];
      this.as.push(tr);
    }
    this.submitButton = true;
    console.log(this.as, "  this.as ");
  }
  getPoints(event, i) {
    this.as = [];
    // console.log(this.geo_list[i], this.addedZones[i]);
    for (let i = 0; i < event.target.getPath().getLength(); i++) {
      let tr = [];
      tr = [
        parseFloat(event.target.getPath().getAt(i).lng().toString()),
        parseFloat(event.target.getPath().getAt(i).lat().toString()),
      ];
      this.as.push(tr);
    }
    this.geo_list[i] = this.as;
    // console.log(this.as);
  }
  getAllCites() {
    this.tableservice
      .getAvailbleserviceCity()
      .then((response) => {
        try {
          this.cityAray = response;
          this.list.cityId = this.cityAray[0].city;
          this.getAPI(this.list.cityId);
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((response) => {
        this.spinnerLoad.hide();
        let errorMessage = "Something went wrong.";
        errorMessage = this.commonservice.doCatchExceptionalErrorsForGivingErrorNotice(
          errorMessage,
          response
        );
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }
  deleteSelectedOverlay() {
    console.log(this.selectedOverlay);
    if (this.selectedOverlay) {
      this.selectedOverlay.setMap(null);
      delete this.selectedOverlay;
      this.as = [];
      this.submitButton = false;
    }
  }
  deleteZoneSet(id) {
    this.tableservice
      .deleteZone(id)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
        this.source.refresh();
      })
      .catch((response) => {
        this.toastr.showtoast("error", response.message);
      });
  }
  openVerticallyCentered(content) {
    if (this.as.length == 0)
      this.toastr.showtoast("warn", "Draw A Zone please.");
    this.modalService.open(content, {size: "lg"});
  }

  submitted(d) {
    d("Cross click");
  }

  closed(d) {
    d("Cross click");
  }
}
