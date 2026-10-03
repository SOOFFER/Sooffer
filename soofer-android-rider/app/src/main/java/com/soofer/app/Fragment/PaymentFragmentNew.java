package com.soofer.app.Fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.soofer.app.Activity.AddCardActivityNew;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.EventBus.AddedCard;
import com.soofer.app.Model.RemoveCardModel;
import com.soofer.app.Presenter.RemoveCardPresenter;
import com.soofer.app.R;
import com.soofer.app.View.RemoveCardView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;


public class PaymentFragmentNew extends BaseFragment implements RemoveCardView {

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
    @BindView(R.id.remove_card)
    TextView removeCard;
    Unbinder unbinder;
    String strcardNumber;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Activity activity;
    Context context;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_payment, container, false);
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

    @OnClick({R.id.back_img, R.id.add_card,R.id.remove_card})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.add_card:
                Intent mainIntent = new Intent(getActivity(), AddCardActivityNew.class);
                startActivityForResult(mainIntent, ADD_CARD_CODE);
                break;
            case R.id.remove_card:
                RemoveCardPresenter addCardPresenter = new RemoveCardPresenter(this);
                addCardPresenter.removeCard(activity);
                break;
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(AddedCard event) {
        strcardNumber = event.getStrCardNumber();
        SharedHelper.putKey(context, "card_number", strcardNumber);
        CheckCardCard();
        EventBus.getDefault().removeStickyEvent(AddedCard.class); // don't forget to remove the sticky event if youre done with it
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

    @SuppressLint("SetTextI18n")
    public void CheckCardCard() {
        if (Utiles.isNull(SharedHelper.getKey(context, "card_number"))) {
            removeCard.setVisibility(View.VISIBLE);
            cardAvailable.setVisibility(View.VISIBLE);
            nocardLayout.setVisibility(View.GONE);
            cardTxt.setText("************" + SharedHelper.getKey(context, "card_number"));
        } else {
            removeCard.setVisibility(View.GONE);
            cardAvailable.setVisibility(View.GONE);
            nocardLayout.setVisibility(View.VISIBLE);
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
