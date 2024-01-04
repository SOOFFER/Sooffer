package com.bismillah.app.View;

import com.bismillah.app.Model.RequestModel;

import retrofit2.Response;

public interface SetrequestView {
    void OnSuccessfully(Response<RequestModel> Response);

    void OnRequestFailure(Response<RequestModel> Response);
}
