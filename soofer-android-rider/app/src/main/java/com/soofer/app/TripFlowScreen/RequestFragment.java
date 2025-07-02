package com.soofer.app.TripFlowScreen;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;

import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.CancelRequestModel;
import com.soofer.app.Presenter.CancelRequestPresenter;

import com.soofer.app.R;
import com.soofer.app.View.RequestView;

import com.soofer.app.CommonClass.Constants;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import retrofit2.Response;

import static com.soofer.app.CommonClass.Utiles.clearInstance;


public class RequestFragment extends BaseFragment implements RequestView {
    CallRequest callRequest;

    @BindView(R.id.foundDevice)
    ImageView foundDevice;

    @BindView(R.id.close_btn)
    ImageButton closeBtn;
    Unbinder unbinder;
   // AnimatorSet animatorSet;

    Activity activity;
    Context context;

    public RequestFragment() {
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_tripflow, container, false);
        unbinder = ButterKnife.bind(this, view);


        activity = getActivity();
        context = getContext();


        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        unbinder.unbind();
    }

    @OnClick(R.id.close_btn)
    public void onViewClicked() {
        System.out.println("enter the cancel the taxi" + CommonData.strRequestId);
        CancelRequestPresenter cancelRequestPresenter = new CancelRequestPresenter(this);
        cancelRequestPresenter.cancelRequestApi(CommonData.strRequestId, activity);
    }


    @Override
    public void onDestroy() {
        super.onDestroy();

    }


    @Override
    public void onSuccess(Response<CancelRequestModel> Response) {
        assert Response.body() != null;
        Utiles.displayMessage(getView(), context, Response.body().getMessage());

        RemoveFragment();

    }

    @Override
    public void onFailure(Response<CancelRequestModel> Response) {
        Utiles.displayMessage(getView(), context, "Something Went Wrong");
    }

    public void RemoveFragment() {
        try {
            Constants.TripFlowFragmant = null;
            callRequest = (CallRequest) getActivity();
            callRequest.ClearServiceFragment();
            getFragmentManager().popBackStackImmediate();
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
    }

    @Override
    public void onStart() {
        super.onStart();

    }
}
