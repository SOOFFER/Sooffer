package com.bismillah.app.Presenter;

import android.app.Activity;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.AllwalletTransactionmodel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.WalletTransactionView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class WalletTransactionPresenter {
    public RetrofitGenerator retrofitGenerator;
    public WalletTransactionView walletTransactionView;
    public Activity activity;

    public WalletTransactionPresenter(Activity activity, WalletTransactionView walletTransactionView) {
        this.walletTransactionView = walletTransactionView;
        this.activity = activity;

    }

    public void getWalletBalance() {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {

                Utiles.ShowLoader(activity);

                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<AllwalletTransactionmodel> call = service.getAllwelletTrascation(SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<AllwalletTransactionmodel>() {
                    @Override
                    public void onResponse(Call<AllwalletTransactionmodel> call, Response<AllwalletTransactionmodel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            walletTransactionView.onTransactionSuccessfully(response);
                        } else {
                            walletTransactionView.onTransactionFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(Call<AllwalletTransactionmodel> call, Throwable t) {
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
