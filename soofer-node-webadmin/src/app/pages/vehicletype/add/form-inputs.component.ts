import { Component, OnInit } from '@angular/core';
import { Service } from '../vehicletype.service';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { dropdown, featuresSettings } from '../../../app.config';

interface commonDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

interface triptypeData {
  value: string;
  label: string;
}

@Component({
  selector: 'ngx-form-inputs',
  templateUrl: './form-inputs.component.html',
  styles: [
    `
      .example-chip-list {
        width: 100%;
      }
      .required::after {
        content: " *";
        color: red;
      }
    `,
  ],
})
export class FormInputsComponent implements OnInit {
  /*** Vehicle and Fare Details */

  list: any = {};
  cities: Array<commonDataList>;
  TripType: Array<triptypeData>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  features = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  data: any = [];
  defaultUnit = featuresSettings.distanceUnit;
  showShareTaxi = featuresSettings.shareTaxi;

  vehicleDropdown = {
    singleSelection: false,
    idField: 'type',
    textField: 'type',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
  };

  /*** Driver Conveyance (Pickup Charge) Details */

  noFilterThreshold: number = 3;
  conveyanceShowbox: boolean = false;

  /*** Tax Details */

  TaxShowbox: boolean = false;

  /*** Waiting Time Details */

  WaitingTime: boolean = false;
  WaitingTimeBefore: boolean = false;
  trueOrFalse = [
    {
      value: 'true',
      label: 'True',
    },
    {
      value: 'false',
      label: 'False',
    },
  ];

  Faretype = [
    {
      value: 'flatrate',
      label: 'Flat Rate',
    },
    {
      value: 'kmrate',
      label: 'KM Rate',
    },
  ];

  yesOrNo = [
    {
      value: 'true',
      label: 'Yes',
    },
    {
      value: 'false',
      label: 'No',
    },
  ];

  gender = [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    },
  ];

  FaretypeOrPercentage = [
    {
      value: 'flatrate',
      label: 'Flat Rate',
    },
    {
      value: 'percentage',
      label: 'Percentage',
    },
  ];

  peakHours: any = [];
  nightHours: any = [];
  itemdata: any = [];
  peakHour1: any = {};
  peakHour2: any = {};
  lengthservicecities: number;
  dropdownSettings = dropdown.dropdownSettings;
  servicecity = featuresSettings.isServiceAvailable;
  availableTrips = featuresSettings.tripsAvailable;
  city: string;

  constructor(
    private dataService: Service,
    private CommonSvc: CommonService,
    private router: Router,
    private toastr: ButtonToasterService
  ) {
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.city = localStorage.getItem('userType');
    this.convertTripType(this.availableTrips);
    this.CommonSvc.getServiceAvailableCity().then(res => {
      //  console.log(res)
      this.cities = res;
      this.lengthservicecities = this.cities.length;
      this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
      this.cities = this.CommonSvc.dataforscids(this.cities);
      if (this.city === 'citywiseadmin') {
        this.list.scIds = this.CommonSvc.dataforscids(this.cities);
      }

      // console.log(this.cities)
    });
    this.list.displayorder = 1;
    this.list.percentPeakHourOne = 0;
    this.list.percentPeakHourTwo = 0;
    this.list.percentNightFare = 0;
    this.list.conveyancePerKm = 0;
    this.list.allowMinimumWaitingTimeInMinutes = 0;
    this.list.chargeRatePerMinuteForExceededMinimumWaitingTime = 0;
    this.list.allowMiniWaitingTimeBeforeTripStartInMin = 0;
    this.list.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart = 0;
    this.list.taxPercentage = 0;
    this.list.baseFare = 0;
    this.list.bookingFare = 0;

    this.list.baseKMBefore = 0;
    this.list.base = 0;
    this.list.baseKMAfter = 0;
    this.list.baseFareAfter = 0;
    this.list.serviceAvailableCityId = '';
    this.list.description = '';
    this.list.tripTypeCode = 'daily';
    this.getVehiclesFortype(this.list.tripTypeCode);
    this.list.conveyanceType = 'flatrate';
    this.list.conveyanceAvailable = 'true';
    this.list.isTax = 'true';
    this.list.isWaitingTimeExceddedChargesApplicable = 'true';
    this.list.isWaitingTimeBeforeTripStartExceddedChargesApplicable = 'true';
    // this.setHours();
    this.list.peakHourOneStartTime = moment('00:00:00', 'HH:mm:ss').format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    this.list.peakHourOneEndTime = moment('00:00:00', 'HH:mm:ss').format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    this.list.peakHourTwoStartTime = moment('00:00:00', 'HH:mm:ss').format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    this.list.peakHourTwoEndTime = moment('00:00:00', 'HH:mm:ss').format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    this.list.nightHourOneStartTime = moment('00:00:00', 'HH:mm:ss').format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    this.list.nightHourOneEndTime = moment('00:00:00', 'HH:mm:ss').format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    this.list.cancelationFeesRider = 0;
    this.list.cancelationFeesDriver = 0;
  }

  getVehiclesByTypeList = [];

  getVehiclesFortype(type, scity = undefined) {
    this.dataService
      .getVehicleByType(type, scity)
      .then(async res => {
        this.getVehiclesByTypeList = await res['datas'];
        this.list.lowCategoryOptions = '';
      })
      .catch(res => {
        this.list.lowCategoryOptions = '';

        this.toastr.showtoast('error', res.message);
      });
  }

  convertTripType(data) {
    const typeArr = [];
    data.forEach(el => {
      typeArr.push({
        label: el,
        value: el.toLowerCase(),
      });
    });
    this.TripType = typeArr;
  }

  ngOnInit(): void { }

  /*** Vehicle and Fare Details */

  selectedCity(option: commonDataList) {
    this.list.serviceAvailableCityId = option.label;
  }

  deSelectedCity(option: commonDataList) {
    this.list.serviceAvailableCityId = '';
  }

  tripTypeDoAssignSelected(option: triptypeData) {
    console.log(this.list.scIds);
    this.getVehiclesFortype(
      option.value,
      this.list.scIds ? this.list.scIds[0].name : undefined
    );
  }

  tripTypeDoUnassignDeselected(option: triptypeData) { }

  filedata: any;

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  // MAT CHIP

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.features.push({ name: value.trim() });
    }
    if (input) {
      input.value = '';
    }
  }

  remove(feature): void {
    const index = this.features.indexOf(feature);
    if (index >= 0) {
      this.features.splice(index, 1);
    }
  }

  featureconvertion() {
    this.data = [];
    this.features.forEach(ele => {
      this.data.push(ele.name);
    });
    this.list.peakHourOneStartTime = moment(
      this.list.peakHourOneStartTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.list.peakHourOneEndTime = moment(
      this.list.peakHourOneEndTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.list.peakHourTwoStartTime = moment(
      this.list.peakHourTwoStartTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.list.peakHourTwoEndTime = moment(
      this.list.peakHourTwoEndTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.list.nightHourOneStartTime = moment(
      this.list.nightHourOneStartTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.list.nightHourOneEndTime = moment(
      this.list.nightHourOneEndTime,
      'YYYY-MM-DDTHH:mm:ss'
    ).format('HH:mm');
    this.peakHour1 = {
      from: moment(this.list.peakHourOneStartTime, 'HH:mm').format('HH:mm:ss'),
      to: moment(this.list.peakHourOneEndTime, 'HH:mm').format('HH:mm:ss'),
      percentPeakFare: this.list.percentPeakHourOne,
    };
    this.peakHour2 = {
      from: moment(this.list.peakHourTwoStartTime, 'HH:mm').format('HH:mm:ss'),
      to: moment(this.list.peakHourTwoEndTime, 'HH:mm').format('HH:mm:ss'),
      percentPeakFare: this.list.percentPeakHourTwo,
    };
    this.peakHours.push(this.peakHour1);
    this.peakHours.push(this.peakHour2);
    this.nightHours = [
      {
        from: moment(this.list.nightHourOneStartTime, 'HH:mm').format(
          'HH:mm:ss'
        ),
        to: moment(this.list.nightHourOneEndTime, 'HH:mm').format('HH:mm:ss'),
        percentNightFare: this.list.percentNightFare,
      },
    ];
  }

  /*** Driver Conveyance (Pickup Charge) Details */

  conveyance(event) {
    if (event.value === 'true') {
      this.CommonSvc.doAddFormControlNgSelectClass();
      this.list.conveyanceType = 'flatrate';
      this.list.conveyancePerKm = 0;
    } else {
      this.list.conveyanceType = 'flatrate';
      this.list.conveyancePerKm = 0;
    }
  }

  /*** Tax Details */

  TaxAction(event) {
    if (event.value === 'true') {
      this.TaxShowbox = true;
      this.CommonSvc.doAddFormControlNgSelectClass();
      this.list.taxPercentage = 0;
    } else {
      this.TaxShowbox = false;
      this.list.taxPercentage = 0;
    }
  }

  /*** Waiting Time Details */

  WaitingTimeExceddedCharges(event) {
    if (event.value === 'true') {
      this.WaitingTime = true;
      this.CommonSvc.doAddFormControlNgSelectClass();
      this.list.allowMinimumWaitingTimeInMinutes = 0;
      this.list.chargeRatePerMinuteForExceededMinimumWaitingTime = 0;
    } else {
      this.WaitingTime = false;
      this.list.allowMinimumWaitingTimeInMinutes = 0;
      this.list.chargeRatePerMinuteForExceededMinimumWaitingTime = 0;
    }
  }
  WaitingTimeExceddedChargesApplicable(event) {
    if (event.value === 'true') {
      this.WaitingTimeBefore = true;
      this.CommonSvc.doAddFormControlNgSelectClass();
      this.list.allowMiniWaitingTimeBeforeTripStartInMin = 0;
      this.list.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart = 0;
    } else {
      this.WaitingTimeBefore = false;
      this.list.allowMiniWaitingTimeBeforeTripStartInMin = 0;
      this.list.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart = 0;
    }
  }
  // setHours() {
  //   this.list.peakHourOneStartTime = moment('18:30', 'HH:mm').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  //   this.list.peakHourTwoStartTime = moment('18:30', 'HH:mm').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  //   this.list.peakHourOneEndTime = moment('19:30', 'HH:mm').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  //   this.list.peakHourTwoEndTime = moment('19:30', 'HH:mm').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  //   this.list.nightHourOneStartTime = moment('17:30', 'HH:mm').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  //   this.list.nightHourOneEndTime = moment('01:30', 'HH:mm').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  //   console.log(this.list.peakHourOneStartTime)
  // }

  /*** POST DATA */

  AddNewDoc(inputs: any): void {
    const newCate = [];
    if (this.list.lowCategoryOptions.length != 0) {
      this.list.lowCategoryOptions.forEach(item => {
        if (item.type) {
          newCate.push(item.type);
        } else {
          newCate.push(item);
        }
      });
    }
    inputs.lowCategoryOptions = newCate;

    console.log(inputs);
    this.featureconvertion();
    if (!inputs) {
      return;
    }
    if (
      (typeof inputs.scIds === 'undefined' || inputs.scIds === '') &&
      this.servicecity === true
    ) {
      this.toastr.showtoast('warn', 'Enter Service Available City');
    } else {
      if (this.servicecity === false) {
        inputs.scIds = this.cities;
      } else {
        inputs.scIds = this.CommonSvc.convertionOfServiceId(inputs.scIds);
      }
      const formdata = new FormData();
      formdata.append('lowCategoryOptions', inputs.lowCategoryOptions);
      formdata.append('file', this.filedata);
      formdata.append('type', inputs.type);
      // formdata.append('baseKMBefore', inputs.baseKMBefore);
      // formdata.append('baseFare', inputs.baseFare);
      // formdata.append('baseKMAfter', inputs.baseKMAfter);
      // formdata.append('baseFareAfter', inputs.baseFareAfter);
      formdata.append('available', inputs.available);
      formdata.append('isRideLater', inputs.isRideLater);
      formdata.append('tripTypeCode', inputs.tripTypeCode);
      formdata.append('displayorder', inputs.displayorder);
      formdata.append('scIds', JSON.stringify(inputs.scIds));
      formdata.append('base', inputs.baseFare);
      formdata.append('bookingFare', inputs.bookingFare);
      formdata.append('timeFare', inputs.timeFare);
      formdata.append('mfare', inputs.mfare);
      formdata.append('bkm', inputs.bkm);
      formdata.append('bkmnac', inputs.bkmnac);
      formdata.append('comison', inputs.comison);
      formdata.append('asppc', inputs.asppc);
      formdata.append('description', inputs.description);
      formdata.append('features', this.data);
      formdata.append('isShareAvailable', inputs.isShareAvailable || false);
      formdata.append( 'gender', inputs.gender);
      formdata.append('conveyanceAvailable', inputs.conveyanceAvailable);
      formdata.append('conveyanceType', inputs.conveyanceType);
      formdata.append('conveyancePerKm', inputs.conveyancePerKm);
      formdata.append('isTax', inputs.isTax);
      formdata.append('taxPercentage', inputs.taxPercentage);
      formdata.append('cancelationFeesDriver', inputs.cancelationFeesDriver);
      // formdata.append("baseFareForRoundTrip", inputs.baseFareForRoundTrip);
      // formdata.append("bkmForRoundTrip", inputs.bkmForRoundTrip);
      // formdata.append("kmReducedPerExtraHr", inputs.kmReducedPerExtraHr);

      formdata.append('cancelationFeesRider', inputs.cancelationFeesRider);
      formdata.append('peakHours', JSON.stringify(this.peakHours));
      formdata.append('nightHours', JSON.stringify(this.nightHours));
      formdata.append(
        'isWaitingTimeExceddedChargesApplicable',
        inputs.isWaitingTimeExceddedChargesApplicable
      );
      formdata.append(
        'allowMinimumWaitingTimeInMinutes',
        inputs.allowMinimumWaitingTimeInMinutes
      );
      formdata.append(
        'chargeRatePerMinuteForExceededMinimumWaitingTime',
        inputs.chargeRatePerMinuteForExceededMinimumWaitingTime
      );

      formdata.append(
        'isWaitingTimeBeforeTripStartExceddedChargesApplicable',
        inputs.isWaitingTimeBeforeTripStartExceddedChargesApplicable
      );

      formdata.append(
        'allowMiniWaitingTimeBeforeTripStartInMin',
        inputs.allowMiniWaitingTimeBeforeTripStartInMin
      );
      formdata.append(
        'chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart',
        inputs.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart
      );
      if (inputs.tripTypeCode === 'outstation') {
        formdata.append('dayRate', inputs.dayRate);
        formdata.append('nightRate', inputs.nightRate);
        formdata.append('kmReducedPerExtraHr', inputs.kmReducedPerExtraHr);
        formdata.append('timeFareForIdel', inputs.timeFareForIdel);
        formdata.append('baseFareForRoundTrip', inputs.baseFareForRoundTrip);
        formdata.append('bkmForRoundTrip', inputs.bkmForRoundTrip);
        formdata.append('timeFareForIdelOneway', inputs.timeFareForIdelOneway);
        formdata.append('timeFareOneway', inputs.timeFareOneway);


      }
      this.dataService
        .createDoc(formdata)
        .then(msg => {
          this.toastr.showtoast('success', msg.message);
          this.router.navigate(['/pages/tables/vehicletype-table']);
        })
        .catch(msg => {
          this.toastr.showtoast('error', msg.message);
        });
    }
  }

  minmax(e) {
    // console.log(e)
    const value = e.target.value;
    // if (value >= 100) {
    //   value = 100
    // }
    // if (value <= 0) {
    //   value = 0
    // }
    const ObjectName = e.target.name;
    this.list[ObjectName] = value;
  }

  lesserThanZero(e) {
    // console.log(e)
    let value = e.target.value;
    if (value <= 0) {
      value = 0;
    }
    const ObjectName = e.target.name;
    this.list[ObjectName] = value;
  }

  featureOnItemSelect(data) {
    console.log(data.name);
    this.getVehiclesFortype(this.list.tripTypeCode, data.name);
  }
  onItemDeSelect(data) {
    console.log(data, 'data');
    this.getVehiclesByTypeList = [];
    this.list.lowCategoryOptions = '';
  }
}
