import { Component, OnInit } from "@angular/core";
import { featuresSettings, AppSettings } from "../../../app.config";
import { ServerDataSource } from "ng2-smart-table";
import { HttpClient } from "@angular/common/http";
import { TripsService } from "../tripdetails.service";
import { ButtonToasterService } from "../../buttontoaster/buttontoaster.service";
import { Angular2Csv } from "angular2-csv";

@Component({
  selector: "ngx-payment-failed-trips",
  templateUrl: "./payment-failed-trips.component.html",
  styleUrls: ["./payment-failed-trips.component.scss"]
})
export class PaymentFailedTripsComponent implements OnInit {
  currentIndex: any = 0;
  initial: number = 0;
  options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    headers: ["Trip Type", "Trip No", "Date", "Rider", "Fare", "Vehicle Type", "Status", "Payment Via"],
    showTitle: true,
    title: "No Response Trip Report",
    useBom: true,
    removeNewLines: false,
    keys: ["triptype", "tripno", "date", "rid", "fare", "vehicle", "status", "Payment"]
  };
  reportname = "No Response Trip_Details" + Date();
  settings = {
    // actions: false,
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
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
      rid: {
        title: "Rider"
      },
      fare: {
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
        filter: {
          type: "list",
          config: {
            selectText: "All",
            list: [{ value: "noresponse", title: "Noresponse" }, { value: "Cancelled", title: "Cancelled" }]
          }
        }
      },
      "csp.via": {
        title: "Payment Mode",
        filter: {
          type: "list",
          config: {
            selectText: "All",
            list: [{ value: "card", title: "Card" }, { value: "cash", title: "Cash" }]
          }
        },
        valuePrepareFunction: (cell, row) => {
          return row.csp["via"] ? row.csp["via"] : "N/A";
        }
      }
    }
  };

  source: ServerDataSource;
  serviceCityArray: any = [];
  showCity: boolean;
  brobj;
  data: any;
  Doc: any = {};
  fields: any;
  tripdetailsId: string;

  constructor(public http: HttpClient, private toastr: ButtonToasterService, private tripservice: TripsService) {
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + "cardPaymentFailedTrips" });
    this.showServiceCity();
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
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity === "undefined" || data.servicecity == "all")
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + "cardPaymentFailedTrips" });
    else
      this.source = new ServerDataSource(this.http, {
        endPoint: AppSettings.API_ENDPOINT + "cardPaymentFailedTrips?scity_like=" + data.servicecity
      });
  }

  ExportAsCSV() {
    this.brobj = [];
    this.http
      .get(AppSettings.API_ENDPOINT + "cardPaymentFailedTrips?_page=1&_limit=1000")
      .toPromise()
      .then(res => {
        this.data = res;
        this.data.forEach(element => {
          element.Payment = element.csp.via;
          this.brobj.push(element);
        });
        this.export(this.brobj);
      })
      .catch(err => {
        this.toastr.showtoast("error", err.message);
      });
  }

  export(data) {
    new Angular2Csv(data, this.reportname, this.options);
  }

  ngOnInit() { }

  /** Invoice Page */

  route(event) {
    this.initial = 1;
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
