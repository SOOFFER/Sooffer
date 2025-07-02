import { Component } from "@angular/core";
import { CommonService } from "../common/common.service";

@Component({
  selector: "privacypolicy",
  templateUrl: "./privacypolicy.html",
  providers: [CommonService]

})
export class PrivacypolicyComponent {
  title: string;
  description: string;
  constructor(private cservice: CommonService) {
    this.title = "Privacy Policy";

    this.cservice.getAboutPAge(this.title)
      .then(res => {
        //console.log(res[0])
        this.title = res[0].title;
        this.description = res[0].desc;
      })
  }
}
