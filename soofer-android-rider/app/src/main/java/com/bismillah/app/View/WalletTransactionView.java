package com.bismillah.app.View;

import com.bismillah.app.Model.AllwalletTransactionmodel;

import retrofit2.Response;

public interface WalletTransactionView {
    void onTransactionSuccessfully(Response<AllwalletTransactionmodel> Response);

    void onTransactionFailure(Response<AllwalletTransactionmodel> Response);


}
