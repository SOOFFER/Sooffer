package com.bismillah.app.View;

import com.bismillah.app.Model.EditProfileModel;

import retrofit2.Response;

public interface UpdateProfileView {
    void OnSuccessfully(Response<EditProfileModel> Response);
    void OnFailure(Response<EditProfileModel> Response);
}
