package com.soofer.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.Model.TripFlowModel;
import com.soofer.driver.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class MultipleAddressLineAdapter extends RecyclerView.Adapter<MultipleAddressLineAdapter.MyViewHolder> {

    private List<TripFlowModel.MultiLocation> addressModelList;
    private Activity activity;


    public MultipleAddressLineAdapter(List<TripFlowModel.MultiLocation> addressModelList, Activity activity) {
        this.addressModelList = addressModelList;
        this.activity = activity;


    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.multiple_stops_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        try {
            if (position == 0) {
                holder.pickerLabelTxt.setText(activity.getResources().getString(R.string.pickupss));
            } else if (position == addressModelList.size() - 1) {
                holder.pickerLabelTxt.setText(activity.getResources().getString(R.string.drop));
            } else {
                holder.pickerLabelTxt.setText(activity.getResources().getString(R.string.stops));
            }
            holder.addressTxt.setText(addressModelList.get(position).getStrAddress());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public int getItemCount() {
        return addressModelList.size();
    }


    static class MyViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.picker_label_txt)
        TextView pickerLabelTxt;
        @BindView(R.id.address_txt)
        TextView addressTxt;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }


}
