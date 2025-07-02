package com.soofer.driver.Fragment;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;

import androidx.cardview.widget.CardView;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.Adapter.FaqCategoryAdapter;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.FaqcategoryModel;
import com.soofer.driver.Presenter.FaqcategoryPresenter;
import com.soofer.driver.R;

import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import retrofit2.Response;


public class FaqFragment extends BaseFragment implements FaqcategoryPresenter.faqcategoryView , FaqCategoryAdapter.Categorydetails{


    @BindView(R.id.back_img)
    ImageButton backImg;


    @BindView(R.id.category_recycleview)
    RecyclerView category_recycleview;
    Unbinder unbinder;
    Fragment fragment;

    FaqcategoryPresenter faqcategoryPresenter;

    private List<FaqcategoryModel> faqcategoryModels;
    public FaqFragment() {
        // Required empty public constructor
    }

    Context context;
    private CompositeDisposable disposable;

    FaqCategoryAdapter faqCategoryAdapter;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    Activity activity;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_faq, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts((ViewGroup) activity.findViewById(android.R.id.content));
        disposable = new CompositeDisposable();
        faqcategoryPresenter = new FaqcategoryPresenter(activity, disposable, this);
        getdata();
        return view;
    }

    private void getdata() {
        HashMap<String, String> map = new HashMap<>();
        map.put("Language", "en");
        faqcategoryPresenter.getFaqcategory(map);
    }
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        Utiles.clearInstance();
        unbinder.unbind();
    }

    @OnClick({R.id.back_img,})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                getFragmentManager().popBackStackImmediate();
                break;


        }
    }

    public void FragmentCalling(Fragment fragment) {
        FragmentManager fragmentManager = getFragmentManager();
        assert fragmentManager != null;
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.containter_faq, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
    }


    @Override
    public void onSuccess(Response<List<FaqcategoryModel>> Response) {
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.VERTICAL, false);
        category_recycleview.setLayoutManager(linearLayoutManager);
        faqcategoryModels = Response.body();
        faqCategoryAdapter = new FaqCategoryAdapter(activity,faqcategoryModels,this);
        category_recycleview.setAdapter(faqCategoryAdapter);
    }

    @Override
    public void onFailure(Response<List<FaqcategoryModel>> Response) {

    }

    @Override
    public void category(String data) {

        System.out.println("id_data..."+data);

        fragment = new CommonFaqFragment(data);
        FragmentCalling(fragment);
    }
}
