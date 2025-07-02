import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { AppSettings } from '../../../../app.config';
import { Http } from '@angular/http';
import { TableService } from '../../table.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'driverhistory',
  templateUrl: './driverhistory.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})

export class DriverhistoryComponent implements OnInit {

  settings = {
    actions: {
      edit: false, //as an example
      add: false, //as an example
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      packageName: {
        title: 'Package name',
      },
      type: {
        title: 'Package type',
      },
      createdAt: {
        title: 'Date',
      },
      amount: {
        title: 'Purchased Amount',
      },
      credit: {
        title: 'Total Credits',
      },
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
        // console.log(this.source);
      }
    });
  }

  disp() {
    this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'driverPackageHistory/' + this.driverId });
  }

  ngOnInit() { }

  btnClick() {
    this.route.navigate(['pages/tables/package/drivercredits']);
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
