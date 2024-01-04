package com.bismillah.app.Fragment;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;


import com.bismillah.app.Activity.TripDetailsActivity;
import com.bismillah.app.Adapter.TripAdapter;
import com.bismillah.app.CommonClass.BaseFragment;
import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.TripHistoryModel;
import com.bismillah.app.Presenter.TripDetailPresenter;
import com.bismillah.app.R;
import com.bismillah.app.View.TripDetailsView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import retrofit2.Response;


public class PastripFragment extends BaseFragment implements TripDetailsView, TripAdapter.CallTripDetailFragment {
    List<TripHistoryModel> tripModels = new ArrayList<>();
    @BindView(R.id.trip_recycleview)
    RecyclerView tripRecycleview;
    @BindView(R.id.nodata_txt)
    TextView nodataTxt;
    Unbinder unbinder;
    TripAdapter tripAdapter;
    private boolean loading = true;
    int pastVisiblesItems, visibleItemCount, totalItemCount = 0;
    int Page = 1;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Context context;
    Activity activity;
    TripDetailPresenter tripDetailPresenter;
    LinearLayoutManager linearLayoutManager;

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
        tripDetailPresenter = new TripDetailPresenter(this);
        getPasination();
        linearLayoutManager = new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false);
        tripRecycleview.setLayoutManager(linearLayoutManager);
        tripModels.clear();
        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

    }

    public void setAdapter() {
        if (tripModels != null && !tripModels.isEmpty()) {
            tripRecycleview.setItemAnimator(new DefaultItemAnimator());
            tripRecycleview.setHasFixedSize(true);
            tripAdapter = new TripAdapter(tripModels, activity, this);
            if (Page == 1) {
                tripRecycleview.setAdapter(tripAdapter);
            } else {
                tripAdapter.notifyDataSetChanged();
            }
            tripRecycleview.smoothScrollToPosition(totalItemCount);
            nodataTxt.setVisibility(View.GONE);
            tripRecycleview.setVisibility(View.VISIBLE);
        } else {
            tripRecycleview.setVisibility(View.GONE);
            nodataTxt.setVisibility(View.VISIBLE);
        }
        setPagination();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @Override
    public void Onsuccess(Response<List<TripHistoryModel>> Response) {
        if (!Response.body().isEmpty()) {
            loading = true;
            tripModels.addAll(Response.body());
            setAdapter();
        }


    }

    @Override
    public void onFailure(Response<List<TripHistoryModel>> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message, activity, getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
    }

    @Override
    public void tripFragment(String tripid) {
        Intent intent = new Intent(activity, TripDetailsActivity.class);
        intent.putExtra("trip_id", tripid);
        startActivity(intent);
    }


    public void getPasination() {
        HashMap<String, String> map = new HashMap<>();
        map.put("_limit", "10");
        map.put("_page", "" + Page);
        tripDetailPresenter.getTripHistory(activity, map);
    }

    public void setPagination() {
        tripRecycleview.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                if (dy > 0) //check for scroll down
                {
                    visibleItemCount = linearLayoutManager.getChildCount();
                    totalItemCount = linearLayoutManager.getItemCount();
                    pastVisiblesItems = linearLayoutManager.findFirstVisibleItemPosition();

                    if (loading) {
                        if ((visibleItemCount + pastVisiblesItems) >= totalItemCount) {
                            loading = false;

                            Page += 1;
                            getPasination();
                            //Do pagination.. i.e. fetch new data
                        }
                    }
                }
            }
        });


    }
}

