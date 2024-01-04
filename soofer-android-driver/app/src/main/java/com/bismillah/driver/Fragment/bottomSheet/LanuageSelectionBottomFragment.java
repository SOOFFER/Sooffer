package com.bismillah.driver.Fragment.bottomSheet;

import android.app.Activity;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.bismillah.driver.Adapter.LanuageAdapter;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.FlowInterface.CommonInterface;
import com.bismillah.driver.R;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;


/**
 * A simple {@link Fragment} subclass.
 */
public class LanuageSelectionBottomFragment extends BottomSheetDialogFragment implements CommonInterface {

    @BindView(R.id.language_recycleview)
    RecyclerView languageRecycleview;

   private Unbinder unbinder;
    private List<String> language = new ArrayList<>();
   private Activity activity;
   private CommonInterface commonInterface;
    public LanuageSelectionBottomFragment(CommonInterface commonInterface) {
        // Required empty public constructor
        this.commonInterface =commonInterface;
    }

    private String strLanguage = "English";
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setStyle(DialogFragment.STYLE_NO_FRAME, R.style.AppTheme);

    }
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        Dialog dialog = super.onCreateDialog(savedInstanceState);
        dialog.getWindow().requestFeature(Window.FEATURE_NO_TITLE);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

        return dialog;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_lanuage_selection_bottom, container, false);
        unbinder = ButterKnife.bind(this, view);
        language.add("Tamil");
        language.add("Hindi");
        language.add("English");
        activity = getActivity();
        if(!SharedHelper.getKey(activity,"language").isEmpty()){
            strLanguage = SharedHelper.getKey(activity,"language");
        }
        LanuageAdapter adapter = new LanuageAdapter(activity, language, this, strLanguage);
        languageRecycleview.setAdapter(adapter);

        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        try {
            unbinder.unbind();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onCallback(Object value) {
        if (value instanceof Integer) {
            switch (language.get((Integer) value)) {
                case "Tamil":
                    SharedHelper.putKey(activity,"lang","ta");
                    break;
                case "Hindi":
                    SharedHelper.putKey(activity,"lang","hi");
                    break;
                case "English":
                    SharedHelper.putKey(activity,"lang","en");
                    break;
            }
            SharedHelper.putKey(activity,"language",language.get((Integer) value));
        }
        commonInterface.onCallback("");
        dismiss();
    }
}
