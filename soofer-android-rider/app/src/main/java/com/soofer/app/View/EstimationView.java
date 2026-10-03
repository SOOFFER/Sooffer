package com.soofer.app.View;

import com.soofer.app.Model.EstimationModel;

import retrofit2.Response;

public interface EstimationView {
    void OnSuccess(Response<EstimationModel> response);

    void OnFailure(Response<EstimationModel> response);
}
