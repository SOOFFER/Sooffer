package com.bismillah.app.Fragment;

import android.app.Activity;
import android.os.Bundle;
import androidx.cardview.widget.CardView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.bismillah.app.CommonClass.BaseFragment;
import com.bismillah.app.CommonClass.CommonData;
import com.bismillah.app.CommonClass.FontChangeCrawler;

import com.bismillah.app.R;

import com.bismillah.app.CommonClass.Utiles;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class CommonFaqFragment extends BaseFragment {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.header_txt)
    TextView headerTxt;
    @BindView(R.id.down_up_img)
    ImageButton downUpImg;
    @BindView(R.id.discreption_txt)
    TextView discreptionTxt;
    @BindView(R.id.how_to_card)
    CardView howToCard;
    Unbinder unbinder;

    Boolean CLickCheck = true;
    @BindView(R.id.fragment_ments)
    FrameLayout fragmentMents;

    public CommonFaqFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Activity activity;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_common_faq, container, false);
        unbinder = ButterKnife.bind(this, view);
        titleTxt.setText(CommonData.strTitle);
        headerTxt.setText(CommonData.strHeaderTitle);
        discreptionTxt.setText(CommonData.strdiscription);
        activity = getActivity();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.down_up_img})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.down_up_img:
                if (CLickCheck) {
                    CLickCheck = false;
                    downUpImg.setImageResource(R.drawable.ic_upword);
                    discreptionTxt.setVisibility(View.VISIBLE);
                } else {
                    CLickCheck = true;
                    downUpImg.setImageResource(R.drawable.ic_down_arrow);
                    discreptionTxt.setVisibility(View.GONE);
                }
                break;
        }
    }

    @OnClick(R.id.fragment_ments)
    public void onViewClicked() {
    }
}
