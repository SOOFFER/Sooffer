package com.soofer.app.Presenter;

import android.app.Activity;
import android.os.Build;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.OfferModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;

import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OffersPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    public offersView offersView;
    Activity activity;

    public OffersPresenter(offersView offersView, Activity activity) {
        this.offersView = offersView;
        this.activity = activity;

    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void getOffers(HashMap<String, Double> data) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<OfferModel>> call = service.getOffersApi(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<List<OfferModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<OfferModel>> call, @NonNull Response<List<OfferModel>> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            offersView.onSuccess(response);
                        } else {
                            offersView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<List<OfferModel>> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

    public interface offersView {
        void onSuccess(Response<List<OfferModel>> Response);

        void onFailure(Response<List<OfferModel>> Response);
    }
}
