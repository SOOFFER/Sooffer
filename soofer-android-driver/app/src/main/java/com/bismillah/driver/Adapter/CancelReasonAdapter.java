package com.bismillah.driver.Adapter;

import android.app.Activity;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;


import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.Model.DriverProfileModel;
import com.bismillah.driver.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class CancelReasonAdapter extends RecyclerView.Adapter<CancelReasonAdapter.MyViewHolder> {


    Activity activity;
    public List<String> cancelmodel;
    public CancelLisioner cancelLisioner;

    public CancelReasonAdapter(Activity activity, List<String> cancelReasonModels, CancelLisioner cancelLisioner) {
        this.activity = activity;
        this.cancelmodel = cancelReasonModels;
        this.cancelLisioner = cancelLisioner;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cancel_reason_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);

    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        holder.reasonTitle.setText(cancelmodel.get(position));
    }

    @Override
    public int getItemCount() {
        return cancelmodel.size();
    }

    class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.reason_title)
        TextView reasonTitle;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
            view.setOnClickListener(v -> cancelLisioner.CancelReason(cancelmodel.get(getAdapterPosition())));
        }
    }

    public interface CancelLisioner {
        void CancelReason(String strreason);
    }
}
