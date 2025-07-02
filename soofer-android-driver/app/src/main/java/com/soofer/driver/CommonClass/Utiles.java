package com.soofer.driver.CommonClass;

import android.animation.Animator;
import android.animation.ObjectAnimator;
import android.animation.PropertyValuesHolder;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.CursorLoader;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.Typeface;
import android.media.ExifInterface;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import androidx.annotation.NonNull;
import com.google.android.material.snackbar.Snackbar;
import androidx.core.graphics.drawable.RoundedBitmapDrawable;
import androidx.core.graphics.drawable.RoundedBitmapDrawableFactory;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.webkit.MimeTypeMap;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.target.BitmapImageViewTarget;
import com.google.android.gms.maps.model.LatLng;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.soofer.driver.R;

import com.google.firebase.database.ValueEventListener;

import com.tapadoo.alerter.Alerter;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.List;

import io.reactivex.rxjava3.disposables.CompositeDisposable;
import retrofit2.adapter.rxjava3.HttpException;


public class Utiles {
    public static ProgressDialog progress = null;

    public static void ShowLoader(final Activity context) {
        context.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (progress == null) {
                    try {
                        progress = new ProgressDialog(context);
                        progress.setMessage(context.getResources().getString(R.string.wait_while_loading));
                        progress.setCancelable(false); // disable dismiss by tapping outside of the dialog
                        progress.show();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });


    }

    public static void ShownewLoader(final Activity context) {
        context.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (progress == null) {
                    try {
                        progress = new ProgressDialog(context);
                        progress.setMessage("Face Recognition in Progress Kindly Wait...");
                        progress.setCancelable(false); // disable dismiss by tapping outside of the dialog
                        progress.show();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });


    }

    public static String dotLimitation(double values) {
        return new DecimalFormat("##.##").format(values);
    }

    public static void DismissLoader() {
        try {
            if (progress != null) {
                progress.dismiss();
                progress = null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void CommonToast(Context activity, String Message) {
        try {
            Toast.makeText(activity, Message, Toast.LENGTH_LONG).show();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static Boolean NullpointerValidation(TextView editText) {
        if (editText.getText().toString() != null && !editText.getText().toString().isEmpty()) {
            return true;
        } else {
            return false;
        }
    }

    public static String Nullpointer(String editText) {
        if (editText != null && !editText.isEmpty()) {
            return editText;
        } else {
            return "";
        }
    }

    public static boolean IsNull(String editText) {
        if (editText != null && !editText.isEmpty()) {
            return true;
        } else {
            return false;
        }
    }

    public static void hideKeyboard(Activity activity) {
        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
        //Find the currently focused view, so we can grab the correct window token from it.
        View view = activity.getCurrentFocus();
        //If no view currently has focus, create a new one, just so we can grab a window token from it
        if (view == null) {
            view = new View(activity);
        }
        assert imm != null;
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }

    public static void displayMessage(View view, Context context, String toastString) {
        try {
            Snackbar.make(view, toastString, Snackbar.LENGTH_SHORT)
                    .setAction("Action", null).show();
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(context, "" + toastString, Toast.LENGTH_SHORT).show();
        }
    }

    public static String BitMapToString(Bitmap bitmap) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos);
        byte[] b = baos.toByteArray();
        return Base64.encodeToString(b, Base64.DEFAULT);
    }

    public static Bitmap StringToBitMap(String encodedString) {
        try {
            byte[] encodeByte = Base64.decode(encodedString, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(encodeByte, 0, encodeByte.length);
        } catch (Exception e) {
            e.getMessage();
            return null;
        }
    }


    public static void setDriversData(Context context) {

        DatabaseReference Driverdata = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(SharedHelper.getKey(context, "userid"));
        HashMap<String, String> map = new HashMap<>();
        map.put("online_status", "0");
        map.put("proof_status", "Pending");
        map.put("vehicle_id", "0");
        map.put("cancelExceeds", "0");
        map.put("lastCanceledDate", "0");
        map.put("credits", "0");
        Driverdata.setValue(map);

        DatabaseReference Accept = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(SharedHelper.getKey(context, "userid")).child("accept");
        HashMap<String, String> acceptmap = new HashMap<>();
        acceptmap.put("trip_id", "0");
        acceptmap.put("others", "0");
        Accept.setValue(acceptmap);

        DatabaseReference Requestdata = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(SharedHelper.getKey(context, "userid")).child("request");
        HashMap<String, String> Requestmap = new HashMap<>();
        Requestmap.put("drop_address", "0");
        Requestmap.put("etd", "0");
        Requestmap.put("picku_address", "0");
        Requestmap.put("stop_one", "0");
        Requestmap.put("stop_two", "0");
        Requestmap.put("request_id", "0");
        Requestmap.put("status", "0");
        Requestdata.setValue(Requestmap);

    }

    public static void ClearFirebase(Context context) {

        DatabaseReference Accept = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(SharedHelper.getKey(context, "userid")).child("accept");
        HashMap<String, Object> acceptmap = new HashMap<>();
        acceptmap.put("trip_id", "0");
        acceptmap.put("others", "0");
        Accept.updateChildren(acceptmap);

        DatabaseReference Requestdata = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(SharedHelper.getKey(context, "userid")).child("request");
        HashMap<String, Object> Requestmap = new HashMap<>();
        Requestmap.put("drop_address", "0");
        Requestmap.put("etd", "0");
        Requestmap.put("picku_address", "0");
        Requestmap.put("stop_one", "0");
        Requestmap.put("stop_two", "0");
        Requestmap.put("request_id", "0");
        Requestmap.put("status", "0");
        Requestdata.updateChildren(Requestmap);
    }

    public static void CircleImageView(final String ImagePath, final ImageView imageView, final Context context) {
        System.out.println("enter the image view in android" + ImagePath);

        try {
            Glide.with(context).load(ImagePath).asBitmap().centerCrop().skipMemoryCache(true).into(new BitmapImageViewTarget(imageView) {
                @Override
                protected void setResource(Bitmap resource) {
                    RoundedBitmapDrawable circularBitmapDrawable =
                            RoundedBitmapDrawableFactory.create(context.getResources(), resource);
                    circularBitmapDrawable.setCircular(true);
                    imageView.setImageDrawable(circularBitmapDrawable);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static void LocalImage(String ImagePath, final ImageView imageView, final Activity activity) {
        System.out.println("enter the image view in android" + ImagePath);

        try {
            Glide.with(activity)
                    .load(ImagePath)
                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                    .skipMemoryCache(true)
                    .transform(new RoundImageTransform(activity))
                    .into(imageView);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static void Documentimg(String ImagePath, final ImageView imageView, final Activity activity) {
        System.out.println("enter the image view in android" + ImagePath);

        try {
            Glide.with(activity)
                    .load(ImagePath)
                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                    .skipMemoryCache(true)
                    .into(imageView);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static String getRealPathFromURI(Uri contentUri, Context context) {
        String[] proj = {MediaStore.Images.Media.DATA};
        CursorLoader loader = new CursorLoader(context, contentUri, proj, null, null, null);
        Cursor cursor = loader.loadInBackground();
        int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
        cursor.moveToFirst();
        String result = cursor.getString(column_index);
        cursor.close();
        return result;
    }

    public static String getMimeType(String url) {
        String type = null;
        String extension = MimeTypeMap.getFileExtensionFromUrl(url);
        if (extension != null) {
            type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        }
        return type;
    }

    public static File saveBitmapToFile(File file, final String gallery) {
        try {

            // BitmapFactory options to downsize the image
            BitmapFactory.Options o = new BitmapFactory.Options();
            o.inJustDecodeBounds = true;
            o.inSampleSize = 6;
            // factor of downsizing the image

            FileInputStream inputStream = new FileInputStream(file);
            //Bitmap selectedBitmap = null;
            BitmapFactory.decodeStream(inputStream, null, o);
            inputStream.close();

            // The new size we want to scale to
            final int REQUIRED_SIZE = 75;

            // Find the correct scale value. It should be the power of 2.
            int scale = 1;
            while (o.outWidth / scale / 2 >= REQUIRED_SIZE &&
                    o.outHeight / scale / 2 >= REQUIRED_SIZE) {
                scale *= 2;
            }

            BitmapFactory.Options o2 = new BitmapFactory.Options();
            o2.inSampleSize = scale;
            inputStream = new FileInputStream(file);

            Bitmap selectedBitmap = BitmapFactory.decodeStream(inputStream, null, o2);
            inputStream.close();
            Matrix matrix = new Matrix();
            if (!gallery.equalsIgnoreCase("camera")) {

                matrix.postRotate(Orientationchanges(file));
                selectedBitmap = Bitmap.createBitmap(selectedBitmap, 0, 0, selectedBitmap.getWidth(), selectedBitmap.getHeight(), matrix, true);

            } else {
                matrix.postRotate(Orientationchanges(file));
                selectedBitmap = Bitmap.createBitmap(selectedBitmap, 0, 0, selectedBitmap.getWidth(), selectedBitmap.getHeight(), matrix, true);

            }

            // here i override the original image file
            file.createNewFile();
            FileOutputStream outputStream = new FileOutputStream(file);

            selectedBitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);

            return file;
        } catch (Exception e) {
            return null;
        }
    }

    public static boolean isNetworkAvailable(Context context) {
        final ConnectivityManager connectivityManager = ((ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE));
        return connectivityManager.getActiveNetworkInfo() != null && connectivityManager.getActiveNetworkInfo().isConnected();
    }

    public static void showNoNetwork(final Activity activity) {
        Alerter.create(activity)
                .setTitle(R.string.internet_connect)
                .setText(R.string.connection)
                .setBackgroundColorRes(R.color.redcolor) // or setBackgroundColorInt(Color.CYAN)
                .setDuration(10000)
                .enableSwipeToDismiss()
                .setProgressColorRes(R.color.black)
                .setTitleTypeface(Typeface.createFromAsset(activity.getAssets(), activity.getResources().getString(R.string.app_font)))
                .setTextTypeface(Typeface.createFromAsset(activity.getAssets(), activity.getResources().getString(R.string.app_font)))
                .setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        try {
                            Intent intent = new Intent(Intent.ACTION_MAIN);
                            intent.setClassName("com.android.phone", "com.android.phone.NetworkSetting");
                            activity.startActivity(intent);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                })
                .show();
    }

    private static int Orientationchanges(File filename) {
        int rotate = 0;
        try {
            ExifInterface exif = new ExifInterface(filename.toString());
            int orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION,
                    ExifInterface.ORIENTATION_NORMAL);

            switch (orientation) {
                case ExifInterface.ORIENTATION_ROTATE_270:
                    rotate -= 90;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_180:
                    rotate -= 90;
                    break;
                case ExifInterface.ORIENTATION_ROTATE_90:
                    rotate -= 90;
                    break;
            }
            Log.d("Fragment", "EXIF info for file " + filename + ": " + rotate);
        } catch (IOException e) {
            Log.d("Fragment", "Could not get EXIF info for file " + filename + ": " + e);
        }
        return rotate;
    }

    public static void CreateFirebaseTripData(String tripid,Context context,String status) {
        DatabaseReference trips_data = FirebaseDatabase.getInstance().getReference().child("trips_data").child(tripid);
        HashMap<String, Object> createTrip = new HashMap<>();
        createTrip.put("Drop_address", "0");
        createTrip.put("Drop_latlng", "0");
        createTrip.put("convance_fare", "0");
        createTrip.put("cancel_fare", "0");
        createTrip.put("distance", "0");
        createTrip.put("time", "0");
        createTrip.put("isNight", "0");
        createTrip.put("distance_fare", "0");
        createTrip.put("cancelby", "0");
        createTrip.put("driver_rating", "0");
        createTrip.put("duration", "0");
        createTrip.put("pickup_address", "0");
        createTrip.put("rider_rating", "0");
        createTrip.put("status", status);
        createTrip.put("time_fare", "0");
        createTrip.put("datetime", "0");
        createTrip.put("trip_type", "0");
        createTrip.put("total_fare", "0");
        createTrip.put("discount", "0");
        createTrip.put("driver_alavance_dis", "0");
        createTrip.put("ispay", "0");
        createTrip.put("pay_type", "0");
        createTrip.put("tax", "0");
        createTrip.put("isTax", "0");
        createTrip.put("isWaiting", "0");
        createTrip.put("isPickup", "0");
        createTrip.put("driver_token", SharedHelper.getToken(context, "device_token"));
        trips_data.updateChildren(createTrip);
    }

    public static Boolean PasswordValidation(EditText editText, EditText confirm, String status) {
        if (status.equalsIgnoreCase("password")) {
            if (editText.getText().toString().isEmpty() || editText.getText().length() < 6) {
                return true;
            } else {
                return false;
            }

        } else if (status.equalsIgnoreCase("match")) {
            if (editText.getText().toString().equals(confirm.getText().toString())) {
                return false;
            } else {
                return true;
            }
        } else {
            if (editText.getText().toString().isEmpty()) {
                return true;
            } else {
                return false;
            }

        }
    }

    public static void ShowError(String Messagem, Context context, View view) {
        try {
            JSONObject jsonObject = new JSONObject(Messagem);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(view, context, jsonObject.optString("message"));
            }

        } catch (Exception e) {
            Utiles.displayMessage(view, context, context.getResources().getString(R.string.something_went_wrong));
        }
    }

    public static void CommonErrorMessage(String Message, View view, Context context) {
        try {
            JSONObject jsonObject = new JSONObject(Message);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(view, context, jsonObject.optString("message"));
            }

        } catch (JSONException e) {
        }
    }

    public static void showErrorMessage(String message, Context context, View view) {
        if (message != null) {
            try {
                JSONObject jsonObject = new JSONObject(message);
                if (jsonObject.has("message")) {
                    Utiles.displayMessage(view, context, jsonObject.optString("message"));
                }

            } catch (JSONException e) {
                Utiles.displayMessage(view, context, context.getString(R.string.poor_network));
            }
        } else {
            Utiles.displayMessage(view, context, context.getString(R.string.poor_network));
        }


    }

    public static void StartAnimation(View decorView) {
        ObjectAnimator scaleDown = ObjectAnimator.ofPropertyValuesHolder(decorView,
                PropertyValuesHolder.ofFloat("scaleX", 0.0f, 1.0f),
                PropertyValuesHolder.ofFloat("scaleY", 0.0f, 1.0f),
                PropertyValuesHolder.ofFloat("alpha", 0.0f, 1.0f));
        scaleDown.setDuration(1000);
        scaleDown.start();
    }

    public static void DismissiAnimation(View decorView, final Dialog dialog) {
        ObjectAnimator scaleDown = ObjectAnimator.ofPropertyValuesHolder(decorView,
                PropertyValuesHolder.ofFloat("scaleX", 1.0f, 0.0f),
                PropertyValuesHolder.ofFloat("scaleY", 1.0f, 0.0f),
                PropertyValuesHolder.ofFloat("alpha", 1.0f, 0.0f));
        scaleDown.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationEnd(Animator animation) {
                try {
                    dialog.dismiss();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onAnimationStart(Animator animation) {
            }

            @Override
            public void onAnimationCancel(Animator animation) {
            }

            @Override
            public void onAnimationRepeat(Animator animation) {
            }
        });
        scaleDown.setDuration(1000);
        scaleDown.start();
    }

    public static boolean isMyServiceRunning(Context activity, Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) activity.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    public static void compositeClreate(CompositeDisposable disposable) {
        if (disposable != null && disposable.isDisposed()) {
            disposable.dispose();
        }
    }

    public static void clearInstance() {
        System.gc();
    }

    public static LatLng getDestination(String location) {
        String arr[] = location.split(",");
        LatLng latLng = null;
        try {
            latLng = new LatLng(Double.parseDouble(arr[0]), Double.parseDouble(arr[1]));
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }
        return latLng;
    }

    public static void RemoveRefenceListioner(DatabaseReference databaseReference, ValueEventListener valueEventListener){
        try {
            if(databaseReference!=null){
                databaseReference.removeEventListener(valueEventListener);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void getErrorBody(@NonNull Throwable throwable, Context activity) {
        try {
            if (throwable instanceof HttpException) {
                HttpException error = (HttpException) throwable;
                assert error.response().errorBody() != null;
                String errorBody = error.response().errorBody().string();
                JSONObject jsonObject = new JSONObject(errorBody);
                if (jsonObject.has("message")) {
                    CommonToast(activity,jsonObject.optString("message"));
                } else {
                    CommonToast(activity,activity.getResources().getString(R.string.something_went_wrong));
                }
            } else {
                CommonToast(activity,activity.getResources().getString(R.string.something_went_wrong));
            }

        } catch (Exception e) {
            e.printStackTrace();
            CommonToast(activity,activity.getResources().getString(R.string.something_went_wrong));
        }
    }

    public static void iconChange(EditText view,boolean isboolean,Activity activity){
        if(isboolean){
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                view.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, activity.getDrawable(R.drawable.ic_hide), null);
            } else {

                view.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.ic_hide, 0);
            }
        }else {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                view.setCompoundDrawablesRelativeWithIntrinsicBounds(null, null, activity.getDrawable(R.drawable.view), null);
            } else {

                view.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.view, 0);
            }
        }

    }

    @TargetApi(11)
    public static void moveToFront(Context context) {
        if (Build.VERSION.SDK_INT >= 11) { // honeycomb
            final ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
            final List<ActivityManager.RunningTaskInfo> recentTasks = activityManager.getRunningTasks(Integer.MAX_VALUE);

            for (int i = 0; i < recentTasks.size(); i++)
            {
                Log.d("Executed app", "Application executed : "
                        +recentTasks.get(i).baseActivity.toShortString()
                        + "\t\t ID: "+recentTasks.get(i).id+"");
                // bring to front
                if (recentTasks.get(i).baseActivity.toShortString().indexOf(context.getPackageName()) > -1) {
                    activityManager.moveTaskToFront(recentTasks.get(i).id, ActivityManager.MOVE_TASK_WITH_HOME);
                }
            }
        }
    }

    public static  String createBrandInfo(){
        JSONObject json = new JSONObject();
        try {
            json.put("manufacture",android.os.Build.MANUFACTURER);
            json.put("device", android.os.Build.DEVICE);
            json.put("brand", android.os.Build.BRAND);
            json.put("model", Build.MODEL);
            json.put("version", Build.VERSION.SDK_INT);
            System.out.println("enter the brand name"+json);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return json.toString();
    }

}
