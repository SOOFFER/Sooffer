package com.bismillah.driver.Fragment;


import android.app.Activity;
import android.content.Context;
import android.os.Bundle;

import androidx.annotation.Nullable;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.Length;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;
import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.AddBankModel;
import com.bismillah.driver.Model.BankDetailsModel;
import com.bismillah.driver.Presenter.AddAndUpdateBankPresenter;
import com.bismillah.driver.R;
import com.bismillah.driver.View.AddBankView;
import com.rengwuxian.materialedittext.MaterialEditText;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;


public class PaymentFragment extends BaseFragment implements Validator.ValidationListener, AddBankView {

    @BindView(R.id.back_img)
    ImageView backImg;
    Unbinder unbinder;
    @NotEmpty(message = "Enter the Valid Email Id")
    @BindView(R.id.email_edt)
    MaterialEditText emailEdt;
   // @NotEmpty(message = getString(R.string.acc_name_name))
    @NotEmpty(message = "Enter the Account Name")
    @BindView(R.id.acc_name_edt)
    MaterialEditText accNameEdt;
    @NotEmpty(message = "")
    //@Length(min = 12, message = getString(R.string.enter_the_account))
    @Length(min = 12, message = "Enter the Account Minimum 12 digits Number")
    @BindView(R.id.acc_num_edt)
    MaterialEditText accNumEdt;
  //  @NotEmpty(message = getString(R.string.bank_location))
    @NotEmpty(message = "Enter the Bank Location")
    @BindView(R.id.bnk_lcn_edt)
    MaterialEditText bnkLcnEdt;
    //@NotEmpty(message = getString(R.string.enter_bank))
/*
    @NotEmpty(message = "Enter the Bank Name")
*/
    @BindView(R.id.bank_name_edt)
    MaterialEditText bankNameEdt;
    @NotEmpty(message = "")
   // @Length(min = 9, message = getString(R.string.ifc_code))
    @Length(min = 9, message = "Enter the IFC Code  Minimum 9 digits Number")
    @BindView(R.id.bic_code_edt)
    MaterialEditText bicCodeEdt;
    @BindView(R.id.submit_btn)
    Button submitBtn;
    private Validator validator;
    Context context;
    Activity activity;
    private AddAndUpdateBankPresenter paymentPresenter;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, Bundle savedInstanceState) {
        //Inflate layout in fragment
        View view = inflater.inflate(R.layout.fragment_payment, null, false);
        unbinder = ButterKnife.bind(this, view);
        context = getActivity();
        activity = getActivity();
        // set validation for each text
        validator = new Validator(this);
        validator.setValidationListener(this);
        paymentPresenter = new AddAndUpdateBankPresenter(this);
        //set font style
        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(getActivity().getAssets(), getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) getActivity().findViewById(android.R.id.content));
        paymentPresenter.getBankDetail(activity);
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.submit_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                Utiles.hideKeyboard(activity);
                getFragmentManager().popBackStackImmediate();
                break;

            case R.id.submit_btn:
                validator.validate();
                break;
        }
    }

    @Override
    public void onValidationSucceeded() {
        Utiles.hideKeyboard(activity);
        submitBtn.setEnabled(false);
        PayoutToken();


    }

    @Override
    public void onValidationFailed(List<ValidationError> errors) {
        for (ValidationError error : errors) {
            View view = error.getView();
            String message = error.getCollatedErrorMessage(getActivity());
            if (view instanceof EditText) {
                ((EditText) view).setError(message);
            } else {
                Utiles.CommonToast(getActivity(), message);
            }
        }
    }


    public void PayoutToken() {

        try {

            HashMap<String, String> map = new HashMap<>();
            map.put("email", emailEdt.getText().toString().trim());
            map.put("holdername", accNameEdt.getText().toString().trim());
            map.put("acctNo", accNumEdt.getText().toString().trim());
            map.put("banklocation", bnkLcnEdt.getText().toString().trim());
            map.put("bankname", bankNameEdt.getText().toString().trim());
            map.put("swiftCode", bicCodeEdt.getText().toString().trim());


            paymentPresenter.getAddAndUpdateBank(map, activity);
            submitBtn.setEnabled(true);

        } catch (Exception e) {
            Utiles.displayMessage(getView(), context, e.getMessage());
            submitBtn.setEnabled(true);
        }


    }

    @Override
    public void OnSuccessfully(Response<AddBankModel> Response) {
        if (Response.body().getSuccess()) {
            Utiles.CommonToast(activity, Response.body().getMessage());
            getFragmentManager().popBackStackImmediate();
        } else {
            Utiles.displayMessage(getView(), context, context.getResources().getString(R.string.something_went_wrong));
        }

    }

    @Override
    public void OnFailure(Response<AddBankModel> Response) {
        try {
            String Message = Response.errorBody().string();

            JSONObject jsonObject = new JSONObject(Message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getView(), context, jsonObject.optString("message"));
            }

        } catch (IOException | JSONException e) {
            Utiles.displayMessage(getView(), context, context.getResources().getString(R.string.something_went_wrong));
        }
    }

    @Override
    public void OngetSuccessfully(Response<BankDetailsModel> Response) {

        try {
            assert Response.body() != null;
            emailEdt.setText(Utiles.Nullpointer(Response.body().getBankDetails().getEmail()));
            accNameEdt.setText(Utiles.Nullpointer(Response.body().getBankDetails().getHoldername()));
            accNumEdt.setText(Utiles.Nullpointer(Response.body().getBankDetails().getAcctNo()));
            bnkLcnEdt.setText(Utiles.Nullpointer(Response.body().getBankDetails().getBanklocation()));
            bankNameEdt.setText(Utiles.Nullpointer(Response.body().getBankDetails().getBankname()));
            bicCodeEdt.setText(Utiles.Nullpointer(Response.body().getBankDetails().getSwiftCode()));
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    @Override
    public void OngetFailure(Response<BankDetailsModel> Response) {
        try {
            String Message = Response.errorBody().string();

            JSONObject jsonObject = new JSONObject(Message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(getView(), context, jsonObject.optString("message"));
            }

        } catch (IOException | JSONException e) {
            Utiles.displayMessage(getView(), context, context.getResources().getString(R.string.something_went_wrong));
        }

    }
}