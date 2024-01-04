import { Component, ViewChild } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from "../table.service";
import { DatePipe, Location } from '@angular/common';
import { AppSettings } from "../../../app.config";
import { CommonService } from "../../common/common.service";
import { ButtonToasterService } from "../../buttontoaster/buttontoaster.service";
import { filter } from 'lodash';
import * as moment from "moment";

@Component({
    selector: 'ngx-smart-table',
    providers: [TableService, CommonService, ButtonToasterService],
    templateUrl: './smart-table.component.html',
    styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  },
  .invoice{
    padding-top: 45px !important;
  }
  `],
})

export class DriverDailyAttendance {
    title: string = 'Driver Daily Attendance';
    initial: number = 0;
    private baseurl = AppSettings.BASEURL;
    selectedid: any;
    dateObj: any;
    selectedDocs: any = {};
    settings = {
        actions: {
            edit: false, //as an example
            delete: false, //as an example
            add: false, //as an example
            custom: [{ name: 'routeToAPage', title: `<i class="nb-trash"></i>` }]
        },
        pager: {
            display: true,
            perPage: 10,
        },
        columns: {
            code: {
                title: "Driver Code",
                filter: true,
            },
            date: {
                title: "Date",
                // valuePrepareFunction: (row) => moment(row).format('YYYY-MMM-DD h:mm A'),
                valuePrepareFunction: (row) => moment(row)
                    .subtract(moment(row).utcOffset(), 'minutes').format('YYYY-MMM-DD h:mm A'),

                filter: false

            },
            faceSimalarityPercentage: {
                title: "Face Comparison Percentage",
                filter: false,
            },
            image: {
                title: 'Driver Image',
                type: 'html',
                valuePrepareFunction: (file: string) => `<img width="50px" src="${this.baseurl + file}" alt='icon' />`,
                filter: false
            },
        },
    };

    source: ServerDataSource;
    filedata: any;
    list: any = {};
    dbBackId: any;


    constructor(
        private _http: HttpClient,
        private service: TableService,
        private toastr: ButtonToasterService,
        private location: Location,
        private datePipe: DatePipe,
        private CommonSvc: CommonService
    ) {
        const date = new Date();
        this.display();
        this.dateObj = {};
        this.list.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
        this.list.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.dateObj.fromDate = moment(this.list.fromDate).format('YYYY-MM-DD');
        this.dateObj.toDate = moment(this.list.toDate).format('YYYY-MM-DD');

    }

    display() {
        this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'DriverAttendance' });
    }

    @ViewChild('dataForm1') form: any;

    fileEvent(e) {
        this.filedata = e.target.files[0];
    }

    ngOnInit(): void { }

    btBack(num: number): void {
        this.initial = num;
        this.list = {};
    }

    route(event) {
        this.dbBackId = event.data._id;
        this.deletebannerimage();
    }

    deletebannerimage(): void {
        // const ndata = { 'id':this.dbBackId};
        this.CommonSvc.Deletedriverdailyattendance(this.dbBackId).then(msg => {
            this.toastr.showtoast("success", msg.message);
            this.display();
        })
            .catch(msg => {
                this.toastr.showtoast("error", msg.message);
            })
    }

    logDate(msg) {
        this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
        console.log('101010101010101101010101010', this.dateObj)
    }

    filterRes(data) {

        console.log(data);
        if (data.fromDate && data.toDate) {
            const fromDate = this.dateObj['fromDate'];
            const toDate = this.dateObj['toDate'];
            this.source = new ServerDataSource(this._http, {
                endPoint:
                    AppSettings.API_ENDPOINT +
                    'DriverAttendance?fromDate=' +
                    fromDate +
                    '&toDate=' +
                    toDate
                // +
                // "&requestFrom=" +
                // "without_limit",
            });
        }


        //   if (
        //     this.dateObj['fromDate'] === undefined ||
        //     this.dateObj['toDate'] === undefined
        //   ) {
        //     this.toastr.showtoast('warn', 'Select Both From Date and To Date');
        //   } else {
        //     const fromDate = this.dateObj['fromDate'];
        //     const toDate = this.dateObj['toDate'];
        //     this.source = new ServerDataSource(this._http, {
        //       endPoint:
        //         AppSettings.API_ENDPOINT +
        //         'subscriptionHistory?endDate_gte=' +
        //         fromDate +
        //         '&endDate_lte=' +
        //         toDate
        //       // +
        //       // "&requestFrom=" +
        //       // "without_limit",
        //     });
        //   }

    }

}
