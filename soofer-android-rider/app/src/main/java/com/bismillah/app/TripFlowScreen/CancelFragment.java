package com.bismillah.app.TripFlowScreen;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import androidx.fragment.app.FragmentManager;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.bismillah.app.Activity.HomeActivity;
import com.bismillah.app.Activity.WelcomeActivity;
import com.bismillah.app.CommonClass.Constants;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.gson.Gson;
import com.bismillah.app.Adapter.CancelReasonAdapter;
import com.bismillah.app.CommonClass.BaseFragment;
import com.bismillah.app.CommonClass.FontChangeCrawler;
import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.FlowInterface.CallRequest;
import com.bismillah.app.Model.CancelReasonModel;
import com.bismillah.app.Model.CancelTripModel;
import com.bismillah.app.Presenter.CancelTripPresenter;
import com.bismillah.app.R;
import com.bismillah.app.View.CancelView;
import com.rengwuxian.materialedittext.MaterialEditText;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

import static com.bismillah.app.CommonClass.Constants.TripFlowFragmant;
import static com.bismillah.app.CommonClass.Constants.isDriver;
import static com.bismillah.app.CommonClass.Utiles.ClearFirebase;
import static com.bismillah.app.CommonClass.Utiles.clearInstance;
import static com.bismillah.app.CommonClass.Utiles.showErrorMessage;

public class CancelFragment extends BaseFragment implements CancelReasonAdapter.CancelLisioner, CancelView {

    private List<CancelReasonModel> cancelReasonModels;
    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.trip_recycleview)
    RecyclerView tripRecycleview;
    @BindView(R.id.Cancel_reason_txt)
    MaterialEditText CancelReasonTxt;
    @BindView(R.id.submit)
    Button submit;
    @BindView(R.id.other_cancel_reason)
    CardView otherCancelReason;
    @BindView(R.id.cancel_reason_frame)
    FrameLayout cancelReasonFrame;
    Unbinder unbinder;
    private CallRequest callRequest;


    public CancelFragment() {
        // Required empty public constructor
    }

    private Activity activity;
    private Context context;
    private FragmentManager fragmentManager;
    private String strCancelReason = "";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    private static DatabaseReference CancelReason;
    private static ChildEventListener CancelReasonListioner;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_cancel, container, false);
        unbinder = ButterKnife.bind(this, view);
        fragmentManager = getFragmentManager();
        activity = getActivity();
        context = getContext();
        cancelReasonModels = new ArrayList<>();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        setAdapter();
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.submit, R.id.cancel_reason_frame})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                fragmentManager.popBackStackImmediate();
                break;
            case R.id.submit:
                if (Objects.requireNonNull(CancelReasonTxt.getText()).toString().isEmpty()) {
                    CancelReasonTxt.setText("Please Enter Cancel Reason");
                } else {
                    Utiles.hideKeyboard(activity);
                    strCancelReason = CancelReasonTxt.getText().toString();
                    CancelTripPresenter();
                }

                break;
            case R.id.cancel_reason_frame:
                slideDown(cancelReasonFrame);
                break;
        }
    }

    public void setAdapter() {
        CancelReason = FirebaseDatabase.getInstance().getReference().child("Cancel_reason").child("Rider_reason");
        CancelReasonListioner = CancelReason.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                AllAddedData(dataSnapshot);
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                AllAddedData(dataSnapshot);
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {

            }

            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {

            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        });
    }

    public void AllAddedData(DataSnapshot dataSnapshot) {
        cancelReasonModels.add(new CancelReasonModel(dataSnapshot.getKey()));
        tripRecycleview.setLayoutManager(new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false));
        tripRecycleview.setItemAnimator(new DefaultItemAnimator());
        tripRecycleview.setHasFixedSize(true);
        CancelReasonAdapter cancelReasonAdapter = new CancelReasonAdapter(activity, cancelReasonModels,this);
        tripRecycleview.setAdapter(cancelReasonAdapter);
    }

    @Override
    public void CancelReason(String strreason) {
        if (strreason.equalsIgnoreCase("Others")) {
            slideUp(cancelReasonFrame);
        } else {
            strCancelReason = strreason;
            CancelTripPresenter();
        }

    }

    public void RemoveDuplicated(List<CancelReasonModel> cancelReasonModels) {
        for (CancelReasonModel cancelreason : cancelReasonModels) {

        }
    }


    // slide the view from below itself to the current position
    public void slideUp(View view) {
        Animation slide_up = AnimationUtils.loadAnimation(activity,
                R.anim.slide_up);
        view.startAnimation(slide_up);
        view.setVisibility(View.VISIBLE);
    }

    // slide the view from its current position to below itself
    public void slideDown(View view) {
        Animation slide_down = AnimationUtils.loadAnimation(activity,
                R.anim.slide_down);
        view.startAnimation(slide_down);
        view.setVisibility(View.GONE);
    }

    public void CancelTripPresenter() {
        CancelTripPresenter cancelTripPresenter = new CancelTripPresenter(this);
        cancelTripPresenter.CancelTrip(SharedHelper.getKey(context, "trip_id"), activity, strCancelReason);
    }

    @Override
    public void OnSuccessfully(Response<CancelTripModel> Response) {
        if (Response.body().getSuccess()) {
            CancelTrip();
            ClearFirebase(SharedHelper.getKey(context, "userid"));
            if (isAdded() && activity != null) {
                callRequest = (CallRequest) getActivity();
                System.out.println("xxx "+callRequest);
                callRequest.ClearServiceFragment();
                System.out.println("xxx "+callRequest);
            }

            TripFlowFragmant = null;
            SharedHelper.putKey(context, "trip_id", "null");
        } else {
            Utiles.displayMessage(getView(), context, "Something Went Wrong");
        }
    }

    @Override
    public void OnFailure(Response<CancelTripModel> Response) {
        showErrorMessage(new Gson().toJson(Response.errorBody()), activity, getView());
    }

    public void CancelTrip() {
        DatabaseReference CancelReference = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(context, "trip_id"));
        Constants.isDriver = false;
        HashMap<String, Object> map = new HashMap<>();
        map.put("status", "5");
        map.put("cancelby", "Rider");
        CancelReference.updateChildren(map);

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (CancelReason != null) {
            CancelReason.removeEventListener(CancelReasonListioner);

        }
    }
}
