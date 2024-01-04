package com.bismillah.driver.TripflowFragment.BottomSheetDialogFragment;

import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.bismillah.driver.Adapter.SelectListAdapter;
import com.bismillah.driver.FlowInterface.CommonInterface;
import com.bismillah.driver.R;

import java.util.ArrayList;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;

public class SelectionBottomSheetFragment extends BottomSheetDialogFragment {

    @BindView(R.id.multiple_recycleview)
    RecyclerView multipleRecycleview;

    @BindView(R.id.title_txt)
    TextView titleTxt;
    private Unbinder unbinder;
    private Activity activity;
    private ArrayList<?> listdata ;
    private String strTitle;
    private CommonInterface commonInterface;
    public SelectionBottomSheetFragment(String strTitle,ArrayList<?> listdata,CommonInterface commonInterface) {
        // Required empty public constructor
        this.commonInterface = commonInterface;
        this.strTitle = strTitle;
        this.commonInterface = commonInterface;
        this.listdata = listdata;
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_selection_bottom_sheet, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        titleTxt.setText(strTitle);
        SelectListAdapter adapter = new SelectListAdapter(activity,listdata,commonInterface);
        multipleRecycleview.setAdapter(adapter);
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