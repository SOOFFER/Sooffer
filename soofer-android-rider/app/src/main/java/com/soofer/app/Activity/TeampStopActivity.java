package com.soofer.app.Activity;

import android.os.Bundle;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.widget.ImageView;
import android.widget.TextView;

import com.soofer.app.CommonClass.BaseActivity;
import com.soofer.app.R;

import com.soofer.app.CommonClass.CommonFirebaseListoner;
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_teamp_stop);
        ButterKnife.bind(this);

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
