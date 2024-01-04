import { Component } from '@angular/core';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { TableService } from '../table.service';
import { Ng2SmartTableModule, ServerDataSource } from 'ng2-smart-table'
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppSettings, featuresSettings } from '../../../app.config';
import { DatePipe } from '@angular/common';
import { Server } from 'selenium-webdriver/safari';


@Component({
    selector: 'Driver-Duty-Report',
    templateUrl: './driver-duty-report.component.html'
})

export class DriverDutyReportComponent {

    list: any = {};
    source: ServerDataSource

    settings = {
        pager: {
            perPage: 10,
        },
        actions: {
            add: false,
            delete: false,
            edit: false,
            custom: [{ name: "routeToPage", title: `<i class="nb-edit"></i>` }],
        },

        columns: {
            code: {
                title: 'Code',
                filter: false,
            },
            fname: {
                title: 'Driver Name',
                filter: false,
            },
            onlineHours: {
                title: 'Online Hours',
                filter: false,
                valuePrepareFunction: (row, col) => {
                    // console.log('col',col)
                    if (col.userinfo.length == 0)
                        return 0
                    else return col.userinfo[0].onlineLable;

                }
            },
            offlineLable: {
                title: 'Offline Hours',
                filter: false,
                valuePrepareFunction: (row, col) => {
                    // console.log('row',row)
                    // console.log('col',col)
                    if (col.userinfo.length == 0)
                        return 0
                    else
                        return col.userinfo[0].offlineLable;
                }

            },
            lastON: {
                title: 'Last On',
                filter: false,
                valuePrepareFunction: (row, col) => {
                    // console.log(col.userinfo)
                    if (col.userinfo.length == 0)
                        return 'N/A'
                    else if (col.userinfo[0].lastON == null)
                        return 'N/A'
                    else {
                        return this.datePipe.transform(col.userinfo[0].lastON.split('T')[0] + " " +
                            col.userinfo[0].lastON.split('T')[1].split('Z')[0], 'yyyy-MM-dd, h:mm a');

                    }
                }

            },
            lastOFF: {
                title: 'Last Off',
                filter: false,
                valuePrepareFunction: (row, col) => {
                    // console.log(col.userinfo)

                    if (col.userinfo.length == 0)
                        return 'N/A'
                    else if (col.userinfo[0].lastOFF == null)
                        return 'N/A'
                    else {
                        console.log(col.userinfo[0].lastOFF.split('T'))
                        return this.datePipe.transform(col.userinfo[0].lastOFF.split('T')[0] + " " +
                            col.userinfo[0].lastOFF.split('T')[1].split('Z')[0], 'yyyy-MM-dd, h:mm a');

                    }
                }
            }
        }
    }
    date: any;
    SearchDate: any;
    Date: string;
    s
    sdate: string;
    showCity: boolean;
    event: any;
    ServiceCity: any;

    constructor(_http: Http, private tableSvc: TableService, private toaster: ButtonToasterService,
        private router: Router, private Http: HttpClient, private datePipe: DatePipe,) {
        const date = new Date()
        this.list.date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        this.date = this.datePipe.transform(this.list.date, 'yyyy-MM-dd');
        this.list.date = this.date
        this.source = new ServerDataSource(this.Http, { endPoint: AppSettings.API_ENDPOINT + 'perDayOnlineReport?' + 'date=' + this.list.date })
        if (featuresSettings.isCityWise === true && featuresSettings.isServiceAvailable === true && localStorage.getItem('userType') === "superadmin")
            this.showCity = true;
        else
            this.showCity = false;
        this.tableSvc.getServiceCity()
            .then(res => {
                this.ServiceCity = res;
            })
    }

    FilterByDate(data) {
        console.log(data)
        this.Date = this.datePipe.transform(data.date, 'yyyy-MM-dd');
        this.SearchDate = this.Date
        console.log(this.SearchDate)
        if ((data.servicecity === undefined || data.servicecity === 'all') && data.date)
            this.source = new ServerDataSource(this.Http, { endPoint: AppSettings.API_ENDPOINT + 'perDayOnlineReport?' + 'date=' + this.SearchDate })
        else if (data.servicecity && data.date)
            this.source = new ServerDataSource(this.Http, { endPoint: AppSettings.API_ENDPOINT + 'perDayOnlineReport?' + 'date=' + this.SearchDate + '&scity_like=' + data.servicecity })
    }

    route(event) {
        this.router.navigate(["pages/tables/driver-duty-report1", { '_id': event.data._id }])
    }
}
