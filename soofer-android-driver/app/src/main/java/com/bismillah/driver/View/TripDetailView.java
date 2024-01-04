package com.bismillah.driver.View;


import com.bismillah.driver.Model.TripDetailsModel;

import retrofit2.Response;

public interface TripDetailView {

    void onSuccess(Response<TripDetailsModel> Response);

    void onFailure(Response<TripDetailsModel> Response);
}
