package com.bismillah.driver.Fragment;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.cardview.widget.CardView;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import com.airbnb.lottie.LottieAnimationView;

import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.CommonData;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.PayoutModel;
import com.bismillah.driver.Presenter.SubscriptionPresenter;
import com.bismillah.driver.R;
import com.rengwuxian.materialedittext.MaterialEditText;

import java.util.HashMap;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import retrofit2.adapter.rxjava3.HttpException;


import static com.bismillah.driver.CommonClass.Utiles.hideKeyboard;


public class DriverCreditFragment extends BaseFragment implements SubscriptionPresenter.CommonView {
    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.animation_view)
    LottieAnimationView animationView;
    @BindView(R.id.credits_txt)
    TextView creditsTxt;
    Unbinder unbinder;
    @BindView(R.id.subscription_txt)
    TextView subscriptionTxt;
    @BindView(R.id.request_payment_btn)
    Button requestPaymentBtn;
    @BindView(R.id.add_bank_btn)
    Button addBankBtn;
    @BindView(R.id.view_transaction_btn)
    Button viewTransactionBtn;
    @BindView(R.id.Cancel_reason_txt)
    MaterialEditText CancelReasonTxt;
    @BindView(R.id.submit)
    Button submit;
    @BindView(R.id.other_cancel_reason)
    CardView otherCancelReason;
    @BindView(R.id.cancel_reason_frame)
    FrameLayout cancelReasonFrame;


    private SubscriptionPresenter subscriptionPresenter;

    public DriverCreditFragment() {
        // Required empty public constructor
    }

    Activity activity;
    Context context;
    private FragmentManager fragmentManager;
    private CompositeDisposable disposable;


    @SuppressLint("SetTextI18n")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_blank, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        disposable = new CompositeDisposable();
        subscriptionPresenter = new SubscriptionPresenter(activity, disposable, this);
        try {
            creditsTxt.setText(getString(R.string.your_remaining_credits) + " $ " + CommonData.walletBalance);
            subscriptionTxt.setVisibility(SharedHelper.getKey(context, "subscriptionDate").isEmpty() ? View.GONE : View.VISIBLE);
            subscriptionTxt.setText(getString(R.string.subscription_end_date) + SharedHelper.getKey(context, "subscriptionDate"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        fragmentManager = getFragmentManager();
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.view_transaction_btn, R.id.request_payment_btn, R.id.add_bank_btn,R.id.cancel_reason_frame,R.id.submit})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;
            case R.id.view_transaction_btn:
                Fragment fragment = new WalletTransactionFragment();
                fragmentManager.beginTransaction()
                        .replace(android.R.id.content, fragment, fragment.getClass().getSimpleName())
                        .addToBackStack(null)
                        .commitAllowingStateLoss();
                break;

            case R.id.add_bank_btn:
                if(SharedHelper.getOnlineStatus(activity,"isconnect")){
                    Alertdialog();
                }else {
                    moveToFragment(new StripePayoutFragment("Add Bank"));
                }
                break;

            case R.id.request_payment_btn:
                slideUp(cancelReasonFrame);
                break;
            case R.id.cancel_reason_frame:
                slideDown(cancelReasonFrame);
                break;
            case R.id.submit:
                if(CancelReasonTxt.getText().toString().isEmpty()){
                    CancelReasonTxt.setError("Please Enter Your Amount");
                }else {
                    cancelReasonFrame.setVisibility(View.GONE);
                    viewTransactionBtn.setVisibility(View.VISIBLE);
                    hideKeyboard(activity);
                    HashMap<String, String> map = new HashMap<>();
                    map.put("amount", CancelReasonTxt.getText().toString());
                    map.put("description", "Amount to payout");
                    subscriptionPresenter.getDriverPayoutApi(map);
                    CancelReasonTxt.setText("");
                }
        }

    }
    public void slideUp(View view) {
        Animation slide_up = AnimationUtils.loadAnimation(activity,
                R.anim.slide_up);
        view.startAnimation(slide_up);
        view.setVisibility(View.VISIBLE);
        viewTransactionBtn.setVisibility(View.GONE);
    }

    // slide the view from its current position to below itself
    public void slideDown(View view) {
        viewTransactionBtn.setVisibility(View.VISIBLE);
        Animation slide_down = AnimationUtils.loadAnimation(activity,
                R.anim.slide_down);
        view.startAnimation(slide_down);
        view.setVisibility(View.GONE);
    }
    @SuppressLint("SetTextI18n")
    @Override
    public void onSuccess(Object object, String fromApi) {
        if (object instanceof PayoutModel) {
            CommonData.walletBalance = ((PayoutModel) object).getWalletBal();
            creditsTxt.setText(getString(R.string.your_remaining_credits) + " $ " + CommonData.walletBalance);
            Utiles.CommonToast(activity, ((PayoutModel) object).getMessage());
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

    private void Alertdialog() {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
        builder1.setTitle(getResources().getString(R.string.app_name));
        builder1.setMessage("You already have an account");
        builder1.setCancelable(true);

        builder1.setPositiveButton(
                "View Account",
                (dialog, id) -> {
                    dialog.dismiss();
                    hideKeyboard(activity);
                    moveToFragment(new StripePayoutFragment("Login"));

                });
        builder1.setNegativeButton("Add Account", (dialog, which) ->{dialog.cancel();
            moveToFragment(new StripePayoutFragment("Add Bank"));} );

        walletAlert = builder1.create();
        walletAlert.show();
    }
    AlertDialog walletAlert;
    private void moveToFragment(Fragment fragment) {

        try {
            fragmentManager.beginTransaction()
                    .replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
