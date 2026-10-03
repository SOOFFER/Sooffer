package com.soofer.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.CommonClass.Customizeview.CustomizeCheckbox;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.PackageModel;
import com.soofer.driver.R;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class PackageAdapter extends RecyclerView.Adapter<PackageAdapter.MyViewHolder> {

    private List<?> packageModels;
    private CallbackListioner callbackListioner;
    private Activity activity;
    public int mSelectedItem = -1;
    public String strSubscriptionid ="";
    public String getStrSubscriptionDate ="";


    public PackageAdapter(Activity activity, List<?> packageModels, CallbackListioner callbackListioner) {
        this.packageModels = packageModels;
        this.activity = activity;
        this.callbackListioner = callbackListioner;

    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.packageadapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, @SuppressLint("RecyclerView") int position) {
        if(packageModels.get(position) instanceof PackageModel.SubscriptionPackage){
            if(strSubscriptionid!=null && !strSubscriptionid.isEmpty()){
                holder.checkboxPrize.setChecked(strSubscriptionid.equalsIgnoreCase(((PackageModel.SubscriptionPackage) packageModels.get(position)).getId()));

            }else {
                holder.checkboxPrize.setChecked(position == mSelectedItem);
            }

            holder.serviceTxt.setText(Utiles.Nullpointer(((PackageModel.SubscriptionPackage) packageModels.get(position)).getName()));
            holder.discountAmountTxt.setText("$ "+Utiles.Nullpointer(((PackageModel.SubscriptionPackage) packageModels.get(position)).getAmount()));

        }else if (packageModels.get(position) instanceof PackageModel.CommissionPackage){
            holder.checkboxPrize.setChecked(position == mSelectedItem);
            holder.serviceTxt.setText(Utiles.Nullpointer(((PackageModel.CommissionPackage) packageModels.get(position)).getName()));
            holder.discountAmountTxt.setText("$ "+ Utiles.Nullpointer(((PackageModel.CommissionPackage) packageModels.get(position)).getAmount()));
        }

    }

    @Override
    public int getItemCount() {
        return packageModels.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.service_txt)
        TextView serviceTxt;
        @BindView(R.id.discount_amount_txt)
        TextView discountAmountTxt;
        @BindView(R.id.checkbox_prize)
        CustomizeCheckbox checkboxPrize;

        public MyViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
            itemView.setOnClickListener(v -> {
                if (packageModels.get(getAdapterPosition()) instanceof PackageModel.CommissionPackage){
                    checkboxPrize.setChecked(!checkboxPrize.isChecked());
                    if(checkboxPrize.isChecked()){
                        callbackListioner.onClickPostion(packageModels.get(getAdapterPosition()),true);
                        mSelectedItem = getAdapterPosition();
                    }else {
                        mSelectedItem = -1;
                        callbackListioner.onClickPostion(-1,false);

                    }
                    notifyDataSetChanged();
                }else if(packageModels.get(getAdapterPosition()) instanceof PackageModel.SubscriptionPackage){
                    checkboxPrize.setChecked(!checkboxPrize.isChecked());
                    if(checkboxPrize.isChecked()){
                        if(((PackageModel.SubscriptionPackage) packageModels.get(getAdapterPosition())).getType().equalsIgnoreCase("subscription")&&strSubscriptionid!=null && !strSubscriptionid.isEmpty() ){
                            checkboxPrize.setChecked(false);
                            //  Utiles.Subscription(activity,"You already have a Subscription "+Utiles.Nullpointer(getStrSubscriptionDate));
                            return;
                        }else {
                            callbackListioner.onClickPostion(packageModels.get(getAdapterPosition()),true);
                            mSelectedItem = getAdapterPosition();
                        }

                    }else {
                        mSelectedItem = -1;
                        callbackListioner.onClickPostion(-1,false);

                    }
                    notifyDataSetChanged();
                }
            });
        }
    }

    public interface CallbackListioner {
        void onClickPostion(Object position, boolean ischeck);
    }
}