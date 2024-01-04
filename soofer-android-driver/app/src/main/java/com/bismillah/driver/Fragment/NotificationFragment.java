package com.bismillah.driver.Fragment;

import android.app.Activity;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.airbnb.lottie.LottieAnimationView;
import com.bismillah.driver.Adapter.NotificationAdapter;
import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.NotificationModel;
import com.bismillah.driver.Presenter.NotificationPresenter;
import com.bismillah.driver.R;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;


import static com.bismillah.driver.CommonClass.Utiles.getErrorBody;


/**
 * A simple {@link Fragment} subclass.
 */
public class NotificationFragment extends BaseFragment implements NotificationPresenter.CommonInterface {


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

    public NotificationFragment() {
        // Required empty public constructor
    }

    private int count = 1;
    private CompositeDisposable disposable;
    private NotificationPresenter notificationPresenter;
    private Unbinder unbinder;
    private Activity activity;
    private List<NotificationModel> notificationModels;
    private NotificationAdapter notificationAdapter;

    private boolean loading = true;

    private int pastVisiblesItems, visibleItemCount, totalItemCount = 0;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_notification, container, false);
        unbinder = ButterKnife.bind(this, view);
        disposable = new CompositeDisposable();
        activity = getActivity();
        notificationModels = new ArrayList<>();
        notificationPresenter = new NotificationPresenter(activity, disposable, this);

        getPagination();
        return view;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            unbinder.unbind();
            if (disposable != null && disposable.isDisposed()) {
                disposable.clear();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnClick(R.id.back_img)
    public void onViewClicked() {
        getFragmentManager().popBackStackImmediate();
    }

    @Override
    public void onSuccess(Object object) {
        if (object instanceof List<?>) {

            if(!((List) object).isEmpty()){
                loading = true;
            }
            notificationModels.addAll((Collection<? extends NotificationModel>) object);

            if (notificationAdapter == null) {
                notificationAdapter = new NotificationAdapter(activity,notificationModels);
                notifiationRecycleview.setAdapter(notificationAdapter);
                if (notificationModels.isEmpty()) {
                    nodataTxt.setVisibility(View.VISIBLE);
                    notifiationRecycleview.setVisibility(View.GONE);
                } else {
                    nodataTxt.setVisibility(View.GONE);
                    notifiationRecycleview.setVisibility(View.VISIBLE);
                    setPagination();
                }
            }else {
                notificationAdapter.notifyDataSetChanged();
            }
        }

    }

    @Override
    public void onFailure(Throwable object) {
        getErrorBody(object, activity);
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
        //map.put("userType", "Driver");
        notificationPresenter.getWalletTransactonHistory(map);
    }

    private void setPagination() {
        notifiationRecycleview.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                if (dy > 0)
                {
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

