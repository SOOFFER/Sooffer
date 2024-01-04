package com.bismillah.driver.Presenter;

import android.app.Activity;
import android.util.Log;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.TripHistoryModel;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.TripDetailsView;

import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TripDetailPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    TripDetailsView tripDetailsView;

    public TripDetailPresenter(TripDetailsView tripDetailsView) {
        this.tripDetailsView = tripDetailsView;
    }

    public void getTripHistory(final Activity activity, HashMap<String,String> map) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<TripHistoryModel>> call = service.getTripHistory(SharedHelper.getKey(activity.getApplicationContext(), "token"),map);
                call.enqueue(new Callback<List<TripHistoryModel>>() {
                    @Override
                    public void onResponse(Call<List<TripHistoryModel>> call, Response<List<TripHistoryModel>> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {

                            tripDetailsView.Onsuccess(response);
                        } else {
                            tripDetailsView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<List<TripHistoryModel>> call, Throwable t) {
                        Log.e("tag", "trip history api exception" + t.getMessage());
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }
        } else {
            Utiles.showNoNetwork(activity);
        }



    }

}
