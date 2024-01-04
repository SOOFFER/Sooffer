package com.bismillah.app.CommonClass.BaseClass;

import android.app.Activity;

import com.bismillah.app.Retrofit.ApiInterface;

import io.reactivex.disposables.CompositeDisposable;

public abstract class BasePresenter {

    protected CommonInterFace commonInterFace;
    protected CompositeDisposable disposable;
    protected Activity context;
    protected ApiInterface apiInterface;

    public interface CommonInterFace{
        void onSuccess(Object object);
        void onFailure(Throwable throwable);
        void showLoader();
        void hideLoader();
    }
}
