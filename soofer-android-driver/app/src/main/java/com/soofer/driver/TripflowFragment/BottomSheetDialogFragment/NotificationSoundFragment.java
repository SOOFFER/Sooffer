package com.soofer.driver.TripflowFragment.BottomSheetDialogFragment;


import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.fragment.app.Fragment;

import com.airbnb.lottie.LottieAnimationView;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.soofer.driver.R;

import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Optional;
import butterknife.Unbinder;

/**
 * A simple {@link Fragment} subclass.
 */
public class NotificationSoundFragment extends BottomSheetDialogFragment {


    @BindView(R.id.animation_view)
    LottieAnimationView animationView;
    @BindView(R.id.need_access_btn)
    Button needAccessBtn;
    private Unbinder unbinder;

    public NotificationSoundFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_notification_sound, container, false);
        unbinder = ButterKnife.bind(this,view);
        return view;
    }
    @Optional
    @OnClick(R.id.need_access_btn)
    public void onViewClicked() {
        NotificationManager notificationManager =
                (NotificationManager) Objects.requireNonNull(getActivity()).getSystemService(Context.NOTIFICATION_SERVICE);
        assert notificationManager != null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                && !notificationManager.isNotificationPolicyAccessGranted()) {
            try {
                Intent intent = new Intent(
                        android.provider.Settings
                                .ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
                startActivity(intent);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        dismiss();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            unbinder.unbind();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
