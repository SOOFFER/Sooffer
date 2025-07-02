// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AppSettings, featuresSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CommonService {

  private apiUrl = AppSettings.API_ENDPOINT;
  private TapiUrl = AppSettings.VEH_ENDPOINT;

  public bSubject = new BehaviorSubject(AppSettings.GOOGLE_MAP_DEFAULT_LOCATION);

  constructor(private http: HttpClient) { }

  doAddFormControlNgSelectClass() {
    setTimeout(function () {
      const selectboxElements = document.querySelectorAll('ng-select > div');
      for (let i = 0; i < selectboxElements.length; ++i) {
        selectboxElements[i].classList.add('form-control');
      }
    }, 500);
  }

  pageMenus() {
    return this.http.get(this.apiUrl + 'getMenu')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getDocumentsettings(data): Promise<any> {
    return this.http
      .get(this.apiUrl + "getNeededDocuments/" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }



  doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response) {
    if (typeof response === 'string') {
      errorMessage = response;
    } else if (
      typeof response['_body'] !== 'undefined'
      && response['_body'] !== ''
    ) {
      try {
        if (typeof response['_body'] === 'string') {
          response['_body'] = JSON.parse(response['_body']);
        }

        if (
          typeof response['_body']['message'] !== 'undefined'
          && response['_body']['message'] !== ''
        ) {
          errorMessage = response['_body']['message'];
        }
        return errorMessage;
      } catch (error) {
        errorMessage = error.toString();
        return errorMessage;
      }
    }
  }

  generalfunFor(Availbleservice, whichApi = 'adminapi') {
    let url = AppSettings.API_ENDPOINT;
    if (whichApi === 'api') {
      url = AppSettings.VEH_ENDPOINT;
    }
    return this.http.get(url + Availbleservice)
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(this.handleError);
  }
  getDailyVehciles(data): Promise<any> {
    return this.http
      .get(
        // this.apiUrl + 'getDailyVehicle?city=' + data
        this.apiUrl + "getVechicleName/daily/" + data
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getBoundryPolygonForaCity(data): Promise<any> {
    return this.http.get(this.apiUrl + 'getCityBoundaryPolygonForANewCity?city=' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  cancelATrip(data): Promise<any> {
    return this.http.put(this.apiUrl + 'cancelCurrentTrip/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  endATrip(data): Promise<any> {
    return this.http.post(this.apiUrl + 'endTripFromAdmin/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getBoundryPolygon(data): Promise<any> {
    return this.http.get(this.apiUrl + 'getCityBoundaryPolygon/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getOuterPolygon(data): Promise<any> {
    return this.http.get(this.apiUrl + 'getOuterBoundaryPolygon/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }


  upadteCityBoundry(input, city): Promise<any> {
    console.log(city);
    return this.http.put(this.apiUrl + 'getCityBoundaryPolygon/' + city, input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  upadteOuterBoundry(input, city): Promise<any> {
    console.log(city);
    return this.http.put(this.apiUrl + 'getOuterBoundaryPolygon/' + city, input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }


  getCitiesSelected(data): Promise<any> {
    return this.http.get(this.apiUrl + 'city/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getStatesSelected(data): Promise<any> {
    return this.http.get(this.apiUrl + 'state/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getServiceAvailableCity(): Promise<any> {
    return this.http.get(this.apiUrl + 'AvailbleserviceCity/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCArView(data): Promise<any> {
    return this.http.get(this.apiUrl + 'godView' + '/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetStateofSelectedCountry(data): Promise<any> {
    return this.http.get(this.apiUrl + 'state/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCountriesSelected(data): Promise<any> {
    return this.http.get(this.apiUrl + 'countries/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getPackage(): Promise<any> {
    return this.http.get(this.apiUrl + 'package')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getCountries(): Promise<any> {
    return this.http.get(this.apiUrl + 'countries')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getTypeAhead(): Promise<any> {
    return this.http.post(this.apiUrl + 'getDriverTypeahead/', 'fdfrt')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);

  }

  AddLanguageval(data): Promise<any> {
    return this.http.post(this.apiUrl + 'languagesForAdminUiCRUD/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  UpdateLangval(data): Promise<any> {
    return this.http.put(this.apiUrl + 'languagesForAdminUiCRUD/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DeleteLangval(data): Promise<any> {
    return this.http.delete(this.apiUrl + 'languagesForAdminUiCRUD/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  AddColorval(data): Promise<any> {
    return this.http.post(this.apiUrl + 'colorForAdminUiCRUD/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  UpdateColorval(data): Promise<any> {
    return this.http.put(this.apiUrl + 'colorForAdminUiCRUD/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DeleteColorval(data): Promise<any> {
    return this.http.delete(this.apiUrl + 'colorForAdminUiCRUD/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }


  AddYearval(data): Promise<any> {
    return this.http.post(this.apiUrl + 'yearsForAdminUiCRUD/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  UpdateYearval(data): Promise<any> {
    return this.http.put(this.apiUrl + 'yearsForAdminUiCRUD/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DeleteYearval(data): Promise<any> {
    return this.http.delete(this.apiUrl + 'yearsForAdminUiCRUD/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  AddCurrencyval(data): Promise<any> {
    return this.http.post(this.apiUrl + 'currencyForAdminUiCRUD/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  UpdateCurrencyval(data): Promise<any> {
    return this.http.put(this.apiUrl + 'currencyForAdminUiCRUD/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DeleteCurrencyval(data): Promise<any> {
    return this.http.delete(this.apiUrl + 'currencyForAdminUiCRUD/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }





  GetState(data): Promise<any> {
    return this.http.get(this.apiUrl + 'state/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetCity(data): Promise<any> {
    return this.http.get(this.apiUrl + 'city/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCompanies(): Promise<any> {
    return this.http.get(this.apiUrl + 'companies/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getLangs(): Promise<any> {
    return this.http.get(this.apiUrl + 'languages/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCurrency(): Promise<any> {
    return this.http.get(this.apiUrl + 'currency/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCarMake(): Promise<any> {
    return this.http.get(this.apiUrl + 'carmake/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getYearsData(): Promise<any> {
    return this.http.get(this.apiUrl + 'years/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetDrivers(data): Promise<any> {
    return this.http.get(this.apiUrl + 'companyDrivers/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetTripDetails(data): Promise<any> {
    return this.http.get(this.apiUrl + 'tripDetails/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getATripDetailsForDetailView(data): Promise<any> {
    return this.http.get(this.apiUrl + 'getATripDetailsForDetailView/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteATripDetails(data): Promise<any> {
    return this.http.delete(this.apiUrl + 'tripDetails/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getTripMailDetails(data): Promise<any> {
    return this.http.post(this.apiUrl + 'sendTripReceipt/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getVehicleTypeData(): Promise<any> {
    return this.http.get(this.apiUrl + 'allvehicletypes/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getTypeData(tok: any): Promise<any> {
    const headers = new Headers();
    headers.append('x-access-token', tok);
    const opts = new RequestOptions();
    opts.headers = headers;
    return this.http.post(this.TapiUrl + 'serviceBasicFare/', opts)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  markSettledDvrPayment(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'markSettledDvrPayment/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  gethelpCatagory(): Promise<any> {
    return this.http.get(this.apiUrl + 'helpcategory/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addHelp(addData) {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'help/', addData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  editHelp(updateData: any, id): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'help/' + id, updateData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deletefHelpTopic(id: any): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + 'help/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addHelpCat(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'helpcategory/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  editHelpCat(inputs: any, id): Promise<any> {
    return this.http.put(this.apiUrl + 'helpcategory/' + id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteHelpCat(id: any): Promise<any> {
    return this.http.delete(this.apiUrl + 'helpcategory/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  Deletedriverdailyattendance(id): Promise<any> {
    return this.http.delete(this.apiUrl + 'DriverAttendance/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addFaq(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'faq/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  editFaq(inputs: any, id): Promise<any> {
    return this.http.put(this.apiUrl + 'faq/' + id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deletefaq(id: any): Promise<any> {
    return this.http.delete(this.apiUrl + 'faq/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getfaqCatagory(): Promise<any> {
    return this.http.get(this.apiUrl + 'faqcategory')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getfaqLang(data): Promise<any> {
    return this.http.get(this.apiUrl + 'faq?language=' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getfaqCat(data): Promise<any> {
    return this.http.get(this.apiUrl + 'faqcategory?language=' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  // New 
  // getHelp(data): Promise<any> {
  //   return this.http.get(this.apiUrl + 'helpcategory?language=' + data)
  //     .toPromise()
  //     .then(this.handleData)
  //     .catch(this.handleError);
  // }


  getHelp(data): Promise<any> {
    return this.http.get(this.apiUrl + 'help')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getHelpCat(data): Promise<any> {
    return this.http.get(this.apiUrl + 'helpcategory?language=' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addFaqCat(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'faqcategory/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  editFaqCat(inputs: any, id): Promise<any> {
    return this.http.put(this.apiUrl + 'faqcategory/' + id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deletefaqCat(id: any): Promise<any> {
    return this.http.delete(this.apiUrl + 'faqcategory/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getLatLng(city): Promise<any> {
    if (city == undefined || city == 'all') {
      return this.http.get(this.apiUrl + 'heatMap/')
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
    else {
      return this.http.get(this.apiUrl + 'heatMap?scity_like=' + city)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }

  }

  getLatLngWithLimits(fromDate, toDate): Promise<any> {
    return this.http.get(this.apiUrl + 'heatMap?createdAt_gte=' + fromDate + '&createdAt_lte=' + toDate)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  approveDriverTranxDetails(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'driverBankTransactions/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  minimumBalance(): Promise<any> {
    return this.http.get(this.apiUrl + 'minimumBalance/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateminimumBalance(data): Promise<any> {
    const headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const opts = new RequestOptions();
    opts.headers = headers;

    return this.http.put(this.apiUrl + 'minimumBalance/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deactivateAllUsers(data): Promise<any> {
    const headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const opts = new RequestOptions();
    opts.headers = headers;

    return this.http.put(this.apiUrl + 'setinactivedrivers/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  tripRequestedDrivers(data): Promise<any> {
    return this.http.get(this.apiUrl + 'tripRequestedDrivers/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deliveryRequestedDrivers(data): Promise<any> {
    return this.http.get(this.apiUrl + 'deliveryTripRequest/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getRider(data): Promise<any>{
    return this.http.get(this.apiUrl  + "rider?email_like=" + data +"&_page=1&_limit=10") 
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError);
  }
  getOneDriver(id): Promise<any>{
    return this.http.get(this.apiUrl + 'driver?code_like='+`${id}`+"&_page=1&_limit=10") 
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError);
  }

  private handleData(res: any) {
    const body = res;
    //  console.log(body); // for development purposes only
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    // console.error('An error occurred', error); // for development purposes only
    const err = error;
    //  console.log(err.message)
    return Promise.reject(err || error);
  }

  private Availbleservicefilter(data) {
    const city = [];
    data.forEach(el => {
      if (featuresSettings.isCityWise == true) {
        city.push(el);
      }
      else {
        if (el.city == 'Default') {
          city.push(el);
        }
      }
    });
    return city;
  }

  convertionOfServiceId(data) {
    console.log(data);
    const docs = [];
    data.forEach(ele => {
      if (ele._id) {


        data = {
          scId: ele._id,
          name: ele.label ? ele.label : (ele.name ? ele.name : '')
        };
      }
      else {
        data = ele;
      }
      docs.push(data);
    });
    return docs;
  }


  dataforscids(data) {
    if (featuresSettings.isServiceAvailable === false) {
      let Default;
      data.forEach(el => {
        if (el.name === 'Default' || el.label === 'Default') {
          Default = [el];
        }
      });
      return Default;
    }
    else {
      return data;
    }

  }



  onDeSelect(data, e) {

    data.forEach((el, key) => {
      console.log;
      if (e._id === el.scId || e._id === el._id) {
        if (key > -1) {
          data.splice(key, 1);
        }
      }
    });

    data = this.convertionOfServiceId(data);
    return data;
  }

  ReconvertionScid(data) {
    let newDocs = [];
    if (data == undefined) {

      newDocs = [];
    }
    else {
      data.forEach(el => {
        const convert = {
          _id: el.scId,
          label: el.name
        };
        newDocs.push(convert);
      });

    }
    return newDocs;
  }

}
