import { Component } from "@angular/core";
import { CommonService } from "../common/common.service";

@Component({
  selector: "legal",
  templateUrl: "./legal.html",
  providers: [CommonService]

})
export class LegalComponent {
  title: string;
  description: string;
  constructor(private cservice: CommonService) {
    this.title = "Legal";

    this.cservice.getAboutPAge(this.title)
      .then(res => {
        //console.log(res[0])
        this.title = res[0].title;
        this.description = res[0].desc;
      })
  }
}
