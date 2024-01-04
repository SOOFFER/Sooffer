package com.bismillah.driver.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.ImageUploadModel;
import com.bismillah.driver.Model.TripFlowModel;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.TripFlowView;

import java.util.ArrayList;
import java.util.HashMap;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class TripFlowPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    public TripFlowView tripFlowView = null;

    public TripFlowPresenter(TripFlowView tripFlowView) {
        this.tripFlowView = tripFlowView;
    }

    public void TripFlowStatusApi(HashMap<String, String> data, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                //   Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<TripFlowModel> call = service.TripFlowStatus(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<TripFlowModel>() {
                    @Override
                    public void onResponse(@NonNull Call<TripFlowModel> call, @NonNull Response<TripFlowModel> response) {
                        //  Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            tripFlowView.OnSuccessfullys(response);

                        } else {
                            tripFlowView.OnFailures(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<TripFlowModel> call, Throwable t) {
                        //  Utiles.DismissLoader();
                        System.out.println("enter the error" + t.getMessage());
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }

    }

    public void TripFlowStatusMultiPartApi(HashMap<String, RequestBody> map,
                                           Activity activity,
                                           MultipartBody.Part imageArray,
                                           MultipartBody.Part imageArray1,
                                           MultipartBody.Part imageArray2,
                                           MultipartBody.Part imageArray3) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<ImageUploadModel> call = service.TripFlowStatusMultiPartApi(SharedHelper.getKey(activity.getApplicationContext(), "token"), map, imageArray, imageArray1, imageArray2, imageArray3);
                call.enqueue(new Callback<ImageUploadModel>() {
                    @Override
                    public void onResponse(@NonNull Call<ImageUploadModel> call, @NonNull Response<ImageUploadModel> response) {
                          Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            tripFlowView.OnSuccessfullyUpload(response);

                        } else {
                            tripFlowView.OnFailureUpload(response);
                        }

                    }

                    @Override
                    public void onFailure(Call<ImageUploadModel> call, Throwable t) {
                          Utiles.DismissLoader();
                        System.out.println("enter the error" + t.getMessage());
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }
}
