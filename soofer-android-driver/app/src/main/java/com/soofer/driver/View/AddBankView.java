package com.soofer.driver.View;


import com.soofer.driver.Model.AddBankModel;
import com.soofer.driver.Model.BankDetailsModel;

import retrofit2.Response;

public interface AddBankView {
    void OnSuccessfully(Response<AddBankModel> Response);

    void OnFailure(Response<AddBankModel> Response);

    void OngetSuccessfully(Response<BankDetailsModel> Response);

    void OngetFailure(Response<BankDetailsModel> Response);
}
