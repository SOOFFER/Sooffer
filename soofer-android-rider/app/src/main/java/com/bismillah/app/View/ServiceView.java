package com.bismillah.app.View;

import com.bismillah.app.Model.ServiceModel;

import retrofit2.Response;

public interface ServiceView {
    void OnSuccess(Response<ServiceModel> response);
    void OnFailure(Response<ServiceModel> response);
    void show();
    void hide();
}
