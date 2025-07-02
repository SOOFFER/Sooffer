package com.soofer.app.View;

import com.soofer.app.Model.RequestModel;

import retrofit2.Response;

public interface SetrequestView {
    void OnSuccessfully(Response<RequestModel> Response);

    void OnRequestFailure(Response<RequestModel> Response);
}
