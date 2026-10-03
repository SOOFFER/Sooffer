package com.soofer.driver.View;

import com.soofer.driver.Model.TwoDriverModel;

import retrofit2.Response;

public interface TwodriverView {

    void OnSuccess(Response<TwoDriverModel> response);

    void OnFailure(Response<TwoDriverModel> response);

}
