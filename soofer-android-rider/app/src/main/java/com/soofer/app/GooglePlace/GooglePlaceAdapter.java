package com.soofer.app.GooglePlace;

import android.app.Activity;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.GooglePlace.GooglePlcaeModel.Prediction;


import java.util.List;

import com.soofer.app.R;

import butterknife.BindView;
import butterknife.ButterKnife;

public class GooglePlaceAdapter extends RecyclerView.Adapter<GooglePlaceAdapter.MyViewHolder> {
    List<Prediction> predictions;
    Activity activity;
    Callback callback;


    public GooglePlaceAdapter(Activity activity, List<Prediction> predictions, Callback callback) {
        this.callback = callback;
        this.activity = activity;
        this.predictions = predictions;

    }

    public interface Callback {
        void SelectedAddress(Prediction Address);
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.googleplaceadapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        final Prediction prediction = predictions.get(position);
        holder.placeName.setText(prediction.getStructuredFormatting().getMainText());
        holder.placeDetail.setText(prediction.getStructuredFormatting().getSecondaryText());
        holder.addressLayout.setTag(position);
        holder.addressLayout.setOnClickListener(v -> {
            int position1 = (int) v.getTag();
            callback.SelectedAddress(predictions.get(position1));

        });

    }

    @Override
    public int getItemCount() {
        return predictions.size();
    }

    static class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.place_name)
        TextView placeName;
        @BindView(R.id.place_detail)
        TextView placeDetail;

        @BindView(R.id.address_layout)
        LinearLayout addressLayout;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }
}
