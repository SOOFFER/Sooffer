package com.soofer.app.Presenter;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.soofer.app.CommonClass.BaseClass.BasePresenter;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;

import java.util.HashMap;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

import static com.soofer.app.Retrofit.RetrofitGenerator.apiInterface;

public class InvoiceEmailPresenter extends BasePresenter {
    public InvoiceEmailPresenter(@NonNull CompositeDisposable disposable, @NonNull CommonInterFace commonInterFace, @NonNull Activity context) {
        this.disposable = disposable;
        this.commonInterFace = commonInterFace;
        this.context = context;
    }

    public void getInvoiceEmailAddress(HashMap<String, String> map) {
        if (Utiles.isNetworkAvailable(context)) {

            if (apiInterface == null) {
                commonInterFace.showLoader();
                apiInterface = apiInterface();
                disposable.add(apiInterface.getSendinVoiceEmail(SharedHelper.getKey(context, "token"), map)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(objecs -> {
                            apiInterface =null;
                            commonInterFace.onSuccess(objecs);
                            commonInterFace.hideLoader();
                        }, error -> {
                            apiInterface =null;
                            commonInterFace.onFailure(error);
                            commonInterFace.hideLoader();
                        }));
            }

        } else {
            Utiles.showNoNetwork(context);
        }
    }

   /* public void getEstimateCablist(HashMap<String, String> map) {
        if (Utiles.isNetworkAvailable(context)) {

            if (apiInterface == null) {
                commonInterFace.showLoader();
                apiInterface = apiInterface();
                disposable.add(apiInterface.getSelectCabList(SharedHelper.getKey(context, "token"), map)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(objecs -> {
                            apiInterface =null;
                            commonInterFace.onSuccess(objecs);
                            commonInterFace.hideLoader();
                        }, error -> {
                            apiInterface =null;
                            commonInterFace.onFailure(error);
                            commonInterFace.hideLoader();
                        }));
            }

        } else {
            Utiles.showNoNetwork(context);
        }
    }*/
}
