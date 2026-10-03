package com.soofer.driver.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;
import android.util.Log;

import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.EarningModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;

import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EarningPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    EarningViews tripDetailsView;
    Activity activity;

    public EarningPresenter(EarningViews tripDetailsView, Activity activity) {
        this.tripDetailsView = tripDetailsView;
        this.activity = activity;
    }

    public void getEanings(HashMap<String,String> map) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<EarningModel>> call = service.getEaringList(SharedHelper.getKey(activity.getApplicationContext(), "token"),map);
                call.enqueue(new Callback<List<EarningModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<EarningModel>> call, @NonNull Response<List<EarningModel>> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            tripDetailsView.Onsuccess(response);
                        } else {
                            tripDetailsView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<List<EarningModel>> call, @NonNull Throwable t) {
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

    public interface EarningViews{
        void Onsuccess(Response<List<EarningModel>> Response);

        void onFailure(Response<List<EarningModel>> Response);
    }

}
