package com.soofer.app.View;

import com.soofer.app.Model.ScheduleTripModel;

import retrofit2.Response;

public interface ScheduleRequestView {
    void OnSuccessfully(Response<ScheduleTripModel> Response);

    void OnRequestFailure(Response<ScheduleTripModel> Response);
}
