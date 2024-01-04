package com.bismillah.app.View;

import com.bismillah.app.Model.CancelTripModel;

import retrofit2.Response;

public interface CancelView {
    void OnSuccessfully(Response<CancelTripModel> Response);

    void OnFailure(Response<CancelTripModel> Response);
}
