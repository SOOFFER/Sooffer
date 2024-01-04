// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppSettings } from '../../../app.config';
import { HttpErrorResponse } from '@angular/common/http';

// import 'rxjs/add/operator/toPromise';

@Injectable()
export class UtilityService {

  constructor(private http: Http) { }
  data: any = [];
  private apiUrl = AppSettings.API_ENDPOINT;
  GetAdminLanguageData() {
    return this.http.get(this.apiUrl + "adminLanguageUpdate/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  AddAdminLanguage(data) {
    return this.http.post(this.apiUrl + 'adminLanguageUpdate', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  AddFrontendLanguage(data) {
    return this.http.post(this.apiUrl + 'landingLanguageUpdate', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  GetVehicleData(data) {
    return this.http.get(this.apiUrl + "vehicleDetails?language=" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  GetLanguageDetail(data: any) {
    return this.http
      .get(this.apiUrl + "languageUpdate/" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  GetFrontendLanguageData() {
    return this.http.get(this.apiUrl + "landingLanguageUpdate/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  UpdateAdminLanguage(data, inputs) {
    return this.http.put(this.apiUrl + 'adminLanguageUpdate/' + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  UpdateFrontendLanguage(data, inputs) {
    return this.http.put(this.apiUrl + 'landingLanguageUpdate/' + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  UpdateLanguage(data: any, inputs: any) {
    return this.http
      .put(this.apiUrl + "languageUpdate/" + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DownloadLanguage(data): Promise<any> {
    return this.http
      .get(AppSettings.BASEURL + "locales/" + data + ".json")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  AddLanguage(data): Promise<any> {
    return this.http
      .post(this.apiUrl + "listLanguage/", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError1);
  }

  GetLanguageData() {
    return this.http
      .get(this.apiUrl + "listLanguage")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateHowItsBlockForDriver(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'updateHowItWorksDriver/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateDriverPage(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'updatedriverHomePage/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateHowItsBlockForRider(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'updateHowItWorksRider/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateRiderPage(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'updateriderHomePage/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  HomeBannerAndOurDriver(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'updateHomeBannerOurDriver/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateHowItsBlock(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'updateHowItWorksHome/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  submitHomeSeconMiddle(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'updateHomeSeconMiddleSection/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateLangMgmt(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'languageUpdate/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addServiceCity(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'serviceAvailable/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getRidersList(): Promise<any> {
    return this.http.get(this.apiUrl + 'ridersForNotificationTest/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  sendTest(testFor: any, inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'testThirdParty/' + testFor + '/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  createBackUp(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'dbbackup/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteBackUp(inputs: any): Promise<any> {
    return this.http.delete(this.apiUrl + 'dbbackup/' + inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deletecityService(id): Promise<any> {
    //  console.log("at service");
    return this.http.delete(this.apiUrl + 'serviceAvailable/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  UpdateserviceCity(inputs: any): Promise<any> {
    //  console.log("at service");
    return this.http.put(this.apiUrl + 'serviceAvailable/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  addhomecontent(inputs: any): Promise<any> {
    //  console.log("at service");
    return this.http.post(this.apiUrl + 'homecontent/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateMyPage(inputs): Promise<any> {
    return this.http.put(this.apiUrl + 'pages/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getCities(): Promise<any> {
    //  console.log("at service");
    return this.http.get(this.apiUrl + 'serviceAvailable/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  sendpush(inputs): Promise<any> {
    return this.http.post(this.apiUrl + 'sendPushNotifyBulk/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  sendSMS(inputs): Promise<any> {
    //  console.log("at service");
    return this.http.post(this.apiUrl + 'sendPushNotifyBulk/sms', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getHomecontent(value): Promise<any> {
    return this.http.get(this.apiUrl + 'gethomecontent?language=' + value)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getHomecontents(): Promise<any> {
    return this.http.get(this.apiUrl + 'gethomecontent/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getcountry(): Promise<any> {
    return this.http.get(this.apiUrl + 'countriesForAdminUiCRUD/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }


  updateFirstBlock(inputs: any, data: any): Promise<any> {
    return this.http.post(this.apiUrl + 'homeFirstBlock?language=' + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateSecondBlock(inputs: any, data: any): Promise<any> {
    return this.http.post(this.apiUrl + 'homeSecondBlock?language=' + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateHomeFooter(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'updateHomeFooter/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateFooter(inputs: any, data: any): Promise<any> {
    return this.http.post(this.apiUrl + 'footerSection?language=' + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateThirdBlock(inputs: any, data: any): Promise<any> {
    return this.http.post(this.apiUrl + 'homeThirdBlock?language=' + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  addHomeDriver(inputs): Promise<any> {
    return this.http.post(this.apiUrl + 'ourDrivers/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  AddVehicle(inputs): Promise<any> {
    return this.http.post(this.apiUrl + 'vehicleDetails/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  updateHomeDriver(inputs): Promise<any> {
    return this.http.put(this.apiUrl + 'ourDrivers/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateVehicle(inputs: any, id: any): Promise<any> {
    return this.http.put(this.apiUrl + 'vehicleDetails/' + id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  DeleteHomeDriver(id): Promise<any> {
    return this.http.delete(this.apiUrl + 'ourDrivers/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  DeleteVehicle(id): Promise<any> {
    return this.http.delete(this.apiUrl + 'vehicleDetails/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }


  addStates(input) {
    return this.http.post(AppSettings.API_ENDPOINT + 'statesForAdminUiCRUD/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }


  updateStates(input) {
    return this.http.put(AppSettings.API_ENDPOINT + 'statesForAdminUiCRUD/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteStates(data) {
    return this.http.delete(this.apiUrl + 'statesForAdminUiCRUD/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }




  Addcities(inputs): Promise<any> {
    //  console.log("at service");
    return this.http.post(this.apiUrl + 'citiesForAdminUiCRUD', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }


  updatecities(inputs): Promise<any> {
    //  console.log("at service");
    return this.http.put(this.apiUrl + 'citiesForAdminUiCRUD', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  deletecities(inputs): Promise<any> {
    //  console.log("at service");
    return this.http.delete(this.apiUrl + 'citiesForAdminUiCRUD/' + inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }


  Addcountries(inputs): Promise<any> {
    //  console.log("at service");
    return this.http.post(this.apiUrl + 'countriesForAdminUiCRUD', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateCountry(inputs): Promise<any> {
    //  console.log("at service");
    return this.http.put(this.apiUrl + 'countriesForAdminUiCRUD', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  deleteCountry(inputs): Promise<any> {
    //  console.log("at service");
    return this.http.delete(this.apiUrl + 'countriesForAdminUiCRUD/' + inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addLang(addData: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'addSelectedLanguages/', addData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetLanguages(): Promise<any> {
    return this.http.get(AppSettings.API_ENDPOINT + 'getAvailableLanguages/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  deleteLang(id: any): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + 'deleteSelectedLanguages/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }


  updateLang(addData: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'updateSelectedLanguages/', addData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  AddCarModel(addData) {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'carMakeForCRUD/', addData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);

  }
  UpdateCarModel(updateData: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'carMakeForCRUD/', updateData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  DeleteCarModel(id: any): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + 'carMakeForCRUD/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateSeoSettings(input) {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'seosettings/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getPages(): Promise<any> {
    //  console.log("at service");
    return this.http.get(this.apiUrl + 'pages/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getPagesLang(data): Promise<any> {
    //  console.log("at service");
    return this.http.get(this.apiUrl + 'pages?language=' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDriverLang(data): Promise<any> {
    //  console.log("at service");
    return this.http.get(this.apiUrl + 'ourDrivers?language=' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: any) {
    const body = res.json();
    //   console.log(body); // for development purposes only
    return body || {};
  }

  private handleError1(error: Error | HttpErrorResponse): Promise<any> {
    console.log(error);
    if (error instanceof HttpErrorResponse) {
      //  return Promise.reject(error);
      console.log("Server or connection error happened");
      if (!navigator.onLine) {
        return Promise.reject(error);
        console.log("Handle offline error");
      } else {
        // Handle Http Error (error.status === 403, 404...)
        return Promise.reject(error.message || error);
      }
    } else {
      return Promise.reject(error.message || error);
      // Handle Client Error (Angular Error, ReferenceError...)
    }
  }

  private handleError(error: any): Promise<any> {
    // console.error('An error occurred', error); // for development purposes only
    return Promise.reject(error.message || error);
  }

}
