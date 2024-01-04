package com.bismillah.app.View;




import com.bismillah.app.Model.TripDetailsModel;

import retrofit2.Response;

public interface TripDetailView {

    void onSuccess(Response<TripDetailsModel> Response);

    void onFailure(Response<TripDetailsModel> Response);
}
