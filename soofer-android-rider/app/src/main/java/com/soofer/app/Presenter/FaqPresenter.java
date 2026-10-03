package com.soofer.app.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.FaqModel;
import com.soofer.app.Model.FaqcategoryModel;
import com.soofer.app.Retrofit.ApiInterface;
import com.soofer.app.Retrofit.RetrofitGenerator;

import java.util.HashMap;
import java.util.List;

import io.reactivex.disposables.CompositeDisposable;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FaqPresenter {

    public RetrofitGenerator retrofitGenerator = null;
    Activity activity;
    private CompositeDisposable disposable;
    private faqView polyGonView;

    public FaqPresenter(Activity activity, CompositeDisposable disposable,faqView polyGonView) {
        this.activity = activity;
        this.disposable = disposable;
        this.polyGonView = polyGonView;
    }

    public void getFaq(HashMap<String,String> Language) {
        if (Utiles.isNetworkAvailable(activity)) {
            if (retrofitGenerator == null) {
                Utiles.ShowLoader(activity);
                retrofitGenerator = new RetrofitGenerator();
                ApiInterface service = retrofitGenerator.getRetrofitUrl().create(ApiInterface.class);
                Call<List<FaqModel>> call = service.getfaq(SharedHelper.getKey(activity.getApplicationContext(), "token"), Language);
                call.enqueue(new Callback<List<FaqModel>>() {
                    @Override
                    public void onResponse(@NonNull Call<List<FaqModel>> call, @NonNull Response<List<FaqModel>> response) {
                        retrofitGenerator = null;
                        Utiles.DismissLoader();
                        if (response.isSuccessful() && response.body() != null) {
                            polyGonView.onSuccess(response);
                        } else {
                            polyGonView.onFailure(response);
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<List<FaqModel>> call, @NonNull Throwable t) {
                        Utiles.DismissLoader();
                        Utiles.CommonToast(activity, "Something Went Wrong");
                    }
                });

            }

        } else {
            Utiles.showNoNetwork(activity);
        }
    }

    public interface faqView {
        void onSuccess(Response<List<FaqModel>> Response);

        void onFailure(Response<List<FaqModel>> Response);
    }
}
