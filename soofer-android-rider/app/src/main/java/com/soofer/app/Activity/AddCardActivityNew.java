package com.soofer.app.Activity;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatButton;

import com.soofer.app.BuildConfig;
import com.soofer.app.CommonClass.BaseActivity;
import com.soofer.app.CommonClass.CustomDialog;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.EventBus.AddedCard;
import com.soofer.app.Presenter.AddCardPresenter;
import com.soofer.app.R;
import com.soofer.app.View.AddCardView;
import com.stripe.android.ApiResultCallback;
import com.stripe.android.PaymentConfiguration;
import com.stripe.android.SetupIntentResult;
import com.stripe.android.Stripe;
import com.stripe.android.model.ConfirmSetupIntentParams;
import com.stripe.android.model.PaymentMethodCreateParams;
import com.stripe.android.model.SetupIntent;
import com.stripe.android.view.CardNumberEditText;
import com.stripe.android.view.CvcEditText;
import com.stripe.android.view.ExpiryDateEditText;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import okhttp3.ResponseBody;
import retrofit2.Response;

public class AddCardActivityNew extends BaseActivity implements AddCardView {

    Activity activity = AddCardActivityNew.this;
    Context context = AddCardActivityNew.this;
    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.confirmButton)
    AppCompatButton confirmButton;
    CustomDialog customDialog;
    String cardNumber ="";
    private Stripe stripe;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTheme(R.style.Mytheme);
        PaymentConfiguration.init(getApplicationContext(), BuildConfig.Stripe);
        setContentView(R.layout.activity_add_new);
        customDialog = new CustomDialog(AddCardActivityNew.this);

        FontChangeCrawler fontChanger = new FontChangeCrawler(getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) this.findViewById(android.R.id.content));
        ButterKnife.bind(this);

        stripe = new Stripe(this, BuildConfig.Stripe);

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        stripe.onSetupResult(requestCode, data, new ApiResultCallback<SetupIntentResult>() {
            @Override
            public void onSuccess(@NonNull SetupIntentResult setupIntentResult) {
                SetupIntent si = setupIntentResult.getIntent();
                if (SetupIntent.Status.Succeeded.equals(si.getStatus())) {
                    assert si.getPaymentMethod() != null;
                    String paymentMethodId = si.getPaymentMethod().id;
                    String setUpIntentId = si.getId();
                    System.out.println("PAYMENT METHOD ID::::"+paymentMethodId);
                    System.out.println("PAYMENT SETUPINTENT  ID::::"+setUpIntentId);
                    System.out.println("PAYMENT CONFIRM DATA:::"+si);
                    assert si.getPaymentMethod().card != null;
                    updateCardDetails(paymentMethodId,setUpIntentId,si.getPaymentMethod().card.last4);
                } else {
                    Toast.makeText(getApplicationContext(), si.getLastErrorMessage(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onError(@NonNull Exception e) {
                Toast.makeText(getApplicationContext(), e.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateCardDetails(String paymentMethodId,String setupIntentId, String last4){
        AddCardPresenter addCardPresenter = new AddCardPresenter(this);
        addCardPresenter.updateCard(activity, paymentMethodId,setupIntentId,last4);
    }

    private void fetchPaymentConfiguration(String clientSecret) {
        System.out.println("STRIPE KEY:::"+BuildConfig.Stripe);
        System.out.println("paymentIntentClientSecret:::"+ clientSecret);

        CardNumberEditText cardNumberEditText = findViewById(R.id.card_number_edit_text);
        ExpiryDateEditText expiryDateEditText = findViewById(R.id.expiry_date_edit_text);
        CvcEditText cvcEditText = findViewById(R.id.cvc_edit_text);

        cardNumber = Objects.requireNonNull(cardNumberEditText.getText()).toString();

        List<String> expiryDateTokens = Arrays.asList(Objects.requireNonNull(expiryDateEditText.getText()).toString().split("/"));

        int expMonth = Integer.parseInt(expiryDateTokens.get(0));
        int expYear = Integer.parseInt(expiryDateTokens.get(1));
        String cvc = cvcEditText.getText() != null ? cvcEditText.getText().toString() : null;

        PaymentMethodCreateParams.Card cardParams =
                new PaymentMethodCreateParams.Card.Builder()
                        .setNumber(cardNumber)
                        .setExpiryMonth(expMonth)
                        .setExpiryYear(expYear)
                        .setCvc(cvc)
                        .build();
        PaymentMethodCreateParams paymentMethodCreateParams =
                PaymentMethodCreateParams.create(cardParams);
        ConfirmSetupIntentParams confirmParams = ConfirmSetupIntentParams.create(paymentMethodCreateParams, clientSecret);
        stripe.confirmSetupIntent(this, confirmParams);
    }

    @OnClick({R.id.back_img, R.id.confirmButton})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                Utiles.hideKeyboard(AddCardActivityNew.this);
                finish();
                break;
            case R.id.confirmButton:
                CardNumberEditText cardNumberEditText = findViewById(R.id.card_number_edit_text);
                ExpiryDateEditText expiryDateEditText = findViewById(R.id.expiry_date_edit_text);
                CvcEditText cvcEditText = findViewById(R.id.cvc_edit_text);
                if (cardNumberEditText.isCardNumberValid()
                        && expiryDateEditText.isDateValid()
                        && cvcEditText.getText() != null
                        && !cvcEditText.getText().toString().trim().isEmpty()) {
                    getCardApiCall();
                } else {
                    Toast.makeText(this, getString(R.string.enter_card_details), Toast.LENGTH_SHORT).show();
                }
                break;
        }
    }

    private void getCardApiCall() {
        AddCardPresenter addCardPresenter = new AddCardPresenter(this);
        addCardPresenter.addCard(activity, "","");
    }

    @Override
    public void OnSuccessfully(Response<ResponseBody> Response) {
        try {
            String messageData = Response.body().string();
            JSONObject message = new JSONObject(messageData);
            if (message.has("clientSecret")) {
                fetchPaymentConfiguration(message.optString("clientSecret"));
            }
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
    }

    public void OnSuccessfullyUpdateCard(Response<ResponseBody> Response) {
        EventBus.getDefault().postSticky(new AddedCard( cardNumber.trim().substring(cardNumber.length() - 4), ""));
        finish();
    }

    @Override
    public void OnFailure(Response<ResponseBody> Response) {
        Utiles.displayMessage(getCurrentFocus(), activity, "Something went wrong");
    }


    @SuppressLint("GestureBackNavigation")
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
