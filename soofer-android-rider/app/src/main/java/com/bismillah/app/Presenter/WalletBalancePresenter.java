package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.AddWalletModel;
import com.bismillah.app.Model.WalletBalanceModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.WalletView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class WalletBalancePresenter {
    public RetrofitGenerator retrofitGenerator;
    public WalletView walletView;
    public Activity activity;

    public WalletBalancePresenter(Activity activity, WalletView walletView) {
        this.walletView = walletView;
        this.activity = activity;

    }

    public void getWalletBalance(Boolean status) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                if (status) {
                    Utiles.ShowLoader(activity);
                }
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<WalletBalanceModel> call = service.getWalletBalance(SharedHelper.getKey(activity.getApplicationContext(), "token"));
                System.out.println("enter the wallet url"+call.request().url());
                call.enqueue(new Callback<WalletBalanceModel>() {
                    @Override
                    public void onResponse(@NonNull Call<WalletBalanceModel> call, @NonNull Response<WalletBalanceModel> response) {
                        Utiles.DismissLoader();

                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            walletView.onwalletSuccessfully(response);
                        } else {
                            walletView.onwalletFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<WalletBalanceModel> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        System.out.println("enter the wallet exception"+t.getMessage());
                        retrofitGenerator = null;
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void getAddwallet(String data) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<AddWalletModel> call = service.getAddwallet(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<AddWalletModel>() {
                    @Override
                    public void onResponse(@NonNull Call<AddWalletModel> call, @NonNull Response<AddWalletModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            walletView.onaddwalletSuccessfully(response);
                            retrofitGenerator = null;
                        } else {
                            walletView.onaddwalletFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<AddWalletModel> call, @NonNull Throwable t) {
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
