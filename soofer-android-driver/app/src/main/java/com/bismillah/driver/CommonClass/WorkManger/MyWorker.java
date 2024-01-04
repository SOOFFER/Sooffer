package com.bismillah.driver.CommonClass.WorkManger;

import android.content.Context;
import android.content.Intent;
import androidx.annotation.NonNull;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.bismillah.driver.CommonClass.CommonData;
import com.bismillah.driver.CommonClass.Constants;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.MainActivity;

import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.jetbrains.annotations.NotNull;

import static com.bismillah.driver.CommonClass.CommonData.RequestBoolean;
import static com.bismillah.driver.CommonClass.CommonData.isRequestFrom;

public class MyWorker extends Worker {

    static DatabaseReference RequestDatabase, AppAutoLoggedOut;
    static ValueEventListener RequestValueEvent, AppAutoLoggedOutValue;
    private Context context;
    private String strDriverID = "";

    public MyWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        this.context = getApplicationContext();
        strDriverID = SharedHelper.getKey(context, "userid");
    }

    @NonNull
    @Override
    public Result doWork() {
        getRequest();
        return Result.success();
    }

    private void getRequest() {

        if (!strDriverID.isEmpty()) {
            if (RequestDatabase == null) {
                RequestDatabase = FirebaseDatabase.getInstance().getReference().child("drivers_data").child(strDriverID).child("request").child("status");
                RequestValueEvent = new ValueEventListener() {
                    @Override
                    public void onDataChange(@NotNull DataSnapshot dataSnapshot) {
                        if (dataSnapshot.getValue() != null) {
                            if (dataSnapshot.getValue().toString().equalsIgnoreCase("1") && Constants.RquestScreen) {
                                RequestBoolean = false;
                                isRequestFrom = false;
                                Constants.RequestStart = false;
                                System.out.println("enter the request");
                                Intent intent = new Intent(context, MainActivity.class);
                                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                                context.startActivity(intent);
                            } else {
                                System.out.println("enter the no request");
                            }

                            if (dataSnapshot.getValue().toString().equalsIgnoreCase("0")) {
                                RequestBoolean = false;
                                isRequestFrom = true;
                                Constants.RequestStart = true;
                                CommonData.requestionInprogress = false;
                            }
                        }
                    }

                    @Override
                    public void onCancelled(@NotNull DatabaseError databaseError) {

                    }
                };
                RequestDatabase.addValueEventListener(RequestValueEvent);

            }

        }

    }

}
