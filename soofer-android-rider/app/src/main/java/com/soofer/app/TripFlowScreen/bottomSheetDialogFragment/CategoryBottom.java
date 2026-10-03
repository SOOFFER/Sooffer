package com.soofer.app.TripFlowScreen.bottomSheetDialogFragment;

import android.app.Dialog;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.FragmentManager;

import com.soofer.app.Adapter.ServiceAdapter;
import com.soofer.app.EventBus.CategoryPassing;
import com.soofer.app.EventBus.FlowBottomSheet;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.ServiceModel;
import com.soofer.app.Model.TripFlowModel;
import com.soofer.app.R;
import com.soofer.app.databinding.BottomsheetCategoryBinding;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

import org.greenrobot.eventbus.EventBus;

import java.util.List;

import retrofit2.Response;


public class CategoryBottom extends BottomSheetDialogFragment implements CallRequest {
    BottomSheetBehavior bottomSheetBehavior;
    BottomsheetCategoryBinding bi;
    List<ServiceModel.VehicleCategory> servieModel;
    private ServiceAdapter serviceAdapter;
    private FragmentManager supportFragmentManager;

    public CategoryBottom(List<ServiceModel.VehicleCategory> servieModel, FragmentManager supportFragmentManager) {
        this.servieModel = servieModel;
        this.supportFragmentManager = supportFragmentManager;
    }

    public CategoryBottom() {

    }

    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        BottomSheetDialog bottomSheet = (BottomSheetDialog) super.onCreateDialog(savedInstanceState);
        View view = View.inflate(getContext(), R.layout.bottomsheet_category, null);
        bi = DataBindingUtil.bind(view);
        bottomSheet.setContentView(view);
        bottomSheetBehavior = BottomSheetBehavior.from((View) (view.getParent()));
        if (servieModel != null && !servieModel.isEmpty()) {
            if (serviceAdapter == null) {
                serviceAdapter = new ServiceAdapter(requireActivity(), servieModel, this);
                bi.recylerCartype.setAdapter(serviceAdapter);
            } else {
                serviceAdapter.notifyDataSetChanged();
            }
        }
        bottomSheet.setCanceledOnTouchOutside(false);
        bottomSheet.setOnKeyListener(new Dialog.OnKeyListener() {
            @Override
            public boolean onKey(android.content.DialogInterface dialog, int keyCode, KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_UP) {
                    Log.d("BOTTOM SHEET", "Back button pressed inside BottomSheetDialog!");
                    EventBus.getDefault().postSticky(new FlowBottomSheet());
                    dismiss();
                    return true;
                }
                return false; // Let the system handle other keys
            }
        });

        return bottomSheet;
    }


    @Override
    public void callReuest() {

    }

    @Override
    public void ClearServiceFragment() {

    }

    @Override
    public void CallsummaryFragment() {

    }

    @Override
    public void CallEstimationfare() {

    }


    @Override
    public void FareDetailFragment(List<ServiceModel> serviceModels) {

    }

    @Override
    public void FlowDetails(Response<TripFlowModel> Response) {

    }

    @Override
    public void SelectedCategory(ServiceModel.VehicleCategory ServiceType) {
        EventBus.getDefault().postSticky(new CategoryPassing("Service"));
    }

    @Override
    public void availablestatus(String availablestatus) {
        EventBus.getDefault().postSticky(new CategoryPassing("AvailableStatus"));
    }

}
