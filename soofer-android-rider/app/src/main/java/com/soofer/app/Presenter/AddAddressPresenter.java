package com.soofer.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.FavoriteAddressModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.AddressView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddAddressPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    public AddressView addressView;

    public AddAddressPresenter(AddressView addressView) {
        this.addressView = addressView;

    }

    public void addAddress(final Activity activity, HashMap<String, String> data) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<FavoriteAddressModel> call = service.addAddress(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<FavoriteAddressModel>() {
                    @Override
                    public void onResponse(@NonNull Call<FavoriteAddressModel> call, @NonNull Response<FavoriteAddressModel> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            addressView.OnSuccessfully(response);
                        } else {
                            addressView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<FavoriteAddressModel> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }
}
