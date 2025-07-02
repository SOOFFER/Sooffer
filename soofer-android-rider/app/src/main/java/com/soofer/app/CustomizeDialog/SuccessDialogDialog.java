package com.soofer.app.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.view.Window;
import android.widget.Button;

import com.soofer.app.EventBus.AddFavoriteEvent;
import com.soofer.app.R;

import org.greenrobot.eventbus.EventBus;

public class SuccessDialogDialog extends Dialog {

    public Activity activity;
    public Dialog dialog;
    private Button submit;


    public SuccessDialogDialog(Activity activity) {
        super(activity);
        // TODO Auto-generated constructor stub
        this.activity = activity;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.successdialog);
        submit = findViewById(R.id.submit);
        submit.setOnClickListener(v ->{ activity.finish();
            EventBus.getDefault().postSticky(new AddFavoriteEvent(""));});

    }


}
