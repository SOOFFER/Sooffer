package com.bismillah.driver.View;

import com.bismillah.driver.Model.RequestTexiHail;

import retrofit2.Response;

public interface RequestTexiHailView {
    void OnSuccessRequestTexiHail(Response<RequestTexiHail> response);

    void OnFailureRequestTexiHail(Response<RequestTexiHail> response);
}
