package com.soofer.app.Adapter;

import static com.soofer.app.CommonClass.CommonData.strDate;

import android.annotation.SuppressLint;
import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.ServiceModel;

import java.util.List;

import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.R;
import com.soofer.app.Retrofit.RetrofitGenerator;


import butterknife.BindView;
import butterknife.ButterKnife;


public class ServiceAdapter extends RecyclerView.Adapter<ServiceAdapter.MyViewHolder> {
    private final List<ServiceModel.VehicleCategory> serviceModels;
    private final Activity activity;
    private boolean clickable = false;
    private int click = 0;
    private final CallRequest callRequest;

    public ServiceAdapter(Activity activity, List<ServiceModel.VehicleCategory> serviceModels, CallRequest callRequest) {
        this.activity = activity;
        this.serviceModels = serviceModels;
        this.callRequest = callRequest;

    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.serviceadapter, parent, false);
        return new ServiceAdapter.MyViewHolder(view);
    }

    @SuppressLint({"RecyclerView", "ResourceType", "SetTextI18n"})
    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        String str_outstation = SharedHelper.getKey(activity, "outstationflow");
        String str_rental = SharedHelper.getKey(activity, "rentalflow");
        holder.txt_car_name.setText(serviceModels.get(position).getType());
        holder.mints_name.setText(serviceModels.get(position).getEta());
        holder.seatTxt.setVisibility(View.VISIBLE);
        holder.mints_name.setVisibility(View.VISIBLE);
        holder.comngtxt.setVisibility(View.GONE);


        Log.e(serviceModels.get(position).getEta(), "ETA");
        holder.seatTxt.setText("Seat : " + serviceModels.get(position).getSeats());
        if (serviceModels.get(position).getType().equals("Rental")) {
            if (str_rental.equals("false")) {
                holder.comngtxt.setText("Coming soon");
                holder.seatTxt.setVisibility(View.GONE);
                holder.mints_name.setVisibility(View.GONE);
                holder.comngtxt.setVisibility(View.VISIBLE);
            }

        } else if (serviceModels.get(position).getType().equals("Outstation")) {
            if (str_outstation.equals("false")) {
                holder.comngtxt.setText("Coming soon");
                holder.seatTxt.setVisibility(View.GONE);
                holder.mints_name.setVisibility(View.GONE);
                holder.comngtxt.setVisibility(View.VISIBLE);
            }
        }
        if (serviceModels.get(position).getAvailable()) {
            Glide.with(activity).load(RetrofitGenerator.imagepath + serviceModels.get(position).getFile())
                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                    .skipMemoryCache(false)
                    .override(100, 100)
                    .into(holder.img_cartype);


        } else {
            Glide.with(activity).load(R.drawable.soon).diskCacheStrategy(DiskCacheStrategy.NONE)
                    .skipMemoryCache(false)
                    .override(100, 100)
                    .into(holder.img_cartype);


        }

        if (!clickable) {
            if (position == 0) {
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.ic_select_car));
                CommonData.strServiceType = serviceModels.get(position).getType();
                CommonData.strServiceImage = RetrofitGenerator.imagepath + serviceModels.get(position).getFile();
                CommonData.ServiceID = serviceModels.get(position).getId();
                CommonData.isRiderLater = serviceModels.get(position).getIsRideLater();
                try {
                    CallRequest callRequest = (CallRequest) activity;
                    callRequest.SelectedCategory(serviceModels.get(holder.getAdapterPosition()));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.car_bg));
            }
        } else {
            if (position == click) {
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.ic_select_car));
            } else {
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.car_bg));
            }
        }


        holder.itemView.setOnClickListener(v -> {
            if (strDate.isEmpty() && serviceModels.get(position).getEta().equals("NA")) {
                callRequest.availablestatus(serviceModels.get(position).getEta());
            } else {
                if (serviceModels.get(position).getAvailable()) {
                    CommonData.strServiceType = serviceModels.get(position).getType();
                    CommonData.ServiceID = serviceModels.get(position).getId();
                    CommonData.isRiderLater = serviceModels.get(position).getIsRideLater();
                    CommonData.strServiceImage = RetrofitGenerator.imagepath + serviceModels.get(position).getFile();
                    CommonData.strVehicleCode = serviceModels.get(position).getTripTypeCode();
                    CommonData.DriverETA = serviceModels.get(position).getEta();
                    clickable = true;
                    try {
                        if (click == position) {
                            callRequest.SelectedCategory(serviceModels.get(holder.getAdapterPosition()));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    try {
                        CallRequest callRequest = (CallRequest) activity;
                        callRequest.SelectedCategory(serviceModels.get(holder.getAdapterPosition()));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    click = position;
                    notifyDataSetChanged();
                } else {
                    Utiles.displayMessage(activity.getCurrentFocus(), activity, "Coming Soon");
                }

            }


        });
    }

    @Override
    public int getItemCount() {
        return serviceModels.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.img_service_car)
        ImageView img_cartype;

        @BindView(R.id.txt_car_name)
        TextView txt_car_name;
        @BindView(R.id.mints_name)
        TextView mints_name;
        @BindView(R.id.seat_txt)
        TextView seatTxt;
        @BindView(R.id.coming_txt)
        TextView comngtxt;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }


}
