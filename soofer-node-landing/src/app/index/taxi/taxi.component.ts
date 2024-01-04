import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MyTaxiService } from './mytaxi.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DatePipe } from '@angular/common';
import { AppSettings } from '../../app.config';
import { ButtonToasterService } from './../buttontoaster/buttontoaster.service';

@Component({
  selector: "taxi",
  templateUrl: './taxi.html',
  styleUrls: ['./taxi.css'],
  providers: [DatePipe, MyTaxiService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TaxiComponent implements OnInit {

  makeary: any[] = [];
  modelary: any[] = [];
  yearary: any[] = [];
  companyary: any[] = [];
  driverary: any[] = [];
  vehicleary: any[] = [];
  private id;
  list: any = {};
  index = 1;
  columnsToDisplay = ['makename', 'model', 'taxistatus', 'color'];
  dataSource: any = [];
  filedata: any;
  expiryDate: any;
  selectedid: any;
  taxiMessage: string;
  singleTaxiId: any;
  baseurl: string = AppSettings.BASEURL;

  constructor(private datePipe: DatePipe,
    private cservice: MyTaxiService,
    private toast: ButtonToasterService) {
    this.id = localStorage.getItem('Id');
    this.cservice.editDriver(this.id)
      .then(res => {
        this.dataSource = res;
        //    console.log(res);
      });
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.cservice.getCompanies()
      .then(msg => this.companyary = msg);
    this.cservice.getCarMake()
      .then(msg => this.makeary = msg[0]['datas']);
    this.cservice.getYearsData()
      .then(msg => this.yearary = msg[0]['datas']);
    this.cservice.getVehicleTypeData()
      .then(msg => this.vehicleary = msg);
    this.dataSource.paginator = this.paginator;
  }

  changInitail(something) {
    this.index = 2;
    this.list = something;
    this.list.make = something.makename;
    this.singleTaxiId = this.list._id;
    this.selectedid = this.list.driver;
    for (const Tfind of this.makeary) {
      for (const Tfmod of Tfind.model) {
        if (this.list.model === Tfmod) {
          //console.log(Tfmod);
          this.modelary = Tfind.model;
          //   console.log(this.modelary)
        }
      }
    }
    if (this.list.type.length !== 0) {
      this.list.basic = something.type[0].basic;
      this.list.luxury = something.type[0].luxury;
      this.list.normal = something.type[0].normal;
    }
  }

  deleteModel(items) {
    if (window.confirm('Are you sure you want to delete?')) {
      const tdele: any = {};
      tdele.makeid = items._id;
      tdele.driverid = items.driver;
      // console.log(tdele);
      this.cservice.deleteVehicle(tdele.driverid, tdele.makeid).
        then(res => {
          if (res.success === true) {
            this.toast.showtoast('success', res.message);
            this.cservice.editDriver(localStorage.getItem('Id'))
              .then(res => {
                this.dataSource = res;
                // console.log(res);
              });
            this.index = 1;
          } else {
            this.toast.showtoast('success', res.message);
          }
        })
        .catch(res => {
          console.log(res);
          this.toast.showtoast('error', res.message);
        });
    }
  }

  GetModel(data: any): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.list.makename = selectElementText;
    const selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    const index = this.makeary.map((el) => el.make).indexOf(selectElementId);
    if (index === -1) { this.toast.showtoast('success', 'No Models Available'); } else {
      this.modelary = this.makeary[index].model;
    }
  }

  GetAddModel(data: any): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.list.makename = selectElementText;
    const selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    const index = this.makeary.map((el) => el._id).indexOf(selectElementId);
    if (index === -1) { this.toast.showtoast('success', 'No Models Available'); } else {
      this.modelary = this.makeary[index].model;
    }
  }

  editDrvDetails(input) {
    if (!input) { return; }
    this.cservice.editDetails(input)
      .then(res => {
        if (res.success === true) {
          this.toast.showtoast('success', res.message);
          this.goback();
        }
        //         console.log(res.message);
      });
  }
  submitDriverTaxiDoc(filefor) {
    if (this.filedata === undefined || this.expiryDate === undefined) {
      this.taxiMessage = 'Please choose both document and Date';
    } else {
      const formdata = new FormData();
      formdata.append('file', this.filedata);
      formdata.append('expDate', this.expiryDate);
      formdata.append('driverid', this.selectedid);
      formdata.append('makeid', this.singleTaxiId);
      formdata.append('filefor', filefor);
      this.cservice.uploadDriverTaxiDocs(formdata)
        .then(msg => {
          //   console.log(msg);
          this.changelook(msg, filefor);
          this.taxiMessage = msg.message;
        });
    }
  }

  changelook(msg, filefor) {
    // console.log(msg,filefor);
    switch (filefor) {
      case 'licence':
        this.list.licence = msg.file.path;
        this.list.licenceexp = msg.request.licenceexp;
        break;
      case 'insurance':
        this.list.insurance = msg.file.path;
        this.list.insuranceexp = msg.request.licenceexp;
        break;
      case 'passing':
        this.list.passing = msg.file.path;
        this.list.passingexp = msg.request.licenceexp;
        break;
      case 'register':
        this.list.registration = msg.file.path;
        this.list.registrationexpdate = msg.registrationexpdate;
        break;
      case 'permit':
        this.list.permit = msg.file.path;
        this.list.permitexpdate = msg.permitexpdate;
        break;
      case 'Insurance':
        this.list.insurance = msg.file.path;
        this.list.insuranceexpdate = msg.insuranceexpdate;
        break;
    }
  }

  addMyTaxi() {
    console.log('4');
    this.index = 4;
    this.list = {};
    const tId = localStorage.getItem('Id');
    this.list.driverid = tId;
  }

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  logDate(msg) {
    this.expiryDate = this.datePipe.transform(msg.target.value, 'dd-MM-yyyy');
  }

  addDrvDetails(input) {
    // console.log(input);
    input.driver = input.driverid;
    this.cservice.addTaxi(input)
      .then(res => {
        if (res.success === true) {
          this.toast.showtoast('success', res.message);
          this.cservice.editDriver(localStorage.getItem('Id'))
            .then(res => {
              this.dataSource = res;
              // console.log(res);
            });
        }
        this.index = 1;
      })
      .catch(msg => {
        this.toast.showtoast('error', msg.message);
      });
  }

  goback() {
    this.index = 1;
  }

  editTaxiDocs(something) {
    this.index = 3;
    this.list = something;
    this.singleTaxiId = this.list._id;
    this.selectedid = this.list.driver;
  }
}

