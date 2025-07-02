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

import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Interface.CommonInterFace;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.CabListModel;
import com.soofer.app.R;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class CabListAdapter extends RecyclerView.Adapter<CabListAdapter.MyViewHolder> {


    private Activity activity;
    private CommonInterFace commonInterFace;
    private List<CabListModel.Datum> data;
    private String strSelectID = "";

    public CabListAdapter(Activity activity, List<CabListModel.Datum> data, CommonInterFace commonInterFace) {
        this.activity = activity;
        this.data =data;
        this.commonInterFace = commonInterFace;

    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.carlist_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        Utiles.Documentimg(data.get(position).getFile(),holder.carImge,activity);
        Glide.with(activity).load(data.get(position).getFile())
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .skipMemoryCache(false)
                .override(100, 100)
                .into(holder.carImge);
      //  holder.carImge.setColorFilter(activity.getResources().getColor(R.color.colorPrimary));
        holder.carTypeTxt.setText(Utiles.NullPointer(data.get(position).getType()));
        holder.packageTypeTxt.setText("$ "+Utiles.NullPointer(data.get(position).getFare()));
        holder.carRadio.setChecked(strSelectID.equalsIgnoreCase(data.get(position).getId()));
    }

    @Override
    public int getItemCount() {
        return data.size();
    }

    class MyViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.car_radio)
        RadioButton carRadio;
        @BindView(R.id.car_imge)
        ImageView carImge;
        @BindView(R.id.car_type_txt)
        TextView carTypeTxt;
        @BindView(R.id.package_type_txt)
        TextView packageTypeTxt;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
             view.setOnClickListener(views->{
                 strSelectID = data.get(getAdapterPosition()).getId();
                 commonInterFace.callBack(data.get(getAdapterPosition()));
                 notifyDataSetChanged();
             });
        }
    }
}
