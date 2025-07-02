package com.soofer.app.View;

import com.soofer.app.Model.WalletTransactionCreditModel;

import retrofit2.Response;

public interface WalletCreditView {
    void onTransactionSuccessfully(Response<WalletTransactionCreditModel> Response);

    void onTransactionFailure(Response<WalletTransactionCreditModel> Response);


}
