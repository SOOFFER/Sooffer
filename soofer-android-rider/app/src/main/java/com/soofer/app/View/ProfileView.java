package com.soofer.app.View;


import com.soofer.app.Model.ProfileModel;

import java.util.List;

import retrofit2.Response;

public interface ProfileView {
    void OnSuccessfully(Response<List<ProfileModel>> Response);
    void OnFailure(Response<List<ProfileModel>> Response);

}
