package com.bismillah.app.Adapter;

import android.app.Activity;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.Model.CancelReasonModel;
import com.bismillah.app.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class CancelReasonAdapter extends RecyclerView.Adapter<CancelReasonAdapter.MyViewHolder> {


    Activity activity;
    public List<CancelReasonModel> cancelReasonModels;
    public CancelLisioner cancelLisioner;

    public CancelReasonAdapter(Activity activity, List<CancelReasonModel> cancelReasonModels, CancelLisioner cancelLisioner) {
        this.activity = activity;
        this.cancelReasonModels = cancelReasonModels;
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
        holder.reasonTitle.setText(cancelReasonModels.get(position).getStrTitle());

    }

    @Override
    public int getItemCount() {
        return cancelReasonModels.size();
    }

    class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.reason_title)
        TextView reasonTitle;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
            view.setOnClickListener(v -> cancelLisioner.CancelReason(cancelReasonModels.get(getAdapterPosition()).getStrTitle()));
        }
    }

    public interface CancelLisioner {
        void CancelReason(String strreason);
    }
}
