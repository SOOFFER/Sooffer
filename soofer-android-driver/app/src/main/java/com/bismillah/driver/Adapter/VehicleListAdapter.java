package com.bismillah.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;

import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.ListVehicleModel;
import com.bismillah.driver.R;

import java.util.List;

public class VehicleListAdapter extends RecyclerView.Adapter<VehicleListAdapter.MyViewHolder> {

    List<ListVehicleModel> vehicleModels;
    Activity activity;
    UpdateVehicleInterface updateVehicleInterface;

    public VehicleListAdapter(Activity activity, List<ListVehicleModel> vehicleModels, UpdateVehicleInterface updateVehicleInterface) {
        this.activity = activity;
        this.vehicleModels = vehicleModels;
        this.updateVehicleInterface = updateVehicleInterface;
    }

    @NonNull
    @Override
    public VehicleListAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.vehicle_list_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull VehicleListAdapter.MyViewHolder holder, int position) {
        final ListVehicleModel vehicleModel = vehicleModels.get(position);
        if (SharedHelper.getKey(activity.getApplicationContext(), "vehicleId") != null && SharedHelper.getKey(activity.getApplicationContext(), "vehicleId").equalsIgnoreCase(vehicleModel.getId())) {
            holder.vehicle_radio_button.setChecked(true);
        } else {
            holder.vehicle_radio_button.setChecked(false);
        }
        holder.vehicle_radio_button.setText("  " + vehicleModel.getMakename() + " " + vehicleModel.getModel() +" ( "+vehicleModel.getVehicletype() +" )");
        holder.vehicle_radio_button.setTag(position);
        holder.vehicle_radio_button.setOnClickListener(v -> {
            int pos = (int) v.getTag();
            if(!vehicleModel.getTaxistatus().equalsIgnoreCase("inactive")){
                updateVehicleInterface.UpdateVehicle(vehicleModels.get(pos));
                SharedHelper.putKey(activity, "vehicleId", vehicleModels.get(pos).getId());
                SharedHelper.putKey(activity, "vehicle_type", vehicleModels.get(pos).getVehicletype());
            }else {
                holder.vehicle_radio_button.setChecked(false);
                Utiles.CommonToast(activity,activity.getResources().getString(R.string.your_vehicle_status_is_inactive));
            }


        });

    }
    @Override
    public int getItemCount() {
        return vehicleModels.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {
        RadioButton vehicle_radio_button;

        public MyViewHolder(View itemView) {
            super(itemView);
            vehicle_radio_button = itemView.findViewById(R.id.vehicle_radio_button);
        }
    }

    public interface UpdateVehicleInterface {
        void UpdateVehicle(ListVehicleModel listVehicleModel);
    }
}
