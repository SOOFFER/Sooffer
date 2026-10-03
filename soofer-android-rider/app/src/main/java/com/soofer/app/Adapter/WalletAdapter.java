package com.soofer.app.Adapter;

import android.annotation.SuppressLint;
import android.app.Activity;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.Model.WalletTransactionCreditModel;

import java.util.List;

import com.soofer.app.R;

import butterknife.BindView;
import butterknife.ButterKnife;

public class WalletAdapter extends RecyclerView.Adapter<WalletAdapter.MyViewHolder> {
    List<WalletTransactionCreditModel.Transaction> walletModels;
    Activity activity;

    public WalletAdapter(List<WalletTransactionCreditModel.Transaction> walletModels, Activity activity) {
        this.walletModels = walletModels;
        this.activity = activity;

    }

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
        WalletTransactionCreditModel.Transaction transaction = walletModels.get(position);
        holder.dateTimeTxt.setText(transaction.getDate());
        holder.amountTxt.setText("$" + transaction.getAmt());
        holder.statusTxt.setText(activity.getResources().getString(R.string.status) + transaction.getType());
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
