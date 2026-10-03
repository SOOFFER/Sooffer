package com.soofer.app.Retrofit;

import com.soofer.app.GooglePlace.GooglePlcaeModel.GeocoderModel;
import com.soofer.app.GooglePlace.GooglePlcaeModel.PlacesResults;
import com.soofer.app.GooglePlace.ReverseGeoCoderModel.ReverseGeocoderModel;
import com.soofer.app.Model.AddContactModel;
import com.soofer.app.Model.AddWalletModel;
import com.soofer.app.Model.AllwalletTransactionmodel;
import com.soofer.app.Model.CabListModel;
import com.soofer.app.Model.CancelRequestModel;
import com.soofer.app.Model.CancelTripModel;
import com.soofer.app.Model.CardDeliveryModel;
import com.soofer.app.Model.ChangePasswordModel;
import com.soofer.app.Model.ContactlistModel;
import com.soofer.app.Model.DeleteContactModel;
import com.soofer.app.Model.EditProfileModel;
import com.soofer.app.Model.EstimationModel;
import com.soofer.app.Model.FaqModel;
import com.soofer.app.Model.FaqcategoryModel;
import com.soofer.app.Model.FavoriteAddressModel;
import com.soofer.app.Model.FeedbackModel;
import com.soofer.app.Model.ForgetPasswordModel;
import com.soofer.app.Model.LanguageCurrencyModel;
import com.soofer.app.Model.LoginModel;
import com.soofer.app.Model.NotificationModel;
import com.soofer.app.Model.OTPModel;
import com.soofer.app.Model.OTPVerificationModel;
import com.soofer.app.Model.OfferModel;
import com.soofer.app.Model.OutStationModel;
import com.soofer.app.Model.PackageListModel;
import com.soofer.app.Model.ProfileModel;
import com.soofer.app.Model.PromoCodeModel;
import com.soofer.app.Model.RegisterModel;
import com.soofer.app.Model.RemoveCardModel;
import com.soofer.app.Model.RequestModel;
import com.soofer.app.Model.RoutesModel;
import com.soofer.app.Model.ScheduleCancelModel;
import com.soofer.app.Model.ScheduleTripModel;
import com.soofer.app.Model.ServiceModel;
import com.soofer.app.Model.TripDetailsModel;
import com.soofer.app.Model.TripFlowModel;
import com.soofer.app.Model.TripHistoryModel;
import com.soofer.app.Model.WalletBalanceModel;
import com.soofer.app.Model.WalletTransactionCreditModel;
import com.soofer.app.Model.scheduleTripListModel;

import java.util.HashMap;
import java.util.List;

import io.reactivex.Flowable;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FieldMap;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.HTTP;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.PartMap;
import retrofit2.http.Path;
import retrofit2.http.Query;
import retrofit2.http.QueryMap;

public interface ApiInterface {

    @GET("commondata")
    Call<List<LanguageCurrencyModel>> getCountryandLanguage();

    @FormUrlEncoded
    @POST("riders")
    Call<RegisterModel> getRegister(@FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("riderslogin")
    Call<LoginModel> getLogin(@FieldMap HashMap<String, String> data);

    @GET("/maps/api/place/autocomplete/json")
    Call<PlacesResults> getCityResults(@Query("input") String input, @Query("location") String location, @Query("radius") String radius, @Query("key") String key, @Query("components") String components,@Query("sessiontoken") String sessiontoken,@Header("X-Android-Package") String name, @Header("X-Android-Cert") String SHA1KEy);

    @GET("/maps/api/directions/json")
    Call<RoutesModel> drawPolyline(@Query("origin") String pickupLocation, @Query("destination") String dropLocation, @Query("key") String key, @Query("waypoints") String waypoints, @Query("components") String components, @Query("sessiontoken") String sessiontoken, @Header("X-Android-Package") String name, @Header("X-Android-Cert") String SHA1KEy);

    @GET("geocode/json")
    Call<ReverseGeocoderModel> getReverserGecoder(@Query("address") String Address, @Query("key") String key,@Query("components") String components,@Query("sessiontoken") String sessiontoken,@Header("X-Android-Package") String name, @Header("X-Android-Cert") String SHA1KEy);

    @GET("geocode/json")
    Flowable<GeocoderModel> getAddressFromLocation(@Query("latlng") String latlng, @Query("key") String key,@Query("components") String components,@Query("sessiontoken") String sessiontoken,@Header("X-Android-Package") String name, @Header("X-Android-Cert") String SHA1KEy);

    @GET("rider")
    Call<List<ProfileModel>> getProfile(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @PUT("riderpwd")
    Call<ChangePasswordModel> ChangePassword(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @Multipart
    @PUT("rider")
    Call<EditProfileModel> getUpdateProfile(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> data, @Part MultipartBody.Part filePart);

    @GET("rideremgcontact")
    Call<List<ContactlistModel>> getContactList(@Header("x-access-token") String Access_token);

    @HTTP(method = "DELETE", path = "rideremgcontact", hasBody = true)
    Call<DeleteContactModel> getDeleteContact(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);

    @FormUrlEncoded
    @POST("rideremgcontact")
    Call<AddContactModel> getAddContact(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("serviceBasicFare")
    Call<ServiceModel> getServiceList(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @POST("sendchatFCM")
    Call<FeedbackModel> sendNotificationFCM(@Header("x-access-token") String Access_token, @Body com.soofer.app.Model.FirebaseModel.NotificationModel data);

    @POST("sendaphoneCall")
    Call<FeedbackModel> sendNotificationFCMCall(@Header("x-access-token") String Access_token, @Body com.soofer.app.Model.FirebaseModel.FCMPayloadModel data);

    @FormUrlEncoded
    @POST("estimationFare")
    Call<EstimationModel> getEstimationFare(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("requestTaxi")
    Call<RequestModel> setRequestapi(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("requestRentalTaxi")
    Call<RequestModel> setRequestRental(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("requestOutstationTaxi")
    Call<RequestModel> setOutStationRequest(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("requestTaxi")
    Call<ScheduleTripModel> setScheduleRequestapi(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("cancelTaxi")
    Call<CancelRequestModel> CancelRequest(@Header("x-access-token") String Access_token, @Field("requestId") String request_id);

    @FormUrlEncoded
    @PUT("cancelCurrentTrip")
    Call<CancelTripModel> CancelTrip(@Header("x-access-token") String Access_token, @Field("tripId") String tripId, @Field("reason") String reason);

    @FormUrlEncoded
    @PUT("tripDriverDetails")
    Call<TripFlowModel> TripFlowApi(@Header("x-access-token") String Access_token, @Field("tripId") String tripId);

    @FormUrlEncoded
    @PUT("riderFeedback")
    Call<FeedbackModel> FeedBack(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("riderTripHistory")
    Call<List<TripHistoryModel>> getTripHistory(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("contactUs")
    Call<ResponseBody> sentAdminMessage(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @POST("logout")
    Call<ResponseBody> getFCM();


    @GET("logout")
    Call<ResponseBody> getLogout(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @POST("ridersAddress")
    Call<ResponseBody> UpdateFavoriteLocation(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("addCard")
    Call<ResponseBody> AddCard(@Header("x-access-token") String Access_token, @Field("cardToken") String data,@Field("lastNum") String lastNum);

    @FormUrlEncoded
    @POST("updateCardDetails")
    Call<ResponseBody> updateCard(@Header("x-access-token") String Access_token, @Field("PaymentMethodId") String paymentId,@Field("setupIntentId") String intentId,@Field("last4") String lastNum);

    @FormUrlEncoded
    @PUT("pastTripDetailRider")
    Call<TripDetailsModel> getTripDetails(@Header("x-access-token") String Access_token, @Field("tripId") String tripId);

    @GET("myWalletHistory")
    Call<AllwalletTransactionmodel> getAllwelletTrascation(@Header("x-access-token") String Access_token);

    @GET("myWallet")
    Call<WalletBalanceModel> getWalletBalance(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @PUT("addToMyWallet")
    Call<AddWalletModel> getAddwallet(@Header("x-access-token") String Access_token, @Field("id") String rechargeAmount);

    @GET("myWalletCreditHistory")
    Call<WalletTransactionCreditModel> getWalletCreditList(@Header("x-access-token") String Access_token);

    @GET("myWalletDebitHistory")
    Call<WalletTransactionCreditModel> getWalletDebitList(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @PUT("validatePromo")
    Call<PromoCodeModel> getpromoAmount(@Header("x-access-token") String Access_token, @FieldMap HashMap<String,String> map);

    @GET("riderUpcomingScheduleTaxi")
    Call<List<scheduleTripListModel>> getScheduleList(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @PUT("userCancelScheduleTaxi")
    Call<ScheduleCancelModel> getcancelShedule(@Header("x-access-token") String Access_token, @Field("requestId") String requestId);

    @FormUrlEncoded
    @POST("riderForgotPassword")
    Call<ForgetPasswordModel> getSendOPTChangesPaassword(@Header("x-access-token") String Access_token, @Field("email") String email);

    @PATCH("riderForgotPassword")
    Call<OTPVerificationModel> getChangePassword(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);


    @FormUrlEncoded
    @POST("verifyNumber")
    Call<OTPModel> getOpt(@Field("phone") String phone, @Field("email") String email, @Field("phcode") String phcode,@Field("otp") String otp,@Field("hashval") String hashval);

    @FormUrlEncoded
    @POST("ridersAddress")
    Call<FavoriteAddressModel> addAddress(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @HTTP(method = "DELETE", path = "ridersAddress/{id}", hasBody = true)
    Call<ResponseBody> getDeleteFavorite(@Header("x-access-token") String Access_token, @Path("id") String id);

    @FormUrlEncoded
    @PUT("stopRequestingTaxi")
    Call<ResponseBody> getStopProcessRequest(@Header("x-access-token") String Access_token, @Field("requestId") String requestId);

    @FormUrlEncoded
    @POST("offersList")
    Call<List<OfferModel>> getOffersApi(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, Double> data);

    @FormUrlEncoded
    @PUT("updateDropLocation")
    Call<ResponseBody> getupdatelocation(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("tripPaymentStatus")
    Call<FeedbackModel> getPaypalBuy(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("emergencyMsg")
    Call<FeedbackModel> getsentEmergency(@Header("x-access-token") String Access_token, @Field("trip_id") String trip_id);

    @FormUrlEncoded
    @POST("rental/packageList")
    Flowable<PackageListModel> getPackageList(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("rental/fareEstimation")
    Flowable<CabListModel> getSelectCabList(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("rental/outstationVehicleListWithFare")
    Flowable<OutStationModel> getOutstationEstimate(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("sendTripReceipt")
    Flowable<ResponseBody> getSendinVoiceEmail(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("tripRequestReceived")
    Flowable<ResponseBody> tripisReceivedApi(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("pushNotificationForRider")
    Flowable<List<NotificationModel>> getNotification(@Header("x-access-token") String Access_token, @QueryMap HashMap<String, String> data);

    @POST("deleteRiderCard")
    Call<RemoveCardModel> removeCard(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @POST("safeRide/ridertaxi")
    Call<CardDeliveryModel> submitCarDelivery(@Header("x-access-token") String token, @FieldMap HashMap<String, String> data);

    @PUT("addTips")
    Call<ResponseBody> getaddTips(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);

    @GET("faqcategory")
    Call<List<FaqcategoryModel>> getfaqcategory(@Header("x-access-token") String Access_token, @QueryMap HashMap<String, String> data);

    @GET("faq")
    Call<List<FaqModel>> getfaq(@Header("x-access-token") String Access_token, @QueryMap HashMap<String, String> data);
}
