package com.soofer.app.Adapter;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;
import android.widget.TextView;

import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Interface.CommonInterFace;
import com.soofer.app.Model.PackageListModel;
import com.soofer.app.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class PackageAdapter extends RecyclerView.Adapter<PackageAdapter.MyViewHolder> {


    private Activity activity;
    private CommonInterFace commonInterFace;
    private List<PackageListModel.PackageDetail> packageDetail;
    private String selectItem = "";

    public PackageAdapter(Activity activity, List<PackageListModel.PackageDetail> packageDetail, CommonInterFace commonInterFace) {
        this.activity = activity;
        this.commonInterFace = commonInterFace;
        this.packageDetail = packageDetail;

    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.package_adapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);

    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        holder.radioPackage.setChecked(selectItem.equalsIgnoreCase(packageDetail.get(position).getId()));
        System.out.println("enter the pack id" + packageDetail.get(position).getId());
        holder.packageTypeTxt.setText(packageDetail.get(position).getName());
    }

    @Override
    public int getItemCount() {
        return packageDetail.size();
    }

    class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.radio_package)
        RadioButton radioPackage;
        @BindView(R.id.package_type_txt)
        TextView packageTypeTxt;

        MyViewHolder(View itemview) {
            super(itemview);
            ButterKnife.bind(this, itemview);
            itemview.setOnClickListener(view1 -> {
                try {
                    selectItem = packageDetail.get(getAdapterPosition()).getId();
                    commonInterFace.callBack(packageDetail.get(getAdapterPosition()));
                    notifyDataSetChanged();
                } catch (Exception e) {
                    e.printStackTrace();
                }

            });
        }
    }
}
