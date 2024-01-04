package com.bismillah.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.TripHistoryModel;
import com.bismillah.driver.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class TripAdapter extends RecyclerView.Adapter<TripAdapter.MyViewHolder> {

    List<TripHistoryModel> tripModels;
    Activity activity;
    CallTripDetailFragment callTripDetailFragment;

    public TripAdapter(List<TripHistoryModel> tripModels, Activity activity, CallTripDetailFragment callTripDetailFragment) {
        this.tripModels = tripModels;
        this.activity = activity;
        this.callTripDetailFragment = callTripDetailFragment;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.youtrip_adpater, parent, false);
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
            holder.statusTxt.setText("Completed");
            holder.dateTxt.setText(tripHistoryModel.getDate());
        } else {
            holder.bookIdTxt.setText(activity.getString(R.string.booking_id)+" " + Utiles.Nullpointer(tripHistoryModel.getTripno()));
            holder.pickupTxt.setText(Utiles.Nullpointer(tripHistoryModel.getDsp().getStart()));
            holder.dropAddressTxt.setText(Utiles.Nullpointer(tripHistoryModel.getDsp().getEnd()));
            holder.statusTxt.setText(Utiles.Nullpointer(tripHistoryModel.getStatus()));
            holder.dateTxt.setText(Utiles.Nullpointer(tripHistoryModel.getDate()));
        }
        holder.layoutOnclick.setTag(position);
        holder.layoutOnclick.setOnClickListener(v -> {
            int position1 = (int) v.getTag();
            callTripDetailFragment.tripFragment(Utiles.Nullpointer(String.valueOf(tripModels.get(position1).getId())));
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
        @BindView(R.id.status_txt)
        TextView statusTxt;
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
