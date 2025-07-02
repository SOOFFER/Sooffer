package com.soofer.driver.View;


import okhttp3.ResponseBody;
import retrofit2.Response;

public interface FeedBackView {

    void onSuccess(Response<ResponseBody> Response);

    void onFailure(Response<ResponseBody> Response);
}
