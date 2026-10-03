package com.soofer.driver.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.soofer.driver.Adapter.TripAdapterEarnings;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.TripDetailsModel;
import com.soofer.driver.Model.TripHistoryModel;
import com.soofer.driver.Presenter.TripDetailPresenter;
import com.soofer.driver.Presenter.TripDetailsPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.TripDetailView;
import com.soofer.driver.View.TripDetailsView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import retrofit2.Response;


public class PastripEarningsFragment extends BaseFragment implements TripDetailsView, TripAdapterEarnings.CallTripDetailFragment {
    List<TripHistoryModel> tripModels = new ArrayList<>();
    @BindView(R.id.trip_recycleview)
    RecyclerView tripRecycleview;
    @BindView(R.id.nodata_txt)
    TextView nodataTxt;
    Unbinder unbinder;
    TripAdapterEarnings tripAdapter;
    private boolean loading = true;
    int pastVisiblesItems, visibleItemCount, totalItemCount = 0;
    int Page = 1;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Context context;
    Activity activity;
    private TripDetailPresenter tripDetailPresenter;
    private TripDetailsPresenter tripDetailsPresenter;
    private LinearLayoutManager linearLayoutManager;

    @SuppressLint("WrongConstant")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_pastrip_earnings, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        tripDetailPresenter = new TripDetailPresenter(this);

        tripDetailsPresenter = new TripDetailsPresenter(new TripDetailView() {
            @Override
            public void onSuccess(Response<TripDetailsModel> response) {
                if (response != null && response.body() != null && response.body().getTripDetail() != null) {
                    showFareSplitDialog(response.body());
                }
            }

            @Override
            public void onFailure(Response<TripDetailsModel> response) {
                Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
            }
        });

        getPasination();
        linearLayoutManager = new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false);
        tripRecycleview.setLayoutManager(linearLayoutManager);
        tripRecycleview.setItemAnimator(new DefaultItemAnimator());
        tripModels.clear();
        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

    }

    public void setAdapter() {
        if (tripModels != null && !tripModels.isEmpty()) {
            setPagination();
            tripRecycleview.setHasFixedSize(true);
            tripAdapter = new TripAdapterEarnings(tripModels, activity, this);
            if (Page == 1) {
                tripRecycleview.setAdapter(tripAdapter);
            } else {
               tripAdapter.notifyDataSetChanged();
            }
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

    }

    @Override
    public void Onsuccess(Response<List<TripHistoryModel>> Response) {
        assert Response.body() != null;
        if (!Response.body().isEmpty()) {
            loading = true;
            tripModels.addAll(Response.body());
            setAdapter();
        }


    }

    @Override
    public void onFailure(Response<List<TripHistoryModel>> Response) {
        try {
            assert Response.errorBody() != null;
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message, activity, getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
    }

    @Override
    public void tripFragment(String tripid) {
        if (tripDetailsPresenter != null) {
            System.out.println("CALLING HERE");
            tripDetailsPresenter.getTripDetails(activity, tripid);
        }
    }

    @SuppressLint("SetTextI18n")
    private void showFareSplitDialog(TripDetailsModel model) {
        TripDetailsModel.Acsp acsp = model.getTripDetail().getAcsp();

        BottomSheetDialog dialog = new BottomSheetDialog(activity);
        View sheet = LayoutInflater.from(activity).inflate(R.layout.dialog_fare_split, null);
        dialog.setContentView(sheet);

        TextView tripNoTxt = sheet.findViewById(R.id.fare_trip_no_txt);
        TextView earningsTxt = sheet.findViewById(R.id.fare_earnings_txt);
        ImageView closeBtn = sheet.findViewById(R.id.fare_close_btn);
        LinearLayout container = sheet.findViewById(R.id.fare_rows_container);

        double totalFare = Double.parseDouble(acsp.getCost());
        double gateway = Double.parseDouble(acsp.getGatewayCharge());
        double commission = Double.parseDouble(acsp.getComison());
        double tax = Double.parseDouble(acsp.getTax());
        double bookingFare = Double.parseDouble(acsp.getBooking());
        double tollFee = Double.parseDouble(acsp.getTollFee());

        String earningsAmt = String.valueOf(totalFare-gateway-commission-tax-bookingFare-tollFee);

        tripNoTxt.setText(getString(R.string.booking_no_prefix) + Utiles.Nullpointer(model.getTripDetail().getTripno()));
        earningsTxt.setText("$ " + earningsAmt);

        addFareRow(container, getString(R.string.total_fare), null, "$ " + acsp.getCost());
        addFareRow(container, getString(R.string.gateway_charge), null, "$ " + acsp.getGatewayCharge());
        addFareRow(container, getString(R.string.tipss), null, "$ " + model.getDriverTip());

        String taxDesc = acsp.getTaxPercentage() != null ? acsp.getTaxPercentage() + "%" : null;
        addFareRow(container, getString(R.string.access_faress), taxDesc, "$ " + acsp.getTax());

        addFareRow(container, getString(R.string.payment_method), null, acsp.getVia().toUpperCase());

        closeBtn.setOnClickListener(v -> dialog.dismiss());
        dialog.show();
    }

    @SuppressLint("SetTextI18n")
    private void addFareRow(LinearLayout container, String label, String desc, String value) {
        View row = LayoutInflater.from(activity).inflate(R.layout.item_fare_split_row, container, false);
        TextView labelTxt = row.findViewById(R.id.fare_row_label);
        TextView descTxt = row.findViewById(R.id.fare_row_desc);
        TextView valueTxt = row.findViewById(R.id.fare_row_value);
        labelTxt.setText(label);
        if (desc != null && !desc.isEmpty()) {
            descTxt.setText(desc);
            descTxt.setVisibility(View.VISIBLE);
        }
        valueTxt.setText(value);
        container.addView(row);
    }

    private boolean isZero(String value) {
        if (value == null) return true;
        String v = value.trim();
        if (v.isEmpty() || v.equalsIgnoreCase("null")) return true;
        try {
            return Double.parseDouble(v) == 0d;
        } catch (NumberFormatException e) {
            return false;
        }
    }


    public void getPasination() {
        HashMap<String, String> map = new HashMap<>();
        map.put("_limit", "10");
        map.put("_page", "" + Page);
        map.put("date", CommonData.Earningdate );
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
