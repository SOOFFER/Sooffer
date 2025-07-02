package com.soofer.driver.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.AcceptRequestModel;
import com.soofer.driver.Model.DiclineRequest;
import com.soofer.driver.Model.SendPhoneModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.RequestView;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class RequestPresenter {

    RequestView requestView;
    RetrofitGenerator retrofitGenerator = null;

    public RequestPresenter(RequestView requestView) {
        this.requestView = requestView;

    }

    public void AcceptRequest(String Request_id, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<AcceptRequestModel> call = service.getAcceptRequest( SharedHelper.getKey(activity.getApplicationContext(), "token"), Request_id);
                call.enqueue(new Callback<AcceptRequestModel>() {
                    @Override
                    public void onResponse(@NonNull Call<AcceptRequestModel> call, @NonNull Response<AcceptRequestModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            requestView.OnSuccessAccept(response);
                        } else {
                            requestView.onFailureAccept(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<AcceptRequestModel> call,@NonNull Throwable t) {
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

    public void SchudeleAcceptRequest(String Request_id,String datetime, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<AcceptRequestModel> call = service.getScheduleAcceptRequest( SharedHelper.getKey(activity.getApplicationContext(), "token"), Request_id,datetime);
                call.enqueue(new Callback<AcceptRequestModel>() {
                    @Override
                    public void onResponse(@NonNull Call<AcceptRequestModel> call,@NonNull Response<AcceptRequestModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            requestView.OnScheduleSuccessAccept(response);
                        } else {
                            requestView.onScheduleFailureAccept(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<AcceptRequestModel> call,@NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });
            }
        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void DiclineRequest(String Request_id, final Activity activity) {
        if (retrofitGenerator == null) {
            Utiles.ShowLoader(activity);
            retrofitGenerator = new RetrofitGenerator();
            ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
            Call<DiclineRequest> call = service.getDiclineRequest( SharedHelper.getKey(activity.getApplicationContext(), "token"), Request_id);
            call.enqueue(new Callback<DiclineRequest>() {
                @Override
                public void onResponse(@NonNull Call<DiclineRequest> call,@NonNull Response<DiclineRequest> response) {
                    Utiles.DismissLoader();
                    retrofitGenerator = null;
                    if (response.isSuccessful() && response.body() != null) {
                        requestView.onSuccessDicline(response);
                    } else {
                        requestView.onFailureDicline(response);
                    }
                }

                @Override
                public void onFailure(@NonNull Call<DiclineRequest> call,@NonNull  Throwable t) {
                    Utiles.DismissLoader();
                    retrofitGenerator = null;
                    System.out.println("enter the request"+t.getMessage());
                    Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                }
            });


        }
    }

    public void SendPhone(HashMap<String, String> map, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<SendPhoneModel> call = service.sendPhoneNumber( SharedHelper.getKey(activity.getApplicationContext(), "token"), map);
                call.enqueue(new Callback<SendPhoneModel>() {
                    @Override
                    public void onResponse(@NonNull Call<SendPhoneModel> call, @NonNull Response<SendPhoneModel> response) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        if (response.isSuccessful() && response.body() != null) {
                            requestView.OnSuccessSendPhone(response);
                        } else {
                            requestView.onFailureSendPhone(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<SendPhoneModel> call,@NonNull Throwable t) {
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
