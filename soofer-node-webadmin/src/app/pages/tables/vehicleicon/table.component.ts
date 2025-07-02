import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../table.service';
import { Http } from '@angular/http';
import { AppSettings } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'ngx-smart-table',
  providers: [TableService],
  templateUrl: './smart-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})
export class VehicleIconTableComponent {
  title: String = "Vehicle Icons";
  initial: number = 1;
  selectedid: string;
  selectedDocs: any;
  list: any = {};
  selectedTaxi: any;
  singleTaxi: any;
  cityary: any;
  baseurl: string = AppSettings.BASEURL;
  apiMessage: string;
  clearMsg(): void {
    this.apiMessage = "";
  }
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },

    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      sno: {
        title: 'Type',
      },

      image: {
        title: 'Icon',
        type: 'html',
     
        valuePrepareFunction: (image: string) => `<img width="50px" src="${this.baseurl + image}" alt='icon' />`
      },
    },
  };
  source: ServerDataSource;

  constructor(_http:HttpClient , http: Http, private service: TableService, private CommonSvc: CommonService, private toastr: ButtonToasterService) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'vehicleIcon' });
  }

  ngOnInit(): void {
 
  }

  route(event) {
    this.SetDocsDetails(event.data);
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.selectedid = data._id;
    this.selectedDocs = data;
    this.initial=3;
    // console.log(this.selectedDocs);
  }
  goBack(): void {
    this.initial = 1;
  }
  filedata: any;
  fileEvent(e) {
    this.filedata = e.target.files[0];
  }
  addRecord(): void {

    let formdata = new FormData();
    // formdata.append("_id", this.selectedid);
    formdata.append("file", this.filedata);

    this.service.addIconData(formdata)
      .then(msg => {
        this.apiMessage = msg.message;
        this.toastr.showtoast("success", msg.message);
      })
  }
  deleteRecord(data: any): void {
    console.log(data)
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteIconData(this.selectedid )
        .then(res => {
          this.apiMessage = res.message;
          this.toastr.showtoast("success", res.message);
          this.initial = 1;
        })
    }
  }
  btnClick() {
    this.initial = 2;
  }
}
