package com.bismillah.driver.View;

import com.bismillah.driver.Model.PaymentModel;

public interface PaymentView {
    void PaymentView(retrofit2.Response<PaymentModel> Response);
    void Errorpaymentview(retrofit2.Response<PaymentModel> Response);
}
