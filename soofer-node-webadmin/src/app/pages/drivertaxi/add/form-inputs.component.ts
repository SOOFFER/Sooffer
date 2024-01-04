import { Component, ViewChild, OnInit } from '@angular/core';
import { Service } from '../driver.service';
import { CommonService } from '../../common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { featuresSettings, documentSettings, AppSettings } from '../../../app.config';
import { DriverService } from '../../driver/driver.service';

@Component({
  selector: 'ngx-form-inputs',
  providers: [DriverService],
  styleUrls: ['./form-inputs.component.scss'],
  templateUrl: './form-inputs.component.html',
})

export class FormInputsComponent implements OnInit {
  makeary: any[] = [];
  modelary: any[] = [];
  yearary: any[] = [];
  companyary: any[] = [];
  driverary: any[] = [];
  vehicleary: any[] = [];
  colorary: any[] = [];
  companyadded: boolean = false;
  showCompany = featuresSettings.isMultipleCompaniesAvailable;
  driveradded: boolean = false;
  list: any = {};
  uploadedFileName: string = '';
  baseurl: string = AppSettings.BASEURL;
  taxiLabels = documentSettings.driverTaxiLabels;
  showtaxiLabel = documentSettings.setDriverTaxiLabel;

  otherList: any = [];

  vehicleImage: any;
  vehicleImageBack: any;

  constructor(private dataService: Service,
    private CommonSvc: CommonService,
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ButtonToasterService) {
    this.route.params.subscribe(params => {
      if (params['dvrid'] && params['cmpid'] && params['driverName']) {
        const SelCPY = params['cmpid'];
        const SelDrv = params['dvrid'];
        this.list.driverName = params['driverName'];
        this.list.driver = params['dvrid'];
        this.list.cpy = params['cmpid'];
        this.CommonSvc.getCompanies()
          .then(msg => this.companyary = msg);
        this.GetDrivers(this.list.cpy);
        this.companyadded = true;
        this.driveradded = true;
      }
    });
    this.convertToArrayObj(this.taxiLabels);
  }

  convertToArrayObj(data) {
    data.forEach((el, index) => {
      this.otherList.push({ label: el, value: 'others' + (index + 1) });
    });
  }

  public get half(): number {
    return Math.ceil(this.otherList.length / 2);
  }

  @ViewChild('dataForm') taxiform: any;

  ngOnInit(): void {
    this.CommonSvc.getCompanies()
      .then(msg => this.companyary = msg);
    this.CommonSvc.getCarMake()
      .then(msg => this.makeary = msg[0]['datas']);
    this.CommonSvc.getYearsData()
      .then(msg => this.yearary = msg[0]['datas']);
    this.CommonSvc.getVehicleTypeData()
      .then(msg => this.vehicleary = msg);
  }

  GetDrivers(data: any): void {
    this.CommonSvc.GetDrivers(data)
      .then(msg => {
        this.driverary = msg;
      });
  }

  GetModel(data: any): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.list.makename = selectElementText;
    const selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    console.log(selectElementId, selectElementText);
    const index = this.makeary.map((el) => el._id).indexOf(selectElementId);
    this.modelary = this.makeary[index].model;
  }

  SetVehicleType(data: any): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.list.serviceName = selectElementText;
    const selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    if (selectElementId > 0 || selectElementId !== undefined) {
      this.list.share = true;
      this.list.noofshare = selectElementId;
    }
    if (selectElementId === 'undefined') {
      this.list.share = false;
      this.list.noofshare = 0;
    }
  }

  SetVehicleType2(data: any): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.list.serviceName2 = selectElementText;
    const selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    if (selectElementId > 0 || selectElementId !== undefined) {
      this.list.share2 = true;
      this.list.noofshare2 = selectElementId;
    }
    if (selectElementId === 'undefined') {
      this.list.share2 = false;
      this.list.noofshare2 = 0;
    }
  }

  goBack(): void {
    this.router.navigate(['pages/tables/driver-table']);
  }

  fileEvent(e) {
    this.vehicleImage = '';
    this.vehicleImage = e.target.files[0];
    if (this.vehicleImage) {
      const formData = new FormData();
      formData.append('file', this.vehicleImage);
      formData.append('filefor', 'image');
      formData.append('driverid', this.list.driver);
      this.driverService.uploadDriverTaxiDocs(formData)
        .then(res => {
          this.toastr.showtoast('success', res.message);
          this.uploadedFileName = res.fileurl;
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        });
    }
  }

  fileEvents(e) {
    this.vehicleImageBack = '';
    this.vehicleImageBack = e.target.files[0];
    if (this.vehicleImageBack) {
      const formData = new FormData();
      formData.append('file', this.vehicleImageBack);
      formData.append('filefor', 'imageBack');
      formData.append('driverid', this.list.driver);
      this.driverService.uploadDriverTaxiDocs(formData)
        .then(res => {
          this.toastr.showtoast('success', res.message);
          this.uploadedFileName = res.fileurl;
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        });
    }
  }

  AddNewDoc(inputs: any): void {
    if (!inputs) { return; }
    inputs.image = this.uploadedFileName !== undefined ? this.uploadedFileName : '';
    this.dataService.createDoc(inputs)
      .then(msg => {
        if (msg.success) {
          this.driverary = [];
          this.taxiform.reset();
        }
        this.toastr.showtoast('success', msg.message);
        this.router.navigate(['pages/tables/driver-table']);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }


}
