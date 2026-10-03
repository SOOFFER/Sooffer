package com.soofer.driver.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;
import android.util.Log;


import com.google.gson.Gson;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.CityModel;
import com.soofer.driver.Model.CountryModel;
import com.soofer.driver.Model.OTPModel;
import com.soofer.driver.Model.RegisterModel;
import com.soofer.driver.Model.StateModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.RegisterView;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterPresenter {
    private RetrofitGenerator retrofitGenerator = null;
    public RegisterView registerView;

    public RegisterPresenter(RegisterView registerView) {
        this.registerView = registerView;
    }

    public void getRegisterApi(HashMap<String, String> data, Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<RegisterModel> call = service.getRegister(data);
                call.enqueue(new Callback<RegisterModel>() {
                    @Override
                    public void onResponse(Call<RegisterModel> call, Response<RegisterModel> response) {
                        retrofitGenerator = null;
                        Log.e("url_register", "" + call.request().url() + "\n" + new Gson().toJson(response.body()));
                        if (response.isSuccessful() && response.body() != null) {
                            registerView.RegisterView(response);

                        } else {
                            if (response.errorBody() != null) {
                                registerView.Errorlogview(response);
                            }

                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<RegisterModel> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        retrofitGenerator = null;
                        System.out.printf("enter the error response " + t.getMessage());


                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void getOTP(String data, String email_id, String cc,String otp, final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<OTPModel> call = service.getOpt(data, email_id, cc,otp, SharedHelper.getToken(activity,"hash_token"));
                call.enqueue(new Callback<OTPModel>() {
                    @Override
                    public void onResponse(@NonNull Call<OTPModel> call, @NonNull Response<OTPModel> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            registerView.onSuccessOTP(response);
                            retrofitGenerator = null;

                        } else {
                            if (response.errorBody() != null) {
                                registerView.onFailureOTP(response);
                                retrofitGenerator = null;
                            }

                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<OTPModel> call, @NotNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        retrofitGenerator = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }


    public void getCountry(final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<CountryModel>> call = service.getCountry();
                call.enqueue(new Callback<List<CountryModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<CountryModel>> call, @NonNull Response<List<CountryModel>>response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            registerView.countrysuccess(response);
                            retrofitGenerator = null;
                        } else {
                            if(response.errorBody()!=null){
                                registerView.countryfailure(response);
                                retrofitGenerator = null;
                            }
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<List<CountryModel>> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        retrofitGenerator = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void getState(String data,final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<StateModel>> call = service.getState(data);
                call.enqueue(new Callback<List<StateModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<StateModel>> call, @NonNull Response<List<StateModel>>response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            registerView.statesuccess(response);
                            retrofitGenerator = null;
                        } else {
                            if(response.errorBody()!=null){
                                registerView.statefailure(response);
                                retrofitGenerator = null;
                            }

                        }

                    }



                    @Override
                    public void onFailure(@NonNull Call<List<StateModel>> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        retrofitGenerator = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

    public void getCity(String data,final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<CityModel>> call = service.getCity(data);
                call.enqueue(new Callback<List<CityModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<CityModel>> call, @NonNull Response<List<CityModel>>response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            registerView.citysuccess(response);
                            retrofitGenerator = null;
                        } else {
                            if(response.errorBody()!=null){
                                registerView.cityfailure(response);
                                retrofitGenerator = null;
                            }

                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<List<CityModel>> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        retrofitGenerator = null;
                    }
                });
            }

        } else {
            Utiles.showNoNetwork(activity);
        }


    }

}
