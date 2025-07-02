package com.soofer.app.CommonClass.BaseClass;

import android.app.Activity;

import com.soofer.app.Retrofit.ApiInterface;

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
