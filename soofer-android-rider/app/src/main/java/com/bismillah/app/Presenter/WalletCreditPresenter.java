package com.bismillah.app.Presenter;

import android.app.Activity;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.WalletTransactionCreditModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.WalletCreditView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class WalletCreditPresenter {
    public RetrofitGenerator retrofitGenerator;
    public WalletCreditView walletCreditView;
    public Activity activity;

    public WalletCreditPresenter(Activity activity, WalletCreditView walletCreditView) {
        this.walletCreditView = walletCreditView;
        this.activity = activity;

    }

    public void getWalletBalance() {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<WalletTransactionCreditModel> call = service.getWalletCreditList(SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<WalletTransactionCreditModel>() {
                    @Override
                    public void onResponse(Call<WalletTransactionCreditModel> call, Response<WalletTransactionCreditModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            walletCreditView.onTransactionSuccessfully(response);
                        } else {
                            walletCreditView.onTransactionFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(Call<WalletTransactionCreditModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }


}
