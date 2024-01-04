import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../../../app.config';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { UtilityService } from '../utility.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  },
  .invoice{
    padding-top: 45px !important;
  }
  `],
})

export class DbBackupComponent {
  title: string = "DB Backup";
  settings = {
    // actions: false,
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-trash"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
    },

    columns: {
      foldername: {
        title: 'File Name',
      },
      createdAt: {
        title: 'Created At',
      },
      type:
      {
        title: 'Type',
      },
      folderpath: {
        title: 'Download',
        filter: false,
        type: 'html',
        valuePrepareFunction: (folderpath) => {
          let htmlTag = '<a href="' + folderpath + '" download><i class="fa fa-download" aria-hidden="true"></i></a>';
          return this.sanitizer.bypassSecurityTrustHtml(htmlTag);
        }
      },
    },
  };

  source: ServerDataSource;

  constructor(
    private _http: HttpClient,
    private sanitizer: DomSanitizer,
    private toastr: ButtonToasterService,
    private utilityService: UtilityService) {
    this.display();
  }

  display() {
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'dbbackup' });
  }

  dbBackId: string;

  route(event) {
    this.dbBackId = event.data._id;
    this.deleteDatabaseBackUp();
  }

  ngOnInit(): void {
  }

  deleteDatabaseBackUp(): void {
    this.utilityService.deleteBackUp(this.dbBackId)
      .then(msg => {
        this.toastr.showtoast("success", msg.message);
        this.display();
      })
      .catch(msg => {
        this.toastr.showtoast("error", msg.message);
      })
  }

  createbkup() {
    this.utilityService.createBackUp('')
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.display();
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      })
  }


}
