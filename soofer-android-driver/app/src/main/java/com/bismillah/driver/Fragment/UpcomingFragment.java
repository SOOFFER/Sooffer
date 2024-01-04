package com.bismillah.driver.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;


import com.bismillah.driver.Adapter.ScheduleTripAdapter;
import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.ScheduleCancelModel;
import com.bismillah.driver.Model.scheduleTripListModel;
import com.bismillah.driver.Presenter.ScheduleTripPresenter;
import com.bismillah.driver.R;
import com.bismillah.driver.View.ScheduleListView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import retrofit2.Response;


public class UpcomingFragment extends BaseFragment implements ScheduleTripAdapter.callTripCancel, ScheduleListView {
    List<scheduleTripListModel> tripModels = new ArrayList<>();
    @BindView(R.id.trip_recycleview)
    RecyclerView tripRecycleview;
    @BindView(R.id.nodata_txt)
    TextView nodataTxt;
    Unbinder unbinder;
    ScheduleTripAdapter tripAdapter;
    private android.app.AlertDialog alert11;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    ScheduleTripPresenter scheduleTripPresenter;
    Context context;
    Activity activity;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_pastrip, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        assert activity != null;
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        scheduleTripPresenter = new ScheduleTripPresenter(this);
        scheduleTripPresenter.getScheduleTripList(activity);

        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

    }

    @SuppressLint("WrongConstant")
    public void setAdapter() {
        if (tripModels != null && !tripModels.isEmpty()) {

            tripRecycleview.setLayoutManager(new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false));
            tripRecycleview.setItemAnimator(new DefaultItemAnimator());
            tripRecycleview.setHasFixedSize(true);
            tripAdapter = new ScheduleTripAdapter(tripModels, activity, this);
            tripRecycleview.setAdapter(tripAdapter);
            nodataTxt.setVisibility(View.GONE);
            tripRecycleview.setVisibility(View.VISIBLE);
        } else {
            tripRecycleview.setVisibility(View.GONE);
            nodataTxt.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
        try {
            if(alert11!=null && alert11.isShowing()){
                alert11.cancel();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void tripFragment(String tripid, int position) {

        Alertdialog(tripid,position);
    }

    @Override
    public void Onsuccess(Response<List<scheduleTripListModel>> Response) {
        tripModels.clear();
        tripModels.addAll(Response.body());
        setAdapter();
    }

    @Override
    public void onFailure(Response<List<scheduleTripListModel>> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message,activity,getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }

    }

    @Override
    public void OnCancelScheduleSuccess(Response<ScheduleCancelModel> Response, int position) {
        Utiles.displayMessage(getView(), context, Response.body().getMessage());
        tripModels.remove(position);
        setAdapter();
    }

    @Override
    public void onCancelScheduleFailure(Response<ScheduleCancelModel> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message,activity,getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
    }
    private void Alertdialog(String trip_id, int position) {
        android.app.AlertDialog.Builder builder1 = new android.app.AlertDialog.Builder(activity);
        builder1.setTitle(R.string.cancel_trip);
        builder1.setMessage(R.string.cancel_a_trip);
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                activity.getResources().getString(R.string.yes),
                (dialog, id) -> {
                    dialog.dismiss();
                    scheduleTripPresenter.getCancelScheduleTrip(activity, trip_id, position);
                });
        builder1.setNegativeButton(activity.getResources().getString(R.string.no), (dialog, which) -> dialog.dismiss());
        alert11 = builder1.create();
        alert11.show();

    }
}
