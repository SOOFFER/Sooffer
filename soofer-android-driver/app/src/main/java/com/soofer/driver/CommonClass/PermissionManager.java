package com.soofer.driver.CommonClass;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class PermissionManager
{

    public PermissionManager(){}

    private static final String[] PERMISSIONS = {Manifest.permission.CAMERA};
    private static final int REQUEST_CODE = 101;

    public boolean userHasPermission(Activity activity) {
        return ContextCompat.checkSelfPermission(activity, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
    }

    public void requestPermission(Activity activity)
    {
        ActivityCompat.requestPermissions(activity, PERMISSIONS, REQUEST_CODE);
    }
}
