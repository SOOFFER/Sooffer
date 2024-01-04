package com.bismillah.driver.Fragment;


import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bismillah.driver.Adapter.FeedbackAdapter;
import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.Model.FeedbackListdataModel;
import com.bismillah.driver.Presenter.FeedBAckListPresenter;
import com.bismillah.driver.R;
import com.bismillah.driver.View.FeedBackView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import okhttp3.ResponseBody;
import retrofit2.Response;

public class FeedbackFragment extends BaseFragment implements FeedBackView {

    @BindView(R.id.rcyl_feedback)
    RecyclerView rcylFeedback;
    Unbinder unbinder;
    Context context;
    Activity activity;
    @BindView(R.id.back_img)
    ImageView backImg;
    private List<FeedbackListdataModel> feedbacksmodel = new ArrayList<>();
    private String Profile_url;
    @BindView(R.id.nodata_txt)
    TextView nodataTxt;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_feedback, null, false);
        unbinder = ButterKnife.bind(this, view);

        context = getActivity();
        activity = getActivity();

        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(Objects.requireNonNull(getActivity()).getAssets(), getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) getActivity().findViewById(android.R.id.content));
        FeedBAckListPresenter feedBackPresenter = new FeedBAckListPresenter(this);
        feedBackPresenter.getFeedback(activity);


        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick(R.id.back_img)
    public void onViewClicked() {
        getFragmentManager().popBackStackImmediate();
    }

    public void setAdapter() {
        if (feedbacksmodel != null && !feedbacksmodel.isEmpty()) {
            LinearLayoutManager layoutManagershops
                    = new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false);
            rcylFeedback.setLayoutManager(layoutManagershops);
            FeedbackAdapter adapter = new FeedbackAdapter(activity, feedbacksmodel, Profile_url);
            rcylFeedback.setAdapter(adapter);
            nodataTxt.setVisibility(View.GONE);
            rcylFeedback.setVisibility(View.VISIBLE);
        } else {
            nodataTxt.setVisibility(View.VISIBLE);
            rcylFeedback.setVisibility(View.GONE);
        }


    }

    @Override
    public void onSuccess(Response<ResponseBody> Response) {

        try {
            String jsondata = null;
            jsondata = Response.body().string();
            JSONObject jsonObject = new JSONObject(jsondata);
            Profile_url = jsonObject.optString("profileurl");
            for (int i = 0; i < jsonObject.optJSONArray("feedbacks").length(); i++) {
                JSONObject commen = jsonObject.optJSONArray("feedbacks").optJSONObject(i);
                FeedbackListdataModel feedbackListdataModel = new FeedbackListdataModel();
                if (commen.optJSONObject("riderfb") != null) {
                    feedbackListdataModel.setComment(commen.optJSONObject("riderfb").optString("cmts"));
                }
                if (commen.optJSONObject("userinfo") != null) {
                    feedbackListdataModel.setUserbaneme(commen.optJSONObject("userinfo").optString("fname"));
                    feedbackListdataModel.setUserpic(commen.optJSONObject("userinfo").optString("profile"));
                }

                feedbacksmodel.add(feedbackListdataModel);
            }

        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }


        setAdapter();
    }

    @Override
    public void onFailure(Response<ResponseBody> Response) {
        try {
            String Message = Response.errorBody().string();
            Utiles.ShowError(Message,activity,getView());
        } catch (IOException e) {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
    }
}
