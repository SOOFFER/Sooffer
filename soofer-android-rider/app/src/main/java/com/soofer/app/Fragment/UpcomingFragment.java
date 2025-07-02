package com.soofer.app.Fragment;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.soofer.app.Adapter.ScheduleTripAdapter;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.ScheduleCancelModel;
import com.soofer.app.Model.scheduleTripListModel;
import com.soofer.app.Presenter.ScheduleTripPresenter;


import com.soofer.app.R;
import com.soofer.app.View.ScheduleListView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import retrofit2.Response;


public class UpcomingFragment extends BaseFragment implements ScheduleListView, ScheduleTripAdapter.callTripCancel {
    List<scheduleTripListModel> tripModels = new ArrayList<>();
    @BindView(R.id.trip_recycleview)
    RecyclerView tripRecycleview;
    @BindView(R.id.nodata_txt)
    TextView nodataTxt;
    Unbinder unbinder;
    ScheduleTripAdapter tripAdapter;
    private AlertDialog alert11;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    private ScheduleTripPresenter scheduleTripPresenter;
    private Context context;
    private Activity activity;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_pastrip, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
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
    public void Onsuccess(Response<List<scheduleTripListModel>> Response) {
        tripModels.clear();
        tripModels.addAll(Response.body());
        setAdapter();

    }

    @Override
    public void onFailure(Response<List<scheduleTripListModel>> Response) {
        try {
            String Message = Response.errorBody().string();

            JSONObject jsonObject = new JSONObject(Message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getView(), context, jsonObject.optString("message"));
            }

        } catch (IOException | JSONException e) {
            Utiles.displayMessage(getView(), context, "Something went Wrong");
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

            JSONObject jsonObject = new JSONObject(Message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getView(), context, jsonObject.optString("message"));
            }

        } catch (IOException | JSONException e) {
            Utiles.displayMessage(getView(), context, "Something went Wrong");
        }
    }

    @Override
    public void tripFragment(String tripid, int position) {
        Alertdialog(tripid,position);
    }

    @Override
    public void UpcomingDetails(String tripid) {
        FragmentTransaction ft = getFragmentManager().beginTransaction();
        UpcomingDetails newFragment = UpcomingDetails.newInstance();
        newFragment.show(ft, "dialog");
    }

    private void Alertdialog(String trip_id, int position) {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(activity);
        builder1.setTitle(R.string.cancel_trip);
        builder1.setMessage("Are you sure wanna a cancel a trip");
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                "Yes",
                (dialog, id) -> {
                    dialog.dismiss();
                    scheduleTripPresenter.getCancelScheduleTrip(activity, trip_id, position);
                });
        builder1.setNegativeButton("No", (dialog, which) -> dialog.dismiss());
        alert11 = builder1.create();
        alert11.show();

    }
}
