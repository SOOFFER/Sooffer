package com.soofer.app.View;

import com.soofer.app.Model.PromoCodeModel;

import retrofit2.Response;

public interface PromoView {
    void OnSuccessfully(Response<PromoCodeModel> Response);

    void OnFailure(Response<PromoCodeModel> Response);
}
