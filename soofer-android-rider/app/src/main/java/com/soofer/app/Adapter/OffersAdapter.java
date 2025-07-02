package com.soofer.app.Adapter;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.OfferModel;
import com.soofer.app.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class OffersAdapter extends RecyclerView.Adapter<OffersAdapter.MyViewHolder> {
    List<OfferModel> contactModels;

    Activity activity;

    public OffersAdapter(Activity activity, List<OfferModel> contactModels) {
        this.activity = activity;
        this.contactModels = contactModels;

    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.offer_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);

    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, final int position) {
        Utiles.Documentimg(contactModels.get(position).getFile(),holder.imgCar,activity);
        holder.titleTxt.setText(Utiles.NullPointer(contactModels.get(position).getTitle()));
        holder.descriptionTxt.setText(Utiles.NullPointer(contactModels.get(position).getDesc()));
        holder.codeTxt.setText(Utiles.NullPointer(contactModels.get(position).getCode()));
    }

    @Override
    public int getItemCount() {
        return contactModels.size();
    }

    static class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.img_car)
        ImageView imgCar;
        @BindView(R.id.title_txt)
        TextView titleTxt;
        @BindView(R.id.description_txt)
        TextView descriptionTxt;
        @BindView(R.id.code_txt)
        TextView codeTxt;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }

}
