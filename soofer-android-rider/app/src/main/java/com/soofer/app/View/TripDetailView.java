package com.soofer.app.View;




import com.soofer.app.Model.TripDetailsModel;

import retrofit2.Response;

public interface TripDetailView {

    void onSuccess(Response<TripDetailsModel> Response);

    void onFailure(Response<TripDetailsModel> Response);
}
