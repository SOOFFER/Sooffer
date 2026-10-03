package com.soofer.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.Model.EarningModel;
import com.soofer.driver.R;

import java.util.List;

import com.soofer.driver.CommonClass.Utiles;
import butterknife.BindView;
import butterknife.ButterKnife;

public class EarningsAdapter extends RecyclerView.Adapter<EarningsAdapter.MyViewHolder> {

    List<EarningModel> earningModels;
    Activity activity;
    CallbackLs callbackLs;

    public EarningsAdapter(Activity activity, CallbackLs callbackLs,List<EarningModel> earningModels) {
        this.activity = activity;
        this.callbackLs = callbackLs;
        this.earningModels = earningModels;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.earningadapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(MyViewHolder holder, final int position) {

        holder.dateTxt.setText(earningModels.get(position).getDate());
        holder.totalEarningTxt.setText("$ " + Utiles.dotLimitation( earningModels.get(position).getAmttodriver()));
        holder.totalAmountTxt.setText("$ " + Utiles.dotLimitation( earningModels.get(position).getAmttopay()));
        holder.totalTrips.setText(earningModels.get(position).getNos());

        holder.layoutOnclick.setOnClickListener(v -> {
            callbackLs.positionClick(position);
        });

    }

    @Override
    public int getItemCount() {
        return earningModels.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.date_txt)
        TextView dateTxt;
        @BindView(R.id.total_earning_txt)
        TextView totalEarningTxt;
        @BindView(R.id.total_amount_txt)
        TextView totalAmountTxt;
        @BindView(R.id.totalTrips)
        TextView totalTrips;
        @BindView(R.id.layout_onclick)
        LinearLayout layoutOnclick;

        public MyViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);

        }
    }

    public interface CallbackLs {
        void positionClick(int position);
    }


}
