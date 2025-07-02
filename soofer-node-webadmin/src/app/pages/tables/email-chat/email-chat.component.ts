import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../app.config';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../table.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-email-chat',
  providers: [DatePipe],
  templateUrl: './email-chat.component.html',
})
export class EmailChatComponent implements OnInit {
  initial: string = 'list';
  selectedid: string;
  selectedDocs: any;
  selectedUser: string;
  baseurl: string = AppSettings.BASEURL;

  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      from: {
        title: 'From',
      },
      mail: {
        title: 'Email ID'
      },
      subject: {
        title: 'Subject',
      },
      message: {
        title: 'Message'
      },
      // status: {
      //   title: 'Status'
      // },
      createdAt: {
        title: 'Date',
        valuePrepareFunction: (createdAt) => {
          const dt = this.datePipe.transform(createdAt, 'MMMM d, y');
          return dt;
        }
      },
    },
  };

  source;

  constructor(http: HttpClient,
    private service: TableService,
    private datePipe: DatePipe,
    private toastr: ButtonToasterService) {
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'contactUs' });
  }

  ngOnInit() { }

  checkMailStatus(data) {
    if (data === 'unread') {
      const mailObj = {
        _id: this.selectedid
      };
      this.service.updateMailStatus(mailObj);
    }
  }

  route(event) {
    this.initial = '';
    this.SetDocsDetails(event.data);
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.checkMailStatus(data.status);
    this.selectedid = data._id;
    this.selectedDocs = data;
    this.selectedDocs.reply = this.addReplyStatus(data.reply);
    this.selectedUser = data.from;
  }

  addReplyStatus(data) {
    const arrOfObj = data;
    const result = arrOfObj.map(function (el) {
      const o = Object.assign({}, el);
      if (o.from === 'admin') {
        o.reply = true;
        o.type = 'text';
      } else {
        o.reply = false;
        o.type = 'text';
      }
      return o;
    });
    return data = result;
  }

  goBack(): void {
    this.initial = 'detail';
  }

  // CHAT UI

  sendMessage(event: any) {
    const sendReplyObj = {
      _id: this.selectedid,
      msg: event.message,
      requestFrom: 'Admin_Ui'
    };
    this.service.updateConvo(sendReplyObj)
      .then(res => {
        this.SetDocsDetails(res.data);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

}
