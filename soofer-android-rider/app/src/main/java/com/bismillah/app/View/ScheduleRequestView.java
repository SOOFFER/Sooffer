package com.bismillah.app.View;

import com.bismillah.app.Model.ScheduleTripModel;

import retrofit2.Response;

public interface ScheduleRequestView {
    void OnSuccessfully(Response<ScheduleTripModel> Response);

    void OnRequestFailure(Response<ScheduleTripModel> Response);
}
