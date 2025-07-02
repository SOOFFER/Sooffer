package com.soofer.driver.Retrofit;


import com.soofer.driver.GooglePlace.GooglePlcaeModel.GeocoderModel;
import com.soofer.driver.GooglePlace.GooglePlcaeModel.PlacesResults;
import com.soofer.driver.GooglePlace.ReverseGeoCoderModel.ReverseGeocoderModel;
import com.soofer.driver.Model.AcceptRequestModel;
import com.soofer.driver.Model.AddBankModel;
import com.soofer.driver.Model.AddVehicleDocModel;
import com.soofer.driver.Model.AddVehicleModel;
import com.soofer.driver.Model.AttendanceModel;
import com.soofer.driver.Model.BankDetailsModel;
import com.soofer.driver.Model.CancelTripModel;
import com.soofer.driver.Model.CarModel;
import com.soofer.driver.Model.ChangePasswordModel;
import com.soofer.driver.Model.CityModel;
import com.soofer.driver.Model.ConfirmaPaymentModel;
import com.soofer.driver.Model.CountryModel;
import com.soofer.driver.Model.CreateOrderModel;
import com.soofer.driver.Model.DeleteVehicle;
import com.soofer.driver.Model.DiclineRequest;
import com.soofer.driver.Model.DocumentModel;
import com.soofer.driver.Model.DocumentUploadModel;
import com.soofer.driver.Model.DriverDocumentModel;
import com.soofer.driver.Model.DriverProfileModel;
import com.soofer.driver.Model.EarningModel;
import com.soofer.driver.Model.EarningsModel;
import com.soofer.driver.Model.EstimationModel;
import com.soofer.driver.Model.FaqModel;
import com.soofer.driver.Model.FaqcategoryModel;
import com.soofer.driver.Model.FeedbackModel;
import com.soofer.driver.Model.ForgetPasswordModel;
import com.soofer.driver.Model.ImageUploadModel;
import com.soofer.driver.Model.LanguageCurrencyModel;
import com.soofer.driver.Model.ListVehicleModel;
import com.soofer.driver.Model.LoginModel;
import com.soofer.driver.Model.NotificationModel;
import com.soofer.driver.Model.OTPModel;
import com.soofer.driver.Model.OTPVerificationModel;
import com.soofer.driver.Model.OnlineOflline;
import com.soofer.driver.Model.PackageModel;
import com.soofer.driver.Model.PaymentModel;
import com.soofer.driver.Model.PayoutModel;
import com.soofer.driver.Model.Polygon.PolygonModel;
import com.soofer.driver.Model.RatingModel;
import com.soofer.driver.Model.RegisterModel;
import com.soofer.driver.Model.RemoveCardModel;
import com.soofer.driver.Model.RequestTexiHail;
import com.soofer.driver.Model.ScheduleCancelModel;
import com.soofer.driver.Model.SendPhoneModel;
import com.soofer.driver.Model.ServiceModel;
import com.soofer.driver.Model.StateModel;
import com.soofer.driver.Model.TripDetailsModel;
import com.soofer.driver.Model.TripFlowModel;
import com.soofer.driver.Model.TripHistoryModel;
import com.soofer.driver.Model.TwoDriverModel;
import com.soofer.driver.Model.UpdatProfileModel;
import com.soofer.driver.Model.UpdateLocationModel;
import com.soofer.driver.Model.UpdateVehicleModel;
import com.soofer.driver.Model.VehicleStateModel;
import com.soofer.driver.Model.WalletTransactionModel;
import com.soofer.driver.Model.scheduleTripListModel;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


import io.reactivex.rxjava3.core.Flowable;
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
    @POST("driver")
    Call<RegisterModel> getRegister(@FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("driverlogin")
    Call<LoginModel> getLogin(@FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("riderslogins")
    Call<PaymentModel> submitPayment(@FieldMap HashMap<String, String> data);

    @Multipart
    @POST("driverDocs")
    Call<DriverDocumentModel> DocumentUpload(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> data, @Part MultipartBody.Part filePart);

    @FormUrlEncoded
    @PUT("driverpwd")
    Call<ChangePasswordModel> ChangePassword(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("driver")
    Call<List<DriverProfileModel>> getProfile(@Header("x-access-token") String Access_token);

    @GET("carmakeandyear")
    Call<CarModel> getCarModel(@Header("x-access-token") String Access_token);

    @POST("sendchatFCM")
    Call<FeedbackModel> sendNotificationFCM(@Header("x-access-token") String Access_token, @Body com.soofer.driver.Model.FirebaseModel.NotificationModel data);

    @FormUrlEncoded
    @POST("drivertaxi")
    Call<AddVehicleModel> AddVehicle(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("drivertaxi")
    Call<AddVehicleModel> editVehicle(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("drivertaxi/{id}")
    Call<List<ListVehicleModel>> getVehicleList(@Header("x-access-token") String Access_token, @Path("id") String id);

    @HTTP(method = "DELETE", path = "drivertaxi", hasBody = true)
    Call<DeleteVehicle> DeleteVhicle(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);


    @Multipart
    @POST("driverTaxiDocs")
    Call<AddVehicleDocModel> uploadVehicledoc(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> map, @Part MultipartBody.Part filePart);


    @Multipart
    @PUT("driver")
    Call<UpdatProfileModel> updateProfile(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> data, @Part MultipartBody.Part filePart);

    @FormUrlEncoded
    @PUT("setOnlineStatus")
    Call<OnlineOflline> Onlineoffline(@Header("x-access-token") String Access_token, @Field("status") String status);


    @FormUrlEncoded
    @PUT("DriverLocation")
    Call<UpdateLocationModel> UpdateLocation(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("setCurrentTaxi")
    Call<UpdateVehicleModel> UpdateVehicle(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("declineRequest")
    Call<DiclineRequest> getDiclineRequest(@Header("x-access-token") String Access_token, @Field("requestId") String request_id);

    @FormUrlEncoded
    @PUT("acceptRequest")
    Call<AcceptRequestModel> getAcceptRequest(@Header("x-access-token") String Access_token, @Field("requestId") String request_id);

    @FormUrlEncoded
    @PUT("acceptScheduleRequest")
    Call<AcceptRequestModel> getScheduleAcceptRequest(@Header("x-access-token") String Access_token, @Field("requestId") String requestId, @Field("reqtripDT") String reqtripDT);

    @FormUrlEncoded
    @PUT("cancelTrip")
    Call<CancelTripModel> CancelTrip(@Header("x-access-token") String Access_token, @Field("tripId") String tripId, @Field("reason") String reason);

    @FormUrlEncoded
    @PUT("tripCurrentStatus")
    Call<TripFlowModel> TripFlowStatus(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @PUT("driverFeedback")
    Call<FeedbackModel> FeedBack(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("driverTripHistory")
    Call<List<TripHistoryModel>> getTripHistory(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @FormUrlEncoded
    @POST("driverEarningsBtDate")
    Call<List<EarningModel>> getEaringList(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("myRatings")
    Call<List<RatingModel>> getRating(@Header("x-access-token") String Access_token);

    @GET("feedbackLists")
    Call<ResponseBody> getFeedbackList(@Header("x-access-token") String Access_token);

    @POST("myEarnings")
    Call<EarningsModel> getEarings(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @PUT("pastTripDetail")
    Call<TripDetailsModel> getTripDetails(@Header("x-access-token") String Access_token, @Field("tripId") String tripId);

    @GET("driverUpcomingScheduleTaxi")
    Call<List<scheduleTripListModel>> getScheduleList(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @PUT("driverCancelScheduleTaxi")
    Call<ScheduleCancelModel> getcancelShedule(@Header("x-access-token") String Access_token, @Field("requestId") String requestId);

    @FormUrlEncoded
    @POST("createBankAccount")
    Call<AddBankModel> AddAndUpdateBank(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("driverBankDetails")
    Call<BankDetailsModel> getBankDetails(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @POST("driverForgotPassword")
    Call<ForgetPasswordModel> getSendOPTChangesPaassword(@Header("x-access-token") String Access_token, @Field("email") String email);

    @PATCH("driverForgotPassword")
    Call<OTPVerificationModel> getChangePassword(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);

    @GET("vehicletypelists")
    Flowable<ServiceModel> getServiceType(@Header("x-access-token") String Access_token);

    @GET("logout")
    Call<ResponseBody> getLogout(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @POST("verifyNumberDriver")
    Call<OTPModel> getOpt(@Field("phone") String phone, @Field("email") String email_id, @Field("phcode") String phcode, @Field("otp") String otp, @Field("hashval") String hashval);


    @GET("geocode/json")
    Flowable<GeocoderModel> getAddressFromLocation(@Query("latlng") String latlng, @Query("key") String key);

    @GET("getCityBoundaryPolygon/{City}")
    Flowable<PolygonModel> getCityPolygon(@Path("City") String City);

    @GET("getVehicleServiceAvailablity/{vehicle}")
    Flowable<List<VehicleStateModel>> getVehilceStateList(@Header("x-access-token") String Access_token, @Path("vehicle") String City);

    @PATCH("driverActiveTripType")
    Flowable<ForgetPasswordModel> getUpdateVehicle(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);

    @FormUrlEncoded
    @POST("activeTwoDriver")
    Call<TwoDriverModel> getTwodriver(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("driverWalletReport")
    Flowable<List<WalletTransactionModel>> getWalletTransactionHistory(@Header("x-access-token") String Access_token, @QueryMap HashMap<String, String> data);


    @FormUrlEncoded
    @POST("estimationFareForHailTaxi")
    Call<EstimationModel> getEstimateFare(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("/maps/api/place/autocomplete/json")
    Call<PlacesResults> getCityResults(@Query("input") String input, @Query("location") String location, @Query("radius") String radius, @Query("key") String key, @Query("components") String components, @Query("sessiontoken") String sessiontoken);

    @GET("geocode/json")
    Call<ReverseGeocoderModel> getReverserGecoder(@Query("address") String Address, @Query("key") String key);


    @FormUrlEncoded
    @POST("requestHailTaxi")
    Call<RequestTexiHail> getRequestHailTaxi(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> data);

    @GET("pushNotificationForDriver")
    Flowable<List<NotificationModel>> getNotification(@Header("x-access-token") String Access_token, @QueryMap HashMap<String, String> data);


    @GET("getpayPackage/")
    Flowable<PackageModel> getPackageList(@Header("x-access-token") String Access_token/*, @Path("service_Type") String service_Type*/);

    @FormUrlEncoded
    @POST("createOrder")
    Flowable<CreateOrderModel> CreateOrderIDApi(@Header("x-access-token") String Access_token, @FieldMap HashMap<String, String> map);

    @FormUrlEncoded
    @POST("addDriverPackFromApp")
    Flowable<ConfirmaPaymentModel> getConfirmPaymentApi(@Header("x-access-token") String Access_token, @FieldMap Map<String, String> map);

    @FormUrlEncoded
    @PUT("driverRequestPayoutTransferAmount")
    Flowable<PayoutModel> getDriverPayoutApi(@Header("x-access-token") String Access_token, @FieldMap Map<String, String> map);

    @PATCH("tripRequestReceived")
    Flowable<ResponseBody> tripisReceivedApi(@Header("x-access-token") String Access_token, @Body HashMap<String, String> data);

    @GET("getNeededDocuments/driverDocs")
    Flowable<DocumentModel> getDriverDocumentListApi(@Header("x-access-token") String Access_token);

    @GET("getNeededDocuments/driverTaxiDocs/{id}")
    Flowable<DocumentModel> getVehicleDocumentListApi(@Header("x-access-token") String Access_token, @Path("id") String id);

    @Multipart
    @POST("docsDriver")
    Flowable<DocumentUploadModel> getUploadDocumentApi(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> data, @Part MultipartBody.Part fileFront, @Part MultipartBody.Part fileBack);

    @Multipart
    @POST("driverTaxisdocs")
    Flowable<DocumentUploadModel> getVehicleUploadDocumentApi(@Header("x-access-token") String Access_token, @PartMap HashMap<String, RequestBody> data, @Part MultipartBody.Part fileFront, @Part MultipartBody.Part fileBack);

    @POST("deleteDriverCard")
    Call<RemoveCardModel> removeCard(@Header("x-access-token") String Access_token);

    @FormUrlEncoded
    @PUT("addDriverCard")
    Call<ResponseBody> AddCard(@Header("x-access-token") String Access_token, @Field("cardToken") String data,@Field("lastNum") String lastNum);


    @GET("getBankData")
    Call<OTPModel> getStripedata(@Header("x-access-token") String Access_token);

    @GET("countries")
    Flowable<List<CountryModel>> getCountryListApi(@Header("x-access-token") String Access_token);

    @GET("state/{id}")
    Flowable<List<StateModel>> getStateListApi(@Header("x-access-token") String Access_token, @Path("id") String id);

    @GET("city/{id}")
    Flowable<List<CityModel>> getCityListApi(@Header("x-access-token") String Access_token, @Path("id") String id);

    @Multipart
    @POST("safeRide/tripImages")
    Call<ImageUploadModel> TripFlowStatusMultiPartApi(@Header("x-access-token") String token,
                                                      @PartMap HashMap<String, RequestBody> map,
                                                      @Part MultipartBody.Part imageArray,
                                                      @Part MultipartBody.Part imageArray1,
                                                      @Part MultipartBody.Part imageArray2,
                                                      @Part MultipartBody.Part imageArray3);

    @POST("safeRide/suggestionDriver")
    Call<SendPhoneModel> sendPhoneNumber(@Header("x-access-token")String token, @Body HashMap<String, String> phone);

    @Multipart
    @POST("driverAttendance")
    Call<AttendanceModel> callAttendance(@Header("x-access-token")String token, @Part MultipartBody.Part filePart);


    @GET("faqcategory")
    Call<List<FaqcategoryModel>>getfaqcategory(@Header("x-access-token") String Access_token, @QueryMap HashMap<String, String> data);

    @GET("faq")
    Call<List<FaqModel>>getfaq(@Header("x-access-token") String Access_token, @QueryMap HashMap<String, String> data);

    @GET("countries")
    Call<List<CountryModel>> getCountry();

    @GET("state/{id}")
    Call<List<StateModel>> getState(@Path("id") String data);

    @GET("city/{id}")
    Call<List<CityModel>> getCity(@Path("id") String data);
}
