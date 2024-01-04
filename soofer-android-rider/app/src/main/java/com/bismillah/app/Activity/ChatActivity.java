package com.bismillah.app.Activity;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.RecyclerView;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.StrictMode;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.bismillah.app.Adapter.ChatAdapter;
import com.bismillah.app.CommonClass.Constants;
import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.Model.FirebaseModel.Chat;
import com.bismillah.app.R;

import org.json.JSONObject;

import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;

import static com.bismillah.app.CommonClass.Constants.API_URL_FCM;
import static com.bismillah.app.CommonClass.Constants.AUTH_KEY_FCM;

public class ChatActivity extends AppCompatActivity implements ChildEventListener, View.OnClickListener {

    @BindView(R.id.recyMessage)
    RecyclerView recyMessage;
    @BindView(R.id.edtMessage)
    EditText edtMessage;
    @BindView(R.id.imgSend)
    ImageView imgSend;
    @BindView(R.id.chatLayout)
    RelativeLayout chatLayout;

    DatabaseReference chatRef;
    List<Chat> chatLists = new ArrayList<>();
    ChatAdapter chatAdapter;
    String strTripID = "";
    @BindView(R.id.toolbar)
    Toolbar toolbar;
    Activity activity =this;


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        ButterKnife.bind(this);
        strTripID = SharedHelper.getKey(this, "trip_id");
        chatRef = FirebaseDatabase.getInstance().getReference().child("ChatRoom").child(strTripID);
        chatRef.addChildEventListener(this);
        imgSend.setOnClickListener(this);
        toolbar.setNavigationOnClickListener(v -> onBackPressed());
    }


    @Override
    public void onChildAdded(DataSnapshot dataSnapshot, String s) {
        Chat chat = dataSnapshot.getValue(Chat.class);
        chatLists.add(chat);
        Objects.requireNonNull(recyMessage.getLayoutManager()).scrollToPosition(chatLists.size() - 1);
        if (chatLists.size()!=0){
            chatAdapter = new ChatAdapter(ChatActivity.this, dataSnapshot.getChildrenCount(), chatLists);
            recyMessage.setAdapter(chatAdapter);
        }
    }

    @Override
    public void onChildChanged(@NonNull DataSnapshot dataSnapshot, String s) {

    }

    @Override
    public void onChildRemoved(@NonNull DataSnapshot dataSnapshot) {

    }

    @Override
    public void onChildMoved(@NonNull DataSnapshot dataSnapshot, String s) {

    }

    @Override
    public void onCancelled(@NonNull DatabaseError databaseError) {

    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.imgSend) {
            chatRef.push().setValue(new Chat("Mr.Rider", edtMessage.getText().toString(), "rider"));
            AsyncTask.execute(() -> {
                try {
                    pushFCMNotification(edtMessage.getText().toString());
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("enter the fcm exception" + e);
                }
            });
           edtMessage.setText("");
        }
    }

    public  void pushFCMNotification(String Message) throws Exception {
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        URL url = new URL(API_URL_FCM);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setUseCaches(false);
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "key=" + AUTH_KEY_FCM);
        conn.setRequestProperty("Content-Type", "application/json");
        JSONObject json = new JSONObject();
        json.put("to", Constants.strDriver);
        JSONObject info = new JSONObject();
        info.put("message", Message);
        info.put("alert", Message);
        info.put("click_action", "open_chat"); // Notification body
        info.put("alert", activity.getResources().getString(R.string.app_superbname));
        info.put("body", Message);
        json.put("data", info);
        json.put("aps", info);
        json.put("notification", info);
        OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
        wr.write(json.toString());
        wr.flush();
        conn.getInputStream();
    }
}
