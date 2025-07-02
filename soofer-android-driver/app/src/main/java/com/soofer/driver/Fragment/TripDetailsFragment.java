package com.soofer.driver.Fragment;

import android.annotation.SuppressLint;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

import com.soofer.driver.R;

@SuppressLint("Registered")
public class TripDetailsFragment extends AppCompatActivity {


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fragment_trip_details);
    }


}
