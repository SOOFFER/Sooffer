import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminService } from './../../admin/admin.service';
import { Observable } from 'rxjs/Observable';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { featuresSettings, inputValidation, AdminMenuConfig } from '../../../app.config';
import { MENU_ITEMS } from './../../../pages/pages-menu';
import { ServerDataSource } from 'ng2-smart-table';
import { AppSettings } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { inspect } from 'util'; // or directly

@Component({
    selector: 'ngx-form-inputs',
    providers: [CommonService, AdminService],
    templateUrl: './menusettings.component.html',
})

export class SettingPagesComponent {

    isCityWise = featuresSettings.isCityWise;
    citywiseAdminMenus = AdminMenuConfig.showCityWiseMenu;
    normalAdminMenus = AdminMenuConfig.showNormalMenu;

    index: number = 1;
    list: any = {};

    UpadteList: any = {};
    pagesArray: any = [];
    dropdownSettings:
        {
            singleSelection: boolean; idField: string; textField: string;
            selectAllText: string; unSelectAllText: string;
            itemsShowLimit: number; allowSearchFilter: boolean;
        };
    dropdownList: any = []; // {cuisineNo: number; name: string; }[];
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
            type: {
                title: 'Group',
            },
            menus: {
                title: 'Menus',
                valuePrepareFunction: (cell, row, _id) => {
                    let element = '';
                    for (let i = 0; i < row.menus.length; i++) {
                        if (element === '')
                            element = row.menus[i];
                        else
                            element = element + ',' + row.menus[i];
                    }
                    return element;
                }
            },
        },
    };

    source: ServerDataSource;

    constructor(private http: HttpClient, private dataService: AdminService, private toastr: NbToastrService) {
        this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + '/getMenu' });
        this.dropdownList = MENU_ITEMS;
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'title',
            textField: 'title',
            //  enableCheckAll:true,
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 5,
            allowSearchFilter: false
        };
    }

    @ViewChild('ngForm') form: any;

    onItemSelect(item: any) {
        this.pagesArray.push(item);
    }

    AddAdmin(data): any {
        data.menuslist = (this.pagesArray);
        console.log(data);
        this.dataService.AddMenuItem(data)
            .then(res => {
                if (res.success == true) {
                    this.toastr.success(res.message);
                    this.pagesArray = [];
                    // this.form.reset();
                } else {
                    this.toastr.warning(res.message);

                }
            }).catch(err => {
                console.log(err);
                const erfdr = JSON.parse(err.body);
                this.toastr.danger(erfdr.message);
            });
    }

    editMenus(data): any {
        data.menuslist = (this.pagesArray);
        console.log(data);
        this.dataService.editMenuItem(data)
            .then(res => {
                if (res.success == true) {
                    this.toastr.success(res.message);
                    this.pagesArray = [];
                    // this.form.reset();
                } else {
                    this.toastr.warning(res.message);

                }
            }).catch(err => {
                console.log(err);
                const erfdr = JSON.parse(err.body);
                this.toastr.danger(erfdr.message);

            });
    }

    onItemDeSelect(item: any) {
        this.pagesArray.splice(this.pagesArray.indexOf(item), 1);
    }

    onDeSelectAll(item) {
        this.pagesArray = [];
    }

    onSelectAll(items: any) {
        this.pagesArray = [];
        console.log(items);
        this.pagesArray = items;
    }

    changeTemplate(data: number) {
        this.index = data;
        this.list = {};
        this.UpadteList = {};
        this.pagesArray = [];
    }

    route(event) {
        if (event.data.type === 'citywiseadmin' && !this.isCityWise) {
            this.toastr.danger('Sorry unavailable operation');
        } else {
            this.pagesArray = event.data.menus;
            this.UpadteList.id = event.data._id;
            this.UpadteList.group = event.data.type;
            this.index = 3;
        }
    }
}



