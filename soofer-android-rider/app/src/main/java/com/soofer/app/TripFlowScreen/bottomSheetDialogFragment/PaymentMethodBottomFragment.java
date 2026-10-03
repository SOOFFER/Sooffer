package com.soofer.app.TripFlowScreen.bottomSheetDialogFragment;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.RequiresApi;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.EventBus.FLowRealtimeChanges;
import com.soofer.app.R;

import org.greenrobot.eventbus.EventBus;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class PaymentMethodBottomFragment extends BottomSheetDialogFragment {

    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.cash_img)
    ImageButton cashImg;
    @BindView(R.id.cash_txt)
    TextView cashTxt;
    @BindView(R.id.chash_method)
    RelativeLayout chashMethod;
    @BindView(R.id.card_img)
    ImageButton cardImg;
    @BindView(R.id.card_txt)
    TextView cardTxt;
    @BindView(R.id.card_method)
    RelativeLayout cardMethod;
    @BindView(R.id.add_Card_img)
    ImageButton addCardImg;
    @BindView(R.id.add_card)
    TextView addCard;
    @BindView(R.id.add_card_method)
    RelativeLayout addCardMethod;
    private Activity activity;
    private Unbinder unbinder;

    public PaymentMethodBottomFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        activity = getActivity();
        View view = inflater.inflate(R.layout.fragment_payment_method_bottom, container, false);
        unbinder = ButterKnife.bind(this,view);
        CheckSelection(CommonData.strPaymentType);

        if (SharedHelper.getKey(activity, "card_number").isEmpty()) {
            cardMethod.setVisibility(View.GONE);
        } else {
            cardMethod.setVisibility(View.VISIBLE);
        }
        return view;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @OnClick({R.id.chash_method, R.id.card_method, R.id.add_card})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.chash_method:
                CheckSelection("cash");
                CommonData.strPaymentType = "cash";
                dismiss();
                //ChangeStatus();
                break;
            case R.id.card_method:
                CheckSelection("card");
                CommonData.strPaymentType = "card";
                dismiss();
                // ChangeStatus();
                break;
            case R.id.add_card:
               // fragment = new PaymentFragmentNew();
               // moveToFragment(fragment);
                CheckSelection("Others");
                CommonData.strPaymentType = "Others";
                dismiss();
                break;

        }
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    public void CheckSelection(String status) {
        if (status.equalsIgnoreCase("cash")) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                cashTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, activity.getDrawable(R.drawable.ic_check_layer), null);
                cardTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, null, null);
                addCard.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, null, null);
            } else {

                cashTxt.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_check_layer, 0);
                cardTxt.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0);
                addCard.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0);

            }


        } else if(status.equalsIgnoreCase("others")){
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                addCard.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, activity.getDrawable(R.drawable.ic_check_layer), null);
                cardTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, null, null);
                cashTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, null, null);
            } else {

                addCard.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_check_layer, 0);
                cardTxt.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0);
                cashTxt.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0);

            }
        } else {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                cardTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, activity.getDrawable(R.drawable.ic_check_layer), null);
                cashTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, null, null);
                addCard.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, null, null);
            } else {
                cardTxt.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_check_layer, 0);
                cashTxt.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0);
                addCard.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0);
            }

        }
        EventBus.getDefault().postSticky(new FLowRealtimeChanges(CommonData.strPaymentType));
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        try {
            unbinder.unbind();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
