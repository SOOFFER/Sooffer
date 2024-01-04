package com.bismillah.app.Activity;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import com.google.android.material.snackbar.Snackbar;
import androidx.core.content.ContextCompat;
import androidx.appcompat.app.AppCompatActivity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.Toast;

import com.braintreepayments.cardform.view.CardForm;
import com.bismillah.app.BuildConfig;
import com.bismillah.app.CommonClass.CustomDialog;
import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.EventBus.AddedCard;

import com.stripe.android.Stripe;
import com.stripe.android.TokenCallback;
import com.stripe.android.exception.AuthenticationException;
import com.stripe.android.model.Card;
import com.stripe.android.model.Token;

import org.greenrobot.eventbus.EventBus;

import com.bismillah.app.R;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class AddCardActivity extends AppCompatActivity {

    Activity activity = AddCardActivity.this;
    Context context = AddCardActivity.this;
    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.card_form)
    CardForm cardForm;
    @BindView(R.id.submit)
    Button submit;
    String Card_Token = "";
    CustomDialog customDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTheme(R.style.Mytheme);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.colorPrimary));
            getWindow().setNavigationBarColor(ContextCompat.getColor(this, R.color.colorPrimary));
        }
        setContentView(R.layout.activity_add);
        customDialog = new CustomDialog(AddCardActivity.this);

        FontChangeCrawler fontChanger = new FontChangeCrawler(getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) this.findViewById(android.R.id.content));
        ButterKnife.bind(this);
        cardForm.cardRequired(true)
                .expirationRequired(true)
                .cvvRequired(true)
                .postalCodeRequired(false)
                .mobileNumberRequired(false)
                .actionLabel(getResources().getString(R.string.add_card))
                .setup(this);
        cardForm.getCardEditText().setPadding(20,50,20,1);
    }


    @OnClick({R.id.back_img, R.id.submit})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                Utiles.hideKeyboard(AddCardActivity.this);
                finish();
                break;
            case R.id.submit:
                getCardValidation();
                break;
        }
    }

    public void getCardValidation() {
        customDialog.setCancelable(false);
        Utiles.hideKeyboard(AddCardActivity.this);
        if (customDialog != null) {
            customDialog.show();
        }
        if (cardForm.getCardNumber() == null || cardForm.getExpirationMonth() == null || cardForm.getExpirationYear() == null || cardForm.getCvv() == null) {
            if ((customDialog != null) && (customDialog.isShowing()))
                customDialog.dismiss();
            displayMessage(context.getResources().getString(R.string.enter_card_details));
        } else {
            if (cardForm.getCardNumber().equals("") || cardForm.getExpirationMonth().equals("") || cardForm.getExpirationYear().equals("") || cardForm.getCvv().equals("")) {
                if ((customDialog != null) && customDialog.isShowing())
                    customDialog.dismiss();
                displayMessage(context.getResources().getString(R.string.enter_card_details));
            } else {
                String cardNumber = cardForm.getCardNumber();
                int month = Integer.parseInt(cardForm.getExpirationMonth());
                int year = Integer.parseInt(cardForm.getExpirationYear());
                String cvv = cardForm.getCvv();
                //  utils.print("MyTest", "CardDetails Number: " + cardNumber + "Month: " + month + " Year: " + year);
                if ((customDialog != null) && (customDialog.isShowing()))
                    customDialog.dismiss();
                Card card = new Card(cardNumber, month, year, cvv);
                try {

                    Stripe stripe = new Stripe(BuildConfig.Stripe);
                    stripe.createToken(
                            card,
                            new TokenCallback() {
                                public void onSuccess(Token token) {
                                    if ((customDialog != null) && customDialog.isShowing())
                                        customDialog.dismiss();
                                    Card_Token = token.getId();
                                    System.out.println("enter the token" + Card_Token);
                                    EventBus.getDefault().postSticky(new AddedCard(token.getCard().getLast4(), Card_Token));
                                    finish();


                                }

                                public void onError(Exception error) {
                                    displayMessage(context.getResources().getString(R.string.enter_card_details));
                                    if ((customDialog != null) && customDialog.isShowing())
                                        customDialog.dismiss();
                                }
                            }
                    );
                } catch (AuthenticationException e) {
                    e.printStackTrace();
                    if ((customDialog != null) && (customDialog.isShowing()))
                        customDialog.dismiss();
                }
            }

        }
    }


    public void displayMessage(String toastString) {
        try {
            Snackbar.make(getCurrentFocus(), toastString, Snackbar.LENGTH_SHORT)
                    .setAction("Action", null).show();
        } catch (Exception e) {
            try {
                Toast.makeText(context, "" + toastString, Toast.LENGTH_SHORT).show();
            } catch (Exception ee) {
                ee.printStackTrace();
            }
        }

    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Utiles.clearInstance();
    }
}
