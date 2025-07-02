package com.soofer.driver.Presenter;

import android.app.Activity;
import androidx.annotation.NonNull;


import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.LanguageCurrencyModel;
import com.soofer.driver.R;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;
import com.soofer.driver.View.CurrencyLanguageView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class CurrencyLanguagePresenter {
    public RetrofitGenerator retrofitGenerator = null;

    public CurrencyLanguageView currencyLanguageView;

    public CurrencyLanguagePresenter(CurrencyLanguageView currencyLanguageView) {
        this.currencyLanguageView = currencyLanguageView;

    }
    public void getCurrencyLanguage(final Activity activity) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<LanguageCurrencyModel>> call = service.getCountryandLanguage();
                call.enqueue(new Callback<List<LanguageCurrencyModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<LanguageCurrencyModel>> call, @NonNull Response<List<LanguageCurrencyModel>> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            currencyLanguageView.countriesReady(response.body());
                        } else {
                            Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<List<LanguageCurrencyModel>> call, @NonNull Throwable t) {
                        Utiles.CommonToast(activity, activity.getResources().getString(R.string.something_went_wrong));
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }
}
