package com.soofer.app.TripFlowScreen;

import static com.soofer.app.CommonClass.Constants.TripFlowFragmant;
import static com.soofer.app.CommonClass.Utiles.ClearFirebase;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.cardview.widget.CardView;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;

import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.MainActivity;
import com.soofer.app.R;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

public class TipsFragment extends BaseFragment {
    Unbinder unbinder;
    private CallRequest callRequest;
    Activity activity;
    @BindView(R.id.card1)
    CardView card1;
    @BindView(R.id.card2)
    CardView card2;
    @BindView(R.id.card3)
    CardView card3;
    @BindView(R.id.five_txt)
    TextView five_txt;
    @BindView(R.id.ten_txt)
    TextView ten_txt;
    @BindView(R.id.fifteen_txt)
    TextView fifteen_txt;
    @BindView(R.id.add_amount)
    ImageView add_amount;
    @BindView(R.id.submit_txt)
    Button submit_txt;
    @BindView(R.id.skip)
    TextView skip;
    @BindView(R.id.layout_amount)
    LinearLayout layoutAmount;
    @BindView(R.id.driver_tips)
    EditText driver_tips;
    @BindView(R.id.layout1)
    LinearLayout layout1;
    @BindView(R.id.layout2)
    LinearLayout layout2;
    @BindView(R.id.layout3)
    LinearLayout layout3;
    public Context context;

    public TipsFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @SuppressLint("ResourceAsColor")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_tips,container,false);
        unbinder = ButterKnife.bind(this,view);
        activity = getActivity();
        assert activity != null;
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(),getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        context = getContext();
       // layoutAmount.setVisibility(View.GONE);
        skip.setOnClickListener(v -> {
            ClearFirebase(SharedHelper.getKey(context, "userid"));
            callRequest = (CallRequest) getActivity();
            callRequest.ClearServiceFragment();
            TripFlowFragmant = null;
            SharedHelper.putKey(context, "trip_id", "null");
        });

        add_amount.setOnClickListener(v -> {
            layoutAmount.setVisibility(View.VISIBLE);
        });

        layout1.setOnClickListener(v ->
        {
            SharedHelper.putKey(context,"tip_five",five_txt.getText().toString());
            card1.setBackgroundResource(R.color.colorPrimary);
            card2.setBackgroundResource(R.color.white);
            card3.setBackgroundResource(R.color.white);
        });

        layout2.setOnClickListener(v ->
        {
            SharedHelper.putKey(context,"tip_ten",five_txt.getText().toString());
            card1.setBackgroundResource(R.color.colorPrimary);
            card2.setBackgroundResource(R.color.white);
            card3.setBackgroundResource(R.color.white);
        });
        layout3.setOnClickListener(v ->
        {
            SharedHelper.putKey(context,"tip_fifteen",five_txt.getText().toString());
            card1.setBackgroundResource(R.color.colorPrimary);
            card2.setBackgroundResource(R.color.white);
            card3.setBackgroundResource(R.color.white);
        });


        return view;
}

@OnClick(R.id.submit_txt)
public void onViewClicked(){
        try {
            Utiles.hideKeyboard(activity);
            sendTips();
            Intent intent = new Intent(context, MainActivity.class);
            startActivity(intent);


        }
    catch(Exception e){
        e.printStackTrace();
        }
    }
        private void sendTips(){
        Date c = Calendar.getInstance().getTime();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        String formattedDate = df.format(c);

            HashMap<String,Object> tip = new HashMap<>();
            tip.put("reviewDT",formattedDate);
            int tripId = Integer.parseInt(SharedHelper.getKey(context,"key_id"));
            if(SharedHelper.getKey(context,"tip_five").isEmpty() && SharedHelper.getKey(context,"tip_ten").isEmpty() && SharedHelper.getKey(context,"tip_fifteen").isEmpty())
            {
                tip.put("tips",driver_tips.getText().toString());
            }
            if(SharedHelper.getKey(context,"tip_five") !=null)
            {
                tip.put("tips",SharedHelper.getKey(context,"tip_five"));
            }
            else if(SharedHelper.getKey(context,"tip_ten") !=null)
            {
                tip.put("tips",SharedHelper.getKey(context,"tip_ten"));
            }
            else if(SharedHelper.getKey(context,"tip_fifteen") !=null) {
                tip.put("tips", SharedHelper.getKey(context, "tip_fifteen"));
            }
            else
                tip.put("tips",driver_tips.getText().toString());


        }

    public void FragmentCalling(Fragment fragment) {
        FragmentManager fragmentManager = getFragmentManager();
        assert fragmentManager != null;
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.container, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();


    }

}
