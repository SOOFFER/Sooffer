package com.soofer.driver.Adapter;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.FlowInterface.CommonInterface;
import com.soofer.driver.Model.CityModel;
import com.soofer.driver.Model.CountryModel;
import com.soofer.driver.Model.StateModel;
import com.soofer.driver.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class SelectListAdapter extends RecyclerView.Adapter<SelectListAdapter.MyViewHolder> {



    private Activity activity;
    private List<?> stateModels;
    private CommonInterface callbackListioner;

    public SelectListAdapter(Activity activity, List<?> stateModels, CommonInterface callbackListioner) {
        this.activity = activity;
        this.stateModels = stateModels;
        this.callbackListioner = callbackListioner;

    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.list_select_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);

    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {

        if(stateModels.get(position) instanceof CountryModel){
            holder.titleTxt.setText(((CountryModel) stateModels.get(position)).getName());
        }else if(stateModels.get(position) instanceof StateModel){
            holder.titleTxt.setText(((StateModel) stateModels.get(position)).getName());
        }else if(stateModels.get(position) instanceof CityModel){
            holder.titleTxt.setText(((CityModel) stateModels.get(position)).getName());
        }
        holder.itemView.setOnClickListener(it->{
            callbackListioner.onCallback(stateModels.get(holder.getAdapterPosition()));
        });


    }

    @Override
    public int getItemCount() {
        return stateModels.size();
    }

    class MyViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.title_txt)
        TextView titleTxt;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);

        }
    }


}
