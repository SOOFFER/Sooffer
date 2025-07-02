import { Component, OnInit } from "@angular/core";
import { ServerDataSource } from "ng2-smart-table";
import { Http } from "@angular/http";
import { AppSettings } from "../../../../../app.config";
import { MatChipInputEvent } from "@angular/material";
import { UtilityService } from "../../utility.service";
import { ButtonToasterService } from "../../../../buttontoaster/buttontoaster.service";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "viewcarmakemodel",
  templateUrl: "./viewcarmakemodel.component.html",
  styles: [
    `
      .example-chip-list {
        width: 100%;
      }
      .required::after {
        content: " *";
        color: red;
      }
    `
  ]
})
export class ViewcarmakemodelComponent implements OnInit {
  source: ServerDataSource;
  carmodel = [];
  list: any = {};
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  spinner: boolean = true;
  initial = "list";
  selectedDocs: any;
  selectedid: any;
  selectedUser: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: "routeToAPage", title: `<i class="nb-edit"></i>` }]
    },
    columns: {
      make: {
        title: "Car Make"
      },
      model: {
        title: "Models Available (Comma Separated)"
      }
    }
  };

  constructor(
    private http: HttpClient,
    private service: UtilityService,
    private toastr: ButtonToasterService
  ) {
    // this.source = new ServerDataSource(http, {
    //   endPoint: AppSettings.API_ENDPOINT + "carMakeForCRUD"
    // });
    this.getcarmakemodel()
  }

  getcarmakemodel() {
    this.http.get(AppSettings.API_ENDPOINT + 'carMakeForCRUD')
      .toPromise()
      .then(el => {
        this.source = el[0].datas
      })
  }

  ngOnInit() { }

  route(event) {
    this.initial = "";
    this.SetDocsDetails(event.data);
  }
  SetDocsDetails(data: any): void {
    if (!data) {
      return;
    }
    this.selectedDocs = data;
    this.selectedid = data._id;
    this.matchip(data.model);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our feature
    if ((value || "").trim()) {
      this.carmodel.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(carm): void {
    const index = this.carmodel.indexOf(carm);

    if (index >= 0) {
      this.carmodel.splice(index, 1);
    }
  }
  matchip(data) {
    this.carmodel = [];
    if (data[0] == "") {
      this.carmodel = [];
    } else {
      let val = data.toString();
      let matdata = val.split(",");

      matdata.forEach(el => {
        let mat = {
          name: el
        };
        this.carmodel.push(mat);
      });
      // console.log(this.features)
    }
  }

  goBack() {
    this.initial = "list";
  }

  featureconvertion() {
    let data = [];
    this.carmodel.forEach(ele => {
      data.push(ele.name);
    });
    return data;
  }

  UpdateNewDoc(data) {
    data.model = this.featureconvertion();
    let updateObj = {
      make: data.make,
      model: data.model,
      _id: data._id
    };
    this.service
      .UpdateCarModel(updateObj)
      .then(msg => {
        this.toastr.showtoast("success", msg.message);
        this.spinner = true;
        this.goBack();
      })
      .catch(err => {
        this.toastr.showtoast("error", err.message);
        this.spinner = true;
      });
  }

  DeleteDoc(data) {
    this.spinner = false;
    this.service
      .DeleteCarModel(data)
      .then(msg => {
        this.spinner = true;
        this.toastr.showtoast("success", msg.message);
        this.initial = "list";
      })
      .catch(err => {
        this.toastr.showtoast("error", err.message);
        this.spinner = true;
      });
  }
}
