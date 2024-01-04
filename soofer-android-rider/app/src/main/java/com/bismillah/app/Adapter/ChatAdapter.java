package com.bismillah.app.Adapter;

import android.app.Activity;
import android.content.Context;
import android.os.Build;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;


import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.recyclerview.widget.RecyclerView;

import com.bismillah.app.Model.FirebaseModel.Chat;
import com.bismillah.app.R;

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

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.chat_adapter, null, false);
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {

        if (chatLists.size()!=0){

            if (chatLists.get(position).getType().equalsIgnoreCase("rider")) {
                holder.lytMsgReceive.setVisibility(View.GONE);
                holder.txtMsgSend.setText(chatLists.get(position).getMessage());
            } else {
                holder.lytMsgSend.setVisibility(View.GONE);
                holder.txtMsgReceive.setText(chatLists.get(position).getMessage());
            }
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
