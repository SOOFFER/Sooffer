package com.soofer.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.R;
import com.soofer.driver.FlowInterface.CommonInterface;
import com.soofer.driver.Model.FaqcategoryModel;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class FaqCategoryAdapter extends RecyclerView.Adapter<FaqCategoryAdapter.MyViewHolder> {


    private Activity activity;
    private CommonInterface commonInterFace;
    private List<FaqcategoryModel> data;

    Categorydetails categorydetails;


    public FaqCategoryAdapter(Activity activity, List<FaqcategoryModel> data ,Categorydetails categorydetails) {
        this.activity = activity;
        this.data =data;
        this.categorydetails = categorydetails;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.faqcategoryadapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {

        holder.layoutOnclick.setTag(position);
        holder.layoutOnclick.setOnClickListener(v -> {
            int position1 = (int) v.getTag();
            System.out.println("tags.."+position1+"second..."+data.get(position1).getiDisplayOrder());
            categorydetails.category(data.get(position1).getId());
        });

        holder.name_txt.setText(data.get(position).getvTitleEN());
    }

    @Override
    public int getItemCount() {
        return data.size();
    }

    class MyViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.name_txt)
        TextView name_txt;
        @BindView(R.id.layoutOnclick)
        RelativeLayout layoutOnclick;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }

    public interface Categorydetails {
        void category(String data);
    }
}
