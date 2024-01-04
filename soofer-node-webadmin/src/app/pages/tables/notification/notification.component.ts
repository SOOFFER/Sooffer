import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppSettings, DocumentNotificationSettings, featuresSettings } from '../../../app.config';
import { ServerDataSource, LocalDataSource, ViewCell } from 'ng2-smart-table';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../table.service';
import { ButtonNotifyComponent } from './button-notify/button-notify.component';





@Component({
  selector: 'ngx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements OnInit {

  /** Driver Notification */
  list: any = {}
  li: any = {}
  driverSettings = {
    actions: false,
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      fname: {
        title: 'Name',
      },
      email: {
        title: 'Email',
      },
      phone: {
        title: 'Contact No'
      },
      document: {
        title: "Licence Expiry Date",
        valuePrepareFunction: (value) => {
          return value[0].docExp.split('T')[0];
        }
      },
      Send: {
        title: "Send Notification",
        type: 'custom',
        editable: false,
        filter: false,
        sort: false,
        renderComponent: ButtonNotifyComponent,
        onComponentInitFunction(instance) {
          instance.selection = 'Driver';
          instance.save.subscribe((row) => {
            console.log('Row Data : \n', row);
          });
        },
      },
    },
  };



  driverSource;



  /** Driver Taxi Notification */

  taxiSettings = {
    actions: false,
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      fname: {
        title: 'Name',
      },
      email: {
        title: 'Email',
      },
      phone: {
        title: 'Contact No'
      },
      document: {
        title: "Insurance Expiry Date",
        valuePrepareFunction: (value) => {
          // console.log('value : ', value);
          const taxiInsuranceDate = value.find(item => { return item.docName === "Insurance" });
          // console.log('taxiInsuranceDate : ', taxiInsuranceDate);
          return taxiInsuranceDate.docExp.split('T')[0];
        }
      },
      Send: {
        title: "Send Notification",
        type: 'custom',
        editable: false,
        filter: false,
        sort: false,
        renderComponent: ButtonNotifyComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe((row) => {
            console.log('Row Data : \n', row);
          });
        },
      },
    },
  };

  taxiSource;

  showDriverValuesFromConfig = DocumentNotificationSettings.driverNotificationValues;
  showTaxiValuesFromConfig = DocumentNotificationSettings.driverTaxiNotificationValues;
  showCity: boolean;
  ServiceCity: any;

  constructor(private http: HttpClient,

    private tableService: TableService,
    private toastr: ButtonToasterService) {
    if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin')
      this.showCity = true;
    else
      this.showCity = false;
    this.tableService.getServiceCity()
      .then(Res => {
        this.ServiceCity = Res;
      })
    this.dispDriver(this.list.servicecity);
    this.dispTaxi(this.li.servicecity);
  }

  async dispDriver(data) {
    await this.dispDriverLabels();
    this.driverSource = new LocalDataSource();
    this.tableService.getDriverExpiryDoc(data)
      .then(res => {
        console.log('DRIVER NOTIFICATIONS : ', res);

        this.driverSource = res;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  dispDriverLabels() {
    for (const val of this.showDriverValuesFromConfig) {
      console.log('val : \n', val);
      console.log('showDriverValuesFromConfig : \n', this.showDriverValuesFromConfig);

      // this.driverSettings.columns[val.value] = {
      //   title: val.label,
      //   filter: false,
      //   sort: false,
      //   valuePrepareFunction: (el) => {
      //     console.log('el : \n', el);

      //     console.log('val2 : \n', val);
      //     if (val.type === 'date') {
      //       if (el === undefined || el === '') {
      //         return '---';
      //       } else {
      //         const d = new Date(el);
      //         return d.toLocaleDateString();
      //       }
      //     } else { return el; }
      //   }
      // };

    }
    this.driverSettings.columns['statusReason'] = {
      title: 'Expires Due To',
      filter: false,
      sort: false
    };
  }

  async dispTaxi(data) {
    await this.dispTaxiLabels();
    this.taxiSource = new LocalDataSource();
    this.tableService.getTaxiExpiryDoc(data)
      .then(res => {
        this.taxiSource = res;
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  dispTaxiLabels() {
    for (const val of this.showTaxiValuesFromConfig) {
      // this.taxiSettings.columns[val.value] = {
      //   title: val.label,
      //   filter: false,
      //   sort: false,
      //   valuePrepareFunction: (el) => {
      //     if (val.type === 'date') {
      //       if (el === undefined || el === '') {
      //         return '---';
      //       } else {
      //         const d = new Date(el);
      //         return d.toLocaleDateString();
      //       }
      //     } else { return el; }
      //   }
      // };
    }
    this.taxiSettings.columns['statusReason'] = {
      title: 'Expires Due To',
      filter: false,
      sort: false
    };
  }

  ngOnInit() { }




  SendDriverNotifications() {
    this.http.post<any>(AppSettings.API_ENDPOINT + 'driverExpiryDoc', '')
      .toPromise()
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.error.message);
      });
  }

  BlockDriver() {
    const driverStatus = {
      status: 'pending'
    };
    this.http.put<any>(AppSettings.API_ENDPOINT + 'blockExpiryDriver', driverStatus)
      .toPromise()
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.error.message);
      });
  }

  SendTaxiNotifications() {
    this.http.post<any>(AppSettings.API_ENDPOINT + 'taxiExpiryDoc', '')
      .toPromise()
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.error.message);
      });
  }

  BlockTaxi() {
    const taxiStatus = {
      status: 'inactive'
    };
    this.http.put<any>(AppSettings.API_ENDPOINT + 'blockExpiryTaxis', taxiStatus)
      .toPromise()
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.error.message);
      });
  }

}
