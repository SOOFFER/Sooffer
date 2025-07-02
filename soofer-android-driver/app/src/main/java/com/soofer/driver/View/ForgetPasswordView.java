package com.soofer.driver.View;





import com.soofer.driver.Model.ForgetPasswordModel;
import com.soofer.driver.Model.OTPVerificationModel;

import retrofit2.Response;

public interface ForgetPasswordView {
    void OnSuccessfully(Response<ForgetPasswordModel> Response);

    void OnFailure(Response<ForgetPasswordModel> Response);

    void OnOtpSuccessfully(Response<OTPVerificationModel> Response);

    void OnOtpFailure(Response<OTPVerificationModel> Response);
}
