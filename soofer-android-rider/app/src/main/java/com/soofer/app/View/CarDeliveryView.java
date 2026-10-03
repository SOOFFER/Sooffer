package com.soofer.app.View;

import com.soofer.app.Model.CardDeliveryModel;

import retrofit2.Response;

public interface CarDeliveryView {
    void OnSuccess(Response<CardDeliveryModel> response);

    void OnFailure(Response<CardDeliveryModel> response);
}
