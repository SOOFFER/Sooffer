package com.soofer.app.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Interface.CommonInterFace;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.OutStationModel;
import com.soofer.app.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class SeviceTypeAdapter extends RecyclerView.Adapter<SeviceTypeAdapter.MyViewHolder> {


   private Activity activity;
   private CommonInterFace commonInterFace;
   private List<OutStationModel.VehicleList> vehicleList;
   private String strTripType;
   private int previousSelect =0;

    public SeviceTypeAdapter(Activity activity, CommonInterFace commonInterFace, List<OutStationModel.VehicleList> vehicleList, String strTripType) {
        this.activity = activity;
        this.commonInterFace = commonInterFace;
        this.vehicleList = vehicleList;
        this.strTripType=strTripType;


    }
    public void checkoneWayorRoundTrip(String strTripType){
        this.strTripType=strTripType;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.service_type_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        try {
            if(strTripType.equalsIgnoreCase("oneway")){
                holder.txtFare.setText("$ " +vehicleList.get(position).getFareDetails().getTotalFare());
            }else {
                System.out.println("enter the rate round"+vehicleList.get(position).getFareDetails().getPerKmRateRound());
                holder.txtFare.setText("$ " +vehicleList.get(position).getFareDetails().getPerKmRateRound() +" / Mile");
            }
            holder.carRadio.setChecked(position==previousSelect);
            System.out.println("enter the json pojo"+vehicleList.get(position).getFile());
            Glide.with(activity).load(vehicleList.get(position).getFile())
                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                    .skipMemoryCache(false)
                    .override(100, 100)
                    .into(holder.imgCartype);
            holder.imgCartype.setColorFilter(activity.getResources().getColor(R.color.colorPrimary));
            holder.txtCarName.setText(Utiles.NullPointer(vehicleList.get(position).getVehicle()));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public int getItemCount() {
        return vehicleList.size();
    }

     class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.img_cartype)
        ImageView imgCartype;
        @BindView(R.id.txt_car_name)
        TextView txtCarName;
        @BindView(R.id.txt_fare)
        TextView txtFare;
        @BindView(R.id.car_radio)
        RadioButton carRadio;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
            view.setOnClickListener(Views->{
                commonInterFace.callBack(getAdapterPosition());
                previousSelect = getAdapterPosition();
                notifyDataSetChanged();

            });
        }
    }


}
