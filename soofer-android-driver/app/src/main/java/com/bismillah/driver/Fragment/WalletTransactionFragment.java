package com.bismillah.driver.Fragment;


import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.airbnb.lottie.LottieAnimationView;
import com.bismillah.driver.Adapter.TransactionAdapter;
import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.WalletTransactionModel;
import com.bismillah.driver.Presenter.TransactionHistoryPresenter;
import com.bismillah.driver.R;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;


import static com.bismillah.driver.CommonClass.Utiles.getErrorBody;

/**
 * A simple {@link Fragment} subclass.
 */
public class WalletTransactionFragment extends BaseFragment implements TransactionHistoryPresenter.CommonInterface {


    @BindView(R.id.toolbar)
    Toolbar toolbar;
    @BindView(R.id.recycle_view_transaction)
    RecyclerView recycleViewTransaction;
    @BindView(R.id.animation_view)
    LottieAnimationView animationView;
    @BindView(R.id.Loader_view)
    LottieAnimationView LoaderView;
    private Unbinder unbinder;
    private TransactionAdapter transactionAdapter;
    private CompositeDisposable disposable;
    private Context context;
    private Activity activity;
    private FragmentManager fragmentManager;
    private boolean loading = true;
    private boolean isFirstTime = false;
    private int pastVisiblesItems, visibleItemCount, totalItemCount = 0;
    private int Page = 1;
    private List<WalletTransactionModel> walletTransactionModels;
    private TransactionHistoryPresenter transactionHistoryPresenter;

    public WalletTransactionFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_wallet_transaction, container, false);
        unbinder = ButterKnife.bind(this, view);
        disposable = new CompositeDisposable();
        context = getContext();
        activity = getActivity();
        fragmentManager = getFragmentManager();
        walletTransactionModels = new ArrayList<>();
        transactionHistoryPresenter = new TransactionHistoryPresenter(activity, disposable, this);
        assert activity != null;
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        toolbar.setNavigationOnClickListener(v -> {
            fragmentManager.popBackStackImmediate();
        });
        getPasination();
        return view;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            if (unbinder != null) {
                unbinder.unbind();
            }
            if (disposable != null && disposable.isDisposed()) {
                disposable.clear();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onSuccess(Object object) {
        isFirstTime = true;
        if(object instanceof List<?>){
            walletTransactionModels.addAll((Collection<? extends WalletTransactionModel>) object);
            setAdapter();
        }

    }

    @Override
    public void onFailure(Throwable object) {
        getErrorBody(object, activity);

    }

    @Override
    public void showLoader() {

        if(Page!=1){
            LoaderView.setVisibility(View.VISIBLE);
        }else {
            Utiles.ShowLoader(activity);
        }
    }

    @Override
    public void dismissLoader() {
        if(Page!=1){
            LoaderView.setVisibility(View.GONE);
        }else {
            Utiles.DismissLoader();
        }
    }
    private void setAdapter(){
        if(walletTransactionModels.isEmpty()){
            animationView.setVisibility(View.VISIBLE);
            recycleViewTransaction.setVisibility(View.GONE);
            return;
        }
        if(transactionAdapter == null){

            transactionAdapter = new TransactionAdapter(activity,walletTransactionModels);
            recycleViewTransaction.setAdapter(transactionAdapter);
            animationView.setVisibility(View.GONE);
            recycleViewTransaction.setVisibility(View.VISIBLE);
            setPagination();
        }else {
            transactionAdapter.notifyDataSetChanged();
        }
    }
    private void setPagination() {
        recycleViewTransaction.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                if (dy > 0)
                {
                    LinearLayoutManager layoutManager = (LinearLayoutManager) recycleViewTransaction.getLayoutManager();
                    assert layoutManager != null;
                    visibleItemCount = layoutManager.getChildCount();
                    totalItemCount = layoutManager.getItemCount();
                    pastVisiblesItems = layoutManager.findFirstVisibleItemPosition();
                    if (loading) {
                        if ((visibleItemCount + pastVisiblesItems) >= totalItemCount) {
                            loading = false;
                            Page += 1;
                            getPasination();
                        }
                    }
                }
            }
        });


    }

    private void getPasination() {
        HashMap<String,String> map = new HashMap<>();
        map.put("_page", String.valueOf(Page));
        map.put("_limit", "10");
        transactionHistoryPresenter.getWalletTransactonHistory(map);
    }

}
