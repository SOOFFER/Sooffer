package com.soofer.app.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.text.Html;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Interface.CommonInterFace;
import com.soofer.app.Model.FaqModel;
import com.soofer.app.Model.FaqcategoryModel;
import com.soofer.app.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class FaqAdapter extends RecyclerView.Adapter<FaqAdapter.MyViewHolder>{


    private Activity activity;
    private CommonInterFace commonInterFace;
    private List<FaqModel> data;



    public FaqAdapter(Activity activity, List<FaqModel> data) {
        this.activity = activity;
        this.data =data;


    }

    @NonNull
    @Override
    public FaqAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.faq_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new FaqAdapter.MyViewHolder(view);

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull FaqAdapter.MyViewHolder holder, int position) {

        holder.name_txt.setText(data.get(position).getIfaqcategorytitle());
        CharSequence formattedText = Html.fromHtml(data.get(position).getEnglish());
        holder.discreption_txt.setText(formattedText);

        holder.down_up_img.setOnClickListener(view -> {
        holder.discreption_txt.setVisibility(View.VISIBLE);
        });
    }

    @Override
    public int getItemCount() {
        return data.size();
    }

    class MyViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.header_txt)
        TextView name_txt;
        @BindView(R.id.discreption_txt)
        TextView discreption_txt;

        @BindView(R.id.down_up_img)
        ImageView down_up_img;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }


}
