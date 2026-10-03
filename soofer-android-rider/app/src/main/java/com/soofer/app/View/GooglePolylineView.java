package com.soofer.app.View;

import com.soofer.app.Model.RoutesModel;

import retrofit2.Response;

public interface GooglePolylineView {
    void googlePolylineSuccess(Response<RoutesModel> resultsResponse);
    void googlePolylineFailure(Response<RoutesModel> response);

}
