import { Component, OnInit } from '@angular/core';
import { TableService } from '../../table.service';
import { AppSettings, LanguageSettings } from '../../../../app.config';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'ngx-rental-config',
  templateUrl: './rental-config.component.html',
  styleUrls: ['./rental-config.component.scss']
})
export class RentalConfigComponent implements OnInit {

  config: any;
  language = LanguageSettings.defaultSelectedLang;
  showTransOption = LanguageSettings.showTranslateOption;
  position: any;
  list: any = {
    description: {
      htmlHeader: '',
      htmlBody: '',
      htmlFooter: ''
    },
    dynamicDescription: {
      htmlHeader: '',
      htmlBody: '',
      htmlFooter: ''
    }
  };
  defaultLang = LanguageSettings.defaultSelectedLang;


  constructor(
    private tableservice: TableService,
    private toastr: ButtonToasterService, private translate: TranslateService) {
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang);
    // console.log(browserLang, "browserLang");
    const lang = this.defaultLang
    translate.use(lang)

    this.list = {
      description: {
        htmlHeader: '',
        htmlBody: '',
        htmlFooter: ''
      },
      dynamicDescription: {
        htmlHeader: '',
        htmlBody: '',
        htmlFooter: ''
      }
    };
    setTimeout(() => {
      this.config = {
        height: 250,
        theme: 'modern',
        plugins: 'code',
        toolbar: 'code | formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
        image_advtab: true,
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
        templates: [
          { title: 'Test template 1', content: 'Test 1' },
          { title: 'Test template 2', content: 'Test 2' },
        ],
        content_css: [
          '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
          // '//www.tinymce.com/css/codepen.min.css'
        ],
      };
    }, 0);
    this.language = lang;
    this.getData(this.language);
  }

  getData(value) {
    localStorage.setItem("language", value);
    this.tableservice.getRentalConfig(value)
      .then(res => {
        this.list.description = this.convertHTMLtoText(res['data'].description);
        this.list.dynamicDescription = this.convertHTMLtoText(res['data'].dynamicDescription);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  getLang(lang) {
    console.log(lang, "lang");
    this.getData(lang)
  }

  convertHTMLtoText(res) {
    const obj = {
      htmlHeader: res.split('<body>')[0],
      htmlBody: res.split('<body>').pop().split('</body>')[0],
      htmlFooter: res.split('</body>')[1],
    };
    return obj;
  }

  ngOnInit() { }

  convertTexttoHTML(resp) {
    return resp.htmlHeader + `<body>` + resp.htmlBody + `</body>` + resp.htmlFooter;
  }

  updateRecord(inputs: any): void {
    const updateObj = {
      description: this.convertTexttoHTML(inputs.description),
      dynamicDescription: this.convertTexttoHTML(inputs.dynamicDescription)
    };
    console.log(updateObj);
    console.log(this.language);
    this.tableservice.updateRentalConfig(updateObj, localStorage.language)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.getData(localStorage.language);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

}
