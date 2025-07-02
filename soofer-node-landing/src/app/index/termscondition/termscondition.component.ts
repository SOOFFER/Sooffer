import { Component } from "@angular/core";
import { CommonService } from "../common/common.service";

@Component({
  selector: "termscondition",
  templateUrl: "./termscondition.html",
  providers: [CommonService]

})
export class TermsconditionComponent {
  title: string;
  description: string;
  constructor(private cservice: CommonService) {
    this.title = "Terms & Condition";

    this.cservice.getAboutPAge('Terms & Condition')
      .then(res => {
        // console.log(res[0])
        this.title = res[0].title;
        this.description = res[0].desc;
      })
  }

}
