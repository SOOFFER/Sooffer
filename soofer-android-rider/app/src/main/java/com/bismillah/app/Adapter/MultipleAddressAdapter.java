package com.bismillah.app.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.recyclerview.widget.RecyclerView;

import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.Model.LocalModel.MultipleAddressModel;
import com.bismillah.app.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class MultipleAddressAdapter extends RecyclerView.Adapter<MultipleAddressAdapter.MyViewHolder> {
    private List<MultipleAddressModel> addressModelList;
    private Activity activity;
    private CallBackListioner callBackListioner;

    public MultipleAddressAdapter(List<MultipleAddressModel> addressModelList, Activity activity, CallBackListioner callBackListioner) {
        this.addressModelList = addressModelList;
        this.activity = activity;
        this.callBackListioner = callBackListioner;

    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.multiple_stop_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        holder.icDot.setImageResource(position == addressModelList.size() - 1 ? R.drawable.ic_square_dot : R.drawable.ic_drop_dot);
        if (position == 0) {
            holder.icCloseImg.setVisibility(View.INVISIBLE);
        } else {
            holder.icCloseImg.setVisibility(addressModelList.get(position).getStrAddress().isEmpty() ? View.INVISIBLE : View.VISIBLE);
        }

        holder.addressEdt.setText(addressModelList.get(position).getStrAddress());
        holder.icCloseImg.setOnClickListener(view -> {
            if (addressModelList.size() == 4 && !addressModelList.get(addressModelList.size()-1).getStrAddress().isEmpty()) {
                addressModelList.remove(holder.getAdapterPosition());
                addressModelList.add(new MultipleAddressModel("", 0.0, 0.0));
                notifyDataSetChanged();
            } else {
                addressModelList.remove(holder.getAdapterPosition());
                notifyDataSetChanged();
                if(addressModelList.size()==2){
                    callBackListioner.callAddress(false);
                }

            }

        });
        holder.addressEdt.setOnClickListener(vew -> {
            addressModelList.get(position).setUpdatePosition(true);
            callBackListioner.callAddress(true);
        });
    }

    @Override
    public int getItemCount() {
        return addressModelList.size();
    }


    static class MyViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.ic_dot)
        ImageView icDot;
        @BindView(R.id.address_edt)
        EditText addressEdt;
        @BindView(R.id.ic_close_img)
        ImageView icCloseImg;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }

    public interface CallBackListioner {
        void callAddress(boolean isAdd);
    }
}