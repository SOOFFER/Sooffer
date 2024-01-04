package com.bismillah.app.View;

import com.bismillah.app.Model.PromoCodeModel;

import retrofit2.Response;

public interface PromoView {
    void OnSuccessfully(Response<PromoCodeModel> Response);

    void OnFailure(Response<PromoCodeModel> Response);
}
