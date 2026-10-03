package com.soofer.app.View;

import okhttp3.ResponseBody;
import retrofit2.Response;

public interface AddCardView {
    void OnSuccessfully(Response<ResponseBody> Response);
    void OnSuccessfullyUpdateCard(Response<ResponseBody> Response);
    void OnFailure(Response<ResponseBody> Response);
}
