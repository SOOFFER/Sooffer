import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../trippackage.service';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { inputValidation, featuresSettings, dropdown } from '../../../app.config';
import { formatDate } from '@angular/common';

interface CommonInter {
  value: string;
  label: string;
  _id: string;
  currency: string;
}

interface commonDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'nfx-forms-inputs',
  styleUrls: ['./form-inputs.component.scss'],
  templateUrl: './form-inputs.component.html',
})

export class FormInputComponent implements OnInit {
  list: any = {};
  serviceCity: Array<CommonInter>;
  countries: Array<CommonInter>;
  cities: Array<commonDataList>;
  //cities:any=String;
  validation = inputValidation;
  showservicecity = featuresSettings.isServiceAvailable;
  showCurr: boolean = false;
  servicecity = featuresSettings.isServiceAvailable;
  lengthservicecities: number;
  ngForm: FormData;
  dropdownSettings = dropdown.dropdownSettings;
  // dropdownSettings = {
  //   singleSelection: true,
  //   idField: '_id',
  //   textField: 'label',
  //   itemsShowLimit: 10,
  //   allowSearchFilter: true
  // };

  vehiclesList = [];
  listedVehiclesArray = [];

  constructor(private dataService: Service,
    private router: Router,
    private CommonSvc: CommonService,
    private toastr: ButtonToasterService, ) {
    this.getVehicles('rental');
    this.CommonSvc.getServiceAvailableCity()
      .then(res => {
        //  console.log(res)
        this.cities = res;
        this.lengthservicecities = this.cities.length;
        this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
        this.cities = this.CommonSvc.dataforscids(this.cities);
        // console.log(this.cities)
        if (localStorage.getItem('userType') === 'citywiseadmin') {
          this.list.scIds = this.CommonSvc.dataforscids(this.cities);
        }
      });
  }
  onItemSelect(item: any) {
    console.log(item.name, 'item');
    this.getVehicles('rental', item.name);
    // this.dispCurr(item);
    // let currentCur;
    // this.serviceCity.forEach(el => {
    //   if (el._id === item._id) {
    //     currentCur = el.currency;
    //   }
    // });
    // this.list.cur = currentCur;
  }


  getVehicles(type, name = 'Default') {
    this.dataService.getVehicleByType(type, name)
      .then(res => {
        this.vehiclesList = res['datas'];
        this.toastr.showtoast("success", res.message);

        this.listedVehiclesArray = this.filterVehicles(res['datas']);
      }).catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }

  filterVehicles(arr) {
    const res = arr.map(el => el.type);
    return res.join(', ');
  }

  checkVistingLoc(data) {
    return data.reduce(function (filtered, option) {
      if (option.fixedRate) {
        const someNewValue = true;
        filtered.push(someNewValue);
      } else {
        const someNewValue = false;
        filtered.push(someNewValue);
      }
      return filtered.length > 0 ? filtered : [true];
    }, []).every(x => x);
  }

  getVistingLocValue(data) {
    return data.reduce(function (filtered, option) {
      if (option.type) {
        const someNewValue = option.fixedRate;
        const type = option.type;
        filtered.push({ name: type, rate: someNewValue });
      }
      return filtered.length > 0 ? filtered : [];
    }, []);
  }

  // onItemSelect(item: any) {
  //   this.dispCurr(item);
  //   let currentCur;
  //   this.serviceCity.forEach(el => {
  //     if (el._id === item._id) {
  //       currentCur = el.currency;
  //     }
  //   });
  //   this.list.cur = currentCur;
  // }

  onItemDeSelect(item: any) {
    this.dispCurr('');
  }

  dispCurr(data) {
    if (data.label === 'Default') {
      this.showCurr = true;
    } else {
      this.showCurr = false;
      this.list.cur = '';
    }
  }

  ngOnInit(): void {
    this.CommonSvc.getCountries()
      .then(msg => this.countries = msg[0]['countries'])
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }

  filedata: any;

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  AddNewDoc(inputs: any): void {
    if (!inputs) { return; }
    if ((typeof inputs.scIds === 'undefined' || inputs.scIds === '')
      && this.servicecity === true) {
      this.toastr.showtoast('warn', 'Enter Service Available City');
    } else {
      if (this.servicecity === false) {
        inputs.scIds = this.cities;
      } else {
        inputs.scIds = this.CommonSvc.convertionOfServiceId(inputs.scIds);
      }
       inputs.oldscIds = inputs.scIds;

      inputs.scIds = JSON.stringify(inputs.scIds);
      inputs.fixedRate = JSON.stringify(this.getVistingLocValue(this.vehiclesList));
      this.dataService.AddTripPackages(inputs)
        .then(msg => {
          this.toastr.showtoast('success', msg.message);
          this.router.navigate(['/pages/tables/trippackage-table']);
        })
        .catch(msg => {
           inputs.scIds = inputs.oldscIds;

          this.toastr.showtoast('error', msg.error.message);
        });
    }

  }
}
