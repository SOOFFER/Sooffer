package com.bismillah.driver.Presenter;

import android.app.Activity;
import android.util.Log;

import com.google.gson.Gson;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.AddVehicleModel;
import com.bismillah.driver.Model.CarModel;
import com.bismillah.driver.Model.ServiceModel;
import com.bismillah.driver.R;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;
import com.bismillah.driver.View.CarModelView;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;


import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class CarModelPresenter {

    public RetrofitGenerator retrofitGenerator = null, retrofitGeneratorservictye = null;

    public CarModelView carModelView;
    private CompositeDisposable disposable;

    public CarModelPresenter(CarModelView carModelView, CompositeDisposable disposable) {
        this.carModelView = carModelView;
        this.disposable = disposable;

    }

    public void getCarModel(final Activity activity) {

        if (Utiles.isNetworkAvailable(activity)) {
            Utiles.ShowLoader(activity);
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<CarModel> call = service.getCarModel(SharedHelper.getKey(activity.getApplicationContext(), "token"));
                call.enqueue(new Callback<CarModel>() {
                    @Override
                    public void onResponse(Call<CarModel> call, Response<CarModel> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            carModelView.OnSuccessfullsy(response);
                        } else {
                            carModelView.OnFailurse(response);
                        }
                    }

                    @Override
                    public void onFailure(Call<CarModel> call, Throwable t) {
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        Utiles.DismissLoader();
                    }
                });

            }
        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void getAddVehicle(final Activity activity, HashMap<String, String> data) {
        Log.e("tag", "entertheaddvihicle" + data);
        if (Utiles.isNetworkAvailable(activity)) {
            Utiles.ShowLoader(activity);
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<AddVehicleModel> call = service.AddVehicle(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<AddVehicleModel>() {
                    @Override
                    public void onResponse(@NotNull Call<AddVehicleModel> call, @NotNull Response<AddVehicleModel> response) {
                        Log.e("TAG", "response:addvehicle " + new Gson().toJson(response.body()));
                        retrofitGenerator =null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            carModelView.AddvehicleSucessfully(response);
                        } else {
                            carModelView.AddvehicleFailure(response);
                        }
                    }

                    @Override
                    public void onFailure(Call<AddVehicleModel> call, Throwable t) {
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        Utiles.DismissLoader();
                        retrofitGenerator =null;
                    }
                });
            }
        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void geteditVehicle(final Activity activity, HashMap<String, String> data) {

        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<AddVehicleModel> call = service.editVehicle(SharedHelper.getKey(activity.getApplicationContext(), "token"), data);
                call.enqueue(new Callback<AddVehicleModel>() {
                    @Override
                    public void onResponse(Call<AddVehicleModel> call, Response<AddVehicleModel> response) {
                        Log.e("TAG", "response:editvehicle " + new Gson().toJson(response.body()));
                        retrofitGenerator =null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            carModelView.editVehicleSuccessfull();
                        } else {
                            carModelView.editVehicleFauiler();
                        }
                    }

                    @Override
                    public void onFailure(Call<AddVehicleModel> call, Throwable t) {
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        Utiles.DismissLoader();
                        retrofitGenerator =null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void getservicetype(final Activity activity) {

        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGeneratorservictye == null) {
                Utiles.ShowLoader(activity);
                retrofitGeneratorservictye = new RetrofitGenerator();
                ApiInterface service = retrofitGeneratorservictye.getRxJavaRetrofit().create(ApiInterface.class);
                disposable.add(service.getServiceType(SharedHelper.getKey(activity.getApplicationContext(), "token")).subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread()).subscribe(this::OnsucessFull, this::OnError));


            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    private void OnsucessFull(ServiceModel serviceModels) {
        retrofitGeneratorservictye = null;
        carModelView.onSuccessServiceList(serviceModels);
    }

    private void OnError(Throwable throwable) {
        retrofitGeneratorservictye = null;
        carModelView.onFailureService(throwable);
        System.out.println("enter the  error message" + throwable.getMessage());
    }
}
