package com.soofer.app.View;

import com.soofer.app.Model.FavoriteAddressModel;

import retrofit2.Response;

public interface AddressView {
    void OnSuccessfully(Response<FavoriteAddressModel> Response);
    void OnFailure(Response<FavoriteAddressModel> Response);
}
