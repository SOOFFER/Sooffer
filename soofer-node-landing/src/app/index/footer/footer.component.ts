import { Component } from '@angular/core';
import { SectionService } from './../section/section.service';
import { AppSettings } from 'src/app/app.config';
@Component({
  selector: "footersection",
  templateUrl: "./footer.html",
  styleUrls: ["./footer.css"],
  providers: [SectionService],
})
export class FooterComponent {
  date = new Date();
  list: any = {};
  copyrightURL = AppSettings.COPYRIGHTURL_FOOTER;
  showServiceCity = AppSettings.showServiceCity;
  appName=AppSettings.APPNAME;
  public routeString = "how-it-works";
  constructor(private sectionService: SectionService) {
    this.sectionService.gethomecontent().then(res => {
      //console.log(res);
      this.list = res[0];
      //console.log(this.list);
    });
  }
}
