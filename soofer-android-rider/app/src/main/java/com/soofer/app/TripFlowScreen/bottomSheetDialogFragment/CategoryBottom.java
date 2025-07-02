package com.soofer.app.TripFlowScreen.bottomSheetDialogFragment;

import android.app.Dialog;
import android.content.res.TypedArray;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.databinding.DataBindingUtil;

import com.soofer.app.Adapter.ServiceAdapter;
import com.soofer.app.EventBus.CategoryPassing;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.ServiceModel;
import com.soofer.app.Model.TripFlowModel;
import com.soofer.app.R;
import com.soofer.app.TripFlowScreen.RedEstimateFragment;
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
    RedEstimateFragment ServiceFagment;

    public CategoryBottom(List<ServiceModel.VehicleCategory> servieModel) {
        this.servieModel = servieModel;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        BottomSheetDialog bottomSheet = (BottomSheetDialog) super.onCreateDialog(savedInstanceState);

        //inflating layout
        View view = View.inflate(getContext(), R.layout.bottomsheet_category, null);

        //binding views to data binding.
        bi = DataBindingUtil.bind(view);

        showView(bi.appBarLayout, getActionBarSize());

        //setting layout with bottom sheet
        bottomSheet.setContentView(view);
        bottomSheetBehavior = BottomSheetBehavior.from((View) (view.getParent()));

        //setting Peek at the 16:9 ratio keyline of its parent.
        bottomSheetBehavior.setPeekHeight(BottomSheetBehavior.PEEK_HEIGHT_AUTO);


        if (servieModel != null && !servieModel.isEmpty()) {
            if (serviceAdapter == null) {
                serviceAdapter = new ServiceAdapter(requireActivity(), servieModel, this);
                bi.recylerCartype.setAdapter(serviceAdapter);
            } else {
                serviceAdapter.notifyDataSetChanged();
            }

        }


        bottomSheetBehavior.setBottomSheetCallback(new BottomSheetBehavior.BottomSheetCallback() {
            @Override
            public void onStateChanged(@NonNull View view, int i) {
                if (BottomSheetBehavior.STATE_EXPANDED == i) {
                    showView(bi.appBarLayout, getActionBarSize());
                }
                if (BottomSheetBehavior.STATE_COLLAPSED == i) {
                    hideAppBar(bi.appBarLayout);
                }
                if (BottomSheetBehavior.STATE_HIDDEN == i) {
                    dismiss();
                }

            }

            @Override
            public void onSlide(@NonNull View view, float v) {

            }
        });

        return bottomSheet;
    }

    @Override
    public void onStart() {
        super.onStart();

        bottomSheetBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
    }

    private void hideAppBar(View view) {
        ViewGroup.LayoutParams params = view.getLayoutParams();
        params.height = 0;
        view.setLayoutParams(params);

    }

    private void showView(View view, int size) {
        ViewGroup.LayoutParams params = view.getLayoutParams();
        params.height = size;
        view.setLayoutParams(params);
    }

    private int getActionBarSize() {
        final TypedArray array = getContext().getTheme().obtainStyledAttributes(new int[]{android.R.attr.actionBarSize});
        int size = (int) array.getDimension(0, 0);
        return size;
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
    public void Ridelater() {

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
        System.out.println("Call this");
    }

    @Override
    public void availablestatus(String availablestatus) {
        EventBus.getDefault().postSticky(new CategoryPassing("AvailableStatus"));
    }


}
