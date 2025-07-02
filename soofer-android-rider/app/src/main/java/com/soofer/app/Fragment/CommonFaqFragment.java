package com.soofer.app.Fragment;

import android.app.Activity;
import android.os.Bundle;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.soofer.app.Adapter.FaqAdapter;
import com.soofer.app.Adapter.FaqCategoryAdapter;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.FontChangeCrawler;

import com.soofer.app.Model.FaqModel;
import com.soofer.app.Presenter.FaqPresenter;
import com.soofer.app.Presenter.FaqcategoryPresenter;
import com.soofer.app.R;

import com.soofer.app.CommonClass.Utiles;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.disposables.CompositeDisposable;
import retrofit2.Response;


public class CommonFaqFragment extends BaseFragment implements FaqPresenter.faqView{


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.title_txt)
    TextView titleTxt;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.header_txt)
    TextView headerTxt;
    @BindView(R.id.down_up_img)
    ImageButton downUpImg;
    @BindView(R.id.discreption_txt)
    TextView discreptionTxt;
    @BindView(R.id.how_to_card)
    CardView howToCard;
    Unbinder unbinder;

    Boolean CLickCheck = true;
    @BindView(R.id.fragment_ments)
    FrameLayout fragmentMents;

    @BindView(R.id.faq_recycleview)
    RecyclerView recyclerView;

    FaqPresenter faqPresenter;

    FaqAdapter faqAdapter;

    List<FaqModel> faqModel;

    String _id;
    private CompositeDisposable disposable;
    public CommonFaqFragment(String id) {
        // Required empty public constructor
        this._id = id;
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Activity activity;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_common_faq, container, false);
        unbinder = ButterKnife.bind(this, view);
        titleTxt.setText(CommonData.strTitle);
        headerTxt.setText(CommonData.strHeaderTitle);
        discreptionTxt.setText(CommonData.strdiscription);
        activity = getActivity();
        faqPresenter = new FaqPresenter(activity, disposable, this);
        getdata();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        return view;
    }

    private void getdata() {
        HashMap<String, String> map = new HashMap<>();
        map.put("Language", "en");
        faqPresenter.getFaq(map);
    }
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img, R.id.down_up_img})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;
            case R.id.down_up_img:
                if (CLickCheck) {
                    CLickCheck = false;
                    downUpImg.setImageResource(R.drawable.ic_upword);
                    discreptionTxt.setVisibility(View.VISIBLE);
                } else {
                    CLickCheck = true;
                    downUpImg.setImageResource(R.drawable.ic_down_arrow);
                    discreptionTxt.setVisibility(View.GONE);
                }
                break;
        }
    }

    @OnClick(R.id.fragment_ments)
    public void onViewClicked() {
    }

    @Override
    public void onSuccess(Response<List<FaqModel>> Response) {
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false);
        recyclerView.setLayoutManager(linearLayoutManager);
        faqModel = Response.body();
        List<FaqModel> faqModel1 =  new ArrayList<>();
        for (int i = 0; i < faqModel.size(); i++) {
            if (faqModel.get(i).getIfaqcategoryId().equals(_id)) {
                faqModel1.add(faqModel.get(i));

            }

        }
        System.out.println("alldetails..."+faqModel.size());
        faqAdapter = new FaqAdapter(activity,faqModel1);
        recyclerView.setAdapter(faqAdapter);
    }

    @Override
    public void onFailure(Response<List<FaqModel>> Response) {

    }
}
