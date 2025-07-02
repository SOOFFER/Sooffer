package com.soofer.app.View;

import com.soofer.app.Model.AllwalletTransactionmodel;

import retrofit2.Response;

public interface WalletTransactionView {
    void onTransactionSuccessfully(Response<AllwalletTransactionmodel> Response);

    void onTransactionFailure(Response<AllwalletTransactionmodel> Response);


}
