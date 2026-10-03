package com.soofer.driver.View;

import com.soofer.driver.Model.ChangePasswordModel;

import retrofit2.Response;

public interface ChangePasswordView {
    void OnSuccessfully(Response<ChangePasswordModel> Response);
    void OnFailure(Response<ChangePasswordModel> Response);


}
