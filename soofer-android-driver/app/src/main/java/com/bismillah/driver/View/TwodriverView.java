package com.bismillah.driver.View;

import com.bismillah.driver.Model.EstimationModel;
import com.bismillah.driver.Model.TwoDriverModel;

import retrofit2.Response;

public interface TwodriverView {

    void OnSuccess(Response<TwoDriverModel> response);

    void OnFailure(Response<TwoDriverModel> response);

}
