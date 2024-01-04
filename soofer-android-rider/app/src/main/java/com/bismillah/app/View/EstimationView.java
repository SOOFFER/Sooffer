package com.bismillah.app.View;

import com.bismillah.app.Model.EstimationModel;

import retrofit2.Response;

public interface EstimationView {
    void OnSuccess(Response<EstimationModel> response);

    void OnFailure(Response<EstimationModel> response);
}
