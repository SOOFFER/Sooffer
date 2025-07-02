package com.soofer.driver.View;


import com.soofer.driver.Model.UpdatProfileModel;
import retrofit2.Response;

public interface EditProfileView {
    void OnSuccessfully(Response<UpdatProfileModel> Response);
    void OnFailure(Response<UpdatProfileModel> Response);

}
