package com.soofer.driver.View;

import com.soofer.driver.Model.EarningsModel;

import retrofit2.Response;

public interface EarningsView {

    void onSuccess(Response<EarningsModel> Response);

    void onFailure(Response<EarningsModel> Response);
}
