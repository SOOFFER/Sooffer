package com.bismillah.app.View;

import com.bismillah.app.Model.CancelRequestModel;

import retrofit2.Response;

public interface RequestView {
    void onSuccess(Response<CancelRequestModel> Response);
    void onFailure(Response<CancelRequestModel> Response);
}
