package com.soofer.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.TripHistoryModel;
import com.soofer.driver.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class TripAdapterEarnings extends RecyclerView.Adapter<TripAdapterEarnings.MyViewHolder> {

    List<TripHistoryModel> tripModels;
    Activity activity;
    CallTripDetailFragment callTripDetailFragment;

    public TripAdapterEarnings(List<TripHistoryModel> tripModels, Activity activity, CallTripDetailFragment callTripDetailFragment) {
        this.tripModels = tripModels;
        this.activity = activity;
        this.callTripDetailFragment = callTripDetailFragment;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.youtrip_adpater_earnings, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        TripHistoryModel tripHistoryModel = tripModels.get(position);
        if (tripHistoryModel.getStatus().equalsIgnoreCase("Finished") ||  tripHistoryModel.getStatus().equalsIgnoreCase("completed")) {
            holder.bookIdTxt.setText(activity.getString(R.string.booking_id)+" " + Utiles.Nullpointer(tripHistoryModel.getTripno()));
            holder.pickupTxt.setText(Utiles.Nullpointer(tripHistoryModel.getAdsp().getFrom()));
            holder.dropAddressTxt.setText(Utiles.Nullpointer(tripHistoryModel.getAdsp().getTo()));
            holder.dateTxt.setText(tripHistoryModel.getDate());
        } else {
            holder.bookIdTxt.setText(activity.getString(R.string.booking_id)+" " + Utiles.Nullpointer(tripHistoryModel.getTripno()));
            holder.pickupTxt.setText(Utiles.Nullpointer(tripHistoryModel.getDsp().getStart()));
            holder.dropAddressTxt.setText(Utiles.Nullpointer(tripHistoryModel.getDsp().getEnd()));
            holder.dateTxt.setText(Utiles.Nullpointer(tripHistoryModel.getDate()));
        }
        holder.layoutOnclick.setOnClickListener(v -> {
            callTripDetailFragment.tripFragment(Utiles.Nullpointer(String.valueOf(tripModels.get(position).getId())));
        });


    }

    @Override
    public int getItemCount() {
        return tripModels.size();
    }


    static class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.book_id_txt)
        TextView bookIdTxt;
        @BindView(R.id.date_txt)
        TextView dateTxt;
        @BindView(R.id.pickup_txt)
        TextView pickupTxt;
        @BindView(R.id.drop_address_txt)
        TextView dropAddressTxt;
        @BindView(R.id.layout_onclick)
        LinearLayout layoutOnclick;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }

    public interface CallTripDetailFragment {
        void tripFragment(String tripid);
    }



}
