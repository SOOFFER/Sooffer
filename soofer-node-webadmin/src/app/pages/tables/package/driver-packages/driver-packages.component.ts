import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { AppSettings } from '../../../../app.config';
import { TableService } from '../../table.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ActiveRenderSubComponent } from '../active-render-sub/active-render-sub.component';

@Component({
  selector: 'ngx-driver-packages',
  templateUrl: './driver-packages.component.html',
  styleUrls: ['./driver-packages.component.scss']
})
export class DriverPackagesComponent implements OnInit {

  settings = {
    actions: {
      edit: false, //as an example
      add: false, //as an example
      delete: false
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      purchaseDate: {
        title: 'Purchased Date',
        valuePrepareFunction: (purchaseDate) => {
          return purchaseDate ? moment(purchaseDate).format('DD-MM-YYYY') : 'N/A';
        }
      },
      packageName: {
        title: 'Package Name',
      },
      amount: {
        title: 'Amount',
      },
      noofdays: {
        title: 'No of Days',
      },
      startDate: {
        title: 'Start Date',
        valuePrepareFunction: (startDate) => {
          return startDate ? moment(startDate).format('DD-MM-YYYY') : 'N/A';
        }
      },
      endDate: {
        title: 'End Date',
        valuePrepareFunction: (endDate) => {
          return endDate ? moment(endDate).format('DD-MM-YYYY') : 'N/A';
        }
      },
      status: {
        title: 'Status',
      },
      renderBtn: {
        title: 'Activate Package',
        type: 'custom',
        filter: false,
        sort: false,
        renderComponent: ActiveRenderSubComponent,
        onComponentInitFunction: (instance) => {
          instance.emitBack
            .subscribe((data) => {
              this.source.refresh();
            });
        }
      }
    },
  };

  driverId: any;
  source: ServerDataSource;
  constructor(private router: ActivatedRoute,
    private http: HttpClient,
    private route: Router,
    private service: TableService,
    private toastr: ButtonToasterService) {
    this.router.params.subscribe(params => {
      if (params['dvrid']) {
        this.driverId = params['dvrid'];
        this.disp();
      }
    });
  }

  disp() {
    this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'driverSubscriptionSingle/' + this.driverId });
  }

  ngOnInit() { }

  btnClick() {
    this.route.navigate(['pages/tables/package/driver-subscription']);
  }

  onDeleteConfirm(event) {
    // console.log(event.data._id);
    const id = event.data._id;
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.historydelete(id)
        .then(res => {
          //  console.log(res);
          this.toastr.showtoast('success', res.message);
          this.disp();
          //console.log( event.data );
        })
        .catch(err => {
          this.toastr.showtoast('error', err.message);
        });
    }
  }

}
