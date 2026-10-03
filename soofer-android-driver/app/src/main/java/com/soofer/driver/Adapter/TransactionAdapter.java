package com.soofer.driver.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.EventBus.EstimationChanges;
import com.soofer.driver.Model.WalletTransactionModel;
import com.soofer.driver.R;

import org.greenrobot.eventbus.EventBus;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class TransactionAdapter extends RecyclerView.Adapter<TransactionAdapter.ViewHolder> {


    private Activity context;
    private List<WalletTransactionModel> fareModels;


    public TransactionAdapter(Activity context, List<WalletTransactionModel> fareModels) {
        this.context = context;
        this.fareModels = fareModels;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.wallet_transaction_adapter, parent, false);
        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(context.getAssets(), context.getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) context.findViewById(android.R.id.content));
        return new ViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        if(fareModels.get(position).getType().equalsIgnoreCase("credit")){
            try {
                if(fareModels.get(position).getDescription().startsWith("trips")){
                    holder.transactionIdTxt.setText(fareModels.get(position).getDescription() +" : "+fareModels.get(position).getTrxId());
                }else {
                    holder.transactionIdTxt.setText(fareModels.get(position).getDescription());
                }
                holder.transactionIdTxt.setTextColor(context.getResources().getColor(R.color.darkgreen));
                holder.statusTxt.setTextColor(context.getResources().getColor(R.color.darkgreen));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }else {
            try {
                holder.transactionIdTxt.setText(fareModels.get(position).getDescription() +" : "+fareModels.get(position).getTrxId());
                holder.transactionIdTxt.setTextColor(context.getResources().getColor(R.color.redcolor));
                holder.statusTxt.setTextColor(context.getResources().getColor(R.color.redcolor));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        holder.itemView.setOnClickListener(v -> {
            System.out.println("ESTIMATION CHANGES:::::"+fareModels.get(position).getPayment().toString());
            EventBus.getDefault().postSticky(new EstimationChanges(fareModels.get(position).getPayment().getAmttopay(),fareModels.get(position).getPayment().getCommision(),fareModels.get(position).getPayment().getAmttodriver(),fareModels.get(position).getPayment().getTax(),fareModels.get(position).getPayment().getBooking(),fareModels.get(position).getPayment().getTollFee(),fareModels.get(position).getPayment().getGatewayCharge()));
        });

        holder.statusTxt.setText(Constants.capitalizeFirstLetter(fareModels.get(position).getType()));
        holder.dateTxt.setText(fareModels.get(position).getPaymentDate());
        holder.amountTxt.setText("$ "+fareModels.get(position).getAmt());

    }

    @Override
    public int getItemCount() {
        return fareModels.size();
    }

    static

    public class ViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.transaction_id_txt)
        TextView transactionIdTxt;
        @BindView(R.id.date_txt)
        TextView dateTxt;
        @BindView(R.id.amount_txt)
        TextView amountTxt;
        @BindView(R.id.status_txt)
        TextView statusTxt;

        public ViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }

    private String lastfour(String value){
        if (value.length() > 4) {
            value = value.substring(value.length() - 4);
        }

        return value;
    }

}
