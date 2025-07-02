import { Component, OnInit, ViewChild, ɵConsole } from "@angular/core";
import { CommonService } from "../../../../common/common.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ButtonToasterService } from "../../../../buttontoaster/buttontoaster.service";
import { TableService } from "../../../table.service";
import { AppSettings } from "../../../../../app.config";
import { DrawingManager } from "@ngui/map";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  templateUrl: "./airportzone.component.html"
})
export class AddAirportZoneComponent implements OnInit {
 
  userId: any;
  list: any = {}
  submitButton: boolean = false;
  selectedOverlay: any;
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

  addZone(data)
  {
     this.as = [];
    let t: any = {};
    t = this.selectedOverlay.latLngs.j[0].j;
    for (const ty of t) {
      let tr = [];
      tr = [parseFloat(ty.lng().toString()), parseFloat(ty.lat().toString())];
      this.as.push(tr);

    }
    this.as[this.as.length] = this.as[0];
    data.latlngArray = this.as;
    data.servicecityId = this.serviceCity;
    console.log(data);
    this.tableservice.addAirZoneToCity(data)
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
    this.initial();
  }
  initial()
  {
      this.drawingManager['initialized$'].subscribe(dm => {
      google.maps.event.addListener(dm, 'overlaycomplete', event => {
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          dm.setDrawingMode(null);
          google.maps.event.addListener(event.overlay, 'click', e => {
            this.selectedOverlay = event.overlay;
            this.selectedOverlay.setEditable(true);
            console.log(this.selectedOverlay)
          });
          this.selectedOverlay = event.overlay;
        }
      });
    });
  }
  addSelectedOverlay()
  {
 console.log(this.selectedOverlay)
  }
   getWindow(data) {
    // console.log(data);
    // console.log(data.latLng.lat());
    // console.log(data.latLng.lng());
  }
  // API REQUEST
  getAPI(data) {
    this.cityAray.forEach(element => {
      if (element.city === data)
      {
        this.serviceCity = element._id;     
      }
    });
       this.paths = [];
    this.commonservice.getBoundryPolygon(data).then(response => {
      if (response.data[0].cityBoundaryPolygon != null) {
        if (response.data[0].cityBoundaryPolygon.length > 0) {
          response.data[0].cityBoundaryPolygon.forEach((element, index) => {
            const latlng = { lat: element[1], lng: element[0] };
            this.paths.push(latlng);
          });
          this.toshow = true;
          console.log("  this.paths",  this.paths)
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
      
  }

  setPoints(event) {
  console.log("event",event)

    this.as = [];
    let t: any = {};
    t = event.latLngs.j[0].j;
    for (const ty of t) {
      let tr = [];
      tr = [parseFloat(ty.lng().toString()), parseFloat(ty.lat().toString())];
      this.as.push(tr);
    }
    this.submitButton = true;
    console.log(  this.as ,"  this.as ")
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
      .then(response => {
        try {
          this.cityAray = response;
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
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
     console.log(this.selectedOverlay)
    if (this.selectedOverlay) {
      this.selectedOverlay.setMap(null);
      delete this.selectedOverlay;
      this.as = [];
      this.submitButton = false;
    }
  }

  openVerticallyCentered(content) {
    if (!this.list.cityId )
      this.toastr.showtoast("warn","Select City.")
      
   else  if (this.as.length==0)
      this.toastr.showtoast("warn", "Draw A Zone please.")
     
else
    this.modalService.open(content, { size: 'lg' });
  }

 

  submitted(d) {
    d('Cross click');
  }

  closed(d) {
    d('Cross click');
  }
 
}
