package com.bismillah.app.View;

import com.bismillah.app.Model.WalletTransactionCreditModel;

import retrofit2.Response;

public interface WalletCreditView {
    void onTransactionSuccessfully(Response<WalletTransactionCreditModel> Response);

    void onTransactionFailure(Response<WalletTransactionCreditModel> Response);


}
