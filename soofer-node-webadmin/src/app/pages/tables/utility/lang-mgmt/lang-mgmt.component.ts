import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings, featuresSettings } from '../../../../app.config';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'ngx-lang-mgmt',
  templateUrl: './lang-mgmt.component.html',
  styleUrls: ['./lang-mgmt.component.scss']
})
export class LangMgmtComponent implements OnInit {

  settings = {
    actions: {
      add: true,
      delete: false,
      edit: true
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      key: {
        title: 'Key',
        editable: false
      },
      value: {
        title: 'Value',
      }
    },
  };

  source;
  data: any;
  Drivermsg: any;
  diverdata = [];
  riderdata = [];
  a: any;
  b: any;
  list: any = {};
  langArray: any = featuresSettings.langAvailable;

  constructor(private http: HttpClient,
    private service: TableService,
    private utilityService: UtilityService,
    private spinnerLoad: NgxSpinnerService,
    private toastr: ButtonToasterService) {
    this.source = new LocalDataSource();
    this.list.lang = 'en';
    this.dispDriverReasons(this.list.lang);
  }

  changelang(e) {
    this.dispDriverReasons(e.target.value);
  }

  dispDriverReasons(data) {
    this.spinnerLoad.show();
    this.http.get(AppSettings.API_ENDPOINT + 'listLanguage/' + data)
      .toPromise()
      .then(res => {
        this.a = res['data'];
        // tslint:disable-next-line: forin
        this.source = this.diverdatagetter(this.a);
        this.spinnerLoad.hide();
      })
      .catch(res => {
        this.spinnerLoad.hide();
        this.toastr.showtoast('error', res.message);
      });
  }

  diverdatagetter(data) {
    const ar = [];
    // tslint:disable-next-line: forin
    for (const i in data) {
      const a = { key: i, value: this.a[i] };
      ar.push(a);
    }
    return ar;
  }

  ngOnInit() {
  }

  updateRecord(event) {
    const dataupdate = {
      'key': event.newData.key,
      'value': event.newData.value,
      language: this.list.lang
    };
    this.utilityService.updateLangMgmt(dataupdate)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        event.confirm.resolve(event.newData);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
        event.confirm.resolve(event.data);
      });
  }

}
