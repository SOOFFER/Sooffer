package com.soofer.app.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Build;
import androidx.annotation.RequiresApi;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.ServiceModel;
import com.soofer.app.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * Created by com on 21-Jun-18.
 */

public class NearServiceAdapter extends RecyclerView.Adapter<NearServiceAdapter.MyViewHolder> {
    private List<ServiceModel.VehicleCategory> serviceModels;
    private Activity activity;
    private boolean clickable = false;
    private int click = 0;

    public NearServiceAdapter(Activity activity, List<ServiceModel.VehicleCategory> serviceModels) {
        this.activity = activity;
        this.serviceModels = serviceModels;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.serviceadapter, parent, false);
        return new NearServiceAdapter.MyViewHolder(view);
    }

    @SuppressLint("RecyclerView")
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {


        if (!clickable) {
            if (position == 0) {
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.ic_select_car));
                final int newColor = activity.getResources().getColor(R.color.car_select);
                int height = activity.getResources().getDimensionPixelSize(R.dimen._55sdp);
                int width = activity.getResources().getDimensionPixelSize(R.dimen._55sdp);
                LinearLayout.LayoutParams parms = new LinearLayout.LayoutParams(width, height);
                holder.img_cartype.setLayoutParams(parms);
                try {
                    CallRequest callRequest = (CallRequest) activity;
                   // callRequest.SelectedCategory(CommonData.strServiceType);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.car_bg));
                final int newColor = activity.getResources().getColor(R.color.car_unselect);
              //  holder.img_cartype.setColorFilter(newColor, PorterDuff.Mode.SRC_IN);
                int height = activity.getResources().getDimensionPixelSize(R.dimen._50sdp);
                int width = activity.getResources().getDimensionPixelSize(R.dimen._50sdp);
                LinearLayout.LayoutParams parms = new LinearLayout.LayoutParams(width, height);
                holder.img_cartype.setLayoutParams(parms);
            }
        } else {
            if (position == click) {
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.ic_select_car));
                final int newColor = activity.getResources().getColor(R.color.car_select);
              //  holder.img_cartype.setColorFilter(newColor, PorterDuff.Mode.SRC_IN);
                int height = activity.getResources().getDimensionPixelSize(R.dimen._55sdp);
                int width = activity.getResources().getDimensionPixelSize(R.dimen._55sdp);
                LinearLayout.LayoutParams parms = new LinearLayout.LayoutParams(width, height);
                holder.img_cartype.setLayoutParams(parms);
            } else {
                holder.img_cartype.setBackground(activity.getResources().getDrawable(R.drawable.car_bg));
                final int newColor = activity.getResources().getColor(R.color.car_unselect);
               // holder.img_cartype.setColorFilter(newColor, PorterDuff.Mode.SRC_IN);
                int height = activity.getResources().getDimensionPixelSize(R.dimen._50sdp);
                int width = activity.getResources().getDimensionPixelSize(R.dimen._50sdp);
                LinearLayout.LayoutParams parms = new LinearLayout.LayoutParams(width, height);
                holder.img_cartype.setLayoutParams(parms);
            }
        }


        holder.itemView.setOnClickListener(v -> {

                notifyDataSetChanged();
                click = position;

        });
    }

    @Override
    public int getItemCount() {
        return 10;
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.img_service_car)
        ImageView img_cartype;

        @BindView(R.id.txt_car_name)
        TextView txt_car_name;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }

    public interface SelectedServiceType {
        void SelectService();
    }


}
