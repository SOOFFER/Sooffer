package com.soofer.app.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;


import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.paymentModule.RazorPayPaymentModule;
import com.soofer.app.EventBus.MakePaymentEvent;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.AddWalletModel;
import com.soofer.app.Model.WalletBalanceModel;
import com.soofer.app.Presenter.WalletBalancePresenter;

import com.soofer.app.R;
import com.soofer.app.View.WalletView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;


public class WalletFragment extends BaseFragment implements Validator.ValidationListener, WalletView {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.wallet_balance_txt)
    TextView walletBalanceTxt;
    @BindView(R.id.view_transaction_btn)
    Button viewTransactionBtn;
    @NotEmpty(message = "Required")
    @BindView(R.id.referral_edt)
    MaterialEditText referralEdt;
    @BindView(R.id.famount_btn)
    Button famountBtn;
    @BindView(R.id.samount_btn)
    Button samountBtn;
    @BindView(R.id.lamount_btn)
    Button lamountBtn;
    @BindView(R.id.view_terms_txt)
    TextView viewTermsTxt;
    @BindView(R.id.add_money_btn)
    Button addMoneyBtn;
    Unbinder unbinder;

    private RazorPayPaymentModule razorPayModule;
    private String walletbl;


    public WalletFragment() {
        // Required empty public constructor
    }

    Activity activity;
    Context context;
    private Validator validator;
    private AlertDialog walletAlert;
    private WalletBalancePresenter walletBalancePresenter;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_wallet, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        razorPayModule=new RazorPayPaymentModule(activity);
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        validator = new Validator(this);
        validator.setValidationListener(this);
        walletBalancePresenter = new WalletBalancePresenter(activity, this);
        walletBalancePresenter.getWalletBalance(true);
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
        try {
            if (walletAlert != null && walletAlert.isShowing()) {
                walletAlert.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnClick({R.id.back_img, R.id.view_transaction_btn, R.id.famount_btn, R.id.samount_btn, R.id.lamount_btn, R.id.view_terms_txt, R.id.add_money_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                Utiles.hideKeyboard(activity);
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.view_transaction_btn:
                Utiles.hideKeyboard(activity);
                Fragment fragment = new ViewWalletTrascation();
                FragmentCalling(fragment);
                break;
            case R.id.famount_btn:
                setAmount(famountBtn);
                break;
            case R.id.samount_btn:
                setAmount(samountBtn);
                break;
            case R.id.lamount_btn:
                setAmount(lamountBtn);
                break;
            case R.id.view_terms_txt:
                FragmentCalling(new SupportFragment());
                break;
            case R.id.add_money_btn:
                Utiles.hideKeyboard(activity);
                validator.validate();
                break;
        }
    }

    public void setAmount(Button button) {
        referralEdt.setText(button.getText().toString());
    }

    @Override
    public void onValidationSucceeded() {
        Utiles.hideKeyboard(activity);
        if (SharedHelper.getKey(context, "card_number") != null && !SharedHelper.getKey(context, "card_number").isEmpty()) {
            walletBalancePresenter.getAddwallet(referralEdt.getText().toString());
        } else {
            Alertdialog();
        }
    }

    @Override
    public void onValidationFailed(List<ValidationError> errors) {
        for (ValidationError error : errors) {
            View view = error.getView();
            String message = error.getCollatedErrorMessage(activity);
            if (view instanceof EditText) {
                ((EditText) view).setError(message);
            } else {
                Toast.makeText(activity, message, Toast.LENGTH_LONG).show();
            }
        }
    }

    public void FragmentCalling(Fragment fragment) {
        FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.containter, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commitAllowingStateLoss();
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onwalletSuccessfully(Response<WalletBalanceModel> Response) {
        try {
            assert Response.body() != null;
            if (Response.body().getSuccess()) {
                Float walletamount = Float.parseFloat(Response.body().getBalance());
                walletBalanceTxt.setText("$ " + walletamount);
                SharedHelper.putKey(context, "wallet_amout", String.valueOf(Response.body().getBalance()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public void onwalletFailure(Response<WalletBalanceModel> Response) {
        Utiles.showErrorMessage(new Gson().toJson(Response.errorBody()), context, getView());
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onaddwalletSuccessfully(Response<AddWalletModel> Response) {
        assert Response.body() != null;
        if (Response.body().getSuccess()) {
            walletBalanceTxt.setText("$ " + Response.body().getBalance());
            //  MainActivity.wallet_balance_txt.setText("$ " + Response.body().getBalance());
            SharedHelper.putKey(context, "wallet_amout", String.valueOf(Response.body().getBalance()));
            Utiles.displayMessage(getView(), context, Response.body().getMessage());
            referralEdt.setText("");
        }
    }

    @Override
    public void onaddwalletFailure(Response<AddWalletModel> response) {
        try {
            Utiles.showErrorMessage(response.errorBody().string(), context, getView());
        } catch (IOException e) {
            throw new RuntimeException(e);
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

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(MakePaymentEvent event) {
        walletBalancePresenter.getAddwallet(event.strPaymentId);
        EventBus.getDefault().removeStickyEvent(event); // don't forget to remove the sticky event if youre done with it
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
                    Fragment fragment = new PaymentFragmentNew();
                    FragmentCalling(fragment);
                });

        walletAlert = builder1.create();
        walletAlert.show();
    }
    private void moveToFragment(Fragment fragment) {
        requireActivity().getSupportFragmentManager().beginTransaction()
                .replace(android.R.id.content, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss();;

    }
}
