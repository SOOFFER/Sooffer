import { Component, OnInit } from "@angular/core";
import { MatChipInputEvent } from "@angular/material";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { UtilityService } from "../../utility.service";
import { ButtonToasterService } from "../../../../buttontoaster/buttontoaster.service";
import { Router } from "@angular/router";

@Component({
  selector: "addcarmakemodel",
  templateUrl: "./addcarmakemodel.component.html",
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
export class AddcarmakemodelComponent implements OnInit {
  carmodel = [];
  list: any = {};
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  spinner: boolean = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(
    private service: UtilityService,
    private toastr: ButtonToasterService,
    private route: Router
  ) {}

  ngOnInit() {}

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
  featureconvertion() {
    let data = [];
    this.carmodel.forEach(ele => {
      data.push(ele.name);
    });
    return data;
  }
  AddNewDoc(data) {
    data.model = this.featureconvertion();
    this.service
      .AddCarModel(data)
      .then(msg => {
        this.toastr.showtoast("success", msg.message);
        this.spinner = true;
        this.nextpage();
      })
      .catch(err => {
        this.toastr.showtoast("error", err.message);
        this.spinner = true;
      });
  }
  nextpage() {
    this.route.navigate(["pages/tables/utility/carmakemodel/viewcarmakemodel"]);
  }
}
