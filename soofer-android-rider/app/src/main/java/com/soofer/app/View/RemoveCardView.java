package com.soofer.app.View;

import com.soofer.app.Model.RemoveCardModel;

import okhttp3.ResponseBody;
import retrofit2.Response;

public interface RemoveCardView {
    void OnRemoveSuccessfully(Response<RemoveCardModel> Response);
    void OnRemoveFailure(Response<RemoveCardModel> Response);
}
