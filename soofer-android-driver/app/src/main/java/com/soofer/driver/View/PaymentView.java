package com.soofer.driver.View;

import com.soofer.driver.Model.PaymentModel;

public interface PaymentView {
    void PaymentView(retrofit2.Response<PaymentModel> Response);
    void Errorpaymentview(retrofit2.Response<PaymentModel> Response);
}
