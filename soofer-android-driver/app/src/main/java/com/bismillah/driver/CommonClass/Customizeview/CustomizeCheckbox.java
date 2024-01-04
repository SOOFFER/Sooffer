package com.bismillah.driver.CommonClass.Customizeview;

import android.annotation.SuppressLint;
import android.content.Context;
import android.util.AttributeSet;
import android.widget.CheckBox;

import com.bismillah.driver.R;

public class CustomizeCheckbox extends CheckBox {
    public CustomizeCheckbox(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @SuppressLint("ResourceAsColor")
    @Override
    public void setChecked(boolean t) {
        if (t) {
            this.setBackgroundResource(R.drawable.ic_checked);
            //  this.setTextColor(R.color.white);
        } else {
            this.setBackgroundResource(R.drawable.ic_uncheck);
            // this.setTextColor(R.color.black);
        }
        super.setChecked(t);
    }


}


