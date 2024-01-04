package com.bismillah.driver.CommonClass.Customizeview;

import android.content.Context;
import android.util.AttributeSet;

import com.rengwuxian.materialedittext.MaterialEditText;

import java.util.Objects;

public class CustomEditText extends MaterialEditText {

    public CustomEditText(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CustomEditText(Context context) {
        super(context);
    }

    public CustomEditText(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onSelectionChanged(int selStart, int selEnd) {
        this.setSelection(Objects.requireNonNull(this.getText()).length());
    }
}
