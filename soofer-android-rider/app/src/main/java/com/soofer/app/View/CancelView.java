package com.soofer.app.View;

import com.soofer.app.Model.CancelTripModel;

import retrofit2.Response;

public interface CancelView {
    void OnSuccessfully(Response<CancelTripModel> Response);

    void OnFailure(Response<CancelTripModel> Response);
}
