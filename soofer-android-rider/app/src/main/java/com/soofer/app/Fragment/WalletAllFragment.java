package com.soofer.app.Fragment;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.soofer.app.Adapter.WalletTransactionAdapter;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.AllwalletTransactionmodel;
import com.soofer.app.Presenter.WalletTransactionPresenter;
import com.soofer.app.R;
import com.soofer.app.View.WalletTransactionView;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import retrofit2.Response;


public class WalletAllFragment extends BaseFragment implements WalletTransactionView {

    List<AllwalletTransactionmodel.Transaction> walletModels = new ArrayList<>();
    WalletTransactionAdapter walletTransactionAdapter;
    @BindView(R.id.wallet_transactin_recycleview)
    RecyclerView walletTransactinRecycleview;
    @BindView(R.id.nodata_txt)
    TextView nodataTxt;
    Unbinder unbinder;
    Context context;
    Activity activity;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

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

        WalletTransactionPresenter walletTransactionPresenter = new WalletTransactionPresenter(activity, this);
        walletTransactionPresenter.getWalletBalance();

        return view;
    }

    public void setAdapter() {
        if (walletModels != null && !walletModels.isEmpty()) {

            walletTransactinRecycleview.setLayoutManager(new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false));
            walletTransactinRecycleview.setItemAnimator(new DefaultItemAnimator());
            walletTransactinRecycleview.setHasFixedSize(true);
            walletTransactionAdapter = new WalletTransactionAdapter(walletModels, activity);
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
    public void onTransactionSuccessfully(Response<AllwalletTransactionmodel> Response) {
        assert Response.body() != null;
        if (Response.body().getSuccess()) {
            if (Response.body().getTransaction() != null) {
                walletModels.clear();
                walletModels.addAll(Response.body().getTransaction());
            }

        }
        setAdapter();
    }

    @Override
    public void onTransactionFailure(Response<AllwalletTransactionmodel> Response) {
        Utiles.displayMessage(getView(), context, "Something Went Wrong");
    }
}
