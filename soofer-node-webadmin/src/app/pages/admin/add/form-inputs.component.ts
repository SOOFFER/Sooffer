import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminService } from '../admin.service';
// import { DatepickerOptions } from 'ng2-datepicker';
// import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Observable } from 'rxjs/Observable';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { featuresSettings, inputValidation, AdminMenuConfig } from '../../../app.config';
import { MENU_ITEMS } from '../../pages-menu';

// import * as service from '@nebular/theme/components/toastr/toastr.service';


interface citiesDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}


@Component({
  selector: 'ngx-form-inputs',
  providers: [CommonService],
  templateUrl: './form-inputs.component.html',
})

export class AdminFormInputsComponent {
  citywiseAdmin = featuresSettings.isCityWise;
  list: any = {};
  cities: Array<citiesDataList>;
  filtercity: any;
  admintoken: number;
  cityadmin = [];
  dropdownList;
  pagesArray: any = [];
  dropdownList1= [];
  Pagedropdown = PagesMenuCitywiseComponent.CitywiseAdminPagesMenu;
  changeingarr = [];
  supercities: Array<citiesDataList>;
  commontypecities: Array<citiesDataList>;
  defaultValue: any;
  defaultName: any;
  lengthservicecities: number;
  itemdata = [];
  selectedItems = [];
  dropdownSettings = {
    singleSelection: true,
    idField: '_id',
    textField: 'label',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };
  dropdownSettings1 ={
    singleSelection: false,
            idField: 'title',
            textField: 'title',
            //  enableCheckAll:true,
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 5,
            allowSearchFilter: false
  };

  // dropdownSettings2 ={
  //   singleSelection: false,
  //           idField: 'title',
  //           textField: 'title',
  //           //  enableCheckAll:true,
  //           selectAllText: 'Select All',
  //           unSelectAllText: 'UnSelect All',
  //           itemsShowLimit: 5,
  //           allowSearchFilter: false
  // }



  citywiseAdminMenus = AdminMenuConfig.showCityWiseMenu;
  normalAdminMenus = AdminMenuConfig.showNormalMenu;
  serviceCity = featuresSettings.ServiceAvailableCity

  validation = inputValidation;
  UserType: boolean;

  constructor(private dataService: AdminService,
    private adminservice: AdminService,
    private router: Router,
    private commonservice: CommonService,
    private toastr: ButtonToasterService) {
    this.optionCity();
    this.dropdownList1 =MENU_ITEMS;
    this.commonservice.doAddFormControlNgSelectClass();
    if(localStorage.getItem('userType') == 'citywiseadmin') {
      this.UserType = true;
    }
    else 
    this.UserType = false;
 
    // this.commonservice.pageMenus().then (res=>{
    //   this.dropdownList1= res.data; 
    // });
  }

  optionCity() {
    const superAdminCity = [];
    const cityAdmin = [];
    const normalAdmin = [];

    this.commonservice.getServiceAvailableCity()
      .then(res => {
        //console.log(res)
        this.filtercity = res;
        if(localStorage.getItem('userType') == 'citywiseadmin')
        this.list.scId = this.filtercity[0].value 
        console.log(this.list.scId)
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
    this.list.serviceAvailableCityId = '';

  }

  onItemSelect(item: any) {
    this.pagesArray.push(item);
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

  ngOnInit(): void {
    this.dropdownList = this.cityadmin;
    this.commonservice.getServiceAvailableCity()
      .then(res => {
        this.cities = res;
        this.lengthservicecities = this.cities.length;
      });
  }

  selectedCity(option: citiesDataList) {
    this.list.scLabel = option.label;
  }

  deSelectedCity(option: citiesDataList) {
    this.list.scLabel = '';
  }


  AddAdmin(inputs: any): void {
    console.log(inputs)
    if (!inputs) { return; }
   
    // console.log(this.pagesArray);

    if (inputs.group === 'citywiseadmin') {
      // inputs.scIds = this.commonservice.convertionOfServiceId(inputs.scIds); 
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

    const addAdminObj = {
      fname: inputs.fname,
      lname: inputs.lname,
      email: inputs.email,
      phone: inputs.phone,
      group: inputs.group,
      // scIds : inputs.scIds,
      scIds: JSON.stringify(inputs.scIds),
      password: inputs.password,
      menuslist : (this.pagesArray),
    };

    //console.log(addAdminObj);
    this.dataService.createDoc(addAdminObj)
      .then(msg => {
        this.toastr.showtoast('success', msg.message);
        this.router.navigate(['/pages/admin/view']);

      })
      .catch(err => {
        this.toastr.showtoast('error', err.message);
      });
  }

  adminTypeChecker(e) {

    // console.log(e.target.value)
    if (e.target.value === 'superadmin') {
      this.admintoken = 0;
      this.list.scId = this.defaultValue;
      this.list.scLabel = this.defaultName;
      //console.log("Super");
    } else if (e.target.value === 'citywiseadmin') {
      this.admintoken = 1;
      //console.log("City");
    } else {
      this.admintoken = 2;
    }
    if (this.citywiseAdmin === false) {
      this.admintoken = 0;
      this.list.scId = this.defaultValue;
      this.list.scLabel = this.defaultName;
    }
  }
}


export class PagesMenuCitywiseComponent {
     
   public static CitywiseAdminPagesMenu = [
    { title : 'Dashboard'},
    { title : 'Site Statistics'},
    // { title : 'Admin'},
    { title : 'Vehicle Type'},
    // { title : 'Company'},
    { title : 'Driver'},
    // { title : 'Rider'},
    { title : 'Trip Packages'},
    // { title : 'Hotel'},
    { title : 'Trips'},
    { title : 'Dispatch'},
    { title : 'Map Views'},
    { title : 'Driver Payment Package'},
    { title : 'Settlements'},
    { title : 'Reviews'},
    { title : 'PromoCode'},
    { title : 'Offers'},
    { title : 'Report'},
    // { title : 'Utility'},
    // { title : 'Settings'},


   ]
}