package com.bismillah.driver.CommonClass;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class PermissionManager
{

    public PermissionManager(){}

    private static final String[] PERMISSIONS = {Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE};
    private static final int REQUEST_CODE = 101;

    public boolean userHasPermission(Activity activity)
    {
        int permissionCheck = ContextCompat.checkSelfPermission(activity, PERMISSIONS[0]);
        int permissionCheck2 = ContextCompat.checkSelfPermission(activity, PERMISSIONS[1]);
        return permissionCheck == PackageManager.PERMISSION_GRANTED &&
                permissionCheck2 == PackageManager.PERMISSION_GRANTED;
    }

    public void requestPermission(Activity activity)
    {
        ActivityCompat.requestPermissions(activity, PERMISSIONS, REQUEST_CODE);
    }
}
