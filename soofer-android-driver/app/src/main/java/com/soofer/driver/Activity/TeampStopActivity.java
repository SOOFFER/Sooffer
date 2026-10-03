package com.soofer.driver.Activity;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;


import com.soofer.driver.CommonClass.BaseActivity;
import com.soofer.driver.R;
import com.soofer.driver.Service.TripRquestService;

import com.soofer.driver.CommonClass.CommonFirebaseListoner;
import com.soofer.driver.CommonClass.Utiles;
import butterknife.BindView;
import butterknife.ButterKnife;

public class TeampStopActivity extends BaseActivity {

    @Nullable
    @BindView(R.id.app_logo_img)
    ImageView appLogoImg;
    @BindView(R.id.english)
    @Nullable
    TextView english;
    @Nullable
    @BindView(R.id.tamil)
    TextView tamil;
    Context context = TeampStopActivity.this;
    Activity activity = TeampStopActivity.this;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_teamp_stop);
        ButterKnife.bind(this);
        if (Utiles.isMyServiceRunning(activity, TripRquestService.class)) {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                stopService(new Intent(context, TripRquestService.class));
            } else {
                stopService(new Intent(context, TripRquestService.class));
            }
        }


        try {
            assert tamil != null;
            tamil.setText(CommonFirebaseListoner.strTamilAlert);
            assert english != null;
            english.setText(CommonFirebaseListoner.strEnglishAlert);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
