package com.bismillah.driver.Fragment;


import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import androidx.fragment.app.Fragment;

import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.R;
import com.iriis.libzoomableimageview.ZoomableImageView;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Optional;
import butterknife.Unbinder;

/**
 * A simple {@link Fragment} subclass.
 */
public class ZoomImageFragment extends BaseFragment {


    @BindView(R.id.back_img)
    ImageView backImg;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.iv_zoomable)
    ZoomableImageView ivZoomable;
    private Unbinder unbinder;
    private String imagePath;

    public ZoomImageFragment(String imagePath) {
        // Required empty public constructor
        this.imagePath = imagePath;
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_zoom_image, container, false);
        unbinder = ButterKnife.bind(this, view);
        ivZoomable.setPath(imagePath);
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
    @Optional
    @OnClick(R.id.back_img)
    public void onViewClicked() {
        assert getFragmentManager() != null;
        getFragmentManager().popBackStackImmediate();
    }
}
