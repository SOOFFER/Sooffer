package com.bismillah.driver.View;

import com.bismillah.driver.Model.ChangePasswordModel;

import retrofit2.Response;

public interface ChangePasswordView {
    void OnSuccessfully(Response<ChangePasswordModel> Response);
    void OnFailure(Response<ChangePasswordModel> Response);


}
