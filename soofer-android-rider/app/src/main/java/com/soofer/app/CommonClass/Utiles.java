package com.soofer.app.CommonClass;

import android.animation.Animator;
import android.animation.ObjectAnimator;
import android.animation.PropertyValuesHolder;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.Typeface;
import android.media.ExifInterface;
import android.net.ConnectivityManager;
import android.os.Build;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import com.google.android.material.snackbar.Snackbar;
import android.util.Log;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.jakewharton.retrofit2.adapter.rxjava2.HttpException;
import com.tapadoo.alerter.Alerter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

import com.soofer.app.R;

import org.json.JSONException;
import org.json.JSONObject;

import io.reactivex.disposables.CompositeDisposable;

public class Utiles {
    public static ProgressDialog progress = null;
    private static final int ANIMATION_DURATION = 500;
    public static void ShowLoader(Activity context) {
        try {
            if (progress == null) {
                progress = new ProgressDialog(context);
                progress.setTitle(context.getResources().getString(R.string.logings));
                progress.setMessage(context.getResources().getString(R.string.wait_while_loading));
                progress.setCancelable(false); // disable dismiss by tapping outside of the dialog
                progress.show();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

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
    public static void AddToken(String trip_id, Context context) {
        DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference().child("trips_data").child(trip_id);
        HashMap<String, Object> map = new HashMap<>();
        map.put("rider_token", SharedHelper.getToken(context, "device_token"));
        databaseReference.updateChildren(map);
    }
    public static Boolean NullpointerValidation(TextView editText) {
        if (editText.getText().toString() != null && !editText.getText().toString().isEmpty()) {
            return true;
        } else {
            return false;
        }
    }

    public static Boolean isNull(String editText) {
        if (editText != null && !editText.isEmpty()) {
            return true;
        } else {
            return false;
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.CUPCAKE)
    public static void hideKeyboard(Activity activity) {
        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
        //Find the currently focused view, so we can grab the correct window token from it.
        View view = activity.getCurrentFocus();
        //If no view currently has focus, create a new one, just so we can grab a window token from it
        if (view == null) {
            view = new View(activity);
        }

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

    public static String NullPointer(String values) {
        if (values != null && !values.equalsIgnoreCase("null")) {
            return values;
        } else {
            return "";

        }
    }

    public static void CircleImageView(final String ImagePath, final ImageView imageView, final Context context) {
        System.out.println("enter the image view in android" + ImagePath);

        Glide.with(context)
                .load(ImagePath)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .skipMemoryCache(true)
                .transform(new RoundImageTransform(context))
                .into(imageView);

    }

    public static void ShowError(String Messagem, Context context, View view) {
        try {
            JSONObject jsonObject = new JSONObject(Messagem);
            if (jsonObject.has("message")) {
                Utiles.displayMessage(view, context, jsonObject.optString("message"));
            }

        } catch (JSONException e) {
            Utiles.displayMessage(view, context, context.getResources().getString(R.string.something_went_wrong));
        }
    }

    public static void Documentimg(String ImagePath,  ImageView imageView,  Activity activity) {
        System.out.println("enter the image view in android" + ImagePath);

        Glide.with(activity)
                .load(ImagePath)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .skipMemoryCache(true)
                .into(imageView);

    }

    public static void UpDateRiders(String riderid, Context context) {
        System.out.println("enetr the values");
        DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference().child("riders_data").child(riderid);
        HashMap<String, Object> map = new HashMap<>();
        map.put("current_tripid", "0");
        map.put("name", SharedHelper.getKey(context, "fname"));
        map.put("email_id", SharedHelper.getKey(context, "emailid"));
        map.put("tripstatus", "0");
        map.put("cancelExceeds", "0");
        map.put("lastCanceledDate", "0");
        map.put("oldBalance", "0");
        map.put("requestId", "0");
        map.put("tripdriver", "0");
        databaseReference.updateChildren(map);
    }

    public static void ClearFirabae(String riderid) {
        DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference().child("riders_data").child(riderid);
        HashMap<String, Object> map = new HashMap<>();
        map.put("cancelExceeds", "0");
        map.put("lastCanceledDate", "0");
        databaseReference.updateChildren(map);
    }

    public static void ClearFirebase(String riderid) {
        DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference().child("riders_data").child(riderid);
        HashMap<String, Object> map = new HashMap<>();
        map.put("current_tripid", "0");
        map.put("tripstatus", "0");
        map.put("requestId", "0");
        map.put("tripdriver", "0");
        databaseReference.updateChildren(map);
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
                        Intent intent = new Intent(Intent.ACTION_MAIN);
                        intent.setClassName("com.android.phone", "com.android.phone.NetworkSetting");
                        activity.startActivity(intent);
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

    public static Boolean PasswordValidation(EditText editText, EditText confirm, String status) {
        if (status.equalsIgnoreCase("password")) {
            if (editText.getText().toString().isEmpty() || editText.getText().length() < 6) {
                return true;
            } else {
                return false;
            }

        } else if (status.equalsIgnoreCase("match")) {
            if (editText.getText().toString().equals(confirm.getText().toString())) {
                return true;
            } else {
                return false;
            }
        } else {
            if (editText.getText().toString().isEmpty()) {
                return true;
            } else {
                return false;
            }

        }
    }

    public static void showErrorMessage(String message, Context context, View view) {
        if (message != null) {
            try {
                JSONObject jsonObject = new JSONObject(message);
                if (jsonObject.has("message")) {
                    Utiles.displayMessage(view, context, jsonObject.optString("message"));
                }else {
                    Utiles.displayMessage(view, context, context.getString(R.string.poor_network));
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
                dialog.dismiss();
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

    public static void compositeClreate(CompositeDisposable disposable) {
        if (disposable != null && disposable.isDisposed()) {
            disposable.dispose();
        }
    }

    public static  void clearInstance(){
        System.gc();
    }

    public static String returnString(String message, boolean isstatus) {
        String strMessage = "";
        try {
            JSONObject jsonObject = new JSONObject(message);
            Log.d("JSONOBJJJ", "JSONOBJJJ: "+jsonObject);
            if (isstatus) {
                strMessage = String.valueOf(jsonObject.optJSONObject("distanceDetails"));
                Log.d("DistanceDetails", "DistanceDetails: "+String.valueOf(jsonObject.optJSONObject("distanceDetails")));
            } else {
                strMessage = String.valueOf(jsonObject.optJSONObject("vehicleDetailsAndFare"));
                Log.d("vechdetails", "vechdetails: "+jsonObject.optJSONObject("vehicleDetailsAndFare"));
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return strMessage;
    }

    public static void showLayout(View view,Context context)
    {

        Animation bottomUp = AnimationUtils.loadAnimation(context,
                R.anim.bottom_up);
        view.startAnimation(bottomUp);
        view.setVisibility(View.VISIBLE);

    }

    public static void hideLayout(View view,Context context)
    {
        Animation bottomUp = AnimationUtils.loadAnimation(context,
                R.anim.bottom_down);
        view.startAnimation(bottomUp);
        view.setVisibility(View.GONE);
    }
    public static void getErrorBody(@NonNull Throwable throwable,Context activity) {
        try {
            if (throwable instanceof HttpException) {
                HttpException error = (HttpException) throwable;
                assert error.response().errorBody() != null;
                String errorBody = error.response().errorBody().string();
                JSONObject jsonObject = new JSONObject(errorBody);
                if (jsonObject.has("message")) {
                    CommonToast(activity,jsonObject.optString("message"));
                } else {
                    CommonToast(activity,"Something Went Wrong.");
                }
            } else {
                CommonToast(activity,"Something Went Wrong.");
            }

        } catch (JSONException | IOException e) {
            e.printStackTrace();
            CommonToast(activity,"Something Went Wrong.");
        }
    }
    public static void changeVisiblity(View view,boolean isCheck){
        if(isCheck){
            if(view.getVisibility()==View.GONE)
            {
                view.setVisibility(View.VISIBLE);
            }
        }else {
            if(view.getVisibility()==View.VISIBLE)
            {
                view.setVisibility(View.GONE);
            }
        }
    }
    public static String returnDate(Date date) {
        @SuppressLint("SimpleDateFormat")
        DateFormat df = null;
        try {
            df = new SimpleDateFormat("d MMM yyyy, h:mm a", Locale.US);
            return df.format(date);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
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
