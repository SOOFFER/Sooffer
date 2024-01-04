package com.bismillah.app.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.Model.scheduleTripListModel;

import java.util.List;

import com.bismillah.app.R;

import butterknife.BindView;
import butterknife.ButterKnife;

public class ScheduleTripAdapter extends RecyclerView.Adapter<ScheduleTripAdapter.MyViewHolder> {

    private List<scheduleTripListModel> tripModels;
    private Activity activity;
    private callTripCancel callTripDetailFragment;

    public ScheduleTripAdapter(List<scheduleTripListModel> tripModels, Activity activity, callTripCancel Calltripcancel) {
        this.tripModels = tripModels;
        this.activity = activity;
        this.callTripDetailFragment = Calltripcancel;
    }

    @NonNull
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
        scheduleTripListModel tripHistoryModel = tripModels.get(position);
        holder.cancel_trip_btn.setVisibility(View.VISIBLE);
        if (tripHistoryModel.getStatus().equalsIgnoreCase("Finished") ||  tripHistoryModel.getStatus().equalsIgnoreCase("completed")) {
            holder.bookIdTxt.setText("Book ID:" + tripHistoryModel.getTripno());
            //  holder.pickupTxt.setText(tripHistoryModel.getAdsp().getFrom());
            //    holder.dropAddressTxt.setText(tripHistoryModel.getAdsp().getTo());
            holder.statusTxt.setText(tripHistoryModel.getStatus());
            holder.dateTxt.setText(tripHistoryModel.getTripDT());
        } else {
            holder.bookIdTxt.setText("Book ID:" + tripHistoryModel.getTripno());
            holder.pickupTxt.setText(tripHistoryModel.getDsp().getStart());
            holder.dropAddressTxt.setText(tripHistoryModel.getDsp().getEnd());
            holder.statusTxt.setText(tripHistoryModel.getStatus());
            holder.dateTxt.setText(tripHistoryModel.getTripDT());
            try {
                assert holder.trip_layout != null;
                if (tripHistoryModel.getDsp().getEnd().isEmpty()) {
                    holder.trip_layout.setVisibility(View.GONE);
                } else {
                    holder.trip_layout.setVisibility(View.VISIBLE);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
        holder.cancel_trip_btn.setTag(position);
        holder.cancel_trip_btn.setOnClickListener(v -> {
            int position1 = (int) v.getTag();
            callTripDetailFragment.tripFragment(tripModels.get(position1).getId().toString(), position1);
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
        @Nullable
        @BindView(R.id.trip_layout)
        LinearLayout trip_layout;
        @BindView(R.id.cancel_trip_btn)
        Button cancel_trip_btn;

        MyViewHolder(View view) {
            super(view);
            view.setOnClickListener(view1 -> {

                //   callTripDetailFragment.UpcomingDetails(tripModels.get(this.getAdapterPosition()).getId());
            });
            ButterKnife.bind(this, view);
        }
    }

    public interface callTripCancel {
        void tripFragment(String tripid, int position);

        void UpcomingDetails(String tripid);
    }
}
