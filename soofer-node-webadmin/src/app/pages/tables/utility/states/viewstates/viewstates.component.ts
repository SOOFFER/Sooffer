import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { AppSettings } from '../../../../../app.config';
import { CommonService } from '../../../../common/common.service';
import { UtilityService } from '../../utility.service';
import { HttpClient } from '@angular/common/http';
interface countriesDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'viewstates',
  templateUrl: './viewstates.component.html',
  styles: [`
  .required::after{
    content:" *";
    color:red
  }
  `]
})

export class ViewstatesComponent implements OnInit {
  countries: Array<countriesDataList>;
  nselectedval:Array<any>;
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [
        { name: 'routeToAPage', title: `<i class="nb-edit"></i>` },
        // { name: 'routeToDelete', title: `<i class="nb-trash"></i>` }
      ]
    },
    pager: {
      display: true,
      perPage: 10,
    },

    columns: {
      name: {
        title: 'State',
        valuePrepareFunction: (val) => {
             return val
          },
      },
      status: {
        title: 'Status',
        valuePrepareFunction: (status) => {
          if (status == true) return "Active";
          else return "Inactive";
        }
      }
    },
  };
  
  source: any = ServerDataSource;
  sourceanthor: any = ServerDataSource;
  userId: Number;
  initial: any = "list";
  selectedid: string;
  selectedDocs: any;
  spinner: boolean = true;
  selectedcountry: any;
  formDisableState: any;     
  selectedval;                                       
  dropcountry:Array<any>                                                                                                                                                        ;
  constructor(public _http:HttpClient , private toastr: ButtonToasterService, private http: Http, private Service: UtilityService, private commonsrv: CommonService) {
    this.userId = parseInt(localStorage.getItem('userId'));
    let id = AppSettings.defaultCountryId;
    this.selectedval = id;
    this.getSource(id);
  }

  getSource(id){
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'statesForAdminUiCRUD/' + id });
  }
  
  getstatesval(val){
     this.getSource(val); 
  }

  route(event) {
    this.SetDocsDetails(event.data);
    this.initial = "";
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.selectedid = data.id;
    this.selectedDocs = data;
    this.selectedDocs.countryId = data.country_id;
    this.commonsrv.doAddFormControlNgSelectClass();
  }

  ngOnInit(): void {
    this.getAllCountries()

    this.Service.getcountry().then( res=>{
           this.dropcountry = res;
    }) 
  
  }

  // API REQUEST

  getAllCountries() {
    this.commonsrv.getCountries()
      .then(response => {
        try {
          this.countries = response[0]['countries'];
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      }).catch(response => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.commonsrv.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  goback() {
    this.initial = "list";
  }

  // COUNTRIES

  selectedCountry(option: countriesDataList) {
    this.selectedDocs.name = '';
    this.showStateTextBox();
  }

  deSelectedCountry(option: countriesDataList) {
    this.selectedDocs.countryId = "";
    this.selectedDocs.name = '';
    this.showStateTextBox();
  }

  showStateTextBox() {
    if (
      typeof this.selectedDocs.countryId !== "undefined"
      && this.selectedDocs.countryId !== ""
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  UpdateNewDoc(inputs: any): void {
    if (!inputs) { return; }
    if (inputs.countryId === undefined) {
      this.toastr.showtoast("error", "Please Select the Country");
    }
    else {
      this.spinner = false;
      let obj = {
        name: inputs.name,
        country_id: inputs.countryId,
        id: this.selectedid,
        userId: this.userId,
        status: inputs.status,
      }
      this.Service.updateStates(obj)
        .then(res => {
          this.toastr.showtoast("success", res.message);
          this.spinner = true;
          this.initial = "list";
        })
        .catch(error => {
          this.toastr.showtoast("error", error.message);
          this.spinner = true;
        })
    }
  }

  deleteRecord(data: any): void {
    this.spinner = false;
    this.Service.deleteStates(data)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.spinner = true;
        this.initial = "list";
      })
      .catch(error => {
        this.toastr.showtoast("error", error.message);
        this.spinner = true;
      })

  }

}
