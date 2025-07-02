package com.soofer.driver.View;

import com.soofer.driver.Model.EstimationModel;

import retrofit2.Response;

public interface EstimationView {
    void OnSuccessEstimate(Response<EstimationModel> response);

    void OnFailureEstimate(Response<EstimationModel> response);
}
