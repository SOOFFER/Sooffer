package com.soofer.app.View;

import com.soofer.app.Model.OTPModel;
import com.soofer.app.Model.RegisterModel;


public interface RegisterView {
    void RegisterView(retrofit2.Response<RegisterModel> Response);
    void Errorlogview(retrofit2.Response<RegisterModel> Response);
    void JsonResponse(String object);
    void onSuccessOTP(retrofit2.Response<OTPModel> Response);
    void onFailureOTP(retrofit2.Response<OTPModel> Response);
    void OTPVerification();
}
