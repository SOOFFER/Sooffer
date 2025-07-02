package com.soofer.driver.View;

import com.soofer.driver.Model.AcceptRequestModel;
import com.soofer.driver.Model.DiclineRequest;
import com.soofer.driver.Model.SendPhoneModel;

import retrofit2.Response;

public interface RequestView {

    void OnSuccessAccept(Response<AcceptRequestModel> Response);

    void onFailureAccept(Response<AcceptRequestModel> Response);

    void onSuccessDicline(Response<DiclineRequest> Response);

    void onFailureDicline(Response<DiclineRequest> Response);

    void OnScheduleSuccessAccept(Response<AcceptRequestModel> Response);

    void onScheduleFailureAccept(Response<AcceptRequestModel> Response);

    void OnSuccessSendPhone(Response<SendPhoneModel> response);

    void onFailureSendPhone(Response<SendPhoneModel> response);
}
