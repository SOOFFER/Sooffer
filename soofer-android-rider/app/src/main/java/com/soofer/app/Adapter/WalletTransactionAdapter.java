package com.soofer.app.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.Model.AllwalletTransactionmodel;

import java.util.List;

import com.soofer.app.R;

import butterknife.BindView;
import butterknife.ButterKnife;

public class WalletTransactionAdapter extends RecyclerView.Adapter<WalletTransactionAdapter.MyViewHolder> {
    private List<AllwalletTransactionmodel.Transaction> walletModels;
    private Activity activity;

    public WalletTransactionAdapter(List<AllwalletTransactionmodel.Transaction> walletModels, Activity activity) {
        this.walletModels = walletModels;
        this.activity = activity;

    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.wallettransactionadapter, parent, false);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), activity.getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return new MyViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        AllwalletTransactionmodel.Transaction transaction = walletModels.get(position);
        holder.dateTimeTxt.setText(transaction.getDate());
        holder.amountTxt.setText("$ " + transaction.getAmt());
        holder.statusTxt.setText(transaction.getType());
        if(transaction.getType().toLowerCase().equalsIgnoreCase("credit")) {
            holder.statusTxt.setTextColor(activity.getResources().getColor(R.color.darkgreen));
        } else {
            holder.statusTxt.setTextColor(activity.getResources().getColor(R.color.redcolor));
        }
    }

    @Override
    public int getItemCount() {
        return walletModels.size();


    }


    static class MyViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.date_time_txt)
        TextView dateTimeTxt;
        @BindView(R.id.amount_txt)
        TextView amountTxt;
        @BindView(R.id.status_txt)
        TextView statusTxt;

        MyViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }
}
