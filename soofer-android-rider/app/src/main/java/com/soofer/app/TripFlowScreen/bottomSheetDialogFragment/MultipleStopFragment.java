package com.soofer.app.TripFlowScreen.bottomSheetDialogFragment;


import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.soofer.app.Adapter.MultipleAddressLineAdapter;
import com.soofer.app.Model.TripFlowModel;
import com.soofer.app.R;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import retrofit2.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class MultipleStopFragment extends BottomSheetDialogFragment {

    @BindView(R.id.multiple_recycleview)
    RecyclerView multipleRecycleview;
    private Unbinder unbinder;
    private Response<TripFlowModel> multipleStopDetails;
    private Activity activity;


    public MultipleStopFragment(Response<TripFlowModel> multipleStopDetails) {
        // Required empty public constructor
        this.multipleStopDetails = multipleStopDetails;
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_multiple_stop, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        assert multipleStopDetails.body() != null;
        MultipleAddressLineAdapter multipleAddressLineAdapter = new MultipleAddressLineAdapter(multipleStopDetails.body().getMultiLocation(),activity);
        multipleRecycleview.setAdapter(multipleAddressLineAdapter);
        return view;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            unbinder.unbind();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
