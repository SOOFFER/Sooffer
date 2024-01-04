package com.bismillah.app.View;

import com.bismillah.app.Model.CardDeliveryModel;
import com.bismillah.app.Model.EstimationModel;

import retrofit2.Response;

public interface CarDeliveryView {
    void OnSuccess(Response<CardDeliveryModel> response);

    void OnFailure(Response<CardDeliveryModel> response);
}
