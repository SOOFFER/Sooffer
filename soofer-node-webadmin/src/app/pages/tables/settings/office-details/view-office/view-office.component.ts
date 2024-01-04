import { Component, ViewChild, OnInit } from '@angular/core';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { TableService } from '../../../table.service';
import { Http } from '@angular/http';
import { ServerDataSource } from 'ng2-smart-table';
import { AppSettings, inputValidation, dropdown, featuresSettings } from '../../../../../app.config';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../../common/common.service';
import { stringify } from '@angular/core/src/util';
import { database } from 'firebase';
interface CommonList {
    _id: string;
    value: string;
    city: string;
    label: string;
}


@Component({
    selector: 'office-details',
    providers: [TableService, ButtonToasterService],
    templateUrl: './view-office.component.html'
})

export class ViewOfficeDetailsComponent {

    initial: string = 'list1';
    servicecity = featuresSettings.isServiceAvailable;
    dropdownSettings = dropdown.dropdownSettings;

    cities: Array<CommonList>;


    settings = {
        actions: {
            edit: false,
            delete: false,
            add: false,
            custom: [{ name: 'routeToPage', title: `<i class="nb-edit"></i>` }]
        },
        columns: {
            address: {
                title: 'Address',
            },
            mail: {
                title: 'Mail'
            },
            phone: {
                title: 'phone'
            },

        },

    };
    source: ServerDataSource;
    valid = inputValidation.emailValid;
    lengthservicecities: number;
    OldscIds: any;
    list: any = {};
    detail: any;
    selId: any;

    constructor(http: HttpClient,
        private toaster: ButtonToasterService,
        private CommonSvc: CommonService,
        private tableSvc: TableService) {
        this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'cityWiseOffice' });
        this.CommonSvc.getServiceAvailableCity().then(res => {
            this.cities = res;
            this.lengthservicecities = this.cities.length;
            this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
            this.cities = this.CommonSvc.dataforscids(this.cities);
        });


    }

    route(event) {
        this.initial = '';
        this.list = event.data;
        console.log(this.list);
        this.selId = event.data._id;
        this.OldscIds = event.data.scIds;
    }

    UpdateOffice(data) {
        const info = {
            address: data.address,
            mail: data.mail,
            phone: data.phone,
            scIds: JSON.stringify(data.scIds),
            oldScIds: JSON.stringify(this.OldscIds),
            isSupportNoEnable: data.isSupportNoEnable

        };
        this.tableSvc.UpdateOfficeDetails(info, this.selId)
            .then(res => {
                this.toaster.showtoast('success', res.message);
                this.initial = 'list1';
            })
            .catch(res => {
                this.toaster.showtoast('error', res.message);
            });
    }

    goBack() {
        this.initial = 'list1';
    }

    Delete() {
        if (window.confirm('Are you sure you want to Delete?')) {
            this.tableSvc.DeleteOffice(this.selId)
                .then(res => {
                    this.toaster.showtoast('success', res.message);
                    this.initial = 'list1';
                })
                .catch(res => {
                    this.toaster.showtoast('error', res.message);
                });
        }

    }

}
