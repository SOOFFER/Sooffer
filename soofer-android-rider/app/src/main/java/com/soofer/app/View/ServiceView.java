package com.soofer.app.View;

import com.soofer.app.Model.ServiceModel;

import retrofit2.Response;

public interface ServiceView {
    void OnSuccess(Response<ServiceModel> response);
    void OnFailure(Response<ServiceModel> response);
    void show();
    void hide();
}
