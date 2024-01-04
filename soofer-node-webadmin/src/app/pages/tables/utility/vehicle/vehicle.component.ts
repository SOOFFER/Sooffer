import { Component, ViewChild } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../../table.service';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { AppSettings, LanguageSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';
import { UtilityService } from '../utility.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';
import { TablesRoutingModule } from '../../tables-routing.module';
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'ngx-smart-table',
    providers: [TableService, CommonService, ButtonToasterService, UtilityService],
    templateUrl: './smart-table.component.html',
    styles: [`
    nb-card {
        transform: translate3d(0,0,0);
    },
    .invoice{
        padding-top: 45px !important;
    }
    `],
})

export class VehicleComponent {
    title: string = "Slider Section";
    initial: number = 0;
    baseurl = AppSettings.BASEURL;
    language = LanguageSettings.defaultSelectedLang;
    showTransOption = LanguageSettings.showTranslateOption;
    selectedDocs: any = {};
    settings = {
        actions: {
            edit: false,
            delete: false,
            add: false,
            custom: [{ name: 'routeToPage', title: `<i class="nb-edit"></i>` }]
        },
        pager: {
            display: true,
            perPage: 10,
        },
        columns: {
            name: {
                title: 'Title'
            },
            sliderSection: {
                title: 'Slider Section'
            },
            file: {
                title: 'Image',
                type: 'html',
                filter: false,
                valuePrepareFunction: (file: string) => `<img width="50px" src="${this.baseurl + file}" alt='icon'/>`

            },
        },
    };
    source: ServerDataSource;
    filedata: any;
    list: any = {};
    id: any;
    packageType: any = [];
    defaultLang = LanguageSettings.defaultSelectedLang;


    constructor(http: HttpClient, private service: TableService,
        private toastr: ButtonToasterService, private utility: UtilityService, private location: Location, private CommonSvc: CommonService, private translate: TranslateService) {
        // const browserLang = translate.getBrowserLang();
        // translate.use(browserLang);
        const lang = this.defaultLang
        translate.use(lang)
        this.getData(lang);
        // this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'vehicleDetails' });

    }

    @ViewChild('dataForm1') form: any;

    route(event) {
        this.btBack(2);
        this.selectedDocs = event.data;
        console.log(this.selectedDocs)
        this.id = this.selectedDocs._id
        console.log("id", this.id)
    }

    getLang(lang) {
        console.log(lang, "lang");
        this.getData(lang)
    }

    getLangs(lang) {
        console.log(lang, "lang");
        this.language = lang;
    }

    getData(value) {
        localStorage.setItem("language", value);
        this.utility.GetVehicleData(value)
            .then(res => {
                this.source = res;
            })
            .catch(res => {
                this.toastr.showtoast('error', res.message);
            })
    }


    fileEvent(e) {
        this.filedata = e.target.files[0];
    }

    ngOnInit(): void { }

    AddDriver(inputs) {
        console.log(inputs.sliderSection, "sliderSection")
        let formdata = new FormData();
        formdata.append("file", this.filedata);
        formdata.append("name", inputs.name);
        formdata.append("description", inputs.description);
        formdata.append("priceTag", inputs.priceTag);
        formdata.append("packageDetails", inputs.packageDetails);
        formdata.append("outstationDetails", inputs.outstationDetails);
        formdata.append("displayorder", inputs.displayorder);
        formdata.append("sliderSection", inputs.sliderSection);
        formdata.append("language", this.language);

        this.utility.AddVehicle(formdata)
            .then(res => {
                this.toastr.showtoast('success', res.message)
                this.form.reset();
                this.initial = 0;
            })
            .catch(res => {
                this.toastr.showtoast('success', res.message)
            })
    }

    EditDriver(inputs) {
        let formdata = new FormData();
        formdata.append("file", this.filedata);
        formdata.append("name", inputs.name);
        formdata.append("description", inputs.description);
        formdata.append("priceTag", inputs.priceTag)
        formdata.append("packageDetails", inputs.packageDetails)
        formdata.append("outstationDetails", inputs.outstationDetails)
        formdata.append("displayorder", inputs.displayorder)
        formdata.append("sliderSection", inputs.sliderSection);
        formdata.append("_id", inputs._id);
        this.utility.updateVehicle(formdata, inputs._id)

            .then(res => {
                this.toastr.showtoast('success', res.message)
                this.initial = 0;
            })
            .catch(res => {
                this.toastr.showtoast('error', res.message)
            })
    }

    deleteDriver(id) {
        this.utility.DeleteVehicle(id)
            .then(res => {
                this.toastr.showtoast('success', res.message)
                this.initial = 0;
            })
            .catch(res => {
                this.toastr.showtoast('error', res.message);
            })
    }

    btBack(num: number): void {
        this.initial = num;
        this.list = {};
    }
}