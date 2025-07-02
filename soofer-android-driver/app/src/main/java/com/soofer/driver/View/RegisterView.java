package com.soofer.driver.View;


import com.soofer.driver.Model.CityModel;
import com.soofer.driver.Model.CountryModel;
import com.soofer.driver.Model.OTPModel;
import com.soofer.driver.Model.RegisterModel;
import com.soofer.driver.Model.StateModel;

import java.util.List;

import retrofit2.Response;

public interface RegisterView {
    void RegisterView(retrofit2.Response<RegisterModel> Response);
    void Errorlogview(retrofit2.Response<RegisterModel> Response);
    void JsonResponse(String object);

    void onSuccessOTP(retrofit2.Response<OTPModel> Response);

    void onFailureOTP(retrofit2.Response<OTPModel> Response);

    void OTPVerification();

    void countrysuccess(Response<List<CountryModel>> Response);

    void countryfailure(Response<List<CountryModel>> Response);

    void statesuccess(Response<List<StateModel>>Response);

    void statefailure(Response<List<StateModel>> Response);

    void citysuccess(Response<List<CityModel>>Response);

    void cityfailure(Response<List<CityModel>> Response);
}
