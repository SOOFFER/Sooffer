package com.soofer.driver.Presenter;

import android.app.Activity;


import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.AddBankModel;
import com.soofer.driver.Model.BankDetailsModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.AddBankView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class AddAndUpdateBankPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    private AddBankView cancelView = null;

    public AddAndUpdateBankPresenter(AddBankView cancelView) {
        this.cancelView = cancelView;
    }

    public void getAddAndUpdateBank(HashMap<String, String> Tripid, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<AddBankModel> call = service.AddAndUpdateBank(SharedHelper.getKey(activity.getApplicationContext(), "token"), Tripid);
                call.enqueue(new Callback<AddBankModel>() {
                    @Override
                    public void onResponse(Call<AddBankModel> call, Response<AddBankModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            cancelView.OnSuccessfully(response);

                        } else {
                            cancelView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<AddBankModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        System.out.println("enter the cancel request error" + t.getMessage());
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }

    public void getBankDetail(final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<BankDetailsModel> call = service.getBankDetails(SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<BankDetailsModel>() {
                    @Override
                    public void onResponse(Call<BankDetailsModel> call, Response<BankDetailsModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            cancelView.OngetSuccessfully(response);

                        } else {
                            cancelView.OngetFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<BankDetailsModel> call, Throwable t) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        System.out.println("enter the cancel request error" + t.getMessage());
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }
}
