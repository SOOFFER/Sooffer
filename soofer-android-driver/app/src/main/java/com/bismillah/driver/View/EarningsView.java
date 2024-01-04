package com.bismillah.driver.View;

import com.bismillah.driver.Model.EarningsModel;

import retrofit2.Response;

public interface EarningsView {

    void onSuccess(Response<EarningsModel> Response);

    void onFailure(Response<EarningsModel> Response);
}
