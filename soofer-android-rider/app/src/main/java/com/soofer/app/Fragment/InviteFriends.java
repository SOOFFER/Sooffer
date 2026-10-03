package com.soofer.app.Fragment;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;


import com.soofer.app.R;

import com.soofer.app.CommonClass.Utiles;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;


public class InviteFriends extends BaseFragment {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.referral_code_txt)
    TextView referralCodeTxt;
    @BindView(R.id.share_referal_btn)
    Button shareReferalBtn;
    Unbinder unbinder;
    Activity activity;
    Context context;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_invite_friends, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getActivity();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        referralCodeTxt.setText(SharedHelper.getKey(context, "referal_code"));
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.share_referal_btn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.share_referal_btn:
                if (Utiles.NullpointerValidation(referralCodeTxt)) {
                    SocialShare();
                } else {
                    Utiles.CommonToast(activity, "Something Went Wrong");
                }

                break;
        }
    }

    public void SocialShare() {
        final String appPackageName = activity.getPackageName(); // getPackageName() from Context or Activity object
        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType("text/plain");
        intent.putExtra(Intent.EXTRA_TEXT, activity.getResources().getString(R.string.app_name) + " Referal code " + SharedHelper.getKey(context, "referal_code") + "  " + "https://play.google.com/store/apps/details?id=" + appPackageName);
        intent.putExtra(android.content.Intent.EXTRA_SUBJECT, activity.getResources().getString(R.string.app_name));
        startActivity(Intent.createChooser(intent, "Share"));

    }
}
