package com.soofer.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.Model.NotificationModel;
import com.soofer.driver.R;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class NotificationAdapter extends RecyclerView.Adapter<NotificationAdapter.ViewHolder> {



    private Activity context;
    private List<NotificationModel> fareModels;


    public NotificationAdapter(Activity context, List<NotificationModel> fareModels) {
        this.context = context;
        this.fareModels = fareModels;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.notification_adapter, parent, false);
        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(context.getAssets(), context.getString(R.string.app_font));
        fontChangeCrawler.replaceFonts(context.findViewById(android.R.id.content));
        return new ViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {

        holder.messageTxt.setText(fareModels.get(position).getMessage());
        holder.dateTxt.setText(fareModels.get(position).getCreatedAt());
    }

    @Override
    public int getItemCount() {
        return fareModels.size();
    }

    static

    public class ViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.message_txt)
        TextView messageTxt;
        @BindView(R.id.date_txt)
        TextView dateTxt;

        public ViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }

    private String returnDate(String value){
        String formatted ="";
        @SuppressLint("SimpleDateFormat") SimpleDateFormat input = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        @SuppressLint("SimpleDateFormat") SimpleDateFormat output = new SimpleDateFormat("dd/MM/yyyy");

        Date d = null;
        try
        {
            d = input.parse(value);
            formatted = output.format(d);
        }
        catch (ParseException e)
        {
            e.printStackTrace();
        }
        return formatted;
    }



}