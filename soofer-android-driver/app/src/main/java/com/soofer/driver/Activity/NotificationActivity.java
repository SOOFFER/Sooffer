package com.soofer.driver.Activity;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.airbnb.lottie.LottieAnimationView;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import com.soofer.driver.Adapter.NotificationAdapter;
import com.soofer.driver.CommonClass.BaseActivity;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.NotificationModel;
import com.soofer.driver.Presenter.NotificationPresenter;
import com.soofer.driver.R;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;

public class NotificationActivity extends BaseActivity implements NotificationPresenter.CommonInterface {


    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.notifiation_recycleview)
    RecyclerView notifiationRecycleview;
    @BindView(R.id.Loader_view)
    LottieAnimationView LoaderView;
    @BindView(R.id.nodata_txt)
    TextView nodataTxt;

    private int count = 1;
    private CompositeDisposable disposable;
    private NotificationPresenter notificationPresenter;
    private Unbinder unbinder;
    private Activity activity;
    private List<NotificationModel> notificationModels;
    private NotificationAdapter notificationAdapter;

    private boolean loading = true;
    private FragmentManager fragmentManager;

    private int pastVisiblesItems, visibleItemCount, totalItemCount = 0;


    @RequiresApi(api = Build.VERSION_CODES.Q)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fragment_notification);
        unbinder = ButterKnife.bind(this);
        fragmentManager = getSupportFragmentManager();
        disposable = new CompositeDisposable();
        activity = this;
        notificationModels = new ArrayList<>();
        notificationPresenter = new NotificationPresenter(activity, disposable, this);
        getPagination();
    }

    @SuppressLint("GestureBackNavigation")
    @Override
    public void onBackPressed() {
        finish();
        super.onBackPressed();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            if (disposable != null && disposable.isDisposed()) {
                disposable.clear();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnClick(R.id.back_img)
    public void onViewClicked() {
        finish();
    }

    @Override
    public void onSuccess(Object object) {
        if (object instanceof List<?>) {

            if (!((List) object).isEmpty()) {
                loading = true;
            }
            notificationModels.addAll((Collection<? extends NotificationModel>) object);

            if (notificationAdapter == null) {
                notificationAdapter = new NotificationAdapter(activity, notificationModels);
                notifiationRecycleview.setAdapter(notificationAdapter);
                if (notificationModels.isEmpty()) {
                    nodataTxt.setVisibility(View.VISIBLE);
                    notifiationRecycleview.setVisibility(View.GONE);
                } else {
                    nodataTxt.setVisibility(View.GONE);
                    notifiationRecycleview.setVisibility(View.VISIBLE);
                    setPagination();
                }
            } else {
                notificationAdapter.notifyDataSetChanged();
            }
        }

    }

    @Override
    public void onFailure(Throwable object) {
        Utiles.getErrorBody(object, activity);
    }

    @Override
    public void showLoader() {
        if (count == 1) {
            Utiles.ShowLoader(activity);
        } else {
            LoaderView.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void dismissLoader() {
        if (count == 1) {
            Utiles.DismissLoader();
        } else {
            LoaderView.setVisibility(View.GONE);
        }
    }

    private void getPagination() {
        HashMap<String, String> map = new HashMap<>();
        map.put("_page", String.valueOf(count));
        map.put("_limit", "10");
        notificationPresenter.getNotificationHistory(map);
    }

    private void setPagination() {
        notifiationRecycleview.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                if (dy > 0) {
                    LinearLayoutManager layoutManager = (LinearLayoutManager) notifiationRecycleview.getLayoutManager();
                    assert layoutManager != null;
                    visibleItemCount = layoutManager.getChildCount();
                    totalItemCount = layoutManager.getItemCount();
                    pastVisiblesItems = layoutManager.findFirstVisibleItemPosition();
                    if (loading) {
                        if ((visibleItemCount + pastVisiblesItems) >= totalItemCount) {
                            loading = false;
                            count += 1;
                            getPagination();
                        }
                    }
                }
            }
        });


    }
}

