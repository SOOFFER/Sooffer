package com.bismillah.app.Activity;

import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.appcompat.app.AppCompatActivity;
import android.view.View;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.EventBus.FLowRealtimeChanges;
import com.bismillah.app.Fragment.PaymentFragment;

import org.greenrobot.eventbus.EventBus;

import com.bismillah.app.CommonClass.CommonData;
import com.bismillah.app.R;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class PaymentActivity extends AppCompatActivity {

    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.chash_method)
    RelativeLayout chashMethod;
    @BindView(R.id.card_method)
    RelativeLayout cardMethod;
    @BindView(R.id.add_card)
    TextView addCard;
    @BindView(R.id.cash_txt)
    TextView cashTxt;
    @BindView(R.id.card_txt)
    TextView cardTxt;
    Fragment fragment;

    Context context = PaymentActivity.this;

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_payment);
        ButterKnife.bind(this);
        CheckSelection(CommonData.strPaymentType);
   //     LayoutChange();
    }

    public void LayoutChange() {
        if (SharedHelper.getKey(context, "card_number").isEmpty()) {
            cardMethod.setVisibility(View.GONE);
        } else {
            cardMethod.setVisibility(View.VISIBLE);
        }

    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @OnClick({R.id.chash_method, R.id.card_method, R.id.add_card, R.id.back_img})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.chash_method:
                CheckSelection("cash");
                CommonData.strPaymentType = "cash";
                ChangeStatus();
                break;
            case R.id.card_method:
                CheckSelection("card");
                CommonData.strPaymentType = "card";
                ChangeStatus();
                break;
            case R.id.add_card:
                fragment = new PaymentFragment();
                moveToFragment(fragment);
                break;
            case R.id.back_img:
                finish();
                break;
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    public void CheckSelection(String status) {
        if (status.equalsIgnoreCase("cash")) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                cashTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, getDrawable(R.drawable.ic_check_layer), null);
                cardTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, null, null);
            } else {

                cashTxt.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_check_layer, 0);
                cardTxt.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0);

            }


        } else {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                cardTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, getDrawable(R.drawable.ic_check_layer), null);
                cashTxt.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, null, null);
            } else {
                cardTxt.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_check_layer, 0);
                cashTxt.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0);
            }

        }

    }

    private void moveToFragment(Fragment fragment) {
        if (!isFinishing()) {
            runOnUiThread(() -> getSupportFragmentManager().beginTransaction()
                    .replace(R.id.containter, fragment, fragment.getClass().getSimpleName()).addToBackStack(null).commitAllowingStateLoss());

        }

    }

    public void ChangeStatus() {
        EventBus.getDefault().postSticky(new FLowRealtimeChanges("1"));
        finish();

    }

    @Override
    protected void onResume() {
   //     LayoutChange();
        super.onResume();
    }

    @Override
    protected void onPostResume() {
      //  LayoutChange();
        super.onPostResume();
    }
}
