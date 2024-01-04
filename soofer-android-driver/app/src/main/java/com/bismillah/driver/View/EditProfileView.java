package com.bismillah.driver.View;


import com.bismillah.driver.Model.UpdatProfileModel;
import retrofit2.Response;

public interface EditProfileView {
    void OnSuccessfully(Response<UpdatProfileModel> Response);
    void OnFailure(Response<UpdatProfileModel> Response);

}
