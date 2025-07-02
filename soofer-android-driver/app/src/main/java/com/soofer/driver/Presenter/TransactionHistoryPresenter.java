package com.soofer.driver.Presenter;

import android.app.Activity;

import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.Retrofit.ApiInterface;
import com.soofer.driver.Retrofit.RetrofitGenerator;

import java.util.HashMap;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;


public class TransactionHistoryPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    Activity activity;
    private CompositeDisposable disposable;
    private CommonInterface polyGonView;

    public TransactionHistoryPresenter(Activity activity, CompositeDisposable disposable, CommonInterface polyGonView) {
        this.activity = activity;
        this.disposable = disposable;
        this.polyGonView = polyGonView;
    }

    public void getWalletTransactonHistory(HashMap<String,String> City) {

        if (retrofitGenerator == null) {
            polyGonView.showLoader();
            retrofitGenerator = new RetrofitGenerator();
            ApiInterface service = retrofitGenerator.getRxJavaRetrofit().create(ApiInterface.class);
            disposable.add(service.getWalletTransactionHistory(SharedHelper.getKey(activity, "token"), City)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread()).subscribe(res -> {
                        polyGonView.onSuccess(res);
                        polyGonView.dismissLoader();
                        retrofitGenerator =null;
                    }, throwable -> {
                        polyGonView.onFailure(throwable);
                        polyGonView.dismissLoader();
                        retrofitGenerator =null;
                    }));

        }
    }




    public interface CommonInterface {

        void onSuccess(Object object);

        void onFailure(Throwable object);

        void showLoader();

        void dismissLoader();
    }

}
