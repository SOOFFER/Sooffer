package com.bismillah.driver.View;

import com.bismillah.driver.Model.DriverProfileModel;

import java.util.List;

import retrofit2.Response;

public interface ProfileView {
    void OnSuccessfully(Response<List<DriverProfileModel>> Response);
    void OnFailure(Response<List<DriverProfileModel>> Response);

}
