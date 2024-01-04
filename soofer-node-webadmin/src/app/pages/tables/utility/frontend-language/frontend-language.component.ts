import { Component, OnInit } from "@angular/core";
import { ButtonToasterService } from "../../../buttontoaster/buttontoaster.service";
import { Http } from "@angular/http";
import { UtilityService } from "../utility.service";
import { ServerDataSource } from "ng2-smart-table";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { AppSettings } from "../../../../app.config";
import { app } from "firebase";

@Component({
  selector: "frontend-language",
  templateUrl: "./frontend-language.component.html"
})
export class FrontendComponent {
  settings = {
    actions: {
      edit: false,
      delete: false,
      add: false,
      custom: [{ name: "routeToPage", title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10
    },
    columns: {
      data: {
        title: "Language"
      },
      folderpath: {
        title: "Download",
        filter: false,
        type: "html",
        valuePrepareFunction: value => {
          const htmlTag =
            '<a href="' +
            "http://34.67.121.212:3001/locales/" +
            '" download><i class="fa fa-download" aria-hidden="true"></i></a>';
          return this.sanitizer.bypassSecurityTrustHtml(htmlTag);
        }
      }
    }
  };

  source: any;
  initial: any = "listg";
  lang: any;
  language: any;
  list: any = {};
  data: any;
  selectedFile: any;
  file: string;
  url: any;
  baseurl = AppSettings.BASEURL;
  fileUrl: any;

  constructor(
    private _http: HttpClient,
    private toastr: ButtonToasterService,
    private http: Http,
    private sanitizer: DomSanitizer,
    private service: UtilityService
  ) {
    this.getLanguage();
    // this.source = new ServerDataSource(_http, { endPoint : AppSettings.API_ENDPOINT + 'listLanguage'});
  }

  getLanguage() {
    this.service
      .GetFrontendLanguageData()
      .then(res => {
        this.language = res.data;
        // this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
    // this.source = new ServerDataSource(this._http, {
    //   dataKey: "data",
    //   endPoint: AppSettings.API_ENDPOINT + "listLanguage"
    // });
    // console.log(this.source, "source");
  }

  GetLanguge(data) {
    this.initial = "detail";
    console.log(data);
    this.data = data;
    // this.service
    //   .GetLanguageDetail(data)
    //   .then(res => {
    //     this.list.data = JSON.stringify(res.data);
    //     console.log(this.list.data);
    //     // this.initial = 'listg';

    //     // this.toastr.showtoast('success', res.message);
    //   })
    //   .catch(res => {
    //     this.toastr.showtoast("error", res.message);
    //   });
  }

  Add() {
    this.initial = "data";
  }

  Update(data) {
    // console.log(JSON.parse(data.data));
    // console.log(typeof data);
    const formdata = new FormData();
    formdata.append("file", this.file);
    // formdata.append('language',data.language)
    this.service
      .UpdateFrontendLanguage(this.data, formdata)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.initial = "listg";
        this.getLanguage();
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    this.file = this.selectedFile;
    // const fileReader = new FileReader();
    // console.log(fileReader)
    // fileReader.readAsText(this.selectedFile, "UTF-8");
    // fileReader.onload = (e) => {
    //     this.file = e.target.result;
    // console.log(this.file)
    // }
    // fileReader.onerror = (error) => {
    //   console.log(error);
    // }
  }

  onUpload() {
    // console.log(fileReader)
    // console.log(fileReader.result)
    // var file = fileReader.result
    const formdata = new FormData();
    formdata.append("file", this.file);
    formdata.append("language", this.list.language);
    console.log(formdata);
    this.service
      .AddFrontendLanguage(formdata)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.initial = "listg";
        this.getLanguage();
      })
      .catch(res => {
        console.log(res);
        const error = JSON.parse(res._body);
        this.toastr.showtoast("error", error.message);
        this.list = "";
      });
  }

  download(data){
    console.log(data)
    this.service.DownloadLanguage(data)
    .then(res=>{
        this.toastr.showtoast('success',res.message)
        this.url = res.URL
        this.sanitizer.bypassSecurityTrustHtml(this.url)
    })
    .catch(res=>{
        this.toastr.showtoast('error',res.message)
    })
    }

  // download(data) {
  //   console.log(data);
  //   //  this.url = "http://34.67.121.212:3001/locales/en.json";
  //   this.service
  //     .DownloadLanguage(data)
  //     .then(res => {
  //       // this.toastr.showtoast("success", res.message);
  //       // console.log(res);

  //       // this.url = res.URL;
  //       // return this.sanitizer.bypassSecurityTrustHtml(res);
  //       const dwnld = res;
  //       console.log(dwnld);
  //       const blob = new Blob([dwnld], { type: "string" });
  //       this.fileUrl =this.sanitizer.bypassSecurityTrustResourceUrl(
  //         window.URL.createObjectURL(blob)
  //       );
  //     })
  //     .catch(res => {
  //       this.toastr.showtoast("error", res.message);
  //     });
  // }

  GoBack() {
    this.initial = "listg";
  }
}
