package com.bismillah.driver.View;

import com.bismillah.driver.Model.EstimationModel;

import retrofit2.Response;

public interface EstimationView {
    void OnSuccessEstimate(Response<EstimationModel> response);

    void OnFailureEstimate(Response<EstimationModel> response);
}
