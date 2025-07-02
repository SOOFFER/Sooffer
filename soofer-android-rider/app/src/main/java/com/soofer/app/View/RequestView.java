package com.soofer.app.View;

import com.soofer.app.Model.CancelRequestModel;

import retrofit2.Response;

public interface RequestView {
    void onSuccess(Response<CancelRequestModel> Response);
    void onFailure(Response<CancelRequestModel> Response);
}
