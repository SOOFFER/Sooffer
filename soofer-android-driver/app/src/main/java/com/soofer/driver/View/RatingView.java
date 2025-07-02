package com.soofer.driver.View;

import com.soofer.driver.Model.RatingModel;

import java.util.List;

import retrofit2.Response;

public interface RatingView {

    void onSuccess(Response<List<RatingModel>> Response);

    void onFailure(Response<List<RatingModel>> Response);
}
