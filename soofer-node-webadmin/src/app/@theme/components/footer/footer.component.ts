import { Component } from '@angular/core';
import { AppSettings } from '../../../app.config';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
  <div class="row col-lg-12 col-md-12">
  <div class="col-md-6">
  <span class="created-by"><b><a href={{URL}} target="_blank">{{title}}</a></b> {{year}}</span>
  </div>
  <div class="col-md-6">
  <span class="pull-right">
  <a><b>Version {{version}}</b></a>
         </span>
  </div>
         </div>
  `,
})
export class FooterComponent {
  version = AppSettings.version;
  title = AppSettings.APPNAME;
  year = AppSettings.APPYEAR;
  URL = AppSettings.FEURL;
  // <span class="created-by">Created with ♥ by <b><a href="https://akveo.com" target="_blank">Akveo</a></b> 2017</span>
  // <div class="socials">
  //   <a href="#" target="_blank" class="ion ion-social-github"></a>
  //   <a href="#" target="_blank" class="ion ion-social-facebook"></a>
  //   <a href="#" target="_blank" class="ion ion-social-twitter"></a>
  //   <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
  // </div>
}
