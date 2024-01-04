package com.bismillah.app.View;

import com.bismillah.app.Model.AddWalletModel;
import com.bismillah.app.Model.WalletBalanceModel;
import retrofit2.Response;

public interface WalletView {
    void onwalletSuccessfully(Response<WalletBalanceModel> Response);

    void onwalletFailure(Response<WalletBalanceModel> Response);

    void onaddwalletSuccessfully(Response<AddWalletModel> Response);

    void onaddwalletFailure(Response<AddWalletModel> Response);
}
