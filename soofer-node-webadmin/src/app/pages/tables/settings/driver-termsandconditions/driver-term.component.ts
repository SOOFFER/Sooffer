import { Component, OnInit } from '@angular/core';
import { TableService } from '../../table.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { AppSettings, LanguageSettings } from "../../../../app.config";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'driver-termsandconditions',
  templateUrl: './driver-term.component.html',
})

export class RiderTermsandconditionsComponent implements OnInit {

  htmlBody: any;
  htmlHeader: any;
  htmlFooter: any;
  config: any;
  dest: any;
  position: any;
  showTransOption = LanguageSettings.showTranslateOption;
  defaultLang = LanguageSettings.defaultSelectedLang;

  constructor(
    private tableservice: TableService,
    private translate: TranslateService,
    private toastr: ButtonToasterService) {
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang);
    const lang = this.defaultLang
    translate.use(lang)
    this.dest = setTimeout(() => {
      this.config = {
        height: 500,
        theme: 'modern',
        plugins: 'code',
        toolbar: 'code | formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
        image_advtab: true,
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
        templates: [
          { title: 'Test template 1', content: 'Test 1' },
          { title: 'Test template 2', content: 'Test 2' }
        ],
        content_css: [
          '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
          '//www.tinymce.com/css/codepen.min.css'
        ]
      };
    }, 0);
    this.getData(lang);
  }

  ngOnInit() {
    // this.getData();
  }

  getLang(lang) {
    console.log(lang, "lang");
    this.getData(lang)
  }

  getData(value) {
    localStorage.setItem("language", value);
    this.tableservice.getRiderTermsAndConditions(value)
      .then(res => {
        //console.log(res)
        let body = res.doc
        this.htmlHeader = body.split('<body>')[0];
        this.htmlBody = body.split('<body>').pop().split('</body>')[0];
        this.htmlFooter = body.split('</body>')[1];
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }

  submit(inputs: any): void {
    var getlanguage = localStorage.getItem("language");
    let formattedHtml = this.htmlHeader + `<body>` + inputs + `</body>` + this.htmlFooter;
    let updateHtml = {
      data: formattedHtml
    }
    this.tableservice.updateRiderTermsAndConditions(updateHtml, getlanguage)
      .then(res => {
        this.toastr.showtoast('success', res.message)
        this.getData(getlanguage);
      })
      .catch(res =>
        this.toastr.showtoast('error', res.message))
  }

  ngOnDestroy() {
    clearTimeout(this.dest);
  }

}












