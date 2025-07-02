import { Component, OnInit } from "@angular/core";
import { featuresSettings, AppSettings } from "../../../app.config";
import { ServerDataSource } from "ng2-smart-table";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { TripsService } from "../tripdetails.service";
import { ButtonToasterService } from "../../buttontoaster/buttontoaster.service";

@Component({
  selector: "ngx-ongoing-trips",
  templateUrl: "./ongoing-trips.component.html",
  styleUrls: ["./ongoing-trips.component.scss"]
})
export class OngoingTripsComponent implements OnInit {

  currentIndex: any = 0;
  navigationSubscription: any;
  settings = {

    actions: {
      edit: false,
      delete: false,
      add: false,
      custom: [{ name: "routeToAPage", title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },
    columns: {
      triptype: {
        title: "Trip Type"
      },
      tripno: {
        title: "Trip No"
      },
      date: {
        title: "Date"
      },
      dvr: {
        title: "Driver",
        valuePrepareFunction: (cell, row) => {
          return row.dvr ? row.dvr : "N/A";
        }
      },
      rid: {
        title: "Rider"
      },
      "csp.cost": {
        title: "Fare",
        valuePrepareFunction: (cell, row) => {
          return row.csp["cost"];
        }
      },
      vehicle: {
        title: "Vehicle Type",
        valuePrepareFunction: vehicle => {
          return vehicle ? vehicle : "N/A";
        }
      },
      status: {
        title: "Trip Status",
        // width: "60px",
        filter: false
      },
      "csp.via": {
        title: "Payment Mode",
        type: "number",
        filter: {
          type: "list",
          config: {
            selectText: "All",
            list: [{ value: "card", title: "Card" }, { value: "cash", title: "Cash" }]
          }
        },
        valuePrepareFunction: (cell, row) => {
          return row.csp["via"];
        }
      }
    }
  };
  initial: number = 0;
  source: ServerDataSource;
  serviceCityArray: any = [];
  showCity: boolean;
  brobj;
  data: any;
  Doc: any = {};
  fields: any;
  tripdetailsId: string;

  constructor(public http: HttpClient, private toastr: ButtonToasterService, private tripservice: TripsService,private router: Router,) {
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + "ongoingTrips" });
    this.showServiceCity();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = 0;
      }
    });
  }

  showServiceCity() {
    if (
      featuresSettings.isCityWise === true &&
      featuresSettings.isServiceAvailable === true &&
      localStorage.getItem("userType") === "superadmin"
    ) {
      this.showCity = true;
    } else {
      this.showCity = false;
    }
    this.tripservice.getServiceCity().then(res => {
      this.serviceCityArray = res;
    });
  }

  SerachForCity(data): void {
    if (data.servicecity === "undefined" || data.servicecity == "all")
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + "ongoingTrips" });
    else
      this.source = new ServerDataSource(this.http, {
        endPoint: AppSettings.API_ENDPOINT + "ongoingTrips?scity_like=" + data.servicecity
      });
  }

  ngOnInit() { }

  /** Invoice Page */

  route(event) {
    this.initial = 1;
    console.log(" console.log", this.source.getPaging().perPage)
    const temp = document.querySelector('li.active');
    console.log(temp)
    if (temp) {
      const child = temp.children
      if (child[0] && child[0].childNodes[0] && child[0].childNodes[0].nodeValue) {
        const ind = child[0].childNodes[0].nodeValue;
        this.currentIndex = parseInt(ind);
      }
      console.log("this.currentIndex", this.currentIndex);
    }
    this.tripdetailsId = event.data._id;
    this.fields = this.tripdetailsId;
  }

  goBack() {
    this.initial = 0;
    setTimeout(() => this.source.setPage(this.currentIndex), 0);
  }

  getFields() {
    return this.fields;
  }
}
