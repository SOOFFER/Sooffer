package com.soofer.app.Retrofit;

import android.annotation.SuppressLint;

import com.jakewharton.retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;
import com.soofer.app.Appcontroller.Appcontroller;
import com.soofer.app.CommonClass.SharedHelper;

import java.security.cert.CertificateException;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitGenerator {
  public static String BaseUrl = "http://18.220.141.188:3001/api/";
  //  public static String BaseUrl = "https://6c5h4qpx-3001.inc1.devtunnels.ms/api/";
    public static String imagepath = "http://18.220.141.188:3001/";
    public static String shareLink = "http://18.220.141.188:3001/public/";

    public static Retrofit retrofit = null;

    public Retrofit getRetrofitUrl() {
        retrofit = new Retrofit.Builder()
                .baseUrl(BaseUrl)
                .addConverterFactory(GsonConverterFactory.create())
                .client(getUnsafeOkHttpClient().build())
                .build();
        return retrofit;
    }


    public Retrofit getRxJavaRetrofit() {
        retrofit = new Retrofit.Builder()
                .baseUrl("https://maps.googleapis.com/maps/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .client(getUnsafeOkHttpClient().build())
                .build();
        return retrofit;
    }
    public static Retrofit getRxBaseService() {
        return new Retrofit.Builder()
                .baseUrl(BaseUrl)
                .addConverterFactory(GsonConverterFactory.create())
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .client(getUnsafeOkHttpClient().build())
                .build();
    }

    public static ApiInterface apiInterface(){
        return  new RetrofitGenerator().getRxBaseService().create(ApiInterface.class);
    }
    public static OkHttpClient.Builder getUnsafeOkHttpClient() {
        try {
            // Create a trust manager that does not validate certificate chains
            final TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        @SuppressLint("TrustAllX509TrustManager")
                        @Override
                        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
                        }
                        @SuppressLint("TrustAllX509TrustManager")
                        @Override
                        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
                        }
                        @Override
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return new java.security.cert.X509Certificate[]{};
                        }
                    }
            };
            Interceptor interceptor = chain -> {
                Request newRequest = chain.request().newBuilder().addHeader("authorization", "1d0311a08594a9ab52740a7403b6330541a8b9bd")
                        .addHeader("accept-language", SharedHelper.getToken(Appcontroller.getContexts(),"lang"))
                        .build();
                // try the request
                /* int tryCount = 0;
                while (!response.isSuccessful() && tryCount < 3&& response.code()==500) {
                    Log.d("intercept", "Request is not successful - " + tryCount);
                    tryCount++;
                    // retry the request
                    response = chain.proceed(newRequest);
                }*/
                return chain.proceed(newRequest);
            };
            // Install the all-trusting trust manager
            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
            // Create an ssl socket factory with our all-trusting manager
            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();
            OkHttpClient.Builder builder = new OkHttpClient.Builder();
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);
            builder.addInterceptor(logging);
            builder.addInterceptor(interceptor);
            builder.writeTimeout(60, TimeUnit.SECONDS);
            builder.connectTimeout(60, TimeUnit.SECONDS);
            builder.readTimeout(60, TimeUnit.SECONDS).build();
            builder.retryOnConnectionFailure(true);
            builder.sslSocketFactory(sslSocketFactory, (X509TrustManager) trustAllCerts[0]);
            builder.hostnameVerifier((hostname, session) -> true);
            return builder;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
