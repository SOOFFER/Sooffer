package com.bismillah.app.View;

import com.bismillah.app.Model.RemoveCardModel;

import okhttp3.ResponseBody;
import retrofit2.Response;

public interface AddCardView {
    void OnSuccessfully(Response<ResponseBody> Response);
    void OnFailure(Response<ResponseBody> Response);
    void OnRemoveSuccessfully(Response<RemoveCardModel> Response);
    void OnRemoveFailure(Response<RemoveCardModel> Response);
}
