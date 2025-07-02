package com.soofer.app.View;


import com.soofer.app.Model.TripFlowModel;

import retrofit2.Response;

public interface TripFlowView {

    void OnTripSuccessfully(Response<TripFlowModel> Response);

    void OnTripFailure(Response<TripFlowModel> Response);
}
