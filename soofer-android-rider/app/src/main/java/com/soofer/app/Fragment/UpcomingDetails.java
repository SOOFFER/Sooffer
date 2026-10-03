package com.soofer.app.Fragment;

import android.app.Dialog;
import android.os.Bundle;
import androidx.fragment.app.DialogFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;


import com.soofer.app.R;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;

/**
 * Created by com on 19-May-18.
 */

public class UpcomingDetails extends DialogFragment {

    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.map_img)
    ImageView mapImg;
    @BindView(R.id.profile_image)
    ImageView profileImage;
    @BindView(R.id.user_name)
    TextView userName;
    @BindView(R.id.pickup_txt)
    TextView pickupTxt;
    @BindView(R.id.drop_address_txt)
    TextView dropAddressTxt;
    @BindView(R.id.date_time_txt)
    TextView dateTimeTxt;
    @BindView(R.id.total_amount_txt)
    TextView totalAmountTxt;
    @BindView(R.id.service_type_txt)
    TextView serviceTypeTxt;
    @BindView(R.id.trip_status_txt)
    TextView tripStatusTxt;
    @BindView(R.id.payment_type_img)
    ImageView paymentTypeImg;
    @BindView(R.id.payment_type_txt)
    TextView paymentTypeTxt;
    @BindView(R.id.call_layout)
    LinearLayout callLayout;
    @BindView(R.id.Message_layout)
    LinearLayout MessageLayout;
    @BindView(R.id.trip_cancel_layout)
    LinearLayout tripCancelLayout;
    @BindView(R.id.common_layout)
    LinearLayout commonLayout;
    Unbinder unbinder;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setStyle(DialogFragment.STYLE_NORMAL, R.style.dialog_theme);
    }

    @Override
    public void onStart() {
        super.onStart();
        Dialog d = getDialog();
        if (d != null) {
            int width = ViewGroup.LayoutParams.MATCH_PARENT;
            int height = ViewGroup.LayoutParams.MATCH_PARENT;
            d.getWindow().setLayout(width, height);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.upcomingtrpdetails, container, false);
        unbinder = ButterKnife.bind(this, view);
        return view;
    }

    static UpcomingDetails newInstance() {
        UpcomingDetails f = new UpcomingDetails();
        return f;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.call_layout, R.id.Message_layout, R.id.trip_cancel_layout})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                 dismiss();
                break;
            case R.id.call_layout:
                break;
            case R.id.Message_layout:
                break;
            case R.id.trip_cancel_layout:
                break;
        }
    }
}
