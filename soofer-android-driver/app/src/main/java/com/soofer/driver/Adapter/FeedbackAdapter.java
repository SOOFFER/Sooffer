package com.soofer.driver.Adapter;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.FeedbackListdataModel;
import com.soofer.driver.R;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class FeedbackAdapter extends RecyclerView.Adapter<FeedbackAdapter.ViewHolder> {
    Activity context;
    List<FeedbackListdataModel> feedbacksmodel;
    String profile_url;

    public FeedbackAdapter(Activity context, List<FeedbackListdataModel> feedbacksmodel, String profile_url) {
        this.context = context;
        this.feedbacksmodel = feedbacksmodel;
        this.profile_url = profile_url;

    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.adapter_feedback, parent, false);
        FontChangeCrawler fontChangeCrawler = new FontChangeCrawler(context.getAssets(), context.getString(R.string.app_font));
        fontChangeCrawler.replaceFonts((ViewGroup) context.findViewById(android.R.id.content));
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        FeedbackListdataModel feedback = feedbacksmodel.get(position);
        try {
            Utiles.CircleImageView(profile_url + feedback.getUserpic(), holder.feedbackImage, context);
            holder.txtName.setText(feedback.getUserbaneme());
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (feedback.getComment()!=null) {
            holder.feedBackTxt.setText(feedback.getComment());
        }

    }

    @Override
    public int getItemCount() {
        return feedbacksmodel.size();
    }

    static

    public class ViewHolder extends RecyclerView.ViewHolder {
        @BindView(R.id.feedback_image)
        ImageView feedbackImage;
        @BindView(R.id.txt_name)
        TextView txtName;
        @BindView(R.id.feedBack_txt)
        TextView feedBackTxt;

        public ViewHolder(View view) {
            super(view);
            ButterKnife.bind(this, view);
        }
    }


}
