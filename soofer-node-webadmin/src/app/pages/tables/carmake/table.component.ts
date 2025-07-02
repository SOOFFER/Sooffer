import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { TableService } from '../table.service';

import { Http } from '@angular/http';
import { AppSettings } from '../../../app.config';  
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';  

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService], 
  templateUrl: './smart-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})
export class CarMakeTableComponent { 

  settings = {

     add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate:true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave:true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },

    pager : {
      display : true,
      perPage:10, 
    },

    columns: {
      make: {
        title: 'Car Make',
      },
      model: {
        title: 'Models Available (Comma Separated)',
      }, 
    },
  };

  // source: ServerDataSource; 

  source: LocalDataSource;


  // constructor(http: Http, private service: TableService) {
  //   this.source = new ServerDataSource(http, { endPoint:  AppSettings.API_ENDPOINT + 'carmake' }); 
  // }

  constructor(protected service: TableService,private toastr:ButtonToasterService ) {
    this.source = new LocalDataSource();

    this.service.getCarMake()
    .then( msg =>  this.source.load( msg[0].datas ) );   
 
  } 
 

  ngOnInit(): void { 
  }

  addRecord(event) { 
    var model = event.newData.model;  
    if (!Array.isArray(model)) { 
       model = model.split(",");  
    } 
    var dataupdate = { 
      "make" : event.newData.make,
      "model" : model
    };
    this.service.addCarMake(dataupdate)
    .then(res => { 
      event.confirm.resolve(event.newData); 
    })   
  }


  updateRecord(event) {  
    var model = event.newData.model;  
    if (!Array.isArray(model)) { 
       model = model.split(",");  
    } 
    var dataupdate = {
      "makeid" : event.newData._id,
      "make" : event.newData.make,
      "model" : model
    }; 
    this.service.updateCarMake(dataupdate)
    .then(res => {
      // console.log(res); 
      event.confirm.resolve(event.newData); 
    })  
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
  
      this.service.deleteCarMake(event.data._id)
      .then(res => {
        console.log(res);
        if(res.success==true) 
        {
          this.toastr.showtoast("success",res.message);
          event.confirm.resolve(event.source.data);
          console.log( event.data );
        }
        // else 
        // {
        //   this.toastr.showtoast("error",res.message);
        //   // event.confirm.resolve(event.source.data);
        //   // console.log( event.data );
        // }
     
      }) 
      
    } else {
      event.confirm.reject();
    }

  }

}
