package com.bismillah.driver.Activity;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.StrictMode;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.bismillah.driver.Adapter.ChatAdapter;
import com.bismillah.driver.CommonClass.Constants;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.Model.FirebaseModel.Chat;
import com.bismillah.driver.R;

import org.json.JSONObject;

import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;

import static com.bismillah.driver.CommonClass.Constants.AUTH_KEY_FCM;

public class ChatActivity extends AppCompatActivity implements ChildEventListener, View.OnClickListener {


    @BindView(R.id.recyMessage)
    RecyclerView recyMessage;
    @BindView(R.id.edtMessage)
    EditText edtMessage;
    @BindView(R.id.imgSend)
    ImageView imgSend;
    @BindView(R.id.chatLayout)
    RelativeLayout chatLayout;
    @BindView(R.id.toolbar)
    Toolbar toolbar;
    String Message;

    private FirebaseDatabase database;
    private DatabaseReference chatRef;
    List<Chat> chatLists = new ArrayList<>();
    ChatAdapter chatAdapter;
    String strTripID = "";
    private Activity activity;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        ButterKnife.bind(this);
        activity = this;
        strTripID = SharedHelper.getKey(this, "trip_id");
        chatRef = FirebaseDatabase.getInstance().getReference().child("ChatRoom").child(strTripID);
        chatRef.addChildEventListener(this);
        Message = edtMessage.getText().toString();
        imgSend.setOnClickListener(this);
        toolbar.setOnClickListener(it->{
            onBackPressed();
        });

    }


    @Override
    public void onChildAdded(DataSnapshot dataSnapshot, String s) {
        Chat chat = dataSnapshot.getValue(Chat.class);
        chatLists.add(chat);
        Objects.requireNonNull(recyMessage.getLayoutManager()).scrollToPosition(chatLists.size() - 1);
        chatAdapter = new ChatAdapter(ChatActivity.this, dataSnapshot.getChildrenCount(), chatLists);
        recyMessage.setAdapter(chatAdapter);
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
            chatRef.push().setValue(new Chat("Valentino Rossi", edtMessage.getText().toString(), "driver"));
            AsyncTask.execute(() -> {
                try {
                    pushFCMNotification(edtMessage.getText().toString());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
            edtMessage.setText("");
        }
    }

    public void pushFCMNotification(String Message) throws Exception {
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        URL url = new URL(Constants.API_URL_FCM);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setUseCaches(false);
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "key=" + AUTH_KEY_FCM);
        System.out.println("aaa "+AUTH_KEY_FCM);
        conn.setRequestProperty("Content-Type", "application/json");
        JSONObject json = new JSONObject();
        json.put("to", Constants.strRideToken);
        System.out.println("aaa "+Constants.strRideToken);
        JSONObject info = new JSONObject();
        info.put("message", Message);
        info.put("alert", Message);
        info.put("click_action", "open_chat"); // Notification body
        info.put("alert", activity.getString(R.string.app_super_name));
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

