package com.bismillah.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.PromoCodeModel;
import com.bismillah.app.Retrofit.ApiInterface;
import com.bismillah.app.Retrofit.RetrofitGenerator;
import com.bismillah.app.View.PromoView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PromocodePresenter {

    public RetrofitGenerator retrofitGenerator = null;
    public Activity activity;
    private PromoView promoView;

    public PromocodePresenter(Activity activity, PromoView promoView) {
        this.activity = activity;
        this.promoView = promoView;
    }

    public void getProcodeResult(HashMap<String,String> data) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<PromoCodeModel> call = service.getpromoAmount(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<PromoCodeModel>() {
                    @Override
                    public void onResponse(@NonNull Call<PromoCodeModel> call, @NonNull Response<PromoCodeModel> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            promoView.OnSuccessfully(response);
                        } else {
                            promoView.OnFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<PromoCodeModel> call, @NonNull Throwable t) {
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
