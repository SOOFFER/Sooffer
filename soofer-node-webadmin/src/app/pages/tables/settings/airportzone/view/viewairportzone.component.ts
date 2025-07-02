import { Component, OnInit, ViewChild, ɵConsole } from "@angular/core";
import { CommonService } from "../../../../common/common.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ButtonToasterService } from "../../../../buttontoaster/buttontoaster.service";
import { TableService } from "../../../table.service";
import { AppSettings } from "../../../../../app.config";
import { DrawingManager } from "@ngui/map";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";
import { ServerDataSource } from "ng2-smart-table";

@Component({
  selector: "addzone",
  templateUrl: "./viewairportzone.component.html",
  styleUrls: ["./table.scss"]
})
export class ViewAirportZoneComponent implements OnInit {
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
    lng: null
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
        { name: "routeToEdit", title: `<i class="nb-edit"></i>` },
        { name: "routeToDelete", title: `<i class="nb-trash"></i>` }
      ]
    },

    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      //or something
      name: {
        title: "Name "
      },
      price: {
        title: "Price"
      },
      serviceCity: {
        title: "Service city",
        valuePrepareFunction: (cell, row) => {
          if (row.serviceCity.length != 0) {
            return row.serviceCity[0].city;
          }
        }
      },

      // softdel: {
      //   title: "Status",
      //   valuePrepareFunction: softdel => {
      //     if (softdel == "active") return "Active";
      //     else return "InActive";
      //   }
      // }
    }
  };
  source: ServerDataSource;

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

  addZone(data) {
    data.latlngArray = this.as;

    this.tableservice
      .updateAirZoneToCity(data)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.deleteSelectedOverlay();
        this.zoneadd = {};
        this.submitButton = false;
      })
      .catch(response => {
        this.toastr.showtoast("error", response.message);
      });
  }
  ngOnInit() {
    this.getAllCites();
  }

  route(event) {
    console.log(event);
    if (event.action == "routeToDelete") {
   
      this.deleteZoneSet(event.data._id);

    } else {
      this.pageNo = 1;
      this.list = event.data;
      this.paths = [];
      if (event.data.serviceCity[0].cityBoundaryPolygon != null) {
        if (event.data.serviceCity[0].cityBoundaryPolygon.length > 0) {
          event.data.serviceCity[0].cityBoundaryPolygon.forEach((element, index) => {
            const latlng = { lat: element[1], lng: element[0] };
            this.paths.push(latlng);
          });
        }
      }
      if (event.data.geometry != null) {
        if (event.data.geometry.coordinates.length > 0) {
          this.zonePath = [];
          event.data.geometry.coordinates[0].forEach((element, index) => {
            // console.log(element,"element")
            const latlng = { lat: element[1], lng: element[0] };
            this.zonePath.push(latlng);
          });
        }
        this.as = this.zonePath;
        //  console.log( this.zonePath," this.zonePath")
      }
    }
  }
    getWindow(data) {
    // console.log(data);
    // console.log(data.latLng.lat());
    // console.log(data.latLng.lng());
  }
  getAPI(data) {
    this.cityAray.forEach(element => {
      if (element.city === data) {
        this.serviceCity = element._id;
      }
    });
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + "airportZone/" + this.serviceCity });
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
  getPoints(event) {
    this.as = [];
    let t: any = {};
    t = event.target.latLngs.j[0].j;
    for (const ty of t) {
      let tr = [];
      tr = [parseFloat(ty.lng().toString()), parseFloat(ty.lat().toString())];
      this.as.push(tr);
      // this.as.push(ty.lat().toString() + ' ' + ty.lng().toString())
    }
    // console.log( this.as)
  }
  getAllCites() {
    this.tableservice
      .getAvailbleserviceCity()
      .then(response => {
        try {
          this.cityAray = response;
          if(this.cityAray.length!=0)
       {   this.list.cityId = this.cityAray[0].city;
          this.getAPI(this.list.cityId);}
        } catch (e) {
          this.toastr.showtoast("error", e.message);
        }
      })
      .catch(response => {
        this.spinnerLoad.hide();
        let errorMessage = "Something went wrong.";
        errorMessage = this.commonservice.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
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
      this.tableservice.deleteAirZone(id)
        .then(res => {
        this.toastr.showtoast("success", res.message);
          this.source.refresh();        
         })
      .catch(response => {
        this.toastr.showtoast("error", response.message);
      });
     
  }
  openVerticallyCentered(content) {
    if (this.as.length == 0) this.toastr.showtoast("warn", "Draw A Zone please.");
    this.modalService.open(content, { size: "lg" });
  }

  submitted(d) {
    d("Cross click");
  }

  closed(d) {
    d("Cross click");
  }
}
