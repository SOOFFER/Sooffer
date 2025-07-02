package com.soofer.app.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;
import android.util.Log;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.ScheduleCancelModel;
import com.soofer.app.Model.scheduleTripListModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.ScheduleListView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class ScheduleTripPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    ScheduleListView tripDetailsView;

    public ScheduleTripPresenter(ScheduleListView tripDetailsView) {
        this.tripDetailsView = tripDetailsView;
    }

    public void getScheduleTripList(final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<scheduleTripListModel>> call = service.getScheduleList(SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<List<scheduleTripListModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<scheduleTripListModel>> call, @NonNull Response<List<scheduleTripListModel>> response) {
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            Utiles.DismissLoader();
                            tripDetailsView.Onsuccess(response);
                        } else {
                            tripDetailsView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<List<scheduleTripListModel>> call, @NonNull Throwable t) {
                        Log.e("tag", "trip history api exception" + t.getMessage());
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

    public void getCancelScheduleTrip(final Activity activity, String request_id, final int position) {

        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {

                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ScheduleCancelModel> call = service.getcancelShedule(SharedHelper.getKey(activity.getApplicationContext(), "token"), request_id);
                call.enqueue(new Callback<ScheduleCancelModel>() {
                    @Override
                    public void onResponse(@NonNull Call<ScheduleCancelModel> call, @NonNull Response<ScheduleCancelModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            tripDetailsView.OnCancelScheduleSuccess(response, position);
                        } else {
                            tripDetailsView.onCancelScheduleFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<ScheduleCancelModel> call, @NonNull Throwable t) {
                        Log.e("tag", "trip history api exception" + t.getMessage());
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
