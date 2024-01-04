package com.bismillah.driver.Adapter;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bismillah.driver.CommonClass.Constants;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.VehicleStateModel;
import com.bismillah.driver.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class ServiceStateAdapter extends RecyclerView.Adapter<ServiceStateAdapter.MyViewHolder> {



    private Activity activity;
    private List<VehicleStateModel> stateModels;
    private CallbackListioner callbackListioner;

    public ServiceStateAdapter(Activity activity, List<VehicleStateModel> stateModels, CallbackListioner callbackListioner) {
        this.activity = activity;
        this.stateModels = stateModels;
        this.callbackListioner = callbackListioner;

    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.vehicle_state_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);

    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {

        holder.serviceTypeTitle.setText(Constants.capitalizeFirstLetter(Utiles.Nullpointer(stateModels.get(position).getType())));
        Utiles.Documentimg(stateModels.get(position).getFile(),holder.carImge,activity);
        SharedHelper.putKey(activity,"taxiimage",stateModels.get(position).getFile());
        holder.serviceSwitch.setOnClickListener(view -> {
            callbackListioner.onClickCall(stateModels.get(holder.getAdapterPosition()).getType(), holder.serviceSwitch.isChecked());
            stateModels.get(holder.getAdapterPosition()).setStatus(holder.serviceSwitch.isChecked());
        });
        if (stateModels.get(position).getStatus()) {
            holder.serviceSwitch.setChecked(true);
        } else {
            holder.serviceSwitch.setChecked(false);
        }
    }

    @Override
    public int getItemCount() {
        return stateModels.size();
    }

    class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.car_imge)
        ImageView carImge;
        @BindView(R.id.service_type_title)
        TextView serviceTypeTitle;
        @BindView(R.id.service_switch)
        CheckBox serviceSwitch;
        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);

        }
    }

    public interface CallbackListioner {
        void onClickCall(String type, boolean ischeck);
    }
}
