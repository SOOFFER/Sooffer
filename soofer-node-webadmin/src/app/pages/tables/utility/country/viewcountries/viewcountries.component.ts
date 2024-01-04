import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { AppSettings } from '../../../../../app.config';
import { CommonService } from '../../../../common/common.service';
import { UtilityService } from '../../utility.service';

@Component({
  selector: 'viewcountries',
  templateUrl: './viewcountries.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `]
})
export class ViewcountriesComponent implements OnInit {

  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [
        { name: 'routeToAPage', title: `<i class="nb-edit"></i>` },
        // { name: 'routeToDelete', title: `<i class="nb-trash"></i>` }
      ]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      name: {
        title: 'Country Name',
      },
      sortname: {
        title: 'Country Code',
      },
      phoneCode: {
        title: 'Phone Code',
      },
      currencyName: {
        title: "Currency Name"
      },
      currencyCode: {
        title: "Currency Code"
      },
      status: {
        title: 'Status',
        valuePrepareFunction: (status) => {
          if (status == true) return "Active";
          else return "Inactive";
        }
      }
    },
  };

  source: ServerDataSource;
  userId: Number;
  TripArr = [];
  initial: any = "list";
  // template
  list: any = {};
  newlist: any = {};
  selectedid: string;
  selectedDocs: any;
  spinner: boolean = true;

  constructor(_http: HttpClient, private toastr: ButtonToasterService, private http: Http, private Service: UtilityService, private commonsrv: CommonService) {
    this.userId = parseInt(localStorage.getItem('userId'));
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'countriesForAdminUiCRUD' });
    //console.log(this.source)
  }

  ngOnInit() {

  }

  route(event) {
    this.SetDocsDetails(event.data);
    this.initial = "";
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.selectedid = data.id;
    this.selectedDocs = data;
    //console.log(this.selectedDocs);
  }

  goback() {
    this.initial = "list";
  }

  UpdateNewDoc(inputs: any): void {
    if (!inputs) { return; }
    this.spinner = false;
    let obj = {
      name: inputs.name,
      sortname: inputs.sortname,
      phoneCode: inputs.phoneCode,
      currencyCode: inputs.currencyCode,
      currencyName: inputs.currencyName,
      status: inputs.status,
      userId: this.userId,
      id: this.selectedid
    }
    //console.log(obj)
    this.Service.updateCountry(obj)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.spinner = true;
        //this.CountryUpdation()
        this.initial = "list";
      })
      .catch(err => {
        let error = JSON.parse(err._body)
        this.toastr.showtoast("error", error.message);
        this.spinner = true;
      })
  }

  DeleteDoc(data: any): void {
    this.spinner = false;
    this.Service.deleteCountry(data)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.spinner = true;
        // this.CountryUpdation()
        this.initial = "list";
      })
      .catch(err => {
        let error = JSON.parse(err._body)
        this.toastr.showtoast("error", error.message);
        this.spinner = true;
      })
  }

}
