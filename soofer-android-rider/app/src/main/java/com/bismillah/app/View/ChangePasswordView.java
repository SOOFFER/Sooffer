package com.bismillah.app.View;



import com.bismillah.app.Model.ChangePasswordModel;

import retrofit2.Response;

public interface ChangePasswordView {
    void OnSuccessfully(Response<ChangePasswordModel> Response);
    void OnFailure(Response<ChangePasswordModel> Response);


}
