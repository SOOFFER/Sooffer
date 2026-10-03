package com.soofer.driver.View;

import com.soofer.driver.Model.RoutesModel;

import retrofit2.Response;

public interface GooglePolylineView {
    void googlePolylineSuccess(Response<RoutesModel> resultsResponse);
    void googlePolylineFailure(Response<RoutesModel> response);

}
