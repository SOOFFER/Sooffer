import {Component, OnInit, ViewChild, ɵConsole} from "@angular/core";
import {CommonService} from "../../../../common/common.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ButtonToasterService} from "../../../../buttontoaster/buttontoaster.service";
import {TableService} from "../../../table.service";
import {AppSettings} from "../../../../../app.config";
import {DrawingManager} from "@ngui/map";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

// tslint:disable-next-line: class-name
interface commonDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: "addzone",
  templateUrl: "./addzone.component.html",
})
export class AddZoneComponent implements OnInit {
  userId: any;
  list: any = {};
  submitButton: boolean = false;
  selectedOverlay: any = [];
  @ViewChild(DrawingManager) drawingManager: DrawingManager;

  objForMap: any;
  Arr: any;
  cityAray: any = [];
  zoom = AppSettings.MAP_ZOOM;
  location = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;
  positions;
  paths = [];
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
  service_city: any;
  constructor(
    private commonservice: CommonService,
    private route: Router,
    private modalService: NgbModal,

    private tableservice: TableService,
    private spinnerLoad: NgxSpinnerService,

    private toastr: ButtonToasterService
  ) {
    // tslint:disable-next-line: radix
    this.userId = parseInt(localStorage.getItem("userId"));
  }
  list_Vehicle: any = {};
  vehiclesList = [];
  listedVehiclesArray: any = [];
  getVehcileList(cityData: String) {
    this.commonservice
      .getDailyVehciles(cityData)
      .then((res) => {
        console.log(res);
        this.vehiclesList = res["datas"];
        this.listedVehiclesArray = this.filterVehicles(res["datas"]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  filterVehicles(arr) {
    const res = arr.map((el) => el.type);
    return res.join(", ");
  }
  newSetOfplygon: any = [];
  addZone(data, vehiclelist) {
    console.log(vehiclelist);
    console.log(this.service_city);
    console.log(this.newSetOfplygon);
    var dataToPass = {
      fixedPrice: vehiclelist,
      name: data.name,
      geometry: this.newSetOfplygon,
      servicecityId: this.serviceCity,
    };
    this.tableservice
      .addZoneToCity(dataToPass)
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
    this.initial();
  }
  initial() {
    this.drawingManager["initialized$"].subscribe((dm) => {
      google.maps.event.addListener(dm, "overlaycomplete", (event) => {
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          dm.setDrawingMode(null);
          google.maps.event.addListener(event.overlay, "click", (e) => {
            this.selectedOverlay.push(event.overlay);
            this.selectedOverlay[this.selectedOverlay.length - 1].setEditable(
              true
            );
          });
          // this.selectedOverlay = event.overlay;
          this.selectedOverlay.push(event.overlay);
          console.log("fdfdfd", this.selectedOverlay);
        }
      });
    });
  }
  addSelectedOverlay() {
    console.log(this.selectedOverlay);
  }
  getWindow(data) {
    // console.log(data);
    // console.log(data.latLng.lat());
    // console.log(data.latLng.lng());
  }
  // API REQUEST
  getAPI(data) {
    // this.getVehcileList(this.service_city);
    this.commonservice
      .getDailyVehciles(data)
      .then((res) => {
        console.log(res);
        this.vehiclesList = res["datas"];
        if (this.vehiclesList.length != 0) {
          this.listedVehiclesArray = this.filterVehicles(res["datas"]);
          this.cityAray.forEach((element) => {
            if (element.city === data) {
              this.serviceCity = element._id;
            }
          });
          this.paths = [];
          this.commonservice.getBoundryPolygon(data).then((response) => {
            if (response.data[0].cityBoundaryPolygon != null) {
              if (response.data[0].cityBoundaryPolygon.length > 0) {
                response.data[0].cityBoundaryPolygon.forEach(
                  (element, index) => {
                    const latlng = {lat: element[1], lng: element[0]};
                    this.paths.push(latlng);
                  }
                );
                this.toshow = true;
                console.log("  this.paths", this.paths);
              } else {
                // console.log(response.data[0].cityBoundaryPolygon, 'false1');
                this.toshow = false;
                this.paths = [];
              }
            } else {
              // console.log(response.data[0].cityBoundaryPolygon, 'false2');
              this.toshow = false;
              this.paths = [];
            }
          });
        } else {
            this.toshow = false;
            this.paths = [];
          this.toastr.showtoast("error", "No Daily Vehicle Found");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.service_city = data;
    // console.log(data, "data");
  }

  setPoints(event) {
    // console.log("event", event);
    this.as = [];
    for (let i = 0; i < event.getPath().getLength(); i++) {
      let tr = [];
      tr = [
        parseFloat(event.getPath().getAt(i).lng().toString()),
        parseFloat(event.getPath().getAt(i).lat().toString()),
      ];
      this.as.push(tr);
    }
    this.submitButton = true;
    this.newSetOfplygon.push(this.as);
    // console.log(this.newSetOfplygon);
  }
  getPoints(event) {
    // this.as = [];
    // let t: any = {};
    // t = event.target.latLngs.j[0].j;
    // for (const ty of t) {
    //   let tr = [];
    //   tr = [parseFloat(ty.lng().toString()), parseFloat(ty.lat().toString())];
    //   this.as.push(tr);
    //   // this.as.push(ty.lat().toString() + ' ' + ty.lng().toString())
    // }
  }
  getAllCites() {
    this.tableservice
      .getAvailbleserviceCity()
      .then((response) => {
        try {
          this.cityAray = response;
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
      this.selectedOverlay.forEach((overlay, index) => {
        this.selectedOverlay[index].setMap(null);
      });
      delete this.selectedOverlay;
      this.as = [];
      this.submitButton = false;
    }
  }

  openVerticallyCentered(content) {
    if (!this.list.cityId) this.toastr.showtoast("warn", "Select City.");
    else if (this.as.length == 0)
      this.toastr.showtoast("warn", "Draw A Zone please.");
    else this.modalService.open(content, {size: "lg"});
  }

  submitted(d) {
    d("Cross click");
  }

  closed(d) {
    d("Cross click");
  }
}
