package com.bismillah.app.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.Model.FareModel;
import com.bismillah.app.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class FareAdapter extends RecyclerView.Adapter<FareAdapter.ViewHolder> {

    private Activity context;
    private List<FareModel> fareModels;


    public FareAdapter(Activity context, List<FareModel> fareModels) {
        this.context = context;
        this.fareModels = fareModels;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.fare_adapter, parent, false);
        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(context.getAssets(), context.getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) context.findViewById(android.R.id.content));
        return new ViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        if(fareModels.get(position).getDesc().isEmpty()){
            holder.lableTxt.setText(fareModels.get(position).getLabel());
        }else {
            holder.lableTxt.setText(fareModels.get(position).getLabel() +" \n"+fareModels.get(position).getDesc());
        }
        holder.distanceRentalOutTxt.setText(fareModels.get(position).getValue());


    }

    @Override
    public int getItemCount() {
        return fareModels.size();
    }

    static

    public class ViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.lable_txt)
        TextView lableTxt;
        @BindView(R.id.distance_rental_out_txt)
        TextView distanceRentalOutTxt;

        public ViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }


}
