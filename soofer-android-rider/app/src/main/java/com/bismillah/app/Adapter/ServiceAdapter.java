package com.bismillah.app.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.PorterDuff;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.FlowInterface.CallRequest;
import com.bismillah.app.Model.ServiceModel;

import java.util.List;

import com.bismillah.app.CommonClass.CommonData;
import com.bismillah.app.R;
import com.bismillah.app.Retrofit.RetrofitGenerator;


import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * Created by com on 21-Jun-18.
 */

public class ServiceAdapter extends RecyclerView.Adapter<ServiceAdapter.MyViewHolder> {
    private List<ServiceModel.VehicleCategory> serviceModels;
    private Activity activity;
    private boolean clickable = false;
    private int click = 0;
    private String str_outstn;
    private String str_rental;
    private CallRequest callRequest;

    public ServiceAdapter(Activity activity, List<ServiceModel.VehicleCategory> serviceModels, CallRequest callRequest) {
        this.activity = activity;
        this.serviceModels = serviceModels;
        this.callRequest = callRequest;

    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.serviceadapter, parent, false);
        return new ServiceAdapter.MyViewHolder(view);
    }

    @SuppressLint({"RecyclerView", "ResourceType"})
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
       str_outstn= SharedHelper.getKey(activity,"outstationflow");
        str_rental=SharedHelper.getKey(activity,"rentalflow");
        System.out.println("enter the vehicle image"+ RetrofitGenerator.imagepath + serviceModels.get(position).getFile());
        holder.txt_car_name.setText(serviceModels.get(position).getType());
        holder.mints_name.setText(serviceModels.get(position).getEta());
        holder.seatTxt.setVisibility(View.VISIBLE);
        holder.mints_name.setVisibility(View.VISIBLE);
        holder.comngtxt.setVisibility(View.GONE);


        Log.e(serviceModels.get(position).getEta(),"ETA");
        System.out.println("ETA in service adaptor ::" + serviceModels.get(position).getEta().toString());
     //   holder.seatTxt.setVisibility(serviceModels.get(position).getType().equalsIgnoreCase("rental")||serviceModels.get(position).getType().equalsIgnoreCase("outstation")? View.INVISIBLE : View.VISIBLE);
        holder.seatTxt.setText("Seat : "+serviceModels.get(position).getSeats());
        if(serviceModels.get(position).getType().equals("Rental")){
            if(str_rental.equals("false")) {
                holder.comngtxt.setText("Comming soon");
                holder.seatTxt.setVisibility(View.GONE);
                holder.mints_name.setVisibility(View.GONE);
                holder.comngtxt.setVisibility(View.VISIBLE);
            }

        }
         else if(serviceModels.get(position).getType().equals("Outstation")){
            if(str_outstn.equals("false")) {
                holder.comngtxt.setText("Comming soon");
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
                CommonData.strServiceImage = RetrofitGenerator.imagepath +serviceModels.get(position).getFile();
                CommonData.ServiceID = serviceModels.get(position).getId();
                CommonData.isRiderLater = serviceModels.get(position).getIsRideLater();
                holder.img_cartype.setColorFilter(activity.getResources().getColor(R.color.white), PorterDuff.Mode.MULTIPLY);
                try {
                    CallRequest callRequest = (CallRequest) activity;
                    callRequest.SelectedCategory(serviceModels.get(holder.getAdapterPosition()));

                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {

                holder.img_cartype.setColorFilter(activity.getResources().getColor(R.color.grey), PorterDuff.Mode.MULTIPLY);
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.car_bg));
            }
        } else {
            if (position == click) {
                holder.img_cartype.setColorFilter(activity.getResources().getColor(R.color.white), PorterDuff.Mode.MULTIPLY);
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.ic_select_car));
            } else {
               holder.img_cartype.setColorFilter(activity.getResources().getColor(R.color.grey), PorterDuff.Mode.MULTIPLY);
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.car_bg));
            }
        }



        holder.itemView.setOnClickListener(v -> {

            if(serviceModels.get(position).getEta().equals("NA")){

                callRequest.availablestatus(serviceModels.get(position).getEta());


        }else {

                if (serviceModels.get(position).getAvailable()) {
                    CommonData.strServiceType = serviceModels.get(position).getType();
                    CommonData.ServiceID = serviceModels.get(position).getId();
                    CommonData.isRiderLater = serviceModels.get(position).getIsRideLater();
                    CommonData.strServiceImage = RetrofitGenerator.imagepath + serviceModels.get(position).getFile();
                    CommonData.strVehicleCode = serviceModels.get(position).getTripTypeCode();
                    CommonData.DriverETA = serviceModels.get(position).getEta();

                    System.out.println("STRVechicle :: " + CommonData.strVehicleCode);
                    System.out.println("DriverETA :: " + CommonData.DriverETA);
                    //if(serviceModels.get(position).getEta().equals("NA")) {

                    // }
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
                    System.out.println("aaa " + serviceModels.get(position).getAvailable());
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
