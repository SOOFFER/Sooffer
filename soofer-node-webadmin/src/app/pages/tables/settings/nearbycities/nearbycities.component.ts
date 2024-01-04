import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../common/common.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { TableService } from '../../table.service';
import { Http } from '@angular/http';
import { AppSettings } from '../../../../app.config';
import { HttpClient } from '@angular/common/http';

interface commoninter {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'nearbycities',
  templateUrl: './nearbycities.component.html',

})
export class NearbycitiesComponent implements OnInit {

  initial: string = "list";
  DocsId: any;
  stateId: any;
  city: any;
  list: any = {};
  cities: Array<commoninter>;
  nearbyCities = [];
  parentCityName: string = "";
  constructor(private route: ActivatedRoute,
    private CommonSvc: CommonService,
    private toastr: ButtonToasterService,
    private router: Router,
    private tableservice: TableService,
    private http: HttpClient) {
    this.nearbyCities = [];
    this.route.params.subscribe(params => {
      if (params['cityId']) {
        this.DocsId = params['cityId'];
        this.stateId = params['stateId'];
      }
    });


    this.getCityofSelectedState(this.stateId)

    this.getnearbycites()
  }

  getnearbycites() {
    this.nearbyCities = [];
    this.http.get(AppSettings.API_ENDPOINT + 'AvailbleserviceCity')
      .toPromise()
      .then(res => {
  
        let data = res
       
        Object.entries(data).forEach(el => {
         // console.log(el[1]._id);
          if (el[1]._id == this.DocsId) {
            if (el[1].nearby == [] || el[1].nearby == "") {
              this.nearbyCities = [];
            }
            else {
              this.parentCityName = el[1].city
              this.nearbyCities = el[1].nearby
              console.log(this.nearbyCities)
            }
          }
        })
      })

  }
  getCityofSelectedState(id) {
    this.CommonSvc.GetCity(id)
      .then(response => {
        try {
          this.cities = response[0]['cities']
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      }).catch(response => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  NavigatetoMain() {
    this.router.navigate(['pages/tables/settings/servicecities/viewservicecities'])
  }


  ngOnInit() {

  }
  selectedCity(event) {
    console.log(event)
    this.city = event.name;
  }

  AddDocs(inputs) {
    let data = {
      cityId: inputs.cityId,
      city: this.city
    }

    this.tableservice.AddNearByCities(data, this.DocsId)
      .then(res => {
        this.goBack()
        this.toastr.showtoast('success', res.message)
        this.getnearbycites()
      })
      .catch(err => {
        this.toastr.showtoast('error', err.message)
      })
  }

  show() {
    this.initial = ""
  }

  goBack() {
    this.initial = "list";
  }

  DeleteDocs(data, index) {
    this.tableservice.DeleteNearByCities(data._id, this.DocsId)
      .then(res => {
        this.goBack()
        this.toastr.showtoast('success', res.message)
        this.getnearbycites()
      })
      .catch(err => {
        this.toastr.showtoast('error', err.message)
      })
  }
}
