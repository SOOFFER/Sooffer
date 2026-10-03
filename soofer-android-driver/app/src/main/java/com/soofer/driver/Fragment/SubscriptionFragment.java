package com.soofer.driver.Fragment;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.Adapter.PackageAdapter;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.SpacesItemDecoration;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.EventBus.MakePaymentEvent;
import com.soofer.driver.Model.ConfirmaPaymentModel;
import com.soofer.driver.Model.CreateOrderModel;
import com.soofer.driver.Model.PackageModel;
import com.soofer.driver.Presenter.SubscriptionPresenter;
import com.soofer.driver.R;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import retrofit2.HttpException;


public class SubscriptionFragment extends BaseFragment implements SubscriptionPresenter.CommonView, PackageAdapter.CallbackListioner{

    @BindView(R.id.nopackage_txt)
    TextView nopackageTxt;
    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.date_time_txt)
    TextView dateTimeTxt;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.trip_recycleview)
    RecyclerView tripRecycleview;
    @BindView(R.id.Commission_recycleview)
    RecyclerView CommissionRecycleview;
    @BindView(R.id.requestpackage_btn)
    Button requestpackageBtn;
    private Unbinder unbinder;
    private Activity activity;
    private Context context;
    private FragmentManager fragmentManager;

    private PackageAdapter packageAdapter, SubscriptionAdapter;
    private CompositeDisposable disposable;
    private List<PackageModel.SubscriptionPackage> subscriptionPackages = new ArrayList<>();
    private List<PackageModel.CommissionPackage> commissionPackages = new ArrayList<>();
    private SubscriptionPresenter subscriptionPresenter;
    private PackageModel packageModels;


    private Object objCommisionOrSubscription;
    private String amount = "0";

    public SubscriptionFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view =inflater.inflate(R.layout.fragment_subscription, container, false);
        unbinder = ButterKnife.bind(this,view);
        activity = getActivity();
        context = getContext();
        fragmentManager = getFragmentManager();
        disposable = new CompositeDisposable();
        subscriptionPresenter = new SubscriptionPresenter(activity, disposable, this);
        subscriptionPresenter.getPackageList();

        return view;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unbinder.unbind();
        try {
            disposable.clear();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onSuccess(Object object, String fromApi) {
        if (object instanceof PackageModel) {
            packageModels = (PackageModel) object;
            setAdapter(packageModels);
        }else if(object instanceof ConfirmaPaymentModel){
            try {
                if (objCommisionOrSubscription instanceof PackageModel.SubscriptionPackage) {
                    SharedHelper.putKey(activity, "subscriptionid", ((PackageModel.SubscriptionPackage) objCommisionOrSubscription).getId());
                } else {
                    packageAdapter.mSelectedItem = -1;
                    packageAdapter.notifyDataSetChanged();
                }
                Utiles.displayMessage(getView(), context, ((ConfirmaPaymentModel) object).getMessage());
           /* if (checkSumModel.getReferalInviteApproval()) {
                SharedHelper.putOnline(activity, "referral_invite", true);
                EventBus.getDefault().postSticky(new DocumentUpload("update", "", "",""));
            }*/
            } catch (Exception e) {
                e.printStackTrace();
            }
        }else if(object instanceof CreateOrderModel){
            //razorPayPaymentModule.makePayment(((CreateOrderModel) object).getData().getId(),"Subscription / Comission Payment");
        }
    }



    @Override
    public void onFailure(Throwable throwable) {
        try {
            if (throwable instanceof HttpException) {
                HttpException error = (HttpException) throwable;
                String errorBody = Objects.requireNonNull(error.response().errorBody()).string();
                Utiles.showErrorMessage(errorBody, context, getView());
            } else {
                Utiles.displayMessage(getView(), getContext(), getContext().getString(R.string.poor_network));
            }
        } catch (Exception e) {
            e.printStackTrace();
            Utiles.displayMessage(getView(), getContext(), getContext().getString(R.string.poor_network));
        }
    }

    @Override
    public void showLoader() {
        Utiles.ShowLoader(activity);

    }


    @Override
    public void dismissLoader() {
        Utiles.DismissLoader();
    }
    public void setAdapter(PackageModel packageModels) {
        try {
            if (requestpackageBtn.getVisibility() == View.VISIBLE)
                requestpackageBtn.setVisibility(View.GONE);

            if (!subscriptionPackages.isEmpty()) {
                subscriptionPackages.clear();
            }
            if (!commissionPackages.isEmpty()) {
                commissionPackages.clear();
            }
            commissionPackages.addAll(packageModels.getCommissionPackage());
            subscriptionPackages.addAll(packageModels.getSubscriptionPackage());
            if (packageAdapter == null) {
                packageAdapter = new PackageAdapter(activity, subscriptionPackages, this);
                packageAdapter.strSubscriptionid = packageModels.getSubscriptionId();
                packageAdapter.getStrSubscriptionDate = packageModels.getSubcriptionEndDate();
                int space = activity.getResources().getDimensionPixelSize(R.dimen._5sdp);
                tripRecycleview.addItemDecoration(new SpacesItemDecoration(space));
                tripRecycleview.setAdapter(packageAdapter);
                tripRecycleview.setVisibility(View.VISIBLE);
                nopackageTxt.setVisibility(View.GONE);
            } else {
                packageAdapter.mSelectedItem = -1;
                packageAdapter.strSubscriptionid = packageModels.getSubscriptionId();
                packageAdapter.getStrSubscriptionDate = packageModels.getSubcriptionEndDate();
                packageAdapter.notifyDataSetChanged();
            }
            if (SubscriptionAdapter == null) {
                SubscriptionAdapter = new PackageAdapter(activity, commissionPackages, this);
                int space = activity.getResources().getDimensionPixelSize(R.dimen._5sdp);
                CommissionRecycleview.addItemDecoration(new SpacesItemDecoration(space));
                CommissionRecycleview.setAdapter(SubscriptionAdapter);
                CommissionRecycleview.setVisibility(View.VISIBLE);
                nopackageTxt.setVisibility(View.GONE);
            } else {
                SubscriptionAdapter.mSelectedItem = -1;
                SubscriptionAdapter.notifyDataSetChanged();
            }
            //staticAdapter(packageModels.getVehicles());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onClickPostion(Object position, boolean ischeck) {
        objCommisionOrSubscription = position;
        if (objCommisionOrSubscription instanceof PackageModel.CommissionPackage) {
            amount = ((PackageModel.CommissionPackage) objCommisionOrSubscription).getAmount();
            if (packageAdapter != null) {
                if (packageAdapter.mSelectedItem != -1) {
                    packageAdapter.mSelectedItem = -1;
                    packageAdapter.notifyDataSetChanged();
                }
            }
        }
        if (objCommisionOrSubscription instanceof PackageModel.SubscriptionPackage) {
            amount = ((PackageModel.SubscriptionPackage) objCommisionOrSubscription).getAmount();
            try {
                if (SubscriptionAdapter != null) {
                    if (SubscriptionAdapter.mSelectedItem != -1) {
                        SubscriptionAdapter.mSelectedItem = -1;
                        SubscriptionAdapter.notifyDataSetChanged();
                    }
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (ischeck) {
            if (requestpackageBtn.getVisibility() == View.GONE)
                requestpackageBtn.setVisibility(View.VISIBLE);
        } else {
            if (requestpackageBtn.getVisibility() == View.VISIBLE)
                requestpackageBtn.setVisibility(View.GONE);
        }
    }

    @OnClick({R.id.back_img, R.id.requestpackage_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;
            case R.id.requestpackage_btn:

                if (SharedHelper.getKey(context, "card_number") != null && !SharedHelper.getKey(context, "card_number").isEmpty()) {
                    HashMap<String, String> map = new HashMap<>();
                    map.put("rechargeAmount", amount);

                    if (objCommisionOrSubscription instanceof PackageModel.CommissionPackage) {
                        map.put("packageId", ((PackageModel.CommissionPackage) objCommisionOrSubscription).getId());
                        map.put("type", ((PackageModel.CommissionPackage) objCommisionOrSubscription).getType());
                    } else if (objCommisionOrSubscription instanceof PackageModel.SubscriptionPackage) {
                        map.put("packageId", ((PackageModel.SubscriptionPackage) objCommisionOrSubscription).getId());
                        map.put("type", ((PackageModel.SubscriptionPackage) objCommisionOrSubscription).getType());
                    }
                    subscriptionPresenter.getConfirmPayment(map);

                }else {
                    Alertdialog();
                }

                break;
        }
    }
    @Override
    public void onStart() {
        super.onStart();
        EventBus.getDefault().register(this);
    }

    @Override
    public void onStop() {
        EventBus.getDefault().unregister(this);
        super.onStop();
    }
    public void Alertdialog() {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
        builder1.setTitle(getResources().getString(R.string.app_name));
        builder1.setMessage(R.string.please_added_card);
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                R.string.ok,
                (dialog, id) -> {
                    dialog.dismiss();
                    Utiles.hideKeyboard(activity);
                    Fragment fragment = new PaymentTypeFragment();
                    FragmentCalling(fragment);

                });

        walletAlert = builder1.create();
        walletAlert.show();
    }
    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(MakePaymentEvent event) {
        HashMap<String, String> map = new HashMap<>();
        map.put("tranxId", event.strPaymentId);
        if (objCommisionOrSubscription instanceof PackageModel.CommissionPackage) {
            map.put("packageId", ((PackageModel.CommissionPackage) objCommisionOrSubscription).getId());
            map.put("type", ((PackageModel.CommissionPackage) objCommisionOrSubscription).getType());
        } else if (objCommisionOrSubscription instanceof PackageModel.SubscriptionPackage) {
            map.put("packageId", ((PackageModel.SubscriptionPackage) objCommisionOrSubscription).getId());
            map.put("type", ((PackageModel.SubscriptionPackage) objCommisionOrSubscription).getType());
        }
        subscriptionPresenter.getConfirmPayment(map);
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
    }

    public void FragmentCalling(Fragment fragment) {
        FragmentManager fragmentManager = getFragmentManager();
        assert fragmentManager != null;
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.contentContainer, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
    }
    private AlertDialog walletAlert;
}
