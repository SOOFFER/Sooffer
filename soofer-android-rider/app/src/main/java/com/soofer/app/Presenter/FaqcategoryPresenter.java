package com.soofer.app.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.FaqcategoryModel;
import com.soofer.app.Model.OfferModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;

import java.util.HashMap;
import java.util.List;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FaqcategoryPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    Activity activity;
    private CompositeDisposable disposable;
    private faqcategoryView polyGonView;

    public FaqcategoryPresenter(Activity activity, CompositeDisposable disposable, faqcategoryView polyGonView) {
        this.activity = activity;
        this.disposable = disposable;
        this.polyGonView = polyGonView;
    }

    public void getFaqcategory(HashMap<String,String> Language) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<FaqcategoryModel>> call = service.getfaqcategory(SharedHelper.getKey(activity.getApplicationContext(), "token"), Language);
                call.enqueue(new Callback<List<FaqcategoryModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<FaqcategoryModel>> call, @NonNull Response<List<FaqcategoryModel>> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            polyGonView.onSuccess(response);
                        } else {
                            polyGonView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<List<FaqcategoryModel>> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

    public interface faqcategoryView {
        void onSuccess(Response<List<FaqcategoryModel>> Response);

        void onFailure(Response<List<FaqcategoryModel>> Response);
    }
}
