package com.soofer.app.Fragment;


import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.RequiresApi;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.soofer.app.Adapter.WalletAdapter;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.WalletTransactionCreditModel;
import com.soofer.app.Presenter.WalletDebitPresenter;

import com.soofer.app.R;
import com.soofer.app.View.WalletCreditView;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import retrofit2.Response;

public class WalletMoneyout extends BaseFragment implements WalletCreditView {
    List<WalletTransactionCreditModel.Transaction> walletModels = new ArrayList<>();
    WalletAdapter walletTransactionAdapter;
    @BindView(R.id.wallet_transactin_recycleview)
    RecyclerView walletTransactinRecycleview;
    @BindView(R.id.nodata_txt)
    TextView nodataTxt;
    Unbinder unbinder;
    Context context;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Activity activity;

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_wallet_all, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        WalletDebitPresenter walletTransactionPresenter = new WalletDebitPresenter(activity, this);
        walletTransactionPresenter.getWalletBalance();

        return view;
    }

    public void setAdapter() {
        if (walletModels != null && !walletModels.isEmpty()) {

            walletTransactinRecycleview.setLayoutManager(new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false));
            walletTransactinRecycleview.setItemAnimator(new DefaultItemAnimator());
            walletTransactinRecycleview.setHasFixedSize(true);
            walletTransactionAdapter = new WalletAdapter(walletModels, activity);
            walletTransactinRecycleview.setAdapter(walletTransactionAdapter);
            nodataTxt.setVisibility(View.GONE);
            walletTransactinRecycleview.setVisibility(View.VISIBLE);
        } else {
            walletTransactinRecycleview.setVisibility(View.GONE);
            nodataTxt.setVisibility(View.VISIBLE);
        }
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @Override
    public void onTransactionSuccessfully(Response<WalletTransactionCreditModel> Response) {
        if (Response.body().getSuccess()) {
            if (Response.body().getTransaction() != null) {
                    walletModels.clear();
                    walletModels.addAll(Response.body().getTransaction());
            }

        }
        setAdapter();
    }

    @Override
    public void onTransactionFailure(Response<WalletTransactionCreditModel> Response) {
        Utiles.displayMessage(getView(), context, "Something Went Wrong");
    }
}
