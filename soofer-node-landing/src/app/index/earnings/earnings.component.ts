
import { Component, ElementRef, ViewChild } from "@angular/core";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MyEarningsService } from './earnings.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DatePipe } from "@angular/common";
import { AppSettings } from "../../app.config";
import { ServerDataSource } from "ng2-smart-table";

@Component({
  selector: "earnings",
  templateUrl: "./earnings.html",
  styles: [`
  .col-lg-11 {
    width: 103.666667%;
    margin-left: -2px;
}
   
        button,
        input,
        optgroup,
        select,
        textarea {
          color: inherit;
          font: inherit;
          margin: 0;
        }
    
        table {
          line-height: 1.5em;
          border-collapse: collapse;
          border-spacing: 0;
          display: table;
          width: 100%;
          max-width: 100%;
          overflow: auto;
          word-break: normal;
          word-break: keep-all;
    
          tr {
            th {
              font-weight: bold;
            }
            section {
              font-size: .75em;
              font-weight: bold;
            }
            td,
            th {
              font-size: .875em;
              margin: 0;
              padding: 0.5em 1em;
            }
          }
        }
    
        a {
          color: #1e6bb8;
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
`],
  providers: [DatePipe, MyEarningsService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EarningsComponent {

  columnsToDisplay = ['makename', 'model', 'taxistatus', 'color'];
  dataSource: any = [];
  settings = {

    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      // custom: [{ name: 'routeToAPage', title: `edit` }]
    },

    pager: {
      display: true,
      perPage: 10,
    },

    columns: {
      dvrfname: {
        title: 'Driver',
      },
      tripno: {
        title: 'Trip No'
      },
      commision: {
        title: 'Commision'
      },
      tip: {
        title: 'Tip'
      },
      mtd: {
        title: 'Method'
      }

    }
  };



  source: ServerDataSource;
  constructor(private datePipe: DatePipe, private cservice: MyEarningsService) {
    // this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'foodItemCategory/' + localStorage.getItem('Id')});


    this.cservice.getEarnings(localStorage.getItem('Id')).then(
      res => {
        this.dataSource = res;
        this.source = res;
        //    console.log(res);
      });

  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {

  }

}

