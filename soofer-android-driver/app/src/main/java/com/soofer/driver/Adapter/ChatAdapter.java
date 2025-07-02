package com.soofer.driver.Adapter;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.Model.FirebaseModel.Chat;
import com.soofer.driver.R;

import org.jetbrains.annotations.NotNull;

import java.util.List;

public class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.MyViewHolder> {

    private Context context;
    private List<Chat> chatLists;
    private long count;

    public ChatAdapter(Activity activity, long childrenCount, List<Chat> chatLists) {
        this.context = activity;
        this.chatLists = chatLists;
        this.count = childrenCount;
    }

    @NotNull
    @Override
    public MyViewHolder onCreateViewHolder(@NotNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.chat_adapter, null, false);
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NotNull MyViewHolder holder, int position) {

        if (chatLists.get(position).getType().equalsIgnoreCase("driver")) {
            holder.lytMsgReceive.setVisibility(View.GONE);
            holder.txtMsgSend.setText(Utiles.Nullpointer(chatLists.get(position).getMessage()));
        } else {
            holder.lytMsgSend.setVisibility(View.GONE);
            holder.txtMsgReceive.setText(Utiles.Nullpointer(chatLists.get(position).getMessage()));
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @Override
    public int getItemCount() {
        return chatLists.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {

        RelativeLayout lytMsgReceive, lytMsgSend;
        TextView txtMsgReceive, txtMsgSend;

        public MyViewHolder(View itemView) {
            super(itemView);
            lytMsgReceive = itemView.findViewById(R.id.lytMsgReceive);
            lytMsgSend = itemView.findViewById(R.id.lytMsgSend);
            txtMsgReceive = itemView.findViewById(R.id.txtMsgReceive);
            txtMsgSend = itemView.findViewById(R.id.txtMsgSend);
        }
    }
}


