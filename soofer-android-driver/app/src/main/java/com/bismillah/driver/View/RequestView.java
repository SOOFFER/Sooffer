package com.bismillah.driver.View;

import com.bismillah.driver.Model.AcceptRequestModel;
import com.bismillah.driver.Model.DiclineRequest;
import com.bismillah.driver.Model.SendPhoneModel;

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
