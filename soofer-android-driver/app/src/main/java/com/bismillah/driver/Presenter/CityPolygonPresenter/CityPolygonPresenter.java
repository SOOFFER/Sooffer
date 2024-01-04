package com.bismillah.driver.Presenter.CityPolygonPresenter;

import android.app.Activity;
import android.util.Log;

import com.google.android.gms.maps.model.LatLng;
import com.bismillah.driver.Model.Polygon.PolygonModel;
import com.bismillah.driver.Retrofit.ApiInterface;
import com.bismillah.driver.Retrofit.RetrofitGenerator;

import java.util.ArrayList;
import java.util.List;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;



public class CityPolygonPresenter {
    public RetrofitGenerator retrofitGenerator = null;
    Activity activity;
    private CompositeDisposable disposable;
    private PolyGonView polyGonView;

    public CityPolygonPresenter(Activity activity, CompositeDisposable disposable, PolyGonView polyGonView) {
        this.activity = activity;
        this.disposable = disposable;
        this.polyGonView = polyGonView;
    }

    public void getAddressFromLocation(String City) {

        if (retrofitGenerator == null) {
            retrofitGenerator = new RetrofitGenerator();
            ApiInterface service = retrofitGenerator.getRxJavaRetrofit().create(ApiInterface.class);
            disposable.add(service.getCityPolygon(City)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread()).subscribe(this::OnsucessFull, this::OnError));

        }
    }

    public void OnsucessFull(PolygonModel polygonModel) {
        List<LatLng> latLngs = new ArrayList<>();
        for (int i = 0; i < polygonModel.getData().get(0).getCityBoundaryPolygon().get(0).size(); i++) {
            latLngs.add(new LatLng(polygonModel.getData().get(0).getCityBoundaryPolygon().get(0).get(i).get(1), polygonModel.getData().get(0).getCityBoundaryPolygon().get(0).get(i).get(0)));
        }
        polyGonView.SuccessPolygon(latLngs);
    }

    public void OnError(Throwable throwable) {
        Log.d("error message", "OnError: " + throwable.getMessage());
    }

    public interface PolyGonView {
        void SuccessPolygon(List<LatLng> latLngs);
    }

}
