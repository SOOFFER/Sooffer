package com.bismillah.driver.View;

import com.bismillah.driver.Model.RatingModel;

import java.util.List;

import retrofit2.Response;

public interface RatingView {

    void onSuccess(Response<List<RatingModel>> Response);

    void onFailure(Response<List<RatingModel>> Response);
}
