package com.soofer.driver.Fragment;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.soofer.driver.Activity.AddCardActivity;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.EventBus.AddedCard;
import com.soofer.driver.Model.RemoveCardModel;
import com.soofer.driver.Presenter.AddCardPresenter;
import com.soofer.driver.R;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import okhttp3.ResponseBody;
import retrofit2.Response;

public class PaymentTypeFragment extends Fragment implements AddCardPresenter.AddCardView {
    private final int ADD_CARD_CODE = 435;

    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.nocard_layout)
    LinearLayout nocardLayout;
    @BindView(R.id.card_txt)
    TextView cardTxt;
    @BindView(R.id.card_available)
    LinearLayout cardAvailable;
    @BindView(R.id.add_card)
    Button addCard;
    Unbinder unbinder;
    String strcardNumber;
    @BindView(R.id.remove_card)
    TextView removeCard;

    public PaymentTypeFragment() {
        // Required empty public constructor
    }

    Activity activity;
    Context context;


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_payment_type, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        CheckCardCard();
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.add_card, R.id.remove_card})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                assert getFragmentManager() != null;
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.add_card:
                Intent mainIntent = new Intent(getActivity(), AddCardActivity.class);
                activity.startActivityForResult(mainIntent, ADD_CARD_CODE);
                break;
            case R.id.remove_card:
                AddCardPresenter addCardPresenter = new AddCardPresenter(this);
                addCardPresenter.removeCard(activity);
                break;
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(AddedCard event) {
        AddCardPresenter addCardPresenter = new AddCardPresenter(this);
        strcardNumber = event.getStrCardNumber();
        addCardPresenter.addCard(activity, event.getStrStripToken(),strcardNumber);
        EventBus.getDefault().removeStickyEvent(AddedCard.class); // don't forget to remove the sticky event if youre done with it
    }

    @Override
    public void OnSuccessfully(Response<ResponseBody> Response) {
        try {
            SharedHelper.putKey(context, "card_number", strcardNumber);
            CheckCardCard();
            String messagedata = Response.body().string();
            JSONObject message = new JSONObject(messagedata);
            if (message.has("message")) {
                Utiles.displayMessage(getView(), activity, message.optString("message"));
            }
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void OnFailure(Response<ResponseBody> Response) {
        try {
            Utiles.showErrorMessage(Response.errorBody().string(), activity, getView());
        } catch (Exception e) {
            e.printStackTrace();
            Utiles.displayMessage(getView(), context, context.getString(R.string.poor_network));
        }
    }

    @Override
    public void OnRemoveSuccessfully(Response<RemoveCardModel> Response) {
        SharedHelper.putKey(context, "card_number", "");
        CheckCardCard();
        Utiles.displayMessage(getView(), context, Response.body().getMessage());
        assert getFragmentManager() != null;
        getFragmentManager().popBackStackImmediate();

    }

    @Override
    public void OnRemoveFailure(Response<RemoveCardModel> Response) {
        try {
            Utiles.showErrorMessage(Response.errorBody().string(), activity, getView());
        } catch (Exception e) {
            e.printStackTrace();
            Utiles.displayMessage(getView(), context, context.getString(R.string.poor_network));
        }
    }

    public void CheckCardCard() {
        if (Utiles.IsNull(SharedHelper.getKey(context, "card_number"))) {
            this.cardAvailable.setVisibility(View.VISIBLE);
            this.removeCard.setVisibility(View.VISIBLE);
            this. nocardLayout.setVisibility(View.GONE);

            this. cardTxt.setText("************" + SharedHelper.getKey(context, "card_number"));
        } else {
            this.removeCard.setVisibility(View.GONE);
            this.cardAvailable.setVisibility(View.GONE);
            this.nocardLayout.setVisibility(View.VISIBLE);
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
}
