import { Component } from "@angular/core";
import { CommonService } from "../common/common.service";

@Component({
  selector: "insurance",
  templateUrl: "./insurance.html",
  providers: [CommonService]
})
export class InsuranceComponent {

  title: string;
  description: string;
  constructor(private cservice: CommonService) {
    this.title = "Trust Safety & Insurance";

    this.cservice.getAboutPAge(this.title)
      .then(res => {
        // console.log(res[0])
        this.title = res[0].title;
        this.description = res[0].desc;
      })
  }
}
