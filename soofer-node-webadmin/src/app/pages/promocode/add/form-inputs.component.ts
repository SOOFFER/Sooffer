import { Component, OnInit } from '@angular/core';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { PromoService } from '../promocode.service';
import { CommonService } from '../../common/common.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { featuresSettings, dropdown } from '../../../app.config';

interface commoninter {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'ngx-form-inputs',
  // styleUrls: ['./form-inputs.component.scss'],
  templateUrl: './form-inputs.component.html',
})

export class FormInputsComponent implements OnInit {
  spinners = true;
  seconds = true;
  list: any = {};
  dayList: any = [];
  autoApply: any

  visibleDateOptions: DatepickerOptions = {
    minYear: new Date().getFullYear(),
    maxYear: 2101,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0,


    minDate: new Date(Date.now() - 86400000), // Minimal selectable date
    barTitleIfEmpty: 'Click to Select a Date',
    placeholder: 'Click to Select a Date',
    addClass: 'form-control',
    useEmptyBarTitle: false
  };
  cities: Array<commoninter>;
  dropdownSettings = dropdown.dropdownSettings;
  TripDropDown: any = {};
  servicecity = featuresSettings.isServiceAvailable;
  TripType: any = []
  days = 'Mon,Tue,Wed,Thu,Fri,Sat,Sun';

  filternames = [
    {
      name: 'Mon',
      checked: true
    },
    {
      name: 'Tue',
      checked: true
    },
    {
      name: 'Wed',
      checked: true
    },
    {
      name: 'Thu',
      checked: true
    },
    {
      name: 'Fri',
      checked: true
    },
    {
      name: 'Sat',
      checked: true
    },
    {
      name: 'Sun',
      checked: true
    },
  ];
  tripType: any = [];
  selAll: any;



  constructor(private dataService: PromoService,
    private router: Router,
    private config: NgbTimepickerConfig,
    private CommonSvc: CommonService,
    private toastr: ButtonToasterService) {
    const a = this.days.split(/,/);
    this.dayList = a;
    for (let i = 0; i < a.length; i++) {
      for (const j of this.filternames) {
        if (a[i] === j.name) {
          j.checked = true;
        }
      }
    }
    this.list.start = Date.now();
    this.list.end = Date.now();
    this.list.startTime = moment('00:00:00', 'HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
    this.list.endTime = moment('01:00:00', 'HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');
    config.spinners = true;
    this.CommonSvc.getServiceAvailableCity()
      .then(res => {
        //  console.log(res)
        this.cities = res;
        this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
        this.cities = this.CommonSvc.dataforscids(this.cities);
        // console.log(this.cities)
        if (localStorage.getItem('userType') == 'citywiseadmin') {
          // this.list.scIds = this.CommonSvc.dataforscids(this.cities);
          console.log(this.cities)
          this.list.scIds = this.CommonSvc.dataforscids(this.cities);

        }
      });
    this.list.autoApply = 0;

    this.TripType = [
      { key: 'daily', value: 'Daily' },
      { key: 'rental', value: 'Rental' },
      { key: 'outstation', value: 'Outstation' }
    ];
    console.log(this.TripType)
    this.TripDropDown = {
      singleSelection: false,
      idField: 'key',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  ngOnInit(): void {
    this.generateCode();
  }

  onItemSelect(event) {
    console.log(event.key)
    this.tripType.push(event.key)
    console.log(this.tripType)
  }

  onItemDeSelect(event) {
    this.tripType.splice(this.tripType.indexOf(event.key), 1)
    console.log(this.tripType)
  }

  onSelectAll(event) {
    console.log(event.length)
    this.tripType = [];
    console.log(this.tripType)
    // for(let i of event){
    //    console.log(i.key)
    //    this.tripType.push(i.key)
    // }
    for (let i = 0; i < event.length; i++) {
      this.tripType.push(event[i].key)
    }
    console.log(this.tripType)
  }

  onDeSelectAll(event) {
    this.tripType = [];
    console.log(this.tripType)
  }






  generateCode(): void {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.list.code = text;
  }

  change(e, type) {
    const index = this.dayList.indexOf(type);
    if (index === -1) {
      this.dayList.push(type);
    } else {
      this.dayList.splice(index, 1);
    }
  }

  AddNewDoc(inputs: any): void {
    if (!inputs) { return; }
    if ((typeof inputs.scIds === 'undefined' || inputs.scIds === '') && this.servicecity === true) {
      this.toastr.showtoast('warn', 'Enter Service Available City');
    } else {
      if (this.servicecity === false) {
        inputs.scIds = this.cities;
      } else {
        inputs.scIds = this.CommonSvc.convertionOfServiceId(inputs.scIds);
      }
      const startDateFormat = moment(inputs.start).format('YYYY-MM-DD');
      const endDateFormat = moment(inputs.end).format('YYYY-MM-DD');
      const endTimeFormat = moment(inputs.endTime, 'YYYY-MM-DDTHH:mm:ss').format('H:m:s');
      const startTimeFormat = moment(inputs.startTime, 'YYYY-MM-DDTHH:mm:ss').format('H:m:s');
      const addPromo = {
        code: inputs.code,
        amount: inputs.amount,
        days: this.dayList,
        // forFirst: inputs.forFirst,
        forFirst: false,
        noofuse: inputs.noofuse,
        start: startDateFormat,
        end: endDateFormat,
        startTime: startTimeFormat,
        endTime: endTimeFormat,
        scIds: JSON.stringify(inputs.scIds),
        perUserUsage: inputs.perUserUsage,
        tripType: this.tripType,
        amountType: inputs.amountType,
        percentage: inputs.percentage,
      };
      this.dataService.createDoc(addPromo)
        .then(msg => {
          this.toastr.showtoast('success', msg.message);
          this.router.navigate(['/pages/tables/promocode']);
        })
        .catch(msg => {
          this.toastr.showtoast('error', msg.message);
        });
    }
  }

}
