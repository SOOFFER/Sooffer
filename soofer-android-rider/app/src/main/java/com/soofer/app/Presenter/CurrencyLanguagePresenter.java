package com.soofer.app.Presenter;

import android.app.Activity;

import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.LanguageCurrencyModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.CurrencyLanguageView;

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
                    public void onResponse(Call<List<LanguageCurrencyModel>> call, Response<List<LanguageCurrencyModel>> response) {
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            currencyLanguageView.countriesReady(response.body());
                        } else {
                            Utiles.CommonToast(activity, "Something Went Wrong");
                        }


                    }

                    @Override
                    public void onFailure(Call<List<LanguageCurrencyModel>> call, Throwable t) {
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
