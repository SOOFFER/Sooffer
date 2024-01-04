import { Component } from '@angular/core';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { AdminService } from '../../admin/admin.service';

import { NbToastrService } from '@nebular/theme';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { RouterEvent, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { CommonService } from '../../common/common.service';
import { AppSettings, inputValidation, AdminMenuConfig } from '../../../app.config';
import { TableService } from '../../tables/table.service';
import { featuresSettings } from '../../../app.config';
import { MENU_ITEMS } from '../../pages-menu';
import { PagesMenuCitywiseComponent } from '../add/form-inputs.component';

interface citiesDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, AdminService, CommonService],
  templateUrl: './smart-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})
export class AdminTableComponent {
  initial: string = 'list';
  selectedid: string;
  selectedDocs: any;
  citywiseAdmin = featuresSettings.isCityWise;
  selectedUser: string;
  dropdownList;
  dropdownList1 = [];
  PagesDropDown = PagesMenuCitywiseComponent.CitywiseAdminPagesMenu
  admintoken;
  supercities: Array<citiesDataList>;
  commontypecities: Array<citiesDataList>;
  filtercity;
  defaultValue;
  cityadmin = [];
  changeingarr = [];
  defaultName;
  currentIndex: any = 0;
  baseurl: string = AppSettings.BASEURL;
  cities: Array<citiesDataList>;
  dropdownSettings = {
    singleSelection: false,
    idField: '_id',
    textField: 'label',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };
  navigationSubscription: any;

  dropdownSettings1 = {
    singleSelection: false,
    idField: 'title',
    textField: 'title',
    //  enableCheckAll:true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: false
  }

  citywiseAdminMenus = AdminMenuConfig.showCityWiseMenu;
  normalAdminMenus = AdminMenuConfig.showNormalMenu;

  selectedScID: any;
  validation = inputValidation;
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="ion-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },

    columns: {
      fname: {
        title: 'First Name',
      },
      lname: {
        title: 'Last Name',
      },
      email: {
        title: 'Email',
      },
      phone: {
        title: 'Phone',
      },
      group: {
        title: 'Admin Type'
      }
    },
  };

  source: ServerDataSource;
  UserType: boolean;
  pagesArray: any;
  showCity: boolean;
  ServiceCity: any;

  constructor(private http: HttpClient,
    private service: TableService,
    private commonservice: CommonService,
    private adminservice: AdminService,
    private toastr: ButtonToasterService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.optionCity();
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'admin' });
    this.commonservice.getServiceAvailableCity()
      .then(res => {
        this.cities = res;
      });
    this.dropdownList1 = MENU_ITEMS;

    if (featuresSettings.isCityWise && featuresSettings.isServiceAvailable && localStorage.getItem('userType') == 'superadmin')
      this.showCity = true;
    else
      this.showCity = false

    this.service.getServiceCity()
      .then(res => {
        this.ServiceCity = res;
      })

    if (localStorage.getItem('userType') == 'citywiseadmin')
      this.UserType = true;
    else
      this.UserType = false;
    router.events.subscribe((event: RouterEvent) => {
      //console.log(event)
    });
    //console.log(this.router.url)
    // this.activatedRoute.queryParamMap.subscribe(el => console.log(el))
    const url = new URLSearchParams();
    //console.log(url)

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = "list";
      }
    });

  }


  optionCity() {
    const superAdminCity = [];
    const cityAdmin = [];
    const normalAdmin = [];

    this.commonservice.getServiceAvailableCity()
      .then(res => {
        //console.log(res)
        this.filtercity = res;
        this.filtercity.forEach(el => {
          if (el.label == 'Default') {

            superAdminCity.push(el);
            this.defaultValue = el.value;
            this.defaultName = el.label;
          }
          else if (el.label != 'Default') {

            this.cityadmin.push(el);

          }
          normalAdmin.push(el);
        });
        this.supercities = superAdminCity;
        this.cities = cityAdmin;
        this.commontypecities = normalAdmin;
      });

    //console.log(this.supercities)
    // console.log(this.supercities)
    this.commonservice.doAddFormControlNgSelectClass();
    //this.list.serviceAvailableCityId = "";

  }


  FilterRes(data) {
    // console.log(data)
    if (data == 'all')
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'admin' });
    else
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'admin?scIds.name_like=' + data });
  }



  route(event) {
    // console.log(event);
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
    this.commonservice.doAddFormControlNgSelectClass();
    this.initial = '';
    this.pagesArray = event.data.menus;
    this.SetDocsDetails(event.data);
  }
  onItemSelect(item: any) {
    console.log("push", item);
    this.pagesArray.push(item);

  }


  onItemDeSelect(item: any) {
    console.log("pop", item);
    this.pagesArray.splice(this.pagesArray.indexOf(item), 1);

  }

  onDeSelectAll(item) {
    this.pagesArray = [];
  }

  onSelectAll(items: any) {
    this.pagesArray = [];
    this.pagesArray = items;

  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }

    console.log(data.scIds[0].name);
    this.selectedScID = data.scIds;
    data.scIds = this.commonservice.ReconvertionScid(data.scIds);
    this.selectedid = data._id;
    this.selectedDocs = data;
    this.selectedUser = data.fname;
    this.selectedDocs.scId = data.scIds[0]._id;
    console.log(this.selectedDocs.scId);

    //this.selectedDocs.sAdmin = data.scIds[0].scId
    this.selectedDocs.serviceAvailableCityId = ''
    if (data.group == 'superadmin') {
      this.admintoken = 0;
      this.selectedDocs.scId = this.defaultValue;
      this.selectedDocs.scLabel = this.defaultName;
      // console.log("Super");
    }
    else if (data.group == 'citywiseadmin') {
      this.admintoken = 1;
      // console.log("City");
    }
    else {
      this.admintoken = 2;

    }
    if (this.citywiseAdmin == false) {
      this.admintoken = 0;
      this.selectedDocs.scId = this.defaultValue;
      this.selectedDocs.scLabel = this.defaultName;
    }

    // this.adminTypeChecker(data)
  }

  selectedCity(option: citiesDataList) {
    this.selectedDocs.scId = option.value;
    this.selectedDocs.scLabel = option.label;
  }

  deSelectedCity(option: citiesDataList) {
    this.selectedDocs.scId = ''
    this.selectedDocs.scLabel = '';
  }

  goBack(): void {
    this.initial = 'detail';
    setTimeout(() => this.source.setPage(this.currentIndex), 0);
  }


  updateRecord(inputs: any): void {
    if (!inputs) { return; }
    if (inputs.group === 'citywiseadmin') {
      inputs.scIds = this.commonservice.convertionOfServiceId(inputs.scIds);
    }
    else if (inputs.group === 'superadmin') {
      const selected = {
        scId: inputs.scId,
        name: inputs.scLabel
      };
      inputs.scIds = [selected];
    }
    else {
      const selected = {
        scId: inputs.scId,
        name: inputs.scLabel
      };
      inputs.scIds = [selected];
    }
    inputs.oldScIds = JSON.stringify(this.selectedScID);
    const updateObj = {
      fname: inputs.fname,
      lname: inputs.lname,
      phone: inputs.phone,
      email: inputs.email,
      group: inputs.group,
      oldScIds: inputs.oldScIds,
      menuslist: this.pagesArray,
      scIds: JSON.stringify(inputs.scIds)
    };
    console.log(this.pagesArray);
    this.adminservice.updateAdminData(updateObj, this.selectedid)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  deleteRecord(data: any): void {
    this.adminservice.deleteAdminData(data)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  adminTypeChecker(e) {
    console.log(e);
    if (e.target.value == 'superadmin') {
      this.admintoken = 0;
      this.selectedDocs.scId = this.defaultValue;
      this.selectedDocs.scLabel = this.defaultName;
      //  console.log("Super");
    }
    else if (e.target.value == 'citywiseadmin') {
      this.admintoken = 1;
      //console.log("City");
    }
    else {
      this.admintoken = 2;

    }
    if (this.citywiseAdmin == false) {
      this.admintoken = 0;
      this.selectedDocs.scId = this.defaultValue;
      this.selectedDocs.scLabel = this.defaultName;
    }
  }
}

